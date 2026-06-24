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

1. **Settle the brand and look first** (see "Brand and look" below). Call `list_brands`. If which brand to use isn't obvious, ask the user. Decide an `art_direction` too, or ask for the vibe.
2. **`list_slide_templates`** in two cheap steps. Call it with **no arguments** for a compact pick-list (`key`, `name`, `category`, and a one-line `whenToUse`) of every slide type. Use the `whenToUse` lines to choose the slides that fit. Then call **`list_slide_templates({ keys: [...] })`** to pull the exact field schema for *only* the slides you picked. Don't pull all 89 schemas at once; never guess field names, types, or limits. (`list_slide_types` adds this workspace's custom blocks, referenced as `custom:<id>`.)
3. **`create_deck`** with a clear title, plus `brand_id` and `art_direction` from step 1. It returns a deck id.
4. **`add_slides`** with `replace: true` to set the whole deck in one call. Each slide is `{ type, content }`, where `content` is an object whose keys are the field keys you fetched in step 2.
5. **`publish_deck`**. It returns the live URL, the PDF, and the PPTX. Hand all three to the user.

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

Choose the most specific fit, never the most generic. Every slide in `list_slide_templates` carries a `whenToUse` line, read it and pick the slide it points to. A working map (call `list_slide_templates` for the full set, the `whenToUse` lines, and exact fields):

- **One number:** `bigNumber`. **A few KPIs:** `kpi` or `stats`. **KPIs with trend/status:** `metricDashboard`.
- **Money:** `financials` (P&L), `revenueBreakdown`, `unitEconomics` (CAC/LTV), `waterfall` (a bridge), `dataTable` (a real table). **Market size:** `marketSizing`. **Plans:** `pricing`.
- **Steps / time:** `process` (sequence), `userFlow` (a path), `roadmap` / `timeline` / `milestonePlan` (dated), `gantt`, `kanban`.
- **Comparison:** `compare` (two things), `comparisonMatrix` (many on criteria), `decisionMatrix` (weighted, with a winner), `proConCard`, `beforeAfter`, `mythVsReality`.
- **Strategy:** `swot`, `okr`, `valueProp`, `businessModelCanvas`.
- **Structure:** `architecture`, `integrations`, `orgChart`, `dependencyMap`, `raci`.
- **Frame the deck:** open with `title` and `agenda`, close with `cta` or `thanksClose`.

Vary the types. A deck that is ten of the same layout reads as a wall of text.

## Brand and look

A deck's appearance is two layers: the **brand** (colours, fonts, logo) and the **Art Direction** (the visual personality on top). Settle both before you build.

**Brand (be interactive, don't guess):**
- Call `list_brands`. It returns each brand plus its current Art Direction (`style.preset`, `style.background`).
- If there are several brands, or it isn't obvious which fits, **ask the user which brand to use, or whether to make a new one.** Don't silently pick.
- New brand from a website: `extract_brand_from_url` once, then `create_brand` to save it. (Extraction costs 50 credits.)
- Pass the chosen `brand_id` to `create_deck` (or `set_active_brand` to make it the default).

**Art Direction (give the deck a look):**
- One bundle sets the type pairing, the shape/card treatment, and the canvas background, all over the brand's own colours. Set it per-deck with `art_direction` on `create_deck`/`update_deck` (leaves the brand untouched), or as a brand default with `art_direction` on `create_brand`/`update_brand`.
- The directions: `clean`, `swiss`, `corporate`, `soft`, `horizon`, `editorial`, `bold`, `luminous`, `aurora`, `spotlight`, `blueprint`, `studio`.
- Match it to the audience: `spotlight`/`luminous`/`aurora` for modern or premium product and AI decks; `swiss`/`corporate`/`blueprint` for finance, data, and enterprise; `editorial` for narrative and thought leadership; `soft`/`horizon` for friendly consumer; `bold`/`studio` for launches and brand decks. When unsure, ask for the vibe.
- Backgrounds (a direction picks one; override just the canvas via `update_brand` `background`): `flat`, `mesh`, `aurora`, `glow`, `wash`, `rays`, `grid`, `dots`. Keep it subtle and on-brand.

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
