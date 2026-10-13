import { useQuery, useQueryClient } from "@tanstack/react-query";

import { authClient } from "#/intranet/auth/auth-client";
import { loginOptionsQueryOptions } from "#/intranet/auth/queries";
import { ChangePasswordForm } from "#/intranet/components/change-password-form";
import { AccountSecurity } from "#/intranet/components/forge/plugins/auth";
import { t, type Dictionary, type Locale } from "#/lib/i18n";

import { AgentKeys } from "./agent-keys";
import { $revokeOtherSession } from "./functions";
import { accountSecurityQueryOptions } from "./queries";

export function SecuritySettings({
  userId,
  email,
  dict,
  locale,
}: {
  userId: string;
  email: string;
  dict: Dictionary;
  locale: Locale;
}) {
  const options = accountSecurityQueryOptions(userId);
  const security = useQuery(options);
  const loginOptions = useQuery(loginOptionsQueryOptions());
  const queryClient = useQueryClient();
  return (
    <AccountSecurity
      email={email}
      locale={locale}
      labels={dict.security}
      passwordLabels={dict.auth}
      data={security.isError ? undefined : security.data}
      loading={security.isFetching}
      error={security.isError}
      onRetry={() => void security.refetch()}
      onRequestPasswordReset={
        loginOptions.data?.passwordReset
          ? async () => {
              const result = await authClient.requestPasswordReset({
                email,
                redirectTo: `/${locale}/reset-password`,
              });
              if (result.error) throw new Error(result.error.message);
            }
          : undefined
      }
      onRevokeSession={async (id) => {
        await $revokeOtherSession({ data: { id } });
        await queryClient.invalidateQueries({ queryKey: options.queryKey });
      }}
      agentKeys={<AgentKeys userId={userId} dict={dict} locale={locale} />}
      passwordForm={
        <>
          <p className="text-muted-foreground">{t(dict, "profile.securityDescription")}</p>
          <ChangePasswordForm
            dict={dict}
            onSuccess={async () => {
              await queryClient.invalidateQueries({ queryKey: options.queryKey });
            }}
          />
        </>
      }
    />
  );
}
