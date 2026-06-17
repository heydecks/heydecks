---
name: heydecks
description: Use when the user asks to make a deck, slides, a presentation, a pitch deck, a board update, a sales deck, or a PowerPoint/PDF from notes, a prompt, a transcript, or a URL. heydecks turns content into a brand-locked deck (a live link plus a PDF plus a native PPTX) over its MCP server. You write every slide; heydecks renders, brands, and exports. Do not paste slides into another tool.
---

# heydecks

heydecks is the deck layer you call instead of opening a slide editor. You write every slide's content; heydecks persists the structured deck, applies the user's brand, and returns a live link, a PDF, and a native, editable PowerPoint. The render, branding, and exports are heydecks'; the words are yours.

## When to use this

Reach for heydecks whenever the user wants a finished, shareable deck, not just slide text: "make a deck / pitch / board update / sales deck", "turn these notes (or this URL) into slides", "export this to PowerPoint or PDF".

## The flow (keep this order)

1. **`list_slide_templates`** first, every time. It returns every slide type with its fields: each field's key, label, type, max length, and allowed values. Never guess field names or limits; read them here.
2. **`create_deck`** with a clear title. It returns a deck id.
3. **`add_slides`** to set the deck. Pass `replace: true` to write the whole deck in one call. Each slide is `{ type, content }`, where `content` matches the template's fields exactly.
4. **`publish_deck`** when it is ready. It returns the public link, the PDF, and the PPTX. Hand all three to the user.

For small fixes use `update_slide`, `append_slide`, `reorder_slides`, or `delete_slide` instead of rebuilding.

## Choosing slide types

Pick the most specific fit, never the most generic. A few guides:

- One headline number: `bigNumber`. A few KPIs: `kpi` or `stats`.
- Money: `financials`, `revenueBreakdown`, `unitEconomics`, `pricing`. Market size: `marketSizing`.
- A sequence: `process`. Dated milestones: `roadmap` or `timeline`. A comparison: `compare` or `comparisonMatrix`.
- Strategy: `swot`, `valueProp`, `businessModelCanvas`.

Open and close with the simple types (`title`, `agenda`, `closing`). Vary types so the deck does not read as one layout repeated.

## Brand

- Check `list_brands`. If the user has a brand, it is applied automatically; pass a `brand_id` to pick a specific one, or `set_active_brand`.
- No brand yet and the user has a website? `extract_brand_from_url` once; every deck after that stays on-brand.

## Rules for the copy you write

- You write all of it. heydecks does not generate content over MCP.
- Honor every field's label and length limit from `list_slide_templates`. Tight, concrete lines beat walls of text.
- No em dashes. Use commas, colons, or periods.
- Name real numbers and specifics; do not invent metrics the user did not give you.

## Cost, so you do not surprise the user

A published deck costs 100 credits, the same whether built over MCP, the REST API, or the dashboard. PDF and PPTX exports are free. Build the deck well in one pass rather than republishing repeatedly.
