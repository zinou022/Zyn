# Handover: BUTEC CV template

Paste this to the receiving Claude session, or have it read this file.

## Context
- Repo: `zinou022/Zyn`, branch `claude/zen-darwin-g3mnvc`, draft PR #2.
- Fetch it first: `git fetch origin claude/zen-darwin-g3mnvc && git checkout claude/zen-darwin-g3mnvc`
  (or use `add_repo` if the repo is not in your session).
- Owner: Brik Zine Eddine (Project HSE Manager, BUTEC, Doha). Files contain his real contact details and photo; keep them inside this repo.

## What was decided
`cv/template/` is the **adopted BUTEC personnel-profile template** (bids and tenders): 3 pages A4, Arial,
BUTEC orange `#FAA21C` with black and grey, logo + orange rule header on every page, photo running from the
header rule down to the grey rule under "01 Professional profile", key-figures strip, label/value grids,
one chronological Experience section.

## Read in this order
1. `cv/template/README.md`: full design spec, rebuild steps, update guide, open points.
2. `cv/template/BUTEC_Personnel_CV_Template.pdf`: what it must look like.
3. `cv/template/build_cv.js`: generator (layout and content). Needs `npm i docx`.
`cv/archive/` holds rejected or alternative versions (Century Gothic Rev17, plain ATS version). Not adopted.

## Your task
1. Review the template and README.
2. Update your own work, docs and references so they use and follow this as the BUTEC CV template.
3. Make content changes only in `cv/template/build_cv.js`, rebuild, re-render and visually check all 3 pages.
4. Keep it at 3 pages and keep each job entry together on one page.

## Rules
- Do not restyle (fonts, colours, layout, photo block) without asking the user.
- Do not invent facts or numbers; use only what the user provides.
- Open points are for the user to confirm, not for you to resolve:
  1. Job dates overlap: Project HSSE and Welfare Manager (Jan 2017 - Aug 2018) vs HSEW Manager (Jan 2018 - Nov 2020).
  2. Key figures (15+ years, 4 countries, 7 projects, 11 officers) were derived from the CV text.
  3. References list name/role/company only, contact details "on request".
  4. Contact email is a personal Gmail; user may want a BUTEC address.
- For ATS portals use the plain version in `cv/archive/` (no photo, tables or header content).
