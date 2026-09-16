import type { RefObject } from "react";

import { Newsletter } from "#/components/forge/forms/newsletter";
import { Dialog, DialogContent, DialogTitle } from "#/components/ui/dialog";
import type { Dictionary, Locale } from "#/lib/i18n";
import { withLocale } from "#/lib/navigation";

function subscribe() {
  // Signups stay disabled until Soleva chooses a subscription destination.
}

interface NewsletterDialogProps {
  dict: Dictionary;
  locale: Locale;
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalFocus: RefObject<HTMLButtonElement | null>;
}

export function NewsletterDialog({
  dict,
  locale,
  id,
  open,
  onOpenChange,
  finalFocus,
}: NewsletterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id={id}
        finalFocus={finalFocus}
        closeLabel={dict.nav.close}
        aria-describedby={undefined}
        overlayClassName="z-70"
        className="z-70 max-h-[calc(100dvh-2rem)] gap-4 overflow-y-auto pt-12 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">{dict.footer.newsletter_title}</DialogTitle>
        <Newsletter
          className="rounded-none border-0 p-0 shadow-none sm:p-0"
          eyebrow={dict.footer.newsletter_title}
          title={dict.newsletter.title}
          description={dict.newsletter.description}
          placeholder={dict.footer.newsletter_placeholder}
          emailLabel={dict.footer.newsletter_placeholder}
          buttonLabel={dict.newsletter.comingSoon}
          privacyText={dict.newsletter.unavailable}
          disabled
          onSubmit={subscribe}
        />
        <p className="text-center text-xs text-muted-foreground">
          <a
            href={withLocale(locale, "/confidentialite")}
            className="underline underline-offset-4 hover:text-foreground"
          >
            {dict.cookies.privacyLink}
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
