import React from 'react';
import { ArrowRight, Clock3, Lock, Mail } from 'lucide-react';
import { LAYERS, STYLES } from '../constants';
import { LayerKey, StyleKey } from '../types';
import { Bar, LAYER_ICON, PulseLine, STYLE_ICON, ScoreRing } from './ui';

const SAMPLE: Record<LayerKey, number> = { elevate: 42, execute: 67, evolve: 58 };

export const Intro: React.FC<{ resume: boolean; total: number; onStart: () => void }> = ({ resume, total, onStart }) => (
  <>
    <section className="cover-bg">
      <div className="wrap pt-14 pb-10 sm:pt-20 lg:pt-24 grid lg:grid-cols-[1.35fr,1fr] gap-12 lg:gap-16 items-center">
        <div>
          <p className="kicker">ELVEX AI Future Fit</p>
          <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4.4rem)]">Where will you add value as AI changes your work?</h1>
          <p className="lede mt-6">Find your contribution style and how ready you, and your organization, are for AI. Your personal report arrives by email with three moves to make in the next 30 days.</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button onClick={onStart} className="btn btn-primary text-[1.02rem]">
              {resume ? 'Continue your assessment' : 'Start the assessment'}<ArrowRight className="w-5 h-5" />
            </button>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--body)]">
              <li className="flex items-center gap-2"><Clock3 className="w-4 h-4 text-[var(--icon)]" />About 7 minutes</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[var(--icon)]" />Full report sent to your inbox</li>
              <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-[var(--icon)]" />Answers stay confidential</li>
            </ul>
          </div>
        </div>

        <figure className="panel p-6 sm:p-7 shadow-[0_30px_80px_-30px_rgba(123,44,255,.45)]" aria-label="Example of the report you will receive">
          <figcaption className="flex items-center justify-between text-sm">
            <span className="text-[var(--lav)] font-medium">What your report looks like</span>
            <span className="text-[var(--muted)]">Example</span>
          </figcaption>
          <div className="mt-5 flex items-center gap-6">
            <ScoreRing value={57} size={128} />
            <div>
              <span className="chip">Emerging</span>
              <p className="mt-3 text-[var(--text)] text-[.95rem] leading-snug">Contribution style: <b>Systems Optimizer</b></p>
            </div>
          </div>
          <div className="rule my-5" />
          <div className="space-y-4">
            {(Object.keys(LAYERS) as LayerKey[]).map(k => (
              <div key={k} className="grid grid-cols-[100px,1fr,32px] items-center gap-3 text-sm">
                <span className="text-[var(--lav)]">{LAYERS[k].tagline}</span>
                <Bar value={SAMPLE[k]} dim={k !== 'elevate'} />
                <span className="num text-right text-[var(--text)] font-semibold">{SAMPLE[k]}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-[var(--body)]">Plus where AI gives you an edge, you versus your organization, and a 30 day plan.</p>
        </figure>
      </div>
      <PulseLine className="h-[70px] sm:h-[90px]" />
    </section>

    <section className="wrap py-16 sm:py-20">
      <div className="grid lg:grid-cols-[1fr,2fr] gap-10 lg:gap-16">
        <div>
          <h2 className="h2">Six contribution styles</h2>
          <p className="mt-3 text-[var(--body)] max-w-sm">AI changes every role differently. Knowing how you naturally add value tells you where AI will multiply it.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-[22px] overflow-hidden border border-[var(--line2)] bg-[var(--line2)]">
          {(Object.keys(STYLES) as StyleKey[]).map(k => (
            <div key={k} className="bg-[var(--panel)] p-6">
              <div className="tile">{STYLE_ICON[k]}</div>
              <h3 className="h3 mt-4">{STYLES[k].name}</h3>
              <p className="text-sm text-[var(--body)] mt-1">{STYLES[k].short}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid lg:grid-cols-[1fr,2fr] gap-10 lg:gap-16">
        <div>
          <h2 className="h2">AI readiness in three layers</h2>
          <p className="mt-3 text-[var(--body)] max-w-sm">Scored for you and for your organization, so you can see who is holding back whom.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {(Object.keys(LAYERS) as LayerKey[]).map(k => (
            <div key={k} className="border-t-2 border-[var(--violet)] pt-4">
              <div className="flex items-center gap-3"><span className="tile w-9 h-9 rounded-xl">{LAYER_ICON[k]}</span><span className="num text-[var(--icon)] font-semibold">{LAYERS[k].title}</span></div>
              <h3 className="h3 mt-3">{LAYERS[k].tagline}</h3>
              <p className="text-sm text-[var(--body)] mt-2">{LAYERS[k].question}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 panel-violet p-7 sm:p-8">
        <div>
          <h2 className="h2">Ready when you are</h2>
          <p className="mt-2 text-[var(--lav)]">{total} questions. Your progress saves on this device as you go.</p>
        </div>
        <button onClick={onStart} className="btn btn-primary">{resume ? 'Continue your assessment' : 'Start the assessment'}<ArrowRight className="w-5 h-5" /></button>
      </div>
    </section>
  </>
);
