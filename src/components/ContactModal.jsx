import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
const ContactModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);
  const successTimer = useRef();

  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
      window.clearTimeout(successTimer.current);
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
      const acceptedAt = new Date();
      setReceipt({
        reference: `WH-${acceptedAt.getTime().toString(36).slice(-6).toUpperCase()}`,
        time: acceptedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setStatus("launching");
      successTimer.current = window.setTimeout(() => setStatus("sent"), 900);
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
        {status === "sent" ? <motion.div className="contact-success" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div className="success-plane" aria-hidden="true" initial={{ x: -34, y: 22, rotate: -18, opacity: 0 }} animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 230, damping: 18 }}><span>➤</span></motion.div>
          <div className="success-kicker">Delivery receipt</div>
          <h2 id="contact-title">Message accepted.</h2>
          <p>Thanks for reaching out. I&apos;ll get back to you at {form.email}.</p>
          <motion.dl className="delivery-receipt" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: .08 } } }}>
            {[["Status", "Accepted by email service"], ["Destination", "Wilson's inbox"], ["Reply to", form.email], ["Reference", receipt?.reference], ["Accepted", receipt?.time]].map(([term, value]) => <motion.div key={term} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}><dt>{term}</dt><dd>{value}</dd></motion.div>)}
          </motion.dl>
          <button type="button" onClick={onClose}>Back to the portfolio <span>↗</span></button>
        </motion.div> : <>
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
          <div className="contact-actions"><span aria-live="polite">{status === "launching" ? "Message accepted. Preparing receipt…" : "Secure delivery to Wilson"}</span><motion.button className={status === "launching" ? "send-button is-launching" : "send-button"} type="submit" disabled={status === "sending" || status === "launching"} layout aria-label={status === "launching" ? "Message accepted" : undefined}>
            <AnimatePresence mode="wait" initial={false}>
              {status === "launching" ? <motion.span className="launch-plane" key="plane" aria-hidden="true" initial={{ x: -8, rotate: -18, opacity: 0 }} animate={{ x: [0, 9, 48], y: [0, -5, -22], rotate: [-12, -18, -28], opacity: [1, 1, 0] }} transition={{ duration: .78, ease: "easeIn" }}>➤</motion.span> : <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{status === "sending" ? "Sending…" : "Send message"} <b>↗</b></motion.span>}
            </AnimatePresence>
          </motion.button></div>
        </form>
        </>}
      </motion.section>
    </motion.div>
  );
};

export default ContactModal;
