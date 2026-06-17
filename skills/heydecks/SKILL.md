---
name: heydecks
description: Use when the user asks to make a deck, slides, a presentation, a pitch deck, a board update, a sales deck, or a PowerPoint/PDF from notes, a prompt, a transcript, or a URL. heydecks turns content into a brand-locked deck (a live link plus a PDF plus a native PPTX) over its MCP server. You write every slide; heydecks renders, brands, and exports. Never paste slides into another tool.
---

# heydecks: build a deck

heydecks is the deck layer you call instead of opening a slide editor. You write the content; heydecks persists a structured deck, applies the user's brand, and returns a live link, a PDF, and a native, editable PowerPoint. The words are yours; the render, brand, and exports are heydecks'.

For how to structure a *good* deck (pitch, sales, board update, and so on), use the companion skill **heydecks-deck-design**. This skill is the mechanics.

## When to use

The user wants a finished, shareable deck, not just slide text: "make a deck / pitch / board update / sales deck", "turn these notes (or this URL) into slides", "export this to PowerPoint or PDF".

## The flow

Always in this order:

1. **`list_slide_templates`** first, every time. It returns every slide type with its fields: each field's `key`, `label`, `type`, max length, and allowed values. Read it; never guess field names, types, or limits. (`list_slide_types` adds this workspace's custom blocks, referenced as `custom:<id>`.)
2. **`create_deck`** with a clear title. It returns a deck id.
3. **`add_slides`** with `replace: true` to set the whole deck in one call. Each slide is `{ type, content }`, where `content` is an object whose keys are the field keys from step 1.
4. **`publish_deck`**. It returns the live URL, the PDF, and the PPTX. Hand all three to the user.

For edits afterward use `update_slide`, `append_slide`, `reorder_slides`, or `delete_slide` instead of rebuilding the whole deck.

## What a slide looks like

```
{
  "type": "bigNumber",
  "content": { "value": "42%", "label": "Revenue growth, YoY", "support": "Up from 31% last quarter" }
}
```

The exact keys (`value`, `label`, ...) and their limits come from `list_slide_templates`. Match them exactly. If a field has allowed values, use one of them. If it has a max length, stay under it; tight copy renders better than truncated copy.

## Pick the right slide type

Choose the most specific fit, never the most generic. A working map (call `list_slide_templates` for the full set and exact fields):

- **One number:** `bigNumber`. **A few KPIs:** `kpi` or `stats`. **KPIs with trend/status:** `metricDashboard`.
- **Money:** `financials` (P&L), `revenueBreakdown`, `unitEconomics` (CAC/LTV), `waterfall` (a bridge), `dataTable` (a real table). **Market size:** `marketSizing`. **Plans:** `pricing`.
- **Steps / time:** `process` (sequence), `userFlow` (a path), `roadmap` / `timeline` / `milestonePlan` (dated), `gantt`, `kanban`.
- **Comparison:** `compare` (two things), `comparisonMatrix` (many on criteria), `decisionMatrix` (weighted, with a winner), `proConCard`, `beforeAfter`, `mythVsReality`.
- **Strategy:** `swot`, `okr`, `valueProp`, `businessModelCanvas`.
- **Structure:** `architecture`, `integrations`, `orgChart`, `dependencyMap`, `raci`.
- **Frame the deck:** open with `title` and `agenda`, close with `closing`.

Vary the types. A deck that is ten of the same layout reads as a wall of text.

## Brand

- Call `list_brands`. If the user has a brand it is applied automatically; pass a `brand_id` to choose a specific one, or `set_active_brand`.
- No brand yet but the user has a website? `extract_brand_from_url` once; every deck after that stays on-brand. (Extraction costs 50 credits.)

## Copy rules

- You write all of it. heydecks does not generate content over MCP.
- Honor every field's label and length limit. Lead each slide with the takeaway, not background.
- Use the user's real numbers and specifics. Do not invent metrics they did not give you.
- No em dashes. Use commas, colons, or periods.

## Cost, so you do not surprise the user

A published deck costs 100 credits, the same over MCP, the REST API, or the dashboard. AI images cost 80, a brand extraction 50, an AI edit 10. Reading, manual edits, and PDF and PPTX exports are free. Build the deck well in one pass; do not republish on a loop.

## If something fails

- Bad or missing field: re-read `list_slide_templates` and fix the `content` object to match the field keys and allowed values exactly.
- Not sure a brand exists: call `list_brands` before assuming.
- The user wants a tweak after publishing: use `update_slide` and re-`publish_deck`, do not rebuild from scratch.
