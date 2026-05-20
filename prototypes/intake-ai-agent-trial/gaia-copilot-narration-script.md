# Gaia Co-Pilot — Complete Narration Script

Reference export of all narration, dialogue, UI copy, and scripted content from the **Intake AI Agent Trial** prototype (`prototypes/intake-ai-agent-trial/index.html`).

---

## 1. Landing Page

**Heading:**
> Help shoppers browse, buy, and get support—24/7

**Subheading:**
> Set up AI Agent with confidence:

**Checklist:**
- Define how it responds to specific topics
- Test and refine conversations
- Preview the shopper experience before going live

**CTA Button:** `Start setup`

**Support/Sales Toggle Label:**
> AI Agent can handle:
- Support
- Sales

---

## 2. Welcome Messages (Gaia's Introduction)

These appear as typing bubbles in sequence after the user clicks "Start setup":

1. > I'm Gaia, your Gorgias AI assistant, and I will work alongside you to learn about UrbanStems' shoppers, priorities, and challenges.
2. > By the end of this conversation, we'll have AI Agent live and ready to help UrbanStems's shoppers.
3. > I'll start by pulling up some information about your business to make sure I've got your brand right.

---

## 3. Research Phase

**Research sources** (shown as rotating status lines while Gaia researches the brand):

| Favicon domain       | Label                                  |
|----------------------|----------------------------------------|
| shopify.com          | Reviewing Shopify store · UrbanStems   |
| urbanstems.com       | Looking up urbanstems.com              |
| help.urbanstems.com  | Searching help center                  |
| gorgias.com          | Reviewing ticket history               |

**Findings message** (after research completes):
> Here's what I learned about UrbanStems from your site, social, and store.

---

## 4. Brand Voice Panel

### Personality

**Section title:** Your brand's tone of voice

**Personality label:** UrbanStems AI Agent Personality

**Personality tooltip:**
> We crafted this personality based on your brand. You can tweak the name, tone, and style anytime.

**Description:**
> UrbanStems brand voice is warm, occasion-driven, and emotionally resonant. The AI Agent should acknowledge the shopper's moment first, then offer helpful guidance. Responses should be short, natural, and free of jargon. Think: thoughtful human, not chatbot.

### Dos
- Lead with the occasion ("A birthday gift? How exciting.")
- Use first person and contractions ("I'd love to help you find something.")
- Match the customer's emotional register (excited, stressed, last-minute)

### Don'ts
- Don't open with "How can I assist you today?"
- Don't list options robotically — guide, don't dump
- Avoid words like: utilize, ensure, kindly, please note

### Preset Personalities
| Name           | Description          |
|----------------|----------------------|
| Friendly       | Warm & inviting      |
| Professional   | Precise & polished   |
| Sophisticated  | Elevated & elegant   |

### What this means for your AI Agent
> Your AI Agent should match this. No corporate phrasing, no over-apologizing. Empathy first, resolution second — especially for occasion gifters where emotions run high.

---

## 5. Knowledge Sources Panel

**Section title:** Your knowledge sources

| Source               | Detail                        | Status      |
|----------------------|-------------------------------|-------------|
| Store website        | urbanstems.com                | Syncing     |
| Help Center articles | help.urbanstems.com           | Connected   |
| URLs                 | 3 additional pages indexed    | Syncing     |
| Integrations         | Shopify store                 | Connected   |
| Documents            | None                          | Needs setup |

**What this means for your AI Agent:**
> Instead of generic answers, your AI Agent responds with your actual policies, your real product details, and your brand's tone — every time.

---

## 6. Skills — Batch 1 Introduction

### Batch mode (default):
1. > With your tone of voice and knowledge sources, AI Agent now knows how to sound like your brand and answer general questions.
2. > Now it needs skills to address your most common customer requests. When a request comes in, AI Agent detects the intent, matches it to a skill, and follows its instructions to respond.
3. > I've already set up a few skills which will cover **44%** of your incoming tickets from day one.

### Non-batch mode (alternate):
1. > With your tone of voice and knowledge sources, AI Agent now knows how to sound like your brand and answer general questions.
2. > Now it needs skills to address your most common customer requests. When a request comes in, AI Agent detects the intent, matches it to a skill, and follows its instructions to respond.
3. > I've already drafted some starter skills to cover X% of your incoming tickets. Most of them are ready to go, but some need a few additional details to get your policy right.

