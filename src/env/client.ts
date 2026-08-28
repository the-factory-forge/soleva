import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  emptyStringAsUndefined: true,
  client: {
    VITE_BASE_URL: z.url().default("http://localhost:3000"),
    VITE_GA_MEASUREMENT_ID: z.string().optional(),
    VITE_GOOGLE_ADS_ID: z.string().optional(),
    VITE_ADS_CONVERSION_LABEL: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
});
