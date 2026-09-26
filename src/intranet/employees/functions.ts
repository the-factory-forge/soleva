import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { ENV } from "varlock/env";

import { auth } from "#/intranet/auth/auth";
import { adminMiddleware } from "#/intranet/auth/middleware";
import {
  createEmployeeSchema,
  employeeIdSchema,
  listEmployeesSchema,
  setEmployeeBanSchema,
  updateEmployeeSchema,
} from "#/intranet/components/forge/plugins/employees/schema";
import {
  createEmployeeService,
  type EmployeeActor,
} from "#/intranet/components/forge/plugins/employees/server/employees.server";

import { sendEmployeeVerificationSchema } from "./employees.schema";

function employeeService(actor: EmployeeActor) {
  if (!auth) throw new Error("Auth not configured");
  return createEmployeeService({
    api: auth.api,
    headers: getRequest().headers,
    actor,
    verificationEnabled: Boolean(ENV.EMAIL_API_KEY && ENV.EMAIL_FROM),
  });
}
export const $listEmployees = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .validator(listEmployeesSchema)
  .handler(({ data, context }) => employeeService(context.user).list(data));
export const $createEmployee = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(createEmployeeSchema)
  .handler(({ data, context }) => employeeService(context.user).create(data));
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
    ),
  );