### Batch 1 Enable Options
| Key  | Title                                 | Description                                                                  | Badge       |
|------|---------------------------------------|------------------------------------------------------------------------------|-------------|
| all  | Turn on all ready to enable skills    | AI Agent will always follow skill instructions when matching intent is detected | Recommended |
| pick | Let me choose                         | Pick which skills to enable — the rest will rely on knowledge alone          |             |

---

## 7. Skills — Batch 1 Definitions (Ready to Enable)

| # | Key       | Title                                        | Subtitle                                                        | Preload Question                                    |
|---|-----------|----------------------------------------------|-----------------------------------------------------------------|-----------------------------------------------------|
| 1 | tracking  | Order status, tracking or delivery timing    | Real-time delivery status updates from Shopify                  | Where is my order?                                  |
| 2 | promo     | Promo codes and free shipping                | Help customers apply, troubleshoot, or verify discount codes    | Do you have a promo code?                           |
| 3 | recommend | Product recommendations                     | Match arrangements to occasion, budget, and recipient           | What flowers do you recommend for a birthday?       |
| 4 | marketing | Marketing and promotions                     | Answer questions about sales, campaigns, and loyalty programs   | What deals do you have right now?                   |
| 5 | feedback  | Customer feedback                            | Collect and acknowledge customer feedback and reviews           | I want to leave feedback about my experience        |

---

## 8. Skills — Batch 2 Introduction

### If user chose "Let me choose" for batch 1:
1. > Got it — your selected skills are enabled and the rest are saved as drafts. You can enable them anytime from your Skills page.
2. > The next **3 skills** need a few more details to get your policy right. Let's make sure they'll work with your current workflows.

### Otherwise:
1. > Great work! The next **3 skills** need a few more details to get your policy right.
2. > Let's make sure they'll work with your current workflows.

### Batch 2 Enable Options
| Key    | Title          | Description                                                       | Badge       |
|--------|----------------|-------------------------------------------------------------------|-------------|
| guided | Let's do it    | Takes about 2 minutes — we'll walk you through each one           | Recommended |
| skip   | Skip for now   | These skills will be saved as a draft to edit later               |             |

---

## 9. Skills — Batch 2 Definitions (Needs Review)

| # | Key           | Title                                                              | Subtitle                                                  | Preload Question                    | Actions                             |
|---|---------------|--------------------------------------------------------------------|-----------------------------------------------------------|-------------------------------------|-------------------------------------|
| 1 | items-missing | One or more items missing from an order                            | Verify delivery status, identify missing items, and escalate | An item is missing from my order   | —                                   |
| 2 | product-edits | Product edits in an order                                          | Remove or replace products in an order via Shopify        | I want to swap an item in my order  | Remove item, Replace item           |
| 3 | damaged       | Item damaged, defective, broken or not working as expected         | Reship the order for free via Shopify                     | My bouquet arrived damaged          | Reship order for free               |

---

## 10. Skill Follow-Up Questions

### Items Missing
| Field              | Question                                              | Options                    | AI-Detected |
|--------------------|-------------------------------------------------------|----------------------------|-------------|
| claim_window_days  | How long do customers have to report a missing item?  | 15 days, 30 days, 60 days | 30 days     |

### Product Edits
| Field              | Question                                                                      | Options                              | AI-Detected |
|--------------------|-------------------------------------------------------------------------------|--------------------------------------|-------------|
| edit_window_hours  | How long after placing an order can a customer request product changes?        | 1 hour, 2 hours, Until fulfillment   | 1 hour      |
| shopify_action     | Do you want to allow AI Agent to take action in Shopify?                      | *(see below)*                        | —           |

**Shopify action options (Product Edits):**
- **Yes:** "Yes, turn on the ability to remove and replace items" — *sublabel:* AI Agent will not take actions until you enable the skill
- **No:** "No, not right now" — *sublabel:* AI Agent will hand over tickets to a representative to fully resolve the request

### Damaged / Defective
| Field              | Question                                                                      | Options                                                         | AI-Detected              |
|--------------------|-------------------------------------------------------------------------------|-----------------------------------------------------------------|--------------------------|
| claim_window_days  | How many days after delivery can a customer report a damaged item?            | 14 days, 30 days, 60 days                                      | 30 days                  |
| damage_resolution  | What's your preferred resolution for a confirmed damaged item?               | Reship the order for free, Issue a refund, Let the customer choose | Reship the order for free |
| shopify_action     | Do you want to allow AI Agent to take action in Shopify?                     | *(see below)*                                                   | —                        |

