import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { and, asc, count, desc, eq, ilike, isNotNull, isNull, like, not, or } from "drizzle-orm";
import { ENV } from "varlock/env";

import { auth } from "#/intranet/auth/auth";
import { adminMiddleware } from "#/intranet/auth/middleware";
import { sendEmployeeInvitation } from "#/intranet/auth/verification-email";
import {
  employeeIdSchema,
  EMPLOYEE_PAGE_SIZE,
  setEmployeeBanSchema,
  updateEmployeeSchema,
} from "#/intranet/components/forge/plugins/employees/schema";
import {
  createEmployeeService,
  type EmployeeActor,
} from "#/intranet/components/forge/plugins/employees/server/employees.server";
import { db } from "#/intranet/db";
import { user } from "#/intranet/db/schema";

import {
  createEmployeeInvitationSchema,
  employeeDirectorySchema,
  sendEmployeeVerificationSchema,
} from "./employees.schema";

function employeeService(actor: EmployeeActor) {
  return createEmployeeService({
    api: auth.api,
    sendInvitation: sendEmployeeInvitation,
    headers: getRequest().headers,
    actor,
    verificationEnabled: Boolean(ENV.EMAIL_API_KEY && ENV.EMAIL_FROM),
  });
}
export const $listEmployees = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .validator(employeeDirectorySchema)
  .handler(async ({ data }) => {
    const pattern = `%${data.search.replace(/[\\%_]/g, "\\$&")}%`;
    const filter = data.search
      ? or(ilike(user.name, pattern), ilike(user.email, pattern))
      : undefined;
    // Better Auth can store several comma-separated roles on one account.
    const adminRole = or(
      eq(user.role, "admin"),
      like(user.role, "admin,%"),
      like(user.role, "%,admin"),
      like(user.role, "%,admin,%"),
    )!;
    const column = {
      name: user.name,
      email: user.email,
      role: or(isNull(user.role), not(adminRole))!,
      status: and(isNotNull(user.banned), eq(user.banned, true))!,
    }[data.sort?.field ?? "name"];
    const order = data.sort?.direction === "desc" ? desc : asc;
    const [users, [summary]] = await Promise.all([
      db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          emailVerified: user.emailVerified,
          banned: user.banned,
          mustChangePassword: user.mustChangePassword,
        })
        .from(user)
        .where(filter)
        .orderBy(order(column), asc(user.id))
        .limit(EMPLOYEE_PAGE_SIZE)
        .offset(data.offset),
      db.select({ total: count() }).from(user).where(filter),
    ]);
    return { users, total: summary.total };
  });
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
