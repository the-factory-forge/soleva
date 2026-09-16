import { MailIcon } from "lucide-react";
import { lazy, Suspense, useId, useRef, useState } from "react";

import { Button } from "#/components/ui/button";
import type { Dictionary, Locale } from "#/lib/i18n";

const NewsletterDialog = lazy(() =>
  import("./newsletter-dialog").then((module) => ({ default: module.NewsletterDialog })),
);

interface NewsletterButtonProps {
  dict: Dictionary;
  locale: Locale;
  className?: string;
}

export function NewsletterButton({ dict, locale, className }: NewsletterButtonProps) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogId = useId();

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        className={className}
        aria-label={dict.footer.newsletter_title}
        title={dict.footer.newsletter_title}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        onClick={() => {
          setHasOpened(true);
          setOpen(true);
        }}
      >
        <MailIcon className="size-5" aria-hidden="true" />
      </Button>
      {hasOpened && (
        <Suspense fallback={null}>
          <NewsletterDialog
            id={dialogId}
            dict={dict}
            locale={locale}
            open={open}
            onOpenChange={setOpen}
            finalFocus={triggerRef}
          />
        </Suspense>
      )}
    </>
  );
}