**Shopify action options (Damaged):**
- **Yes:** "Yes, turn on the ability to reship order for free" — *sublabel:* AI Agent will not take actions until you enable the skill
- **No:** "No, not right now" — *sublabel:* AI Agent will hand over tickets to a representative to fully resolve the request

---

## 11. Skill Instructions (Edit Panel)

### Order Cancellation

**Hard handover rule:**
IF the customer wants to cancel an order because of fraud, unauthorized purchases, or payment issues, THEN acknowledge the concern and hand over the ticket immediately.

**1. Order identification**
- IF the customer doesn't mention any specific order, assume they are referring to their last order.
- IF no order data is found, ask the customer for their order number, name, email, or shipping address and attempt to locate the order again.

**2. Cancellation eligibility**
- IF the order fulfillment status contains `Fulfilled`, `Shipped`, `Delivered`, or `Partially Fulfilled`, THEN:
  - Inform the customer that cancellation is no longer possible.
  - Let them know they may return the item once delivered.
- IF the order is `Unfulfilled` AND was placed more than `[cancellation window]` ago, THEN proceed to step 3.

**3. Cancellation execution**
- IF the order is eligible for cancellation, THEN: **[Action: Cancel Order]**

---

### Order Status / Tracking

**1. Order identification**
- IF the customer doesn't mention any specific order, THEN assume they are referring to their last order.
- IF `[Order: Name]` is null, THEN ask the customer for their order number, name, email, or shipping address and attempt to locate the order again.

**2. Unfulfilled orders**
- IF `[Order: Fulfillment - Status]` = 'Unfulfilled', THEN:
  - IF `[Order: Created datetime]` is 5 days ago or less, THEN: Inform the customer the order is being processed and they'll receive a shipping confirmation email with a tracking link once it ships.
  - IF `[Order: Created datetime]` is more than 5 days ago, THEN: Acknowledge the delay and hand over the ticket for investigation.

**3. Order fulfilled but not delivered**
- IF `[Order: Fulfillment - Status]` = 'Fulfilled' AND `[Order: Shipment - Status]` is not 'delivered', THEN:
  - Share `[Order: Fulfillment - Tracking URL]` with the customer.
  - Explain the current shipment status based on `[Order: Shipment - Status]` in plain, customer-friendly language.
- IF `[Order: Fulfillment - Time since order]` is more than 9 days, THEN: Apologize for the delay and hand over for investigation.

**4. Order delivered**
- IF tracking indicates the order is delivered, THEN:
  - Confirm the delivery date and share `[Order: Fulfillment - Tracking URL]`.
- IF the customer reports they haven't received the package, THEN:
  - Acknowledge the concern.
  - Ask the customer to check with neighbors, building staff, or common delivery locations (porch, mailroom, parcel lockers).
  - Confirm the shipping address: `[Order: Shipping address 1]`, `[Order: Shipping address 2]`, `[Order: Zip]`, `[Order: City]`.
- IF the customer has confirmed they checked surrounding locations and can't find the package, THEN: Hand over the ticket for investigation.

---

### Promo Codes and Free Shipping

**1. Customer needs help applying a code**
- IF the customer is asking where or how to apply a discount code, THEN:
  - Walk them through the checkout flow: add items to cart, go to checkout, enter the code in the promo/discount field, and click Apply.
  - Close the ticket.

**2. Code was not applied to a placed order**
- IF the customer reports a promo code wasn't reflected on their order, THEN: Check `[Order: Discount codes]`.
  - IF `[Order: Discount codes]` is not empty, THEN: Share the applied code and discount amount, and ask the customer to verify if it matches what they expected. Close the ticket.
  - IF `[Order: Discount codes]` is empty, THEN: Confirm no code was applied and inform the customer that promo codes cannot be applied after an order is placed. Escalate the ticket to investigate a possible partial refund.

**3. Code is invalid or not working at checkout**
- IF the customer says a promo code isn't working during checkout, THEN: Remind the customer that only one promo code can be used per order, but free shipping can be combined with one discount code.
- IF the code should be valid but still isn't working, THEN: Suggest clearing browser cache, trying a desktop browser, or using an incognito/private window.
- IF the customer is still having trouble applying a discount code, escalate the ticket for further investigation.

