import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { LAYERS, NOT_SURE, SCALE, SECTIONS } from '../constants';
import { Answers, StyleKey } from '../types';
import { LAYER_ICON } from './ui';

interface Props {
  step: number;
  answers: Answers;
  onAnswer: (id: string, v: string | number) => void;
  onGoTo: (i: number) => void;
  onBack: () => void;
  onFinish: () => void;
}

const GROUPS = [
  { title: 'Your contribution style', match: (k: string) => SECTIONS.find(s => s.key === k)?.kind === 'choice' },
  { title: 'Your AI readiness', match: (k: string) => SECTIONS.find(s => s.key === k)?.kind === 'scale' },
];

export const Questions: React.FC<Props> = ({ step, answers, onAnswer, onGoTo, onBack, onFinish }) => {
  const section = SECTIONS[step];
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const total = SECTIONS.reduce((n, s) => n + s.questions.length, 0);
  const done = Object.keys(answers).length;
  const sectionDone = (i: number) => SECTIONS[i].questions.filter(q => answers[q.id] !== undefined).length;
  const complete = section.questions.every(q => answers[q.id] !== undefined);
  const firstOpen = section.questions.find(q => answers[q.id] === undefined)?.id;
  const last = step === SECTIONS.length - 1;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const answer = (id: string, v: string | number) => {
    const wasOpen = answers[id] === undefined;
    onAnswer(id, v);
    if (!wasOpen) return;
    const qs = section.questions;
    const next = qs.slice(qs.findIndex(q => q.id === id) + 1).find(q => answers[q.id] === undefined);
    if (next) setTimeout(() => refs.current[next.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 160);
  };

  const kicker = section.kind === 'choice'
    ? `Part 1, contribution style. Section ${step + 1} of ${SECTIONS.length}`
    : `Part 2, AI readiness (${LAYERS[section.layer].title}). Section ${step + 1} of ${SECTIONS.length}`;

  return (
    <section className="wrap py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8 lg:gap-14 items-start">
      <aside className="min-w-0 lg:sticky lg:top-28" aria-label="Sections">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-[var(--lav)]">Your progress</span>
          <span className="num text-sm text-[var(--muted)]">{done} of {total}</span>
        </div>
        <div className="bar mt-2"><i style={{ width: `${(done / total) * 100}%` }} /></div>

        <nav className="mt-6 hidden lg:block space-y-6">
          {GROUPS.map(g => (
            <div key={g.title}>
              <p className="text-xs font-semibold text-[var(--muted)] mb-2">{g.title}</p>
              <ul className="space-y-1">
                {SECTIONS.map((s, i) => !g.match(s.key) ? null : (
                  <li key={s.key}>
                    <button onClick={() => onGoTo(i)} aria-current={i === step ? 'step' : undefined}
                      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${i === step ? 'bg-[var(--close)] border border-[rgba(123,44,255,.5)] text-[var(--text)]' : 'border border-transparent text-[var(--lav)] hover:bg-[var(--panel)]'}`}>
                      <span className={`w-5 h-5 rounded-full grid place-items-center shrink-0 ${sectionDone(i) === s.questions.length ? 'bg-[var(--violet)] text-white' : 'border border-[var(--line3)]'}`}>
                        {sectionDone(i) === s.questions.length && <Check className="w-3 h-3" />}
                      </span>
                      <span className="flex-1">{s.title}</span>
                      <span className="num text-xs text-[var(--muted)]">{sectionDone(i)}/{s.questions.length}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="lg:hidden mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist">
          {SECTIONS.map((s, i) => (
            <button key={s.key} role="tab" aria-selected={i === step} onClick={() => onGoTo(i)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs border ${i === step ? 'bg-[var(--violet)] border-[var(--violet-hi)] text-white' : sectionDone(i) === s.questions.length ? 'border-[var(--tile-line)] text-[var(--lav)]' : 'border-[var(--line2)] text-[var(--muted)]'}`}>
              {s.title}
            </button>
          ))}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex items-start gap-4">
          <div className="tile hidden sm:grid">{section.kind === 'scale' ? LAYER_ICON[section.layer] : <Sparkles />}</div>
          <div>
            <p className="kicker">{kicker}</p>
            <h1 className="display mt-2 text-[clamp(1.9rem,3.6vw,2.6rem)]">{section.title}</h1>
            <p className="mt-2 text-[var(--body)] max-w-2xl">
              {section.description}{section.kind === 'scale' && ' Rate each statement from 1 (strongly disagree) to 5 (strongly agree).'}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {section.kind === 'choice' && section.questions.map((q, i) => {
            const v = answers[q.id];
            return (
              <div key={q.id} ref={el => { refs.current[q.id] = el; }} className={`statement ${v !== undefined ? 'answered' : ''} ${q.id === firstOpen ? 'current' : ''}`}>
                <p className="text-[var(--text)] text-[1.04rem] leading-relaxed"><span className="num text-[var(--icon)] font-semibold mr-2">{i + 1}</span>{q.text}</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-2.5" role="radiogroup" aria-label={q.text}>
                  {(Object.keys(q.options) as StyleKey[]).map(k => {
                    const on = v === k;
                    return (
                      <button key={k} type="button" role="radio" aria-checked={on} onClick={() => answer(q.id, k)}
                        className={`text-left rounded-xl border px-4 py-3 text-[.95rem] leading-snug transition flex gap-3 items-start ${on ? 'bg-[var(--violet)] border-[var(--violet-hi)] text-white' : 'border-[var(--line2)] text-[var(--lav)] hover:border-[var(--violet)] hover:text-[var(--text)]'}`}>
                        <span className={`w-5 h-5 mt-0.5 rounded-full grid place-items-center shrink-0 border ${on ? 'bg-white border-white text-[var(--violet)]' : 'border-[var(--line3)]'}`}>{on && <Check className="w-3 h-3" />}</span>
                        <span>{q.options[k]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {section.kind === 'scale' && section.questions.map((q, i) => {
            const v = answers[q.id] as number | undefined;
            return (
              <div key={q.id} ref={el => { refs.current[q.id] = el; }} className={`statement ${v !== undefined ? 'answered' : ''} ${q.id === firstOpen ? 'current' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[var(--text)] text-[1.04rem] leading-relaxed"><span className="num text-[var(--icon)] font-semibold mr-2">{i + 1}</span>{q.text}</p>
                  <span className="shrink-0 text-xs text-[var(--muted)] mt-1.5 hidden sm:inline">{q.scope === 'personal' ? 'About you' : 'About your organization'}</span>
                </div>
                <div className="mt-4 grid sm:grid-cols-[1fr,auto] gap-3 items-start">
                  <div>
                    <div className="scale" role="radiogroup" aria-label={q.text}>
                      {SCALE.map(s => (
                        <button key={s.value} type="button" role="radio" aria-checked={v === s.value} aria-label={`${s.value}, ${s.label}`} onClick={() => answer(q.id, s.value)}>
                          {s.value}
                        </button>
                      ))}
                    </div>
                    <div className="scale-ends"><span>Strongly disagree</span><span>Strongly agree</span></div>
                  </div>
                  <button type="button" role="radio" aria-checked={v === NOT_SURE} onClick={() => answer(q.id, NOT_SURE)}
                    className={`h-12 px-4 rounded-xl border text-sm transition ${v === NOT_SURE ? 'bg-[var(--tile)] border-[var(--tile-line)] text-[var(--text)]' : 'border-dashed border-[var(--line3)] text-[var(--body)] hover:text-[var(--text)] hover:border-[var(--violet)]'}`}>
                    Not sure
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <button onClick={onBack} className="btn btn-quiet"><ArrowLeft className="w-4 h-4" />{step === 0 ? 'Your details' : 'Previous section'}</button>
          <div className="flex items-center gap-4">
            {!complete && <span className="text-sm text-[var(--body)]">{section.questions.length - sectionDone(step)} left in this section</span>}
            {last
              ? <button disabled={!complete || done < total} onClick={onFinish} className="btn btn-primary">See my results<ArrowRight className="w-5 h-5" /></button>
              : <button disabled={!complete} onClick={() => onGoTo(step + 1)} className="btn btn-primary">Next: {SECTIONS[step + 1].title}<ArrowRight className="w-5 h-5" /></button>}
          </div>
        </div>
        {last && complete && done < total && <p className="mt-3 text-sm text-[var(--warn)] text-right">Some earlier sections still have unanswered questions. Use the list to finish them.</p>}
      </div>
    </section>
  );
};
