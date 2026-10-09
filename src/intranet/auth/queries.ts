import { queryOptions } from "@tanstack/react-query";

import { $getLoginOptions, $getUser } from "./functions";

export const loginOptionsQueryOptions = () =>
  queryOptions({
    queryKey: ["login-options"],
    queryFn: ({ signal }) => $getLoginOptions({ signal }),
    staleTime: Infinity,
  });

/**
 * Shared by the login page and protected intranet layout. Server endpoints
 * enforce authentication independently through the auth middleware.
 */
export const authQueryOptions = () =>
  queryOptions({
    queryKey: ["auth"],
    queryFn: ({ signal }) => $getUser({ signal }),
  });