---

### Damaged / Defective Item

**1. Order identification**
*(Same as shared Order Identification block above)*

**2. Risk review**
- Review `[Customer: Tags]` and `[Order: Tags]`.
- IF fraud, high-risk, or repeat-claim tags are present (examples: `fraud`, `high_risk`, `chargeback`, `do_not_refund`, `blacklist`, `excessive_claims`, `refund_abuse`), THEN:
  - Do not approve refunds, replacements, or store credit.
  - Acknowledge the issue without referencing internal tags.
  - Hand over the ticket.

**3. Claim eligibility**
- IF the delivery occurred more than `[claim window]` ago, THEN:
  - Inform the customer the claim is outside eligibility.
  - Close the ticket.
- IF the delivery occurred within `[claim window]`, THEN: proceed to the next step.

**4. Evidence collection**
- Request a photo of the damaged or affected item clearly showing the issue.
- IF the customer refuses or no longer has the item, THEN:
  - Inform the customer evidence is required to proceed.
  - Hand over the ticket.

**5. Resolution**
- IF only some items are affected, THEN:
  - Confirm the affected items with the customer.
  - Hand over the ticket for a replacement to be arranged.
- IF all items or the entire shipment is affected, THEN:
  - Ask the customer to confirm they want a free reshipment.
  - IF the customer confirms, THEN: **[Action: Reship order / Issue refund / Let customer choose]** *(based on follow-up answer)*
- IF it's unclear how many items are affected, THEN: Ask the customer to clarify before taking action.

---

### Returns & Exchanges

**Hard handover rule:**
IF the customer wants to return or exchange products from at least 2 different orders, THEN acknowledge the concern and hand over the ticket immediately.

**1. Order identification**
*(Same as shared Order Identification block above)*

**2. Return/exchange eligibility**
- IF `[Order: Created datetime]` is more than `[return window]` ago, THEN:
  - Inform the customer that returns and exchanges are only accepted within `[return window]` of purchase.
  - Do not reference policies, links, or exceptions.

**3. Initiate return or exchange**
- IF `[Order: Created datetime]` is `[return window]` ago or less, THEN:
  - Provide the return portal link: **[Action: Send return portal link]**
  - Inform the customer they will receive a prepaid return shipping label via email once the request is authorized.
  - Inform the customer of the timeline:
    - Processing takes up to 10 business days after the item is received.
    - IF return: Refunds may take an additional 3-5 business days to appear in their account, issued to the original payment method.
    - IF exchange: The new order will ship once the return is processed.

**4. Refund status check**
- IF the customer asks about the status of a refund, THEN: Check `[Order: Return received at]`, `[Order: Return closed at]`, and `[Order: Refund processed at]`.
  - IF `[Order: Return received at]` is empty: Inform the customer the returned item(s) have not yet been received. Advise them to check their return tracking for delivery confirmation.
  - IF `[Order: Return received at]` is not empty and `[Order: Refund processed at]` is empty: Inform the customer the return was received and is being processed. IF more than 10 business days ago: Apologize for the delay and hand over the ticket for investigation.
  - IF `[Order: Refund processed at]` is not empty: Inform the customer the refund was processed. Advise that refunds may take 3-5 business days to appear depending on their financial institution.
  - IF `[Order: Refund processed at]` is more than 5 business days ago and the customer reports they haven't received it: Hand over the ticket for investigation.

---

### Missing Items

**1. Order identification**
*(Same as shared Order Identification block above)*

**2. Claim eligibility**
- IF the delivery date is more than `[claim window]` ago, THEN:
  - Inform the customer that delivery issues must be reported within `[claim window]`.
  - Close the ticket.

**3. Identify the missing items**
- IF the delivery date is `[claim window]` ago or less, THEN:
  - Ask the customer for the full name of the missing item(s).
  - Check fulfillment status for the reported items.

**4. Resolution**
- Check `[Order: Shipment - Status]` for the reported item(s).
- IF the item hasn't been delivered yet (e.g., unfulfilled, in transit, or pending shipment), THEN:
  - Inform the customer the item hasn't been delivered yet and share any available tracking via `[Order: Fulfillment - Tracking URL]`.
  - Close the ticket.
- IF the item shows as delivered, THEN:
  - Ask the customer to double-check the package contents and check with neighbors or building staff.
- IF the item is still missing, THEN: Hand over the ticket.

---

