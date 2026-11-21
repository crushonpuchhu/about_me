"use client";

import { useState } from "react";
import { site } from "@/lib/content";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");
    const subject = `Project enquiry — ${name || "hello"}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div className="field">
        <label htmlFor="message">What are you building?</label>
        <textarea id="message" name="message" required rows={5} />
      </div>
      <div>
        <button type="submit" className="btn">
          Open in your mail app <span className="arrow">↗</span>
        </button>
      </div>
      <p className="note form__note">
        This form has no server: it composes an email in your own client. Prefer
        to write directly? {site.email}
      </p>
      {sent && (
        <p className="note form__sent" role="status">
          Draft opened — check your mail app.
        </p>
      )}
    </form>
  );
}
