import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Mail, Send } from 'lucide-react';
import { LAYERS, STYLES } from '../constants';
import { Contact, LayerKey, Results as R } from '../types';
import { Bar, LAYER_ICON, PulseLine, STYLE_ICON, ScoreRing } from './ui';

interface Props {
  contact: Contact; results: R; delivered: boolean; reference: string;
  sent: 'sending' | 'sent' | 'resent' | 'error'; onResend: (email: string) => void;
  note: string; onNote: (s: string) => void; debrief: 'idle' | 'sending' | 'sent' | 'error'; onDebrief: () => void;
}

export const Results: React.FC<Props> = ({ contact: c, results: r, delivered, reference, sent, onResend, note, onNote, debrief, onDebrief }) => {
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(c.email);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const primary = STYLES[r.primary.key];
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <article>
      {!delivered && (
        <div className="wrap pt-6">
          <div className="rounded-2xl border border-[#6B5420] bg-[#211A0C] text-[#F2D58A] p-4 text-sm flex gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>We couldn’t reach our server just now, so your report hasn’t been emailed yet. Your answers are kept on this device and will be sent automatically the next time you open this page.</span>
          </div>
        </div>
      )}

      <header className="cover-bg">
        <div className="wrap pt-12 pb-10 sm:pt-16 grid lg:grid-cols-[1.4fr,1fr] gap-10 items-center">
          <div>
            <p className="kicker">AI Future Fit results</p>
            <h1 className="display mt-3 text-[clamp(2.2rem,5.5vw,3.8rem)]">{c.fullName}</h1>
            <p className="mt-4 text-[var(--lav)]">{c.role}, {c.company}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{today}. Reference {reference}</p>
          </div>
          <div className="flex items-center gap-6 lg:justify-end">
            <ScoreRing value={r.readiness} size={180} />
            <div className="max-w-[15rem]">
              <p className="text-xs uppercase tracking-[.14em] text-[var(--muted)]">AI readiness</p>
              <span className="chip mt-2">{r.band.name}</span>
              <p className="mt-3 text-[var(--text)] leading-snug">{r.band.summary}</p>
            </div>
          </div>
        </div>
        <PulseLine className="h-[60px]" />
      </header>

      <div className="wrap py-14 space-y-16">
        <section className="grid lg:grid-cols-[1.2fr,1fr] gap-8">
          <div className="panel p-7 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="tile">{STYLE_ICON[r.primary.key]}</div>
              <div><p className="kicker">Your contribution style</p><h2 className="display text-[clamp(1.6rem,3vw,2.2rem)] mt-1">{primary.name}</h2></div>
            </div>
            <p className="mt-5 text-[var(--lav)] text-lg leading-relaxed">{primary.description}</p>
            <p className="mt-4 text-[var(--body)]">{r.tiedTop ? 'Equally strong: ' : 'Second strongest: '}<b className="text-[var(--text)]">{STYLES[r.secondary.key].name}</b></p>
          </div>
          <div className="panel p-7 sm:p-8">
            <p className="text-sm font-semibold text-[var(--text)]">Your style mix</p>
            <ul className="mt-4 space-y-3">
              {r.styles.map(s => (
                <li key={s.key} className="grid grid-cols-[130px,1fr,38px] items-center gap-3 text-sm">
                  <span className={s.key === r.primary.key ? 'text-[var(--text)]' : 'text-[var(--lav)]'}>{s.name}</span>
                  <Bar value={s.share} dim={s.key !== r.primary.key} />
                  <span className="num text-right text-[var(--text)]">{s.share}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="h2">Your AI readiness in three layers</h2>
          <p className="mt-2 text-[var(--body)] max-w-2xl"><b className="text-[var(--text)]">{r.pattern.name}.</b> {r.pattern.description}</p>
          <div className="mt-6 grid md:grid-cols-3 gap-px rounded-[22px] overflow-hidden border border-[var(--line2)] bg-[var(--line2)]">
            {(Object.keys(LAYERS) as LayerKey[]).map(k => {
              const focus = k === r.weakestLayer;
              return (
                <div key={k} className={`p-6 sm:p-7 ${focus ? 'bg-[var(--close)]' : 'bg-[var(--panel)]'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="tile">{LAYER_ICON[k]}</div>
                    {focus && <span className="chip">Focus first</span>}
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div><h3 className="h3">{LAYERS[k].tagline}</h3><p className="text-sm text-[var(--body)]">{LAYERS[k].title}</p></div>
                    <span className="num text-4xl font-bold text-[var(--text)] leading-none">{r.layers[k] ?? 'n/a'}</span>
                  </div>
                  <div className="mt-4"><Bar value={r.layers[k]} dim={!focus} /></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel-violet p-7 sm:p-10 grid lg:grid-cols-[1fr,1.1fr] gap-8 lg:gap-12">
          <div>
            <div className="tile"><Mail className="w-5 h-5" /></div>
            <p className="kicker mt-5">Your full report</p>
            <h2 className="display mt-2 text-[clamp(1.7rem,3.2vw,2.4rem)]">{sent === 'error' ? 'We couldn’t send your report yet' : 'Your full report is on its way to your inbox'}</h2>
            <p className="mt-4 text-[var(--lav)] text-lg leading-relaxed">
              {sent === 'error'
                ? 'Please check your email address below and try again.'
                : <>We’ve emailed your complete report to <b className="text-[var(--text)] break-words">{c.email}</b>. It usually arrives within a few minutes. If you can’t see it, check your junk folder.</>}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">What’s inside</p>
            <ul className="mt-3 space-y-3">
              {[
                'Where AI gives you an edge, and what to watch out for',
                'How ready you are compared with your organization',
                `Three moves for the next 30 days, starting with ${LAYERS[r.weakestLayer].tagline.toLowerCase()}`,
                'Your biggest gaps and strengths',
              ].map(t => <li key={t} className="flex gap-3 text-[var(--lav)]"><CheckCircle2 className="w-5 h-5 shrink-0 text-[var(--icon)] mt-0.5" />{t}</li>)}
            </ul>
            <div className="rule my-6" />
            {editing ? (
              <form onSubmit={e => { e.preventDefault(); if (emailOk) { onResend(email.trim()); setEditing(false); } }} className="space-y-3">
                <label htmlFor="f-resend" className="field-label">Correct email address</label>
                <input id="f-resend" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className={`field ${email && !emailOk ? 'invalid' : ''}`} />
                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={!emailOk} className="btn btn-primary"><Send className="w-4 h-4" />Send my report</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn btn-quiet">Cancel</button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-[var(--body)]">
                {sent === 'sending' ? <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Sending your report</span>
                  : sent === 'resent' ? <span className="text-[var(--good)]">Sent again to {c.email}. </span> : 'Wrong address? '}
                {sent !== 'sending' && <button onClick={() => { setEmail(c.email); setEditing(true); }} className="underline underline-offset-4 text-[var(--text)] hover:text-[var(--icon)]">Correct it and resend</button>}
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="cover-bg border-t border-[var(--line)]">
        <div className="wrap py-14 grid lg:grid-cols-[1fr,1fr] gap-10 items-start">
          <div>
            <h2 className="display text-[clamp(1.9rem,3.6vw,2.7rem)]">Bring this to your team</h2>
            <p className="lede mt-4">In a 30 minute call, an ELVEX partner walks you through your results and shows how {c.company} can move from individual AI use to results across teams. It is a paid advisory session, and we’ll confirm the fee before anything is booked.</p>
            <p className="mt-6 text-sm text-[var(--body)]">These results reflect your own view of how you and your organization work today.</p>
          </div>
          <div className="panel p-6 sm:p-7">
            {debrief === 'sent' ? (
              <div className="flex gap-3 text-[var(--good)]"><CheckCircle2 className="w-6 h-6 shrink-0" /><p><b className="block text-[var(--text)]">Request received</b>We’ll contact you at {c.email} within one working day with times and the fee.</p></div>
            ) : (
              <>
                <label htmlFor="f-debrief" className="field-label">What would you like to focus on? (optional)</label>
                <textarea id="f-debrief" rows={4} value={note} onChange={e => onNote(e.target.value)} placeholder="For example, getting my team using AI consistently" className="field resize-y" />
                <div className="mt-5">
                  <button onClick={onDebrief} disabled={debrief === 'sending'} className="btn btn-primary">
                    {debrief === 'sending' ? <><Loader2 className="w-5 h-5 animate-spin" />Sending request</> : <><Send className="w-5 h-5" />Request a paid debrief</>}
                  </button>
                </div>
                {debrief === 'error' && <p className="field-error mt-3">The request didn’t go through. Try again, or email contact@elvexpartners.com.</p>}
              </>
            )}
          </div>
        </div>
      </section>
    </article>
  );
};
