import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

import { AgentKeys as SharedAgentKeys } from "#/intranet/components/forge/plugins/auth";
import type { Dictionary, Locale } from "#/lib/i18n";

import { $createAgentKey, $deleteAgentKey } from "./functions";
import { agentKeysQueryOptions } from "./queries";

const profileRoute = getRouteApi("/_auth/$lang/intranet/");

export function AgentKeys({
  userId,
  dict,
  locale,
}: {
  userId: string;
  dict: Dictionary;
  locale: Locale;
}) {
  const { keySort, direction = "asc" } = profileRoute.useSearch();
  const navigate = profileRoute.useNavigate();
  const options = agentKeysQueryOptions(userId);
  const keys = useQuery(options);
  const queryClient = useQueryClient();
  return (
    <SharedAgentKeys
      labels={dict.security}
      sortLabels={dict.tableSort}
      sort={keySort ? { field: keySort, direction } : undefined}
      onSortChange={(next, source) => {
        void navigate({
          search: (previous) => ({ ...previous, keySort: next.field, direction: next.direction }),
          replace: source === "restore",
          hash: true,
          resetScroll: false,
        });
      }}
      locale={locale}
      keys={keys.isError ? undefined : keys.data}
      loading={keys.isFetching}
      error={keys.isError}
      onRetry={() => void keys.refetch()}
      onCreate={async (data) => {
        const result = await $createAgentKey({ data });
        void queryClient.invalidateQueries({ queryKey: options.queryKey });
        return result;
      }}
      onDelete={async (id) => {
        await $deleteAgentKey({ data: { id } });
        await queryClient.invalidateQueries({ queryKey: options.queryKey });
      }}
    />
  );
}
