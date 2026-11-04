import { LayerKey, Section, StyleKey } from './types';

// Make webhook for the "ELVEX AI Future Fit Intake" scenario. It handles new submissions,
// report resends and debrief requests (told apart by the resend and debriefRequested flags).
export const INTAKE_WEBHOOK = 'https://hook.us2.make.com/6htqqqe1dgei3abgvgirx8g4kjfr49ih';

export const LAYERS: Record<LayerKey, { title: string; tagline: string; question: string }> = {
  elevate: { title: 'Elevate', tagline: 'Direction', question: 'Do you know where AI is taking your work?' },
  execute: { title: 'Execute', tagline: 'Practice', question: 'Is AI part of how the work actually gets done?' },
  evolve: { title: 'Evolve', tagline: 'Adaptability', question: 'Are you and your team learning fast enough?' },
};

export const SCALE = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Partly' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
];
export const NOT_SURE = 0;

// The six contribution styles. Each choice option A to F maps to one style.
export const STYLES: Record<StyleKey, {
  name: string; short: string; description: string; aiEdge: string; watchOut: string;
}> = {
  A: {
    name: 'Insight Architect', short: 'Turns information into direction',
    description: 'You add most value by making sense of complex information and finding the right path through it.',
    aiEdge: 'AI multiplies your research and analysis. Use it to test more options, faster, then apply your judgment to the few that matter.',
    watchOut: 'Analysis can become the work itself. Set a decision date before you start digging.',
  },
  B: {
    name: 'People Catalyst', short: 'Grows the people around you',
    description: 'You add most value by helping others perform, connect and grow.',
    aiEdge: 'AI frees time from admin so you can coach more. You are also the person teams will look to as AI changes their roles.',
    watchOut: 'You may protect people from change rather than prepare them for it. Lead the change openly.',
  },
  C: {
    name: 'Creative Originator', short: 'Brings new ideas to life',
    description: 'You add most value by imagining what does not exist yet and making it real.',
    aiEdge: 'AI gives you a tireless studio for drafts, variations and prototypes. Your taste and originality become the scarce part.',
    watchOut: 'AI makes average work cheap. Keep a clear point of view so your output does not blend in.',
  },
  D: {
    name: 'Systems Optimizer', short: 'Makes work run better at scale',
    description: 'You add most value by turning messy work into reliable processes that scale.',
    aiEdge: 'You are a natural designer of AI workflows. You can see which steps to automate and which need a human check.',
    watchOut: 'Automating an unclear process scales the mess. Define the standard before you automate it.',
  },
  E: {
    name: 'Growth Influencer', short: 'Wins people and markets over',
    description: 'You add most value by persuading people, opening doors and growing reach.',
    aiEdge: 'AI sharpens your preparation, personalizes your outreach and lets you test messages before they go out.',
    watchOut: 'Speed without substance erodes trust. Check every AI generated claim before you use it.',
  },
  F: {
    name: 'Venture Builder', short: 'Ships results and owns outcomes',
    description: 'You add most value by taking ownership and turning ideas into delivered results.',
    aiEdge: 'AI lets you build and test with a fraction of the team. You can prototype in days what used to take months.',
    watchOut: 'Moving fast with AI can create hidden risk. Agree simple guardrails before you scale anything.',
  },
};

const choice = (id: string, text: string, A: string, B: string, C: string, D: string, E: string, F: string) =>
  ({ id, text, options: { A, B, C, D, E, F } });

