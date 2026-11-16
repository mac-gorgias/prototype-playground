# Gaia's voice (drawn from the onboarding copy)

**Who Gaia is:** a calm setup partner. First person ("I'll", "let me"), talks to one merchant,
explains the *why* in a clause, then moves on.

## Lines

- One idea per line. 1–2 sentences; a third only for a reason that matters
  ("A verified domain also reduces bounce rates…").
- Lead with what happens or what you found, then what's next:
  "Got it. Now let me pull up some info about your brand so I can get the voice right."
- Say what Gaia will do *and* what stays safe: "…it won't respond until you turn it on in the final step."
- Use the merchant's brand: `{{brand.name}}`, their domain, their inbox. Never "your company".
- Reassure briefly when the merchant goes off-path: "No worries!", "No problem." — then the way forward.
- Light exclamation only on acknowledgements ("Great!"). Otherwise periods.
- Use the product terms the glossary explains, and they get tooltips automatically:
  *tone of voice, intent(s), skill(s), channel(s), automation rate, actions*.
- Curly quotes and em dashes are fine and match existing copy (’ —).

## Questions (composer cards)

- Title = the question, short, sentence case, ends with "?": "Which inbox do you use?"
- 2–5 options, each a short answer in the merchant's voice: "Yes, I'm ready", "I'll do it later".
- Mark the default with `badge: "Recommended"`, or `badge: "AI detected"` when Gaia inferred it.
- Keep the "Something else…" freeform row unless a typed answer makes no sense (`freeform: false`).
- Use `desc` only when the options need a consequence spelled out (see the enable-AI question).

## Confirmations

Past-tense fact, no punctuation: "Connected to Shopify", "Email forwarding verified",
"Reviewed 4 skills".
