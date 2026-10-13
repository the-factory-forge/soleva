import { z } from "zod";

export const agentKeySchema = z.object({
  name: z.string().trim().min(1).max(100),
  expiresAt: z.coerce
    .date()
    .refine(
      (date) => date.getTime() > Date.now() && date.getTime() <= Date.now() + 90 * 86_400_000,
      "Choose an expiry within the next 90 days.",
    ),
});
