import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { asc, count, eq, ilike, or } from "drizzle-orm";
import { ENV } from "varlock/env";

import { auth } from "#/intranet/auth/auth";
import { adminMiddleware } from "#/intranet/auth/middleware";
import { sendEmployeeInvitation } from "#/intranet/auth/verification-email";
import {
  employeeIdSchema,
  setEmployeeBanSchema,
  updateEmployeeSchema,
} from "#/intranet/components/forge/plugins/employees/schema";
import {
  createEmployeeService,
  type EmployeeActor,
} from "#/intranet/components/forge/plugins/employees/server/employees.server";
import { db } from "#/intranet/db";
import { user } from "#/intranet/db/schema/auth.schema";

import {
  createEmployeeInvitationSchema,
  listEmployeeDirectorySchema,
  sendEmployeeVerificationSchema,
} from "./employees.schema";

function employeeService(actor: EmployeeActor, search = "") {
  return createEmployeeService({
    api: auth.api,
    sendInvitation: sendEmployeeInvitation,
    directory: {
      async contains(id) {
        return Boolean((await db.select({ id: user.id }).from(user).where(eq(user.id, id)))[0]);
      },
      async list(offset, limit) {
        const pattern = `%${search.replace(/[\\%_]/g, "\\$&")}%`;
        const where = or(ilike(user.name, pattern), ilike(user.email, pattern));
        const [users, totals] = await Promise.all([
          db
            .select()
            .from(user)
            .where(where)
            .orderBy(asc(user.name), asc(user.id))
            .limit(limit)
            .offset(offset),
          db.select({ count: count() }).from(user).where(where),
        ]);
        return { users, total: totals[0].count };
      },
    },
    headers: getRequest().headers,
    actor,
    verificationEnabled: Boolean(ENV.EMAIL_API_KEY && ENV.EMAIL_FROM),
  });
}
export const $listEmployees = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .validator(listEmployeeDirectorySchema)
  .handler(({ data, context }) => employeeService(context.user, data.search).list(data));
export const $createEmployee = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(createEmployeeInvitationSchema)
  .handler(({ data, context }) =>
    employeeService(context.user).create(
      data,
      new URL(`/${data.locale}/reset-password?invitation=true`, ENV.VITE_BASE_URL).toString(),
    ),
  );
export const $setEmployeeBan = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(setEmployeeBanSchema)
  .handler(({ data, context }) => employeeService(context.user).setBan(data));
export const $updateEmployee = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(updateEmployeeSchema)
  .handler(({ data, context }) => employeeService(context.user).update(data));
export const $deleteEmployee = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(employeeIdSchema)
  .handler(({ data, context }) => employeeService(context.user).remove(data));
export const $sendEmployeeVerification = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(sendEmployeeVerificationSchema)
  .handler(({ data, context }) =>
    employeeService(context.user).sendVerification(
      data,
      new URL(`/${data.locale}/login`, ENV.VITE_BASE_URL).toString(),
      new URL(`/${data.locale}/reset-password?invitation=true`, ENV.VITE_BASE_URL).toString(),
    ),
  );
