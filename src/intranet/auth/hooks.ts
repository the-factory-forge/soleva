import { useQuery, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { authClient } from "./auth-client";
import { authQueryOptions } from "./queries";

/**
 * These hooks can be used in our components.
 * They share the same deduped query as beforeLoad in the _auth layout,
 * so these will not result in unnecessary duplicate calls.
 *
 * For reading auth data in loaders/beforeLoad,
 * we can use `authQueryOptions` from queries.ts with `queryClient` from loader context.
 */

export function useAuth() {
  const { data: user, isPending } = useQuery(authQueryOptions());
  return { user, isPending };
}

export function useAuthSuspense() {
  const { data: user } = useSuspenseQuery(authQueryOptions());
  return { user };
}

/** Clear private cached data only after the server confirms sign-out. */
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return async () => {
    const result = await authClient.signOut();
    if (result.error) throw new Error(result.error.message);
    await queryClient.cancelQueries();
    queryClient.clear();
    queryClient.setQueryData(authQueryOptions().queryKey, null);
    await router.invalidate({ sync: true });
  };
}
