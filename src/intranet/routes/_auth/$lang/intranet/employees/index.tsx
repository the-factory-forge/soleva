import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { useAuthSuspense } from "#/intranet/auth/hooks";
import { isAdmin } from "#/intranet/auth/permissions";
import { authQueryOptions } from "#/intranet/auth/queries";
import { EmployeesPage } from "#/intranet/components/forge/plugins/employees";
import { EMPLOYEE_PAGE_SIZE } from "#/intranet/components/forge/plugins/employees/schema";
import {
  $createEmployee,
  $deleteEmployee,
  $sendEmployeeVerification,
  $updateEmployee,
} from "#/intranet/employees/functions";
import { employeesQueryOptions } from "#/intranet/employees/queries";
import { ensureDictionary, useDictionary } from "#/lib/i18n";
import { localeFromPathname } from "#/lib/i18n/pathname";

export const Route = createFileRoute("/_auth/$lang/intranet/employees/")({
  validateSearch: z
    .object({
      q: z.string().trim().max(200).optional().catch(undefined),
      offset: z.coerce.number().int().min(0).optional().catch(undefined),
    })
    .passthrough(),
  beforeLoad: async ({ context, location }) => {
    const locale = localeFromPathname(location.pathname);
    const user = await context.queryClient.query(authQueryOptions());
    if (!isAdmin(user?.role)) {
      throw redirect({ to: "/$lang/access-denied", params: { lang: locale } });
    }
  },
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    await ensureDictionary(locale);
    return { locale };
  },
  head: async ({ loaderData }) => {
    if (loaderData) await ensureDictionary(loaderData.locale);
    return {};
  },
  component: Employees,
});

function Employees() {
  const { locale } = Route.useLoaderData();
  const dict = useDictionary(locale);
  const { user } = useAuthSuspense();
  const { q: search = "", offset = 0 } = Route.useSearch();
  const navigate = Route.useNavigate();
  const setOffset = (value: number) =>
    void navigate({
      search: (previous) => ({ ...previous, offset: value || undefined }),
      hash: true,
      resetScroll: false,
    });
  const queryClient = useQueryClient();
  const employees = useQuery(employeesQueryOptions(offset, search));
  async function refreshEmployees() {
    const result = await queryClient.query({
      ...employeesQueryOptions(offset, search),
      staleTime: 0,
    });
    if (offset > 0 && result.users.length === 0)
      setOffset(Math.max(0, offset - EMPLOYEE_PAGE_SIZE));
    await queryClient.invalidateQueries({ queryKey: ["employees"], refetchType: "none" });
  }
  if (!user) return null;
  return (
    <EmployeesPage
      employees={employees.data?.users ?? []}
      total={employees.data?.total ?? 0}
      search={search}
      onSearchChange={(value) =>
        void navigate({
          search: (previous) => ({ ...previous, q: value || undefined, offset: undefined }),
          hash: true,
          resetScroll: false,
          replace: true,
        })
      }
      loading={employees.isFetching}
      error={employees.isError}
      offset={offset}
      onOffsetChange={setOffset}
      currentUserId={user.id}
      currentUserRole={user.role}
      labels={dict.employees}
      onCreate={async (data) => {
        const result = await $createEmployee({ data: { ...data, locale } });
        setOffset(0);
        await queryClient.invalidateQueries({ queryKey: ["employees"] });
        return result;
      }}
      onUpdate={async (data) => {
        await $updateEmployee({ data });
        await refreshEmployees();
        if (data.id === user.id) await queryClient.invalidateQueries(authQueryOptions());
      }}
      onDelete={async (id) => {
        await $deleteEmployee({ data: { id } });
        await refreshEmployees();
      }}
      onSendVerification={async (id) => {
        const result = await $sendEmployeeVerification({ data: { id, locale } });
        if (result.status === "verified") await refreshEmployees();
        return result;
      }}
    />
  );
}
