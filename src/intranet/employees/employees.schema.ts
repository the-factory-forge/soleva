import { z } from "zod";

import {
  createEmployeeSchema,
  employeeIdSchema,
  listEmployeesSchema,
} from "#/intranet/components/forge/plugins/employees/schema";
import { locales } from "#/lib/i18n/config";

export const sendEmployeeVerificationSchema = employeeIdSchema.extend({ locale: z.enum(locales) });

export const createEmployeeInvitationSchema = createEmployeeSchema.extend({
  locale: z.enum(locales),
});
export const listEmployeeDirectorySchema = listEmployeesSchema.extend({
  search: z.string().trim().max(200).default(""),
});
