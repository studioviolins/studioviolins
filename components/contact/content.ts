/**
 * Talk to Nick: WhatsApp, email, or a short message form. The only measurement is the player's height, and only
 * when the visitor has chosen it on the rental section's slider; everything else Nick collects in conversation.
 *
 * Not shown until Nick confirms them (docs/nick-confirmation-checklist.md): courier coverage and charges (free
 * collection from Hitchin and customer-paid delivery are settled), and whether the timings on record still hold:
 * the existing site's "allow up to five working days" for a reply, and generally one week to prepare a violin.
 * Reply time is about answering messages only, never about instrument availability or delivery.
 */
export const CONTACT_COPY = {
  title: "Talk to Nick.",
  /** What happens next, in general terms only: no times, coverage or charges. */
  body: "Tell Nick a little about the player. He’ll talk through what they need, help you choose the right instrument and size, then arrange collection or delivery.",
  lesson: "Need it for an upcoming lesson? Ask Nick about availability.",
  form: {
    title: "Ask Nick a question",
    intro: "Whether you’re choosing your first violin or looking for your next size, Nick can help.",
    nameLabel: "Your name",
    emailLabel: "Email address",
    phoneLabel: "Phone number",
    /** After the phone label, quieter: the field isn't required. */
    optional: "(optional)",
    messageLabel: "Your message",
    /**
     * Above the fields, only once the visitor has chosen a height on the slider: what will be sent with their
     * message. The size line appears only when there is a suggestion (see components/instrument/height-sizes.ts).
     */
    selection: {
      /** Names the summary for screen readers; not shown. */
      label: "Sent with your message",
      heightLabel: "Player’s height:",
      sizeLabel: "Suggested violin size:",
      sizeNote: "This is our recommendation.",
      change: "Change",
      /** Read by screen readers after "Change"; not shown. */
      changeHint: " the player’s height on the slider",
      remove: "Remove",
      /** Read by screen readers after "Remove"; not shown. */
      removeHint: " the player’s height and size from your message",
    },
    submit: "Send message to Nick",
    sending: "Sending…",
    success: "Thanks—your message has been sent to Nick.",
    failure: "Sorry, your message couldn’t be sent. It’s still here, so you can try again, or reach Nick directly:",
    /**
     * One sentence under the button on how soon Nick usually replies. If he confirms the existing five working
     * days still holds (for the form, WhatsApp and email alike): "Please allow up to five working days for a
     * reply." While it's null, nothing is shown.
     */
    replyTime: null as string | null,
  },
};
