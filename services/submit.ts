import { INTAKE_WEBHOOK, LAYERS, SCALE, SECTIONS, STYLES } from '../constants';
import { LayerKey, Results, SavedState, StyleKey } from '../types';
import { buildReportHtml } from './reportEmail';

const PENDING_KEY = 'elvex_aiff_pending_v1';

const scaleLabel = (v: number) => v === 0 ? 'Not sure' : SCALE.find(s => s.value === v)?.label ?? '';

// One flat payload: every field the Make scenario maps sits at the top level.
export function buildPayload(state: SavedState, r: Results) {
  const c = state.contact;
  const answersText = SECTIONS.map(s => `${s.title}\n` + s.questions.map(q => {
    const a = state.answers[q.id];
    const shown = a === undefined ? 'Not answered'
      : s.kind === 'choice' ? `${a}. ${(q as { options: Record<StyleKey, string> }).options[a as StyleKey]} (${STYLES[a as StyleKey].name})`
      : scaleLabel(a as number);
    return `  ${q.id}. ${q.text}\n     Answer: ${shown}`;
  }).join('\n')).join('\n\n');
  const [firstName, ...rest] = c.fullName.trim().split(/\s+/);

  return {
    source: 'ELVEX AI Future Fit', // internal routing key in Make; the tool is shown as ELVEX AI Readiness
    submissionId: state.submissionId,
    submittedAt: new Date().toISOString(),
    fullName: c.fullName.trim(),
    firstName: rest.length ? firstName : '',
    lastName: rest.length ? rest.join(' ') : firstName,
    role: c.role.trim(),
    company: c.company.trim(),
    email: c.email.trim(),
    mobile: c.mobile.trim(),
    country: c.country,
    industry: c.industry,
    orgSize: c.orgSize,
    consent: c.consent,
    readinessIndex: r.readiness,
    band: r.band.name,
    pattern: r.pattern.name,
    primaryStyle: r.primary.name,
    secondaryStyle: r.secondary.name,
    personalIndex: r.personal,
    organizationIndex: r.organization,
    elevateIndex: r.layers.elevate,
    executeIndex: r.layers.execute,
    evolveIndex: r.layers.evolve,
    focusLayer: LAYERS[r.weakestLayer as LayerKey].title,
    styleMixText: r.styles.map(s => `${s.name}: ${s.share}%`).join('\n'),
    gapsText: r.gaps.map(g => `- ${g.text}`).join('\n'),
    answersText,
    reportHtml: buildReportHtml(c, r, state.submissionId),
    answers: state.answers,
  };
}
export type Payload = ReturnType<typeof buildPayload> & { resend?: boolean; debriefRequested?: boolean; debriefNote?: string };

async function post(body: unknown, timeoutMs: number): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(INTAKE_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally { clearTimeout(t); }
}

const savePending = (p: unknown) => { try { localStorage.setItem(PENDING_KEY, JSON.stringify(p)); } catch { /* storage unavailable */ } };
const clearPending = () => { try { localStorage.removeItem(PENDING_KEY); } catch { /* storage unavailable */ } };

// Sends the submission, keeping a local copy until Make confirms, and retries once.
export async function submitDiagnostic(payload: Payload): Promise<boolean> {
  savePending(payload);
  for (let attempt = 0; attempt < 2; attempt++) {
    try { await post(payload, 45000); clearPending(); return true; }
    catch { await new Promise(r => setTimeout(r, 1500)); }
  }
  return false;
}

export async function retryPendingSubmission() {
  let raw: string | null = null;
  try { raw = localStorage.getItem(PENDING_KEY); } catch { return; }
  if (!raw) return;
  try { await post({ ...JSON.parse(raw), retried: true }, 20000); clearPending(); } catch { /* try again next visit */ }
}

export async function requestDebrief(payload: Payload, note: string) {
  await post({ ...payload, reportHtml: '', debriefRequested: true, debriefNote: note.trim() }, 20000);
}
