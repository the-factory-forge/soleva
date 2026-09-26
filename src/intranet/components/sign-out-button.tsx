import { useSignOut } from "#/intranet/auth/hooks";
import {
  SignOutButton as SignOutControl,
  useAuthAction,
} from "#/intranet/components/forge/plugins/login/auth-controls";

export function SignOutButton() {
  const signOut = useSignOut();
  const action = useAuthAction();
  return (
    <div className="grid gap-2">
      <SignOutControl
        className="w-fit"
        pending={action.pending}
        disabled={action.disabled}
        onClick={() => void action.run(signOut)}
      />
      {action.failed && (
        <p role="alert" className="text-sm text-destructive">
          Could not sign out. Please try again.
        </p>
      )}
    </div>
  );
}
