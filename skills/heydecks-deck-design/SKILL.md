---
name: heydecks-deck-design
description: Use when deciding what a deck should contain and in what order, before or while building it: pitch decks, sales decks, board updates, investor updates, product launches, QBRs, and proposals. Gives the slide sequence for each deck type and the craft rules that make a deck land. Pairs with the heydecks skill, which covers the tool mechanics.
---

# heydecks: design a deck that lands

Most weak decks fail on structure, not tools. This skill is the narrative: what slides a deck needs, in what order, and what each one should say. Use it to plan the deck, then build it with the **heydecks** skill (which maps each slide to a slide type and the tool calls).

## Craft rules (apply to every deck)

- **One idea per slide.** If a slide needs "and", it is two slides.
- **Lead with the takeaway,** not the setup. The slide title is the conclusion ("Revenue up 42%"), not the topic ("Revenue").
- **Show numbers as numbers.** A metric belongs on a `bigNumber`, `kpi`, `metricDashboard`, or a chart/table slide, never buried in a bullet.
- **8 to 15 slides** for most decks. Shorter is almost always better. Cut anything that is not advancing the argument.
- **Open and close on purpose.** A `title` slide up front, a `closing` slide with the one ask or next step at the end.
- **Keep the through-line.** Each slide should make the next one feel inevitable.

## Deck recipes

Each line is one slide. Adapt to the user's content; drop slides they have no material for rather than padding.

### Pitch deck (raising money)
1. Title: company + one-line what-you-do
2. Problem: who hurts and how much
3. Solution: your product, in one breath
4. How it works: the product, 3 steps or a screenshot
5. Why now: the shift that makes this possible
6. Market size: TAM / SAM / SOM (`marketSizing`)
7. Traction: the numbers that prove pull (`bigNumber` or `metricDashboard`)
8. Business model: how you make money (`pricing` or `revenueBreakdown`)
9. Competition: where you win (`comparisonMatrix` or `compare`)
10. Team: why you
11. The ask: round size and use of funds (`closing`)

### Sales deck (B2B, to a prospect)
1. Title
2. The prospect's problem, in their words
3. Cost of doing nothing (quantify it)
4. Your solution, mapped to that problem
5. How it works
6. Proof: results, logos, a case study number (`bigNumber`)
7. Pricing / packages (`pricing`)
8. Next step: one clear action (`closing`)

### Board or investor update
1. Title: period + headline ("Q3: revenue +42%, runway 14 months")
2. TL;DR: 3 to 5 top metrics (`metricDashboard` or `kpi`)
3. Highlights: what went well
4. Lowlights: what did not, and the fix
5. Financials: revenue, burn, runway (`financials` or `waterfall`)
6. Key initiatives / roadmap (`roadmap`)
7. Asks: where you need help (`closing`)

### Product launch / GTM
1. Title
2. What is launching and why it matters
3. Who it is for
4. The before / after (`beforeAfter`)
5. How it works
6. Launch plan and timeline (`timeline` or `milestonePlan`)
7. Goals and metrics (`kpi`)
8. Call to action (`closing`)

### Quarterly business review (QBR)
1. Title: account + period
2. Outcomes delivered (`metricDashboard`)
3. Wins and what drove them
4. Risks / blockers and mitigations
5. Roadmap for next quarter (`roadmap`)
6. Expansion or renewal ask (`closing`)

### Proposal
1. Title
2. Their goal, restated
3. Approach / scope
4. Timeline (`timeline` or `gantt`)
5. Investment (`pricing`)
6. Why us (`compare`)
7. Next step (`closing`)

## Picking length and depth

- Cold audience (investors, new prospects): tighter, more story, fewer numbers per slide.
- Warm audience (board, existing customer): more numbers, less setup, get to the asks.
- If the user gives you thin material, build a shorter deck rather than inventing filler.

## Anti-patterns to avoid

- A wall of bullets on every slide.
- The same layout repeated (use the variety of slide types).
- Burying the headline metric in body text.
- Slides with no point, added only to "look complete".
- Inventing numbers, logos, or quotes the user did not provide.