export const SECTIONS: Section[] = [
  {
    key: 'drives', kind: 'choice', title: 'What drives you',
    description: 'Choose the answer that sounds most like you, not the one you think is expected.',
    questions: [
      choice('s1', 'When you finish a task, what makes you feel you truly succeeded?',
        'Finding a key insight or a logical answer to a complex problem.', 'Seeing someone else succeed or grow because of my support.',
        'Creating something original, like a new design or idea.', 'Improving a process so everything runs more efficiently.',
        'Influencing a decision or winning a new opportunity.', 'Launching something and delivering measurable results quickly.'),
      choice('s2', 'If you had a free day to work on anything, what would you choose?',
        'Researching a deep topic and analyzing the trends.', 'Mentoring others or building a community.',
        'Designing a new concept or creative project.', 'Organizing systems and improving workflows.',
        'Networking and getting others behind a vision.', 'Building a new product or starting a new project.'),
      choice('s3', 'What kind of progress excites you most?',
        'Discovering a new strategic insight.', 'A breakthrough in how a team works together.',
        'A creative breakthrough that changes a brand or product.', 'A system that can now handle ten times the work.',
        'A big increase in market reach or sales.', 'Taking full ownership of an outcome and delivering it.'),
      choice('s4', 'What is your long term career goal?',
        'To be a respected expert and advisor.', 'To be a leader who changes people’s lives.',
        'To leave a legacy of original work.', 'To build a system that scales globally.',
        'To have real influence in my market or industry.', 'To build and own a portfolio of successful ventures.'),
    ],
  },
  {
    key: 'works', kind: 'choice', title: 'How you work',
    description: 'Think about how you actually behave on a normal working week.',
    questions: [
      choice('s5', 'How do you usually start solving a new problem?',
        'I study the facts and look for patterns first.', 'I talk to the people involved to understand their needs.',
        'I brainstorm a completely different way to look at it.', 'I break it down into a step by step process.',
        'I work out who needs to be convinced to move forward.', 'I test a small version of the solution straight away.'),
      choice('s6', 'Which word would colleagues use to describe you?',
        'Analytical', 'Empathetic', 'Creative', 'Structured', 'Persuasive', 'Practical'),
      choice('s7', 'Which role do you naturally take in a team meeting?',
        'The critical thinker who spots the flaws in the plan.', 'The connector who makes sure everyone is heard.',
        'The ideas person who suggests a bold new direction.', 'The organizer who builds the timeline.',
        'The advocate who pushes for the best market outcome.', 'The driver who asks how soon we can start.'),
      choice('s8', 'When you lead a project, what is your top priority?',
        'That the strategy is sound and logical.', 'That the team is motivated and aligned.',
        'That the output is original.', 'That the workflow is efficient.',
        'That the market impact is as big as possible.', 'That the project is finished and delivered.'),
    ],
  },
  {
    key: 'ai', kind: 'choice', title: 'You and AI',
    description: 'How you see AI fitting into your work.',
    questions: [
      choice('s9', 'What is your main goal when you use AI tools?',
        'To research, analyze data and build strategy.', 'To coach and communicate better with others.',
        'To generate content, visuals or new designs.', 'To automate tasks and build efficient workflows.',
        'To improve marketing, sales and reach.', 'To build new products and launch ventures faster.'),
      choice('s10', 'If AI takes over your repetitive tasks, what would you do with the time?',
        'Move into higher level strategic thinking.', 'Help people adapt to the new way of working.',
        'Spend more time on original, human work.', 'Scale systems and processes much faster.',
        'Focus on market impact and growth.', 'Build my own assets and own the results.'),
      choice('s11', 'Which skill do you most want to build next?',
        'Using data for better decisions.', 'Leading and coaching a high performing team.',
        'Using new tools for creative work.', 'Building automated business systems.',
        'Growing influence and reach.', 'Building and scaling a new venture.'),
      choice('s12', 'How do you see most business problems?',
        'As information that needs to be understood better.', 'As people challenges that need resolving.',
        'As chances to reinvent how things are done.', 'As inefficient systems that need fixing.',
        'As barriers to growth that need removing.', 'As tasks that need finishing now.'),
    ],
  },
  {
    key: 'direction', kind: 'scale', layer: 'elevate', title: 'Direction',
    description: 'How clear the path is for you and your organization.',
    questions: [
      { id: 'r1', scope: 'personal', text: 'I know which parts of my role AI will change in the next two years.' },
      { id: 'r2', scope: 'organization', text: 'My organization has a clear direction on how it will use AI.' },
      { id: 'r3', scope: 'organization', text: 'Our leaders talk about AI in terms of business outcomes, not just tools.' },
    ],
  },
  {
    key: 'practice', kind: 'scale', layer: 'execute', title: 'Practice',
    description: 'How much AI is part of the real work today.',
    questions: [
      { id: 'r4', scope: 'personal', text: 'I use AI tools in my work at least every week.' },
      { id: 'r5', scope: 'personal', text: 'I have redesigned at least one of my regular tasks around AI.' },
      { id: 'r6', scope: 'personal', text: 'I check AI outputs for accuracy and risk before I use them.' },
      { id: 'r7', scope: 'organization', text: 'We have clear rules on which AI tools and data we can use.' },
    ],
  },
  {
    key: 'adaptability', kind: 'scale', layer: 'evolve', title: 'Adaptability',
    description: 'How quickly you and those around you learn and adjust.',
    questions: [
      { id: 'r8', scope: 'personal', text: 'I spend time every month learning new tools or skills.' },
      { id: 'r9', scope: 'personal', text: 'I am comfortable making big moves when the future is not clear.' },
      { id: 'r10', scope: 'organization', text: 'My team shares what works with AI, such as prompts and workflows.' },
      { id: 'r11', scope: 'organization', text: 'My manager encourages me to try new ways of working.' },
    ],
  },
];

export const INDUSTRIES = [
  'Government and public sector', 'Energy and utilities', 'Banking and financial services', 'Real estate and construction',
  'Telecom and digital', 'Aviation and transport', 'Healthcare and life sciences', 'Manufacturing and industrial',
  'Retail and consumer goods', 'Technology', 'Professional services', 'Education', 'Other',
];
export const ORG_SIZES = ['Fewer than 50 people', '50 to 249', '250 to 999', '1,000 to 4,999', '5,000 or more'];
export const COUNTRIES = ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Egypt', 'Other'];

// What to do first, by weakest layer. "you" is for the respondent, "team" is how ELVEX helps the organization.
export const PLAYBOOK: Record<LayerKey, { outcome: string; you: string[]; team: string }> = {
  elevate: {
    outcome: 'You know where AI is taking your role, so you invest your time in the right skills.',
    you: [
      'List your ten most frequent tasks and mark which ones AI could draft, check or do in the next two years.',
      'Ask your manager how AI fits the organization’s priorities this year, and agree one outcome you will own.',
      'Pick the one capability that will matter most in your future role and give it 20 minutes a day.',
    ],
    team: 'ELVEX helps leadership teams set a clear AI direction tied to business outcomes, so every team knows what to do next.',
  },
  execute: {
    outcome: 'AI becomes part of how your work gets done, not a side experiment.',
    you: [
      'Choose one weekly deliverable and rebuild it with AI: draft, critique, then finalize yourself.',
      'Write a short checklist for checking AI output (facts, context, risk) and use it every time.',
      'Save your best prompts as reusable templates and share them with one colleague.',
    ],
    team: 'ELVEX redesigns high value workflows task by task around people and AI, with simple rules on tools, data and checks.',
  },
  evolve: {
    outcome: 'You and your team learn fast enough to keep up as the work changes.',
    you: [
      'Block 30 minutes a week to try one new tool or technique on real work.',
      'Run a short monthly review: what you tried, what worked and what you will stop.',
      'Start a simple team habit of sharing one AI win and one lesson each week.',
    ],
    team: 'ELVEX equips managers to lead adoption, so new ways of working stick across teams and do not depend on a few enthusiasts.',
  },
};
