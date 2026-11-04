import { LAYERS, SECTIONS, STYLES } from '../constants';
import { Answers, ItemScore, LayerKey, Results, ScaleQuestion, StyleKey, StyleScore } from '../types';

const idx = (vals: number[]) => vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length - 1) / 4 * 100) : null;

const BANDS = [
  { min: 80, name: 'Leading', summary: 'You are working with AI in ways most organizations are still planning for.' },
  { min: 60, name: 'Capable', summary: 'AI is part of your work. The next step is making it routine and shared.' },
  { min: 40, name: 'Emerging', summary: 'You have started, but AI is not yet changing how the work gets done.' },
  { min: 0, name: 'Early', summary: 'AI is still at the edge of your work. A few focused moves will change that quickly.' },
];

export function computeResults(answers: Answers): Results {
  // Contribution style: count how often each style was chosen.
  const counts: Record<StyleKey, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  let choiceTotal = 0;
  SECTIONS.forEach(s => { if (s.kind === 'choice') s.questions.forEach(q => {
    const a = answers[q.id];
    if (typeof a === 'string' && a in counts) { counts[a as StyleKey]++; choiceTotal++; }
  }); });
  const styles: StyleScore[] = (Object.keys(counts) as StyleKey[])
    .map(k => ({ key: k, name: STYLES[k].name, count: counts[k], share: choiceTotal ? Math.round(counts[k] / choiceTotal * 100) : 0 }))
    .sort((a, b) => b.count - a.count);

  // AI readiness: scale answers, "not sure" (0) is left out.
  const scaleItems: (ScaleQuestion & { layer: LayerKey })[] = SECTIONS.flatMap(s => s.kind === 'scale' ? s.questions.map(q => ({ ...q, layer: s.layer })) : []);
  const scored: ItemScore[] = scaleItems.filter(q => typeof answers[q.id] === 'number' && (answers[q.id] as number) > 0)
    .map(q => ({ id: q.id, text: q.text, value: answers[q.id] as number, scope: q.scope }));
  const val = (filter: (q: typeof scaleItems[number]) => boolean) =>
    scaleItems.filter(filter).map(q => answers[q.id]).filter((v): v is number => typeof v === 'number' && v > 0);

  const layers = Object.fromEntries((Object.keys(LAYERS) as LayerKey[]).map(k => [k, idx(val(q => q.layer === k))])) as Record<LayerKey, number | null>;
  const readiness = idx(val(() => true)) ?? 0;
  const personal = idx(val(q => q.scope === 'personal'));
  const organization = idx(val(q => q.scope === 'organization'));
  const weakestLayer = (Object.keys(layers) as LayerKey[]).sort((a, b) => (layers[a] ?? 101) - (layers[b] ?? 101))[0];

  const p = personal ?? readiness, o = organization ?? readiness;
  const pattern =
    p - o >= 15 ? { name: 'Ahead of your organization', description: 'You are more ready for AI than the environment around you. Without clearer direction, rules and team habits, your progress will stay personal instead of scaling.' }
    : o - p >= 15 ? { name: 'Your organization is ahead of you', description: 'Direction and support are in place, but your own day to day use has not caught up. The fastest gains are in your personal practice.' }
    : p >= 60 && o >= 60 ? { name: 'Ready to scale', description: 'You and your organization are moving together. The opportunity now is to turn good practice into measurable value.' }
    : p < 45 && o < 45 ? { name: 'Early together', description: 'Both you and your organization are at the start. Small, visible wins will build momentum faster than big plans.' }
    : { name: 'Building together', description: 'You and your organization are progressing at a similar pace. Focus on the weakest layer to unlock the next step.' };

  const sorted = [...scored].sort((a, b) => a.value - b.value);
  return {
    readiness,
    band: BANDS.find(b => readiness >= b.min)!,
    layers, personal, organization, weakestLayer, pattern,
    styles, primary: styles[0], secondary: styles[1],
    gaps: sorted.filter(s => s.value <= 3).slice(0, 3),
    strengths: [...sorted].reverse().filter(s => s.value >= 4).slice(0, 3),
  };
}
