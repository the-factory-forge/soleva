import { z } from "zod";

import { employeeIdSchema } from "#/intranet/components/forge/plugins/employees/schema";
import { locales } from "#/lib/i18n/config";

export const sendEmployeeVerificationSchema = employeeIdSchema.extend({ locale: z.enum(locales) });
