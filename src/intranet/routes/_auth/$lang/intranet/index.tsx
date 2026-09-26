import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { toast } from "#/components/ui/toast";
import { $updateProfile } from "#/intranet/auth/functions";
import { useAuthSuspense } from "#/intranet/auth/hooks";
import { isAdmin } from "#/intranet/auth/permissions";
import { authQueryOptions } from "#/intranet/auth/queries";
import { ChangePasswordForm } from "#/intranet/components/change-password-form";
import { ensureDictionary, useDictionary, t } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";

export const Route = createFileRoute("/_auth/$lang/intranet/")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    await ensureDictionary(locale);
    return { locale };
  },
  head: async ({ loaderData }) => {
    if (loaderData) await ensureDictionary(loaderData.locale);
    return {};
  },
  component: ProfileSettings,
});

function ProfileSettings() {
  const { user } = useAuthSuspense();
  const { locale } = Route.useLoaderData();
  const dict = useDictionary(locale);
  const [name, setName] = useState(user?.name ?? "");
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: { name: string }) => $updateProfile({ data }),
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(authQueryOptions().queryKey, updatedUser);
      setName(updatedUser?.name ?? "");
      await queryClient.invalidateQueries({ queryKey: ["employees"], refetchType: "none" });
      await router.invalidate();
      toast.add({ type: "success", description: t(dict, "profile.saved") });
    },
    onError: () => toast.add({ type: "error", description: t(dict, "profile.saveError") }),
  });

  if (!user) return null;
  const initials = (user.name || user.email)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-foreground">{t(dict, "profile.title")}</h1>
      <Card className="shadow-none">
        <CardContent className="flex flex-wrap items-center gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="truncate font-sans text-lg font-semibold">{user.name}</h2>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <dl className="ml-auto text-sm">
            <dt className="text-muted-foreground">{t(dict, "employees.role")}</dt>
            <dd className="font-medium">
              {t(dict, isAdmin(user.role) ? "employees.roleAdmin" : "employees.roleUser")}
            </dd>
          </dl>
        </CardContent>
      </Card>

      <Tabs defaultValue="about" className="gap-6">
        <div className="border-b">
          <TabsList variant="line" aria-label={t(dict, "profile.sections")}>
            <TabsTrigger value="about" className="px-4">
              {t(dict, "profile.about")}
            </TabsTrigger>
            <TabsTrigger value="security" className="px-4">
              {t(dict, "profile.security")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="about">
          <form
            className="flex flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isPending) mutate({ name });
            }}
          >
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>
                  <h2>{t(dict, "profile.about")}</h2>
                </CardTitle>
                <CardDescription>{t(dict, "profile.aboutDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="profile-name">{t(dict, "auth.name")}</Label>
                  <Input
                    id="profile-name"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    maxLength={200}
                    readOnly={isPending}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-email">{t(dict, "auth.email")}</Label>
                  <Input
                    id="profile-email"
                    name="email"
                    type="email"
                    value={user.email}
                    autoComplete="email"
                    readOnly
                    className="bg-muted/50 text-muted-foreground"
                  />
                </div>
              </CardContent>
            </Card>
            <Button type="submit" className="self-start" disabled={isPending || !name.trim()}>
              {isPending && <LoaderCircleIcon className="animate-spin" />}
              {t(dict, isPending ? "profile.saving" : "profile.save")}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>
                <h2>{t(dict, "auth.changePasswordTitle")}</h2>
              </CardTitle>
              <CardDescription>{t(dict, "profile.securityDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md">
                <ChangePasswordForm dict={dict} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
