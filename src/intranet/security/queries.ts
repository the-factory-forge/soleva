import { queryOptions } from "@tanstack/react-query";

import { $getAccountSecurity, $listAgentKeys } from "./functions";

export const accountSecurityQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["account-security", userId],
    queryFn: ({ signal }) => $getAccountSecurity({ signal }),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 60_000,
  });
export const agentKeysQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["agent-keys", userId],
    queryFn: ({ signal }) => $listAgentKeys({ signal }),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 60_000,
  });