### Product Edits

**1. Order identification**
*(Same as shared Order Identification block above)*

**2. Modification eligibility**
- IF `[Order: Fulfillment status]` is `fulfilled` or `shipped`, THEN:
  - Inform the customer that orders already shipped cannot be modified.
  - Close the ticket.
- IF `[Order: Created datetime]` is more than `[edit window]` ago, THEN:
  - Inform the customer that the modification window has passed.
  - Close the ticket.
- IF the order is unfulfilled and within `[edit window]`, THEN: proceed to the next step.

**3. Identify requested changes**
- Ask the customer what they'd like to change. Supported actions:
  - **Remove a product** — remove a specific item from the order
  - **Replace a product** — swap one item for another of equal or lesser value
- IF the customer requests a change not listed above (e.g., add an item, change quantity), THEN: Hand over the ticket.

**4. Remove product**
- IF the customer wants to remove an item, THEN:
  - Confirm the item name and quantity to remove.
  - IF the customer confirms, THEN: **[Action: Remove line item from order]**
  - Inform the customer the item has been removed and a partial refund will be issued to their original payment method.

**5. Replace product**
- IF the customer wants to swap an item, THEN:
  - Ask for the name of the item to remove and the name of the replacement item.
  - Look up the replacement in `[Product: Title]` to confirm availability.
  - IF the replacement costs more than the original, THEN: Inform the customer of the price difference and hand over the ticket.
  - IF the replacement costs the same or less, THEN:
    - Confirm the swap with the customer.
    - IF the customer confirms, THEN: **[Action: Remove line item from order]** then **[Action: Add replacement item to order]**
    - Inform the customer the swap is complete. If there is a price difference, a partial refund will be issued.

---

## 12. Channels Phase

### Channel introduction messages

**If user chose "pick" for batch 2 enable:**
> Done — your picks are enabled and the others are saved as drafts for later.

**Then (always):**
1. > Now, let's pick where AI Agent should help your shoppers. I found **two channels** active for UrbanStems:
2. > I've turned both on by default. You can toggle either off if you'd rather start with just one.

### Channel card
**Title:** What channels should AI Agent use to talk to customers?

| Channel | Label                            | Default |
|---------|----------------------------------|---------|
| Email   | Email: support@urbanstems.com    | On      |
| Chat    | Chat: @urbanstems                | On      |

---

## 13. Chat Widget (Preview)

### Suggested Chips (Home View)
- Where's my order?
- I need to cancel my delivery
- What flowers are best for a birthday?
- My bouquet arrived damaged

### Scripted Chat Responses

**Cancel / Stop delivery:**
- *Thinking:* "Pulling up order #12847..."
- > I pulled up your order #12847, Sarah — it was placed on March 20th and is still within the cancellation window. I can cancel it right now and issue a full refund to your card on file. Would you like me to go ahead?

**Swap / Replace / Switch item:**
- *Thinking:* "Pulling up order #12847..."
- > I've pulled up your order #12847, Sarah — it was placed on March 20th and is still within the edit window. I can see you ordered The Margot bouquet. Would you like to swap it for a different arrangement, or remove an item? Just let me know what you'd like and I'll update the order.

**Modify / Change order / Update address:**
- *Thinking:* "Pulling up order #12847..."
- > Of course, Sarah! I've pulled up order #12847 — it's currently set to deliver to 142 W 57th St, New York, NY. The order is still within the modification window. What's the new address? I'll update it right away.

**Damaged / Broken / Refund / Return / Wrong / Missing / Didn't arrive:**
- *Thinking:* "Reviewing your recent order..."
- > I'm so sorry to hear that, Sarah — that's not the experience we want for you. I've pulled up your order #12847 (The Margot, delivered March 25th). You can share a photo right here in this chat and I'll arrange a replacement or full refund right away.

**Shipping address / Change address:**
- *Thinking:* "Checking if the address can be updated..."
- > Good news — your order #12847 is still within the window for address changes. Where would you like it sent instead? Just share the new address and I'll update it for you right away.

