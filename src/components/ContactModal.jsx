import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
const ContactModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }));
  const apiErrorMessage = (detail, status) => {
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((issue) => {
        const field = issue.loc?.at(-1);
        const label = field ? `${field.charAt(0).toUpperCase()}${field.slice(1)}` : "Field";
        return `${label}: ${issue.msg || "Invalid value"}`;
      }).join(" · ");
    }
    return `Message delivery failed (${status}). Please try again.`;
  };
  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: "" }),
      });
      const responseText = await response.text();
      let result = {};
      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          result = {};
        }
      }
      if (!response.ok) {
        throw new Error(apiErrorMessage(result.detail, response.status));
      }
      setStatus("sent");
    } catch (submissionError) {
      setStatus("error");
      const message = submissionError instanceof TypeError
        ? "The contact service is temporarily unreachable. Please try again shortly."
        : submissionError.message;
      setError(message || "Message delivery failed. Please try again.");
    }
  };

  return (
    <motion.div className="contact-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <motion.section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" initial={{ opacity: 0, y: 35, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 25, scale: .97 }} transition={{ type: "spring", damping: 25, stiffness: 280 }}>
        <div className="contact-top"><span>Start a conversation</span><button type="button" onClick={onClose} aria-label="Close contact form">×</button></div>
        {status === "sent" ? <div className="contact-success"><span>✓</span><h2 id="contact-title">Message sent.</h2><p>Thanks for reaching out. I&apos;ll get back to you at {form.email}.</p><button type="button" onClick={onClose}>Back to the portfolio</button></div> : <>
        <h2 id="contact-title">Have an idea?<br /><em>Let&apos;s talk.</em></h2>
        <p>Tell me a little about what you&apos;re building and your message will be delivered directly to my inbox.</p>
        <form onSubmit={submit} aria-busy={status === "sending"}>
          <div className="contact-row">
            <label>Your name<input name="name" value={form.name} onChange={update} placeholder="Jane Smith" minLength="2" maxLength="100" autoFocus required /></label>
            <label>Your email<input type="email" name="email" value={form.email} onChange={update} placeholder="jane@example.com" required /></label>
          </div>
          <label>Subject<input name="subject" value={form.subject} onChange={update} placeholder="Let&apos;s build something" maxLength="160" /></label>
          <label>Message<textarea name="message" value={form.message} onChange={update} placeholder="A quick note about your idea…" rows="5" minLength="10" maxLength="5000" required /></label>
          {error && <p className="contact-error" role="alert">{error}</p>}
          <div className="contact-actions"><span>Secure delivery to Wilson</span><button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send message"} <b>↗</b></button></div>
        </form>
        </>}
      </motion.section>
    </motion.div>
  );
};

export default ContactModal;
