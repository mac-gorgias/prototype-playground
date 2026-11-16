/* Module: Generate tone of voice (v1) — SILENT. Runs in the background once the store is connected;
 * Configure AI Agent Support waits for it at the point of use (await step).
 * Win: Tone of voice generated (system win, logged only). */
GaiaKit.defineModule({
  id: "generate-tone-of-voice", version: 1,
  name: "Generate tone of voice",
  type: "configure",
  silent: true,
  duration: 7600, // ≈ the old research animation (4 sources × 1.8s + settle)
  requires: ["connect-ecommerce-platform"],
  win: "Tone of voice generated",
  payoff: null,
});
