import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { $changePassword } from "#/intranet/auth/functions";
import { authQueryOptions } from "#/intranet/auth/queries";
import {
  ChangePasswordForm as SharedChangePasswordForm,
  type ChangePasswordValues,
} from "#/intranet/components/forge/plugins/auth";
import type { Dictionary } from "#/lib/i18n";

/** Host adapter keeps session/cache updates outside registry-managed UI. */
export function ChangePasswordForm({
  dict,
  onSuccess,
}: {
  dict: Dictionary;
  onSuccess?: () => Promise<void>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: ChangePasswordValues) => $changePassword({ data }),
    onSuccess: async (user) => {
      queryClient.setQueryData(authQueryOptions().queryKey, user);
      await router.invalidate();
      await onSuccess?.();
    },
  });
  return (
    <SharedChangePasswordForm
      labels={dict.auth}
      onChangePassword={async (values) => {
        await mutation.mutateAsync(values);
      }}
    />
  );
}
