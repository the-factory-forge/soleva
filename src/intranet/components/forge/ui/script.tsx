export interface ScriptProps extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  id?: string;
  /** Framework hint — Next.js uses strategies; other frameworks ignore it. */
  strategy?: "afterInteractive" | "beforeInteractive" | "lazyOnload";
  /** Inline script source (JS string). */
  code?: string;
  children?: string;
}

/**
 * Minimal inline <script>. Sites that need framework script handling
 * (e.g. Next.js `beforeInteractive`) replace this file with a framework
 * component — the props above keep the component contract stable.
 */
export function Script({ id, strategy, code, children, ...props }: ScriptProps) {
  const source = code ?? children ?? "";
  return (
    <script
      id={id}
      data-strategy={strategy}
      dangerouslySetInnerHTML={{ __html: source }}
      {...props}
    />
  );
}
