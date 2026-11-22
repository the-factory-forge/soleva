import { z } from "zod";

import {
  createEmployeeSchema,
  employeeIdSchema,
  listEmployeesSchema,
  EMPLOYEE_SORT_FIELDS,
} from "#/intranet/components/forge/plugins/employees/schema";
import { locales } from "#/lib/i18n/config";

export const createEmployeeInvitationSchema = createEmployeeSchema.extend({
  locale: z.enum(locales),
});

export const sendEmployeeVerificationSchema = employeeIdSchema.extend({ locale: z.enum(locales) });

export const employeeDirectorySchema = listEmployeesSchema.extend({
  sort: z
    .object({
      field: z.enum(EMPLOYEE_SORT_FIELDS).exclude(["website"]),
      direction: z.enum(["asc", "desc"]),
    })
    .optional(),
  search: z.string().trim().max(200).default(""),
});
