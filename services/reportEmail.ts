import { LAYERS, PLAYBOOK, STYLES } from '../constants';
import { Contact, LayerKey, Results } from '../types';

// The respondent's full report as email-safe HTML (tables and inline styles only).
// ELVEX receives the same HTML, so both see exactly the same report.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const V = '#7B2CFF', INK = '#16131F', BODY = '#4A4658', MUTED = '#8B8597', LINE = '#E7E3F2', SOFT = '#F6F3FF';

const bar = (value: number | null, strong: boolean) => {
  const v = Math.round(Math.max(0, Math.min(100, value ?? 0)));
  // Email clients stretch a 0% cell, so an empty bar is drawn as a single grey track.
  if (v <= 0) return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="background:#ECE8F6;height:8px;border-radius:4px;font-size:0;line-height:0">&nbsp;</td></tr></table>`;
  if (v >= 100) return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="background:${strong ? V : '#B9A3EE'};height:8px;border-radius:4px;font-size:0;line-height:0">&nbsp;</td></tr></table>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr>
    <td width="${v}%" style="background:${strong ? V : '#B9A3EE'};height:8px;border-radius:4px;font-size:0;line-height:0">&nbsp;</td>
    <td style="background:#ECE8F6;height:8px;font-size:0;line-height:0">&nbsp;</td></tr></table>`;
};
const label = (t: string) => `<p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;color:${V}">${t}</p>`;
const h2 = (t: string) => `<h2 style="margin:0 0 10px;font-family:Montserrat,Arial,sans-serif;font-size:18px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:${INK}">${t}</h2>`;
const p = (t: string) => `<p style="margin:0 0 12px;font-size:14px;color:${BODY};line-height:1.55">${t}</p>`;
const section = (inner: string, bg = '#FFFFFF') => `<tr><td style="padding:24px 28px;background:${bg};border-top:1px solid ${LINE}">${inner}</td></tr>`;

