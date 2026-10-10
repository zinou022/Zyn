# BUTEC Personnel CV Template

Adopted BUTEC template for personnel profiles in bids and tenders (formerly "Rev16").
Three pages, A4. Master format is Word (`.docx`); export to PDF from Word to send out.

| File | Purpose |
|---|---|
| `BUTEC_Personnel_CV_Template.docx` | Master file (editable) |
| `BUTEC_Personnel_CV_Template.pdf` | Reference render (made with LibreOffice) |
| `build_cv.js` | Generator: all layout and all text content live here |
| `assets/butec-logo.jpg` | BUTEC logo (2000x501 px) |
| `assets/photo.jpg` | Portrait, 561x684 px, grey `#E8E8E8` background |

Rebuild: `npm i docx && node build_cv.js`, then
`soffice --headless --convert-to pdf BUTEC_Personnel_CV_Template.docx`.

## Design spec

**Page**: A4 (11906 x 16838 DXA), margins 1020 left/right, 1000 top/bottom on page 1,
1250 top on later pages (page 1 is its own section so the photo starts right under the header rule).

**Colors**: orange `#FAA21C` (from the logo; rules, bullets, key-figures top line);
text `#161616`; muted grey `#6A6A6A`; hairlines `#DCDCDC`; KPI fill `#F5F5F5`. No other colors.

**Type**: Arial throughout. Name 22 pt bold caps, +2 pt tracking. Section headings 9 pt bold caps,
+2 pt tracking, orange numeral. Labels 8.5 pt bold grey caps. Body 9.5 pt, line 1.1.
Job title 10 pt bold, employer line 9 pt orange, dates 8.5 pt grey right-aligned.

**Running header (every page)**: logo (left), "PERSONNEL PROFILE" (right, 7.5 pt tracked grey),
2.25 pt orange rule below. **Footer**: `BUTEC / <NAME>` left, `Page X of Y` right.

**Page 1**: identity block (name, title line, contact line, photo). The photo spans from the
header's orange rule down to the grey rule under "01 Professional profile" (it is a table cell
spanning two exact-height rows; crop is centered so the face is always fully visible).
Then profile, key-figures strip (4 numbers), 02 Qualifications, 03 Core competencies.
**Pages 2-3** (separate section): 04 Experience (newest first), 05 References.

**Entry pattern**: role (bold) + dates right, employer · place (orange), project line (grey),
3-4 bullets starting with the action; keep each job on one page.

## Updating it
- Edit text in `build_cv.js` (search the section you need). Add a job by copying a `...job(...)` call.
- New person: replace name/title/contact in the identity block and the footer, swap `assets/photo.jpg`
  (square-ish head-and-shoulders; keep eyes ~35% from the top), update key figures.
- Keep it to 3 pages; if a job splits across pages, shorten bullets rather than shrinking type.

## Open points (confirm before sending externally)
1. Employment dates overlap: Project HSSE and Welfare Manager (Jan 2017 - Aug 2018) vs
   HSEW Manager (Jan 2018 - Nov 2020).
2. Key figures (15+ years, 4 countries, 7 projects, 11 officers) are derived from the CV text;
   replace with stronger measured numbers if available.
3. References show name/role/company only; contact details "on request".
4. Contact email is a personal Gmail; swap for a BUTEC address if available.
5. For ATS portals use a plain version (no photo/tables/header content); see `../archive/Brik_Zine_Eddine_CV_ATS.docx`.

Design history and rejected directions are in `../archive/` (Rev17 Century Gothic variant, ATS variant,
early minimal/classic explorations).
