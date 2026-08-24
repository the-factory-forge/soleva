// TODO(perf): replace this hand-rolled zlib middleware with a maintained
// compression lib when one is stable and battle-tested for h3 v2
// (candidate: h3-compression, ~50k dl/week but young/single-maintainer
// as of 2026-08) or when Nitro ships built-in runtime compression.
import { Readable } from "node:stream";
import { createBrotliCompress, createGzip } from "node:zlib";

import { definePlugin } from "nitro";

const COMPRESSIBLE =
  /^(text\/|application\/(json|javascript|xml|x-www-form-urlencoded)|image\/svg\+xml)/i;

export default definePlugin((nitro) => {
  const h3App = nitro.h3 as H3CoreWithMiddleware | undefined;
  h3App?.["~middleware"].push(async (event, next) => {
    const response = await next();
    const type = response.headers.get("content-type") ?? "";
    const acceptEncoding = event.req.headers.get("accept-encoding") ?? "";
    if (!response.body || response.headers.has("content-encoding") || !COMPRESSIBLE.test(type)) {
      return response;
    }
    const method = acceptEncoding.includes("br")
      ? "br"
      : acceptEncoding.includes("gzip")
        ? "gzip"
        : null;
    if (!method) return response;
    const contentLength = Number(response.headers.get("content-length") ?? "0");
    if (contentLength > 0 && contentLength < 1024) return response;
    const zlib = method === "br" ? createBrotliCompress() : createGzip();
    const compressed = Readable.toWeb(
      Readable.fromWeb(
        response.body as unknown as import("node:stream/web").ReadableStream<any>,
      ).pipe(zlib),
    ) as ReadableStream<Uint8Array>;
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.set("content-encoding", method);
    headers.set("vary", "accept-encoding");
    return new Response(compressed, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  });
});

interface H3CoreWithMiddleware {
  "~middleware": Array<
    (
      event: { req: { headers: Headers } },
      next: () => Promise<Response>,
    ) => Promise<Response | undefined> | Response | undefined
  >;
}