**Where is / My order / Order status / Tracking / When will / Arrive / Shipping:**
- *Thinking:* "Looking up your order..."
- > Hi Sarah! I looked up your most recent order (#12847) — it shipped on March 21st via USPS. Your estimated delivery is March 25th. You can track it here: usps.com/track/12847. Let me know if you have any other questions!

**What cities / Deliver to / What's included / Vase / Care card:**
- *Thinking:* "Checking delivery areas..."
- > We deliver to most major US cities — same-day delivery is available in NYC, DC, LA, Chicago, and more if you order before noon local time. Want me to check a specific zip?

**Promo / Discount / Code / Coupon / Sale:**
- *Thinking:* "Checking promotions for your account..."
- > I checked your account, Sarah — you're eligible for 15% off your next order as a returning customer. The code WELCOME15 will apply at checkout. Mother's Day arrangements go live next week with early access for existing customers. Want me to help you find the perfect arrangement?

**Recommend / Popular / Best seller / What flowers / Gift / Occasion / Bouquet:**
- *Thinking:* "Browsing arrangements for you..."
- > Here are a few of our most-loved arrangements — perfect for a birthday surprise:
- *(Product cards: The Margot $88, The Sorbet $68)*

**Fallback (no intent matched):**
- > I'm not able to answer that just yet — but I'll get smarter the more you teach me. [Add more knowledge sources](#) to help me get there.

---

## 14. Edit Panel Chat Responses

When the user provides feedback on a skill in the edit panel:

- > Got it — I'll update the skill instructions to reflect that.
- > Got it — I'll factor that in. Want to keep going?

**Default edit placeholder:**
> Tell us how you'd like AI Agent to handle this use case...

---

## 15. Glossary Tooltips

These appear as dotted-underline terms throughout the conversation thread:

| Term              | Tooltip                                                                                              |
|-------------------|------------------------------------------------------------------------------------------------------|
| automation rate   | The % of requests AI Agent resolves without a human.                                                 |
| tone of voice     | The style and personality AI Agent uses in replies.                                                   |
| knowledge sources | Content AI Agent searches, like your website, help center, or uploaded docs.                         |
| knowledge         | Content AI Agent searches, like your website, help center, or uploaded docs.                         |
| channels          | Where AI Agent talks to customers, like email or chat.                                               |
| channel           | Where AI Agent talks to customers, like email or chat.                                               |
| intents           | The type of request a customer is making, like an order question or return.                          |
| intent            | The type of request a customer is making, like an order question or return.                          |
| skills            | Step-by-step instructions AI Agent follows for a specific intent.                                    |
| skill             | Step-by-step instructions AI Agent follows for a specific intent.                                    |
| actions           | Steps the AI agent can execute automatically in your connected apps, like editing an order or re-sending an item. |

---

## 16. Closing Screen

**Heading:**
> Great work!

**Subheading:**
> In just a couple of minutes, you've built an AI Agent that can handle your most common conversations.

**Section header:**
> Here's what happens next:

**Next steps:**
1. New tickets start routing through your AI Agent immediately
2. You'll see a live performance view in your dashboard
3. You can add skills, tweak tone, or train it on past tickets at any time

**CTA buttons:**
- `Take me to my inbox` (secondary)
- `Review my AI Agent skills` (primary)

---

## 17. Thinking Steps (Per Skill)

These appear as loading/typing indicators in the chat widget preview:

| Skill               | Thinking Steps                                                                               |
|----------------------|----------------------------------------------------------------------------------------------|
| Order Status         | Looking up the customer's order → Checking fulfillment and shipment status → Retrieving tracking information |
| Returns & Exchanges  | Looking up the customer's order → Checking return eligibility → Retrieving return portal link |
| Damaged / Defective  | Looking up the customer's order → Checking claim eligibility → Reviewing order and customer tags for risk → Preparing resolution options |
| Missing Items        | Looking up the customer's order → Checking delivery and fulfillment status → Identifying reported missing items |
| Order Cancellation   | Looking up the customer's order → Checking cancellation eligibility → Preparing some options |
| Subscription Cancel  | Locating the customer's subscription → Checking subscription status → Preparing some options |
| Promo Codes          | Checking applied discount codes on the order → Reviewing promo code validity                 |
| Shipping Address     | Looking up the customer's order → Checking if address change is still possible → Preparing some options |
| Product Edits        | Looking up the customer's order → Checking if the order is still editable → Preparing some options |

---

## 18. Miscellaneous UI Copy

**Skills learn more label:** "How skills work (2 min)"

**Actions tooltip:** "Actions are operations AI Agent performs in connected apps (e.g. Shopify) to fulfill a customer request."

**No instructions placeholder:**
> No instructions yet — Instructions for this skill will be generated during setup.