export function buildReportHtml(c: Contact, r: Results, reference: string) {
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const primary = STYLES[r.primary.key], secondary = STYLES[r.secondary.key];
  const play = PLAYBOOK[r.weakestLayer];

  const styleRows = r.styles.map(s => `<tr>
      <td style="padding:6px 0;font-size:14px;color:${INK}">${s.name}</td>
      <td width="44" align="right" style="padding:6px 0;font-size:13px;font-weight:bold;color:${INK}">${s.share}%</td></tr>
      <tr><td colspan="2" style="padding:0 0 4px">${bar(s.share, s.key === r.primary.key)}</td></tr>`).join('');

  const layers = (Object.keys(LAYERS) as LayerKey[]).map(k => {
    const focus = r.weakestLayer === k;
    return `<td width="33%" valign="top" style="padding:14px;border:1px solid ${focus ? V : LINE};border-radius:10px;background:${focus ? SOFT : '#FFFFFF'}">
      <p style="margin:0;font-size:14px;font-weight:bold;color:${INK}">${LAYERS[k].title}${focus ? ` <span style="font-size:10px;color:${V};letter-spacing:1px">FOCUS FIRST</span>` : ''}</p>
      <p style="margin:2px 0 8px;font-size:12px;color:${MUTED}">${LAYERS[k].tagline}</p>
      <p style="margin:0 0 8px;font-size:28px;font-weight:bold;color:${V}">${r.layers[k] ?? 'n/a'}</p>${bar(r.layers[k], focus)}</td>`;
  }).join('<td width="8" style="font-size:0">&nbsp;</td>');

  const list = (items: string[], empty: string, color: string) => items.length
    ? items.map(t => `<p style="margin:0 0 10px;padding-left:10px;border-left:3px solid ${color};font-size:14px;color:${BODY};line-height:1.5">${esc(t)}</p>`).join('')
    : `<p style="margin:0;font-size:14px;color:${MUTED}">${empty}</p>`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;border:1px solid ${LINE};border-radius:12px;overflow:hidden">
  <tr><td style="padding:28px;background:#07070A;background-image:linear-gradient(135deg,#07070A 0%,#140B2A 100%)">
    <p style="margin:0 0 18px;font-size:15px;font-weight:bold;color:#F4F6FF">ELVEX Partners</p>
    <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;color:#A97BFF">AI Readiness report</p>
    <h1 style="margin:0 0 6px;font-family:Montserrat,Arial,sans-serif;font-size:26px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#F4F6FF">${esc(c.fullName)}</h1>
    <p style="margin:0 0 20px;font-size:13px;color:#D5D7E2">${esc(c.role)}, ${esc(c.company)}. ${esc(c.industry)}, ${esc(c.country)}. ${date}. Ref ${esc(reference)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td valign="middle" style="padding-right:20px;white-space:nowrap"><span style="font-size:56px;font-weight:bold;color:#9457FF;line-height:1">${r.readiness}</span><span style="font-size:14px;color:#A7A9B5"> / 100</span></td>
      <td valign="middle"><p style="margin:0 0 6px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#A7A9B5">AI readiness</p>
        <span style="display:inline-block;padding:4px 10px;border:1px solid #9457FF;border-radius:999px;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#ECE6FF">${r.band.name}</span>
        <p style="margin:8px 0 0;font-size:14px;color:#F4F6FF;line-height:1.5">${esc(r.band.summary)}</p></td></tr></table>
  </td></tr>
  ${section(`${label('Your contribution style')}${h2(primary.name)}
    ${p(`${esc(primary.description)} ${r.tiedTop ? 'You are equally strong as' : 'Your second strongest style is'} <b style="color:${INK}">${secondary.name}</b>: ${esc(secondary.short.toLowerCase())}.`)}
    <div style="padding:14px;background:${SOFT};border-radius:10px;margin:0 0 14px">${label('Where AI gives you an edge')}<p style="margin:0;font-size:14px;color:${INK};line-height:1.55">${esc(primary.aiEdge)}</p></div>
    <div style="padding:14px;border:1px solid ${LINE};border-radius:10px;margin:0 0 16px">${label('Watch out for')}<p style="margin:0;font-size:14px;color:${INK};line-height:1.55">${esc(primary.watchOut)}</p></div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${styleRows}</table>`)}
  ${section(`${label('Your AI readiness in three layers')}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate"><tr>${layers}</tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px"><tr>
      <td width="50%" style="padding-right:8px"><p style="margin:0 0 4px;font-size:13px;color:${MUTED}">You personally</p><p style="margin:0 0 6px;font-size:22px;font-weight:bold;color:${INK}">${r.personal ?? 'n/a'}</p>${bar(r.personal, true)}</td>
      <td width="50%" style="padding-left:8px"><p style="margin:0 0 4px;font-size:13px;color:${MUTED}">Your organization</p><p style="margin:0 0 6px;font-size:22px;font-weight:bold;color:${INK}">${r.organization ?? 'n/a'}</p>${bar(r.organization, false)}</td></tr></table>
    <div style="margin-top:16px;padding:14px;background:${SOFT};border-radius:10px">${label('Pattern')}<p style="margin:0 0 4px;font-size:16px;font-weight:bold;color:${INK}">${esc(r.pattern.name)}</p><p style="margin:0;font-size:14px;color:${BODY};line-height:1.5">${esc(r.pattern.description)}</p></div>`)}
  ${section(`${label(`Where to focus first: ${LAYERS[r.weakestLayer].title}`)}${h2(LAYERS[r.weakestLayer].question)}
    ${p(esc(play.outcome))}
    ${play.you.map((a, i) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px"><tr>
      <td valign="top" style="padding-right:10px"><span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:12px;background:${V};color:#fff;font-size:12px;font-weight:bold">${i + 1}</span></td>
      <td style="font-size:14px;color:${INK};line-height:1.5">${esc(a)}</td></tr></table>`).join('')}
    <p style="margin:14px 0 0;font-size:14px;color:${BODY};line-height:1.55"><b style="color:${INK}">For your organization:</b> ${esc(play.team)}</p>`, SOFT)}
  ${section(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td width="50%" valign="top" style="padding-right:12px">${label('Biggest gaps')}${list(r.gaps.map(g => g.text), 'No major gaps stood out.', '#F2B880')}</td>
    <td width="50%" valign="top" style="padding-left:12px">${label('Strengths to build on')}${list(r.strengths.map(g => g.text), 'No clear strengths yet.', '#5A1FC4')}</td></tr></table>`)}
  <tr><td style="padding:16px 28px;background:#07070A;font-size:12px;color:#A7A9B5">Based on your own answers about how you and your organization work today. We elevate clarity, execute change, and evolve organizations. elvexpartners.com</td></tr>
</table>`;
}
