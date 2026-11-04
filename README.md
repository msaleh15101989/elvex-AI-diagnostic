# ELVEX AI Future Fit

A seven minute lead generation assessment for elvexpartners.com.

## What it does
1. Collects contact details (name, job title, organization, work email, mobile, country, industry, organization size, consent to be contacted).
2. Part 1, contribution style: 12 forced choice questions. Each answer maps to one of six styles (Insight Architect, People Catalyst, Creative Originator, Systems Optimizer, Growth Influencer, Venture Builder). The most chosen style is the primary style.
3. Part 2, AI readiness: 11 statements rated 1 to 5 (or "not sure"), grouped into Elevate (direction), Execute (practice) and Evolve (adaptability), and tagged as personal or organizational. Index = (average − 1) / 4 × 100.
4. Shows headline results on screen. The full report is emailed, so every result comes with a real contact.

## Data flow
Everything goes to one Make webhook (`INTAKE_WEBHOOK` in `constants.tsx`), scenario "ELVEX Diagnostics Intake", shared with the Executive Diagnostic and routed by `source`:
- new submission: ELVEX gets a lead email with contact details, scores, the report and every answer; the respondent gets their report by email
- `resend: true`: only the respondent's report is sent again (corrected email address)
- `debriefRequested: true`: ELVEX gets a "call requested" email

If the webhook can't be reached, the submission is kept in the browser and retried on the next visit.

## Build
`npm install`, then `npm run build` (output in `dist`). Cloudflare Pages builds `main` automatically.
