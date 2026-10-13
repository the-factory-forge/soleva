import { useQuery, useQueryClient } from "@tanstack/react-query";

import { AgentKeys as SharedAgentKeys } from "#/intranet/components/forge/plugins/auth";
import type { Dictionary, Locale } from "#/lib/i18n";

import { $createAgentKey, $deleteAgentKey } from "./functions";
import { agentKeysQueryOptions } from "./queries";

export function AgentKeys({
  userId,
  dict,
  locale,
}: {
  userId: string;
  dict: Dictionary;
  locale: Locale;
}) {
  const options = agentKeysQueryOptions(userId);
  const keys = useQuery(options);
  const queryClient = useQueryClient();
  return (
    <SharedAgentKeys
      labels={dict.security}
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
