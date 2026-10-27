// src/scripts/newsletterSignup.ts
//
// Shared submit logic for the newsletter popup and the inline section.
//
// Mailchimp's regular /subscribe/post endpoint cannot be used from a hidden
// iframe (the response fails to load with ERR_HTTP2_PROTOCOL_ERROR) and does
// not allow cross-origin fetch. The supported alternative is Mailchimp's JSONP
// endpoint: a <script> tag returns a callback with the real result, so the
// subscription completes server-side without a redirect or a new tab.

export interface NewsletterSignupOptions {
  form: HTMLFormElement | null;
  email: HTMLInputElement | null;
  consent: HTMLInputElement | null;
  submit: HTMLButtonElement | null;
  message: HTMLElement | null;
  /** Classes shared by every status message, e.g. "min-h-5 text-sm". */
  messageBaseClass: string;
  successText: string;
  onSuccess?: () => void;
  /** How long to wait for Mailchimp before showing an error. */
  timeoutMs?: number;
}

interface MailchimpResponse {
  result?: string;
  msg?: string;
}

let callbackCounter = 0;

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

export function bindNewsletterSignup({
  form,
  email,
  consent,
  submit,
  message,
  messageBaseClass,
  successText,
  onSuccess,
  timeoutMs = 15000,
}: NewsletterSignupOptions) {
  if (!form || !email || !consent || !submit || !message) return;

  let pending = false;

  const setMessage = (text: string, ok: boolean) => {
    message.textContent = text;
    message.className = `${messageBaseClass} ${ok ? "text-green-700" : "text-red-600"}`;
  };

  const finish = () => {
    pending = false;
    submit.disabled = false;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (pending) return;

    if (!email.validity.valid) {
      setMessage("Inserisci un indirizzo email valido.", false);
      email.focus();
      return;
    }
    if (!consent.checked) {
      setMessage("Accetta la Privacy Policy per continuare.", false);
      return;
    }

    pending = true;
    submit.disabled = true;
    setMessage("Iscrizione in corso...", true);

    // Same audience/IDs as the form action, but the JSONP variant.
    const endpoint = new URL(form.action);
    endpoint.pathname = endpoint.pathname.replace(/\/post$/, "/post-json");

    const callbackName = `__mcSignup${Date.now()}_${callbackCounter++}`;
    endpoint.searchParams.set("EMAIL", email.value.trim());
    endpoint.searchParams.set("c", callbackName);

    const honeypot = form.querySelector<HTMLInputElement>('input[name^="b_"]');
    if (honeypot) endpoint.searchParams.set(honeypot.name, honeypot.value);

    const script = document.createElement("script");
    let timeoutId: number | undefined;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      script.remove();
      try {
        delete (window as unknown as Record<string, unknown>)[callbackName];
      } catch { }
    };

    (window as unknown as Record<string, unknown>)[callbackName] = (
      data: MailchimpResponse
    ) => {
      cleanup();
      finish();

      if (data?.result === "success") {
        setMessage(successText, true);
        form.reset();
        onSuccess?.();
        return;
      }

      const reason = data?.msg ? stripHtml(data.msg) : "";
      setMessage(
        reason || "Iscrizione non riuscita. Riprova oppure scrivici una email.",
        false
      );
    };

    script.async = true;
    script.src = endpoint.toString();
    script.onerror = () => {
      cleanup();
      finish();
      setMessage("Impossibile contattare Mailchimp. Riprova tra poco.", false);
    };

    timeoutId = window.setTimeout(() => {
      if (!pending) return;
      cleanup();
      finish();
      setMessage("Mailchimp non ha risposto in tempo. Riprova tra poco.", false);
    }, timeoutMs);

    document.body.appendChild(script);
  });
}
