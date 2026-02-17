
import React, { useState, useEffect } from 'react';
import { ASSESSMENT_QUESTIONS, FRAMEWORK_METADATA } from './constants';
import { UserAnswers, OptionKey, UserData } from './types';
import { jsPDF } from "jspdf";

type AppPhase = 'WELCOME' | 'COLLECT_DATA' | 'ASSESSMENT' | 'GENERATING' | 'REPORT' | 'SUCCESS';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>('WELCOME');
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    industry: '',
    role: '',
    yearsExperience: '5-10',
    location: ''
  });
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [reportData, setReportData] = useState<{ public: string; owner: string } | null>(null);
  const [formTouched, setFormTouched] = useState(false);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase, currentStep]);

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnswerSelection = (questionId: number, value: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = !!(userData.fullName && validateEmail(userData.email) && userData.industry && userData.location);

  const generateReport = async () => {
    setPhase('GENERATING');

    // Local, no-cost report generator (runs fully in the browser).
    // This avoids exposing any API keys client-side and keeps deployments simple.
    const mapChoiceToNumber = (v: string) => {
      const order = ['A','B','C','D','E','F'];
      const idx = order.indexOf(String(v).toUpperCase());
      return idx >= 0 ? idx + 1 : 0;
    };

    
    const PART_LIBRARY: Record<string, { strength: string; risk: string; actions: string[] }> = {
      "Strategic Tilt": {
        strength: "You naturally translate ambiguity into priorities and make trade-offs rather than collecting information endlessly.",
        risk: "Strategy may stay conceptual unless you convert it into concrete decisions, owners, and timelines.",
        actions: [
          "Pick one strategic objective and define 3 measurable outcomes for the next 30 days.",
          "Write a one-page decision log: what you will do, what you will not do, and why.",
          "Convert outcomes into a weekly rhythm: review, commit, and adjust every 7 days."
        ]
      },
      "Automation View": {
        strength: "You spot repeatable work and quickly identify where automation or AI can remove friction.",
        risk: "You may automate before standards are defined, which can scale inconsistency.",
        actions: [
          "Choose one repetitive activity and document the steps and quality criteria before automating.",
          "Create a simple prompt or template and run 5 iterations to stabilize output quality.",
          "Add a human check: accuracy, context fit, and risk scan before reuse."
        ]
      },
      "AI Application": {
        strength: "You are comfortable applying AI as a practical work partner rather than treating it as a novelty.",
        risk: "Without guardrails, outputs can look polished but still be wrong or misaligned to context.",
        actions: [
          "Select one daily deliverable and redesign it with an AI-assisted workflow (draft, critique, finalize).",
          "Build a verification checklist you must follow before using AI outputs in decisions.",
          "Save your best prompts as reusable patterns (inputs, constraints, tone, acceptance criteria)."
        ]
      },
      "Continuous Learning": {
        strength: "You adapt quickly by learning through iteration and building skill over time.",
        risk: "Learning can become scattered unless you focus on one capability that compounds.",
        actions: [
          "Pick one capability to build (prompting, analysis, automation, storytelling) and commit 20 minutes daily.",
          "Create a small portfolio: 3 improved outputs per week you can show and reuse.",
          "Do a weekly retro: what improved, what broke, what you will change next week."
        ]
      },
      "Communication": {
        strength: "You can explain ideas clearly and help others align around what matters.",
        risk: "Communication can become high-effort if you are compensating for unclear ownership or decisions.",
        actions: [
          "For your next major message, write: purpose, decision needed, and next step in one paragraph.",
          "Standardize meeting outputs: decision, owner, date, and risks.",
          "Create one reusable update template (status, blockers, asks) and use it weekly."
        ]
      },
      "Problem Solving": {
        strength: "You break problems into tractable pieces and move from analysis to action.",
        risk: "You may solve locally without influencing the system-level root cause.",
        actions: [
          "Pick one recurring issue and run a root-cause review with evidence, not opinions.",
          "Define one systemic fix and one quick win you can implement this week.",
          "Track the issue weekly to prove the fix reduced frequency or impact."
        ]
      },
      "Comfort with Uncertainty": {
        strength: "You stay effective when outcomes are unclear and can move forward with incomplete information.",
        risk: "You may under-communicate risks or assumptions, causing surprises later.",
        actions: [
          "Write your top 3 assumptions for the next initiative and how you will validate them.",
          "Use a risk register: risk, trigger, mitigation, owner, review date.",
          "Build a weekly checkpoint to surface uncertainty early rather than late."
        ]
      },
      "Pressure Handling": {
        strength: "You keep momentum under pressure and maintain delivery focus.",
        risk: "Sustained pressure can lead to burnout unless you design sustainable routines.",
        actions: [
          "Define a personal operating rhythm: deep work blocks, communication windows, recovery time.",
          "Set one boundary: limit meeting load or create no-meeting blocks twice a week.",
          "Use a weekly energy audit: what drained you, what fueled you, and what you will change."
        ]
      },
      "Need for Structure": {
        strength: "You create clarity through routines, templates, and predictable execution.",
        risk: "Too much structure can slow adaptation in fast-changing work.",
        actions: [
          "Create a light-weight workflow: 3 steps max for a high-frequency activity.",
          "Define what can change without approval and what needs review.",
          "Run a weekly simplification pass: delete one step, automate one step, standardize one output."
        ]
      },
      "Ownership Desire": {
        strength: "You take responsibility and push work forward without waiting for perfect conditions.",
        risk: "You may absorb too much responsibility and become a bottleneck.",
        actions: [
          "List what you own versus what you influence, then delegate one item this week.",
          "Define clear handoffs: who needs what, by when, in what format.",
          "Create a small operating cadence with stakeholders to reduce ad hoc escalation."
        ]
      },
      "Impact Drive": {
        strength: "You are motivated by meaningful outcomes and can sustain effort when value is clear.",
        risk: "You may reject necessary low-glamour work even when it is required for scale.",
        actions: [
          "Define one impact metric you will move in 30 days and track it weekly.",
          "Identify one foundational task that enables scale and schedule it early.",
          "Share a short impact update to build alignment and momentum."
        ]
      }
    };

    const getPartInsight = (part: string) => {
      const fallback = {
        strength: "You show strength in this area and can use it as leverage to improve other capabilities.",
        risk: "This area may limit your effectiveness if left unattended.",
        actions: [
          "Pick one concrete behavior to improve in this area and practice it twice a week.",
          "Create a simple checklist to make progress measurable.",
          "Review results weekly and adjust your approach."
        ]
      };
      return PART_LIBRARY[part] || fallback;
    };

    const determinePersona = (topParts: Array<{ part: string; score: number }>) => {
      const top = topParts.map(p => p.part);
      const has = (p: string) => top.includes(p);

      if (has("Strategic Tilt") && (has("Automation View") || has("AI Application"))) {
        return {
          label: "AI Strategy Orchestrator",
          meaning: "You combine direction-setting with practical AI application. You perform best when you own priorities and design repeatable AI-assisted workflows."
        };
      }
      if ((has("Need for Structure") || has("Problem Solving")) && (has("Automation View") || has("AI Application"))) {
        return {
          label: "Execution Optimizer",
          meaning: "You turn complexity into structured execution. You perform best when you standardize work, automate repeatables, and track measurable outcomes."
        };
      }
      if (has("Communication") && (has("Comfort with Uncertainty") || has("Continuous Learning"))) {
        return {
          label: "Adaptive Communicator",
          meaning: "You help teams move through ambiguity by making ideas clear and actionable. You perform best when you translate uncertainty into simple next steps."
        };
      }
      if (has("Continuous Learning") && (has("Comfort with Uncertainty") || has("AI Application"))) {
        return {
          label: "Learning Accelerator",
          meaning: "You learn fast and improve through iteration. You perform best when you run short experiments and turn lessons into reusable templates."
        };
      }
      return {
        label: "Balanced Builder",
        meaning: "You have a well-rounded profile. You perform best by doubling down on your strengths and raising your lowest area to remove execution friction."
      };
    };

const normalizedScores = ASSESSMENT_QUESTIONS.map((q) => {
      const raw = answers[q.id];
      if (raw === undefined || raw === null) return null;

      let value: number | null = null;

      if (typeof raw === 'number') value = raw;
      else if (typeof raw === 'string') {
        // Scale answers may come as strings sometimes
        const asNum = Number(raw);
        if (!Number.isNaN(asNum) && raw.trim() !== '') value = asNum;
        else value = mapChoiceToNumber(raw);
      }

      if (value === null || value === 0) return null;

      const min = q.type === 'choice' ? 1 : (q.min ?? 1);
      const max = q.type === 'choice' ? (q.options ? Object.keys(q.options).length : 6) : (q.max ?? 5);

      const clamped = Math.max(min, Math.min(max, value));
      const pct = ((clamped - min) / Math.max(1, (max - min))) * 100;

      return { part: q.part, pct };
    }).filter(Boolean) as Array<{ part: string; pct: number }>;

    const avg = normalizedScores.length
      ? normalizedScores.reduce((a, b) => a + b.pct, 0) / normalizedScores.length
      : 0;

    const byPart = normalizedScores.reduce((acc, s) => {
      acc[s.part] = acc[s.part] || { sum: 0, n: 0 };
      acc[s.part].sum += s.pct;
      acc[s.part].n += 1;
      return acc;
    }, {} as Record<string, { sum: number; n: number }>);

    const partScores = Object.entries(byPart)
      .map(([k, v]) => ({ part: k, score: v.sum / v.n }))
      .sort((a, b) => b.score - a.score);

    const strength = partScores[0];
    const gap = partScores[partScores.length - 1];

    const top3Parts = partScores.slice(0, 3);
    const bottom3Parts = partScores.slice(-3).reverse();

    const persona = determinePersona(top3Parts);

    const topStrengthsText = top3Parts.length
      ? top3Parts.map((p, i) => {
          const insight = getPartInsight(p.part);
          return `${i + 1}) ${p.part} (${p.score.toFixed(0)} / 100)\n- ${insight.strength}`;
        }).join(`\n\n`)
      : "Not available";

    const topRisksText = bottom3Parts.length
      ? bottom3Parts.map((p, i) => {
          const insight = getPartInsight(p.part);
          return `${i + 1}) ${p.part} (${p.score.toFixed(0)} / 100)\n- ${insight.risk}`;
        }).join(`\n\n`)
      : "Not available";

    const actionPlan30 = (() => {
      const weeks = [
        { label: "Week 1", part: bottom3Parts[0]?.part },
        { label: "Week 2", part: bottom3Parts[1]?.part },
        { label: "Week 3", part: bottom3Parts[2]?.part },
      ].filter(w => w.part);

      const lines: string[] = [];
      weeks.forEach(w => {
        const insight = getPartInsight(String(w.part));
        lines.push(`${w.label}: Strengthen ${w.part}`);
        insight.actions.slice(0, 3).forEach(a => lines.push(`- ${a}`));
        lines.push("");
      });

      lines.push("Week 4: Consolidate and scale");
      lines.push("- Choose one workflow to standardize and reuse (prompt + checklist + template).");
      lines.push("- Share the workflow with one colleague and capture improvements.");
      lines.push("- Review results: time saved, quality improved, and decision speed.");
      return lines.join("\n");
    })();

    const band =
      avg >= 80 ? 'High readiness' :
      avg >= 60 ? 'Solid foundation' :
      avg >= 40 ? 'Emerging readiness' :
                 'At risk';

    const publicReport =
`AI Future Fit Discovery Report

Participant
Name: ${userData.fullName}
Email: ${userData.email}
Industry: ${userData.industry}
Role: ${userData.role || 'Not provided'}
Location: ${userData.location}
Experience: ${userData.yearsExperience}

Executive snapshot
Overall index: ${avg.toFixed(1)} / 100 (${band})

Persona label
${persona.label}
${persona.meaning}

Top 3 strengths
${topStrengthsText}

Top 3 risks to manage
${topRisksText}

30-day action plan
${actionPlan30}

How to use this report
- Start with your lowest area first. Raising the constraint improves everything else.
- Use your strongest area as leverage. Apply it to accelerate progress in the gaps.
- Recheck after 30 days. The goal is visible behavioral change, not perfect scores.

Disclaimer
This briefing is an indicative diagnostic based on self-reported answers and should be used as directional guidance.`;


    const ownerCopy =
`OWNER COPY (Internal)

Lead summary
Overall index: ${avg.toFixed(1)} / 100 (${band})
Persona: ${persona.label}
Top strengths: ${top3Parts.map(p => `${p.part} (${p.score.toFixed(0)})`).join(", ")}
Top risks: ${bottom3Parts.map(p => `${p.part} (${p.score.toFixed(0)})`).join(", ")}

Recommended follow-up
- Offer a 20-minute debrief to validate the top risk areas and confirm role context.
- Propose a 60-minute working session: AI workflow design + adoption plan for one high-frequency process.
- If this is an enterprise lead, propose an AI adoption readiness workshop focused on operating model, enablement, governance, and change adoption.

Data captured
Participant: ${userData.fullName}
Email: ${userData.email}
Industry: ${userData.industry}
Role: ${userData.role || 'Not provided'}
Location: ${userData.location}
Experience: ${userData.yearsExperience}

Notes
This version runs without any external AI calls. If you want AI-written narrative later, route answers to your Make webhook and generate the report server-side (do not expose API keys client-side).`;


    setReportData({ public: publicReport, owner: ownerCopy });
    setPhase('REPORT');
  };

  const downloadReport = () => {
    if (!reportData) return;
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    let cursorY = 25;

    doc.setFontSize(8);
    doc.setTextColor(123, 44, 255); 
    doc.setFont("helvetica", "bold");
    doc.text("ELVEX PARTNERS | AI FUTURE FIT", margin, cursorY);
    cursorY += 15;

    doc.setFontSize(22);
    doc.text("CAREER BLUEPRINT", margin, cursorY);
    cursorY += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`PARTICIPANT: ${userData.fullName.toUpperCase()}`, margin, cursorY);
    cursorY += 2;
    doc.setDrawColor(200);
    doc.line(margin, cursorY + 5, pageWidth - margin, cursorY + 5);
    cursorY += 20;

    const lines = reportData.public.split('\n');
    doc.setTextColor(50);
    
    lines.forEach(line => {
      const cleanLine = line.replace(/\*\*/g, '').trim();
      if (!cleanLine) {
        cursorY += 6;
        return;
      }

      let fontSize = 10;
      let fontStyle = "normal";
      let spacing = 6;

      if (cleanLine.match(/^\d+\.\s+TITLE/) || cleanLine.match(/^[A-Z\s]{10,}$/) || cleanLine.startsWith('# ')) {
        fontSize = 13;
        fontStyle = "bold";
        cursorY += 8;
        doc.setTextColor(123, 44, 255);
      } else if (cleanLine.match(/^\d+\.\s+[A-Z]/) || cleanLine.startsWith('## ')) {
        fontSize = 11;
        fontStyle = "bold";
        cursorY += 6;
        doc.setTextColor(30);
      } else {
        doc.setTextColor(60);
      }

      doc.setFont("helvetica", fontStyle);
      doc.setFontSize(fontSize);
      const wrappedText = doc.splitTextToSize(cleanLine.replace(/^#+ /, '').replace(/^[•\-\*] /, '• '), pageWidth - (margin * 2));
      
      if (cursorY + (wrappedText.length * spacing) > 275) {
        doc.addPage();
        cursorY = 25;
      }
      doc.text(wrappedText, margin, cursorY);
      cursorY += (wrappedText.length * spacing);
    });

    doc.setFontSize(7);
    doc.setTextColor(180);
    doc.text("Powered by Elvex Partners. elvexpartners.com", margin, 285);
    doc.save(`AI_Future_Fit_${userData.fullName.replace(/\s+/g, '_')}.pdf`);
    setPhase('SUCCESS');
  };

  const labelClasses = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1";
  const inputClasses = (f: keyof UserData) => `w-full border px-4 py-2.5 text-slate-900 placeholder:text-slate-300 focus:ring-1 outline-none transition-all rounded-sm text-sm font-medium ${formTouched && !userData[f] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white focus:border-[#002D72]'}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      <header className="fixed top-0 w-full bg-white border-b border-slate-200 z-50 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[#002D72] flex items-center justify-center text-white font-bold text-xs rounded-sm">AF</div>
          <span className="text-xs font-extrabold tracking-tight uppercase text-[#002D72]">AI Future Fit Discovery</span>
        </div>
        <a href="https://elvexpartners.com" target="_blank" className="text-[10px] font-black text-[#002D72] uppercase tracking-widest hover:underline">ELVEXPARTNERS.COM</a>
      </header>

      <main className="pt-20 pb-20 px-4 flex justify-center">
        {phase === 'WELCOME' && (
          <div className="max-w-4xl w-full py-16 text-center animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-4xl md:text-7xl font-black text-[#002D72] mb-8 tracking-tighter uppercase leading-none">AI Future Fit <br/> Discovery Session</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 font-medium">The AI economy is reshaping value creation. Discover your unique contribution style in an era of strategy, orchestration, and creativity.</p>
            <button onClick={() => setPhase('COLLECT_DATA')} className="bg-[#002D72] text-white px-12 py-5 text-xs font-bold uppercase tracking-widest hover:bg-[#001F4D] transition-all rounded-sm">Start Discovery</button>
          </div>
        )}

        {phase === 'COLLECT_DATA' && (
          <div className="max-w-xl w-full bg-white p-10 border border-slate-200 shadow-xl rounded-sm">
            <h2 className="text-2xl font-black text-[#002D72] uppercase tracking-tight mb-8">Registration</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClasses}>Full Name</label><input type="text" name="fullName" value={userData.fullName} onChange={handleUserDataChange} className={inputClasses('fullName')} /></div>
                <div><label className={labelClasses}>Business Email</label><input type="email" name="email" value={userData.email} onChange={handleUserDataChange} className={inputClasses('email')} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClasses}>Industry</label><input type="text" name="industry" value={userData.industry} onChange={handleUserDataChange} className={inputClasses('industry')} /></div>
                <div><label className={labelClasses}>Current Role</label><input type="text" name="role" value={userData.role} onChange={handleUserDataChange} className={inputClasses('role')} /></div>
              </div>
              <div><label className={labelClasses}>Location</label><input type="text" name="location" value={userData.location} onChange={handleUserDataChange} className={inputClasses('location')} /></div>
              <button onClick={() => { setFormTouched(true); if (isFormValid) setPhase('ASSESSMENT'); }} className="w-full py-4 mt-6 bg-[#002D72] text-white text-xs font-bold uppercase tracking-widest rounded-sm">Enter Assessment</button>
            </div>
          </div>
        )}

        {phase === 'ASSESSMENT' && (
          <div className="max-w-3xl w-full">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-[9px] font-black uppercase text-[#002D72] tracking-[0.2em]">{ASSESSMENT_QUESTIONS[currentStep].part}</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Query {currentStep + 1} <span className="text-slate-300 font-normal">/ {totalQuestions}</span></h2>
              </div>
              <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden mb-2"><div className="h-full bg-[#002D72] transition-all" style={{ width: `${progress}%` }} /></div>
            </div>

            <div className="bg-white border border-slate-200 shadow-lg p-8 rounded-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-8 leading-snug">{ASSESSMENT_QUESTIONS[currentStep].text}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ASSESSMENT_QUESTIONS[currentStep].type === 'choice' ? (
                  Object.entries(ASSESSMENT_QUESTIONS[currentStep].options!).map(([key, label]) => (
                    <button key={key} onClick={() => handleAnswerSelection(ASSESSMENT_QUESTIONS[currentStep].id, key)}
                      className={`text-left px-5 py-3 border-2 transition-all flex items-center gap-4 rounded-sm
                        ${answers[ASSESSMENT_QUESTIONS[currentStep].id] === key ? 'border-[#002D72] bg-blue-50' : 'border-slate-50 hover:bg-slate-50'}`}>
                      <span className={`w-6 h-6 flex items-center justify-center font-bold text-[10px] rounded-full shrink-0 ${answers[ASSESSMENT_QUESTIONS[currentStep].id] === key ? 'bg-[#002D72] text-white' : 'bg-slate-100 text-slate-400'}`}>{key}</span>
                      <span className="text-sm font-semibold text-slate-600 leading-tight">{label}</span>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full flex justify-between items-center py-6 px-10 bg-slate-50 rounded-sm">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Low</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button key={num} onClick={() => handleAnswerSelection(ASSESSMENT_QUESTIONS[currentStep].id, num)}
                          className={`w-10 h-10 flex items-center justify-center border-2 font-bold text-sm rounded-sm transition-all ${answers[ASSESSMENT_QUESTIONS[currentStep].id] === num ? 'bg-[#002D72] text-white border-[#002D72]' : 'bg-white border-slate-100 text-slate-300'}`}>{num}</button>
                      ))}
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">High</span>
                  </div>
                )}
              </div>

              <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100">
                <button onClick={() => setCurrentStep(s => Math.max(0, s-1))} className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900">Back</button>
                {currentStep < totalQuestions - 1 ? (
                  <button disabled={answers[ASSESSMENT_QUESTIONS[currentStep].id] === undefined} onClick={handleNextStep} className="bg-[#002D72] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-sm disabled:opacity-30">Continue</button>
                ) : (
                  <button disabled={answers[ASSESSMENT_QUESTIONS[currentStep].id] === undefined} onClick={generateReport} className="bg-teal-600 text-white px-10 py-4 text-xs font-bold uppercase tracking-widest rounded-sm shadow-lg">Finalize Analysis</button>
                )}
              </div>
            </div>
          </div>
        )}

        {phase === 'GENERATING' && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-12 h-12 border-4 border-[#002D72] border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-black text-[#002D72] uppercase tracking-tight mb-2">Diagnostic Active</h2>
            <p className="text-slate-400 text-sm italic">Synthesizing behavioral patterns into strategic career insights...</p>
          </div>
        )}

        {phase === 'REPORT' && reportData && (
          <div className="max-w-4xl w-full animate-in fade-in duration-700">
            <div className="bg-white border border-slate-200 shadow-2xl rounded-sm overflow-hidden mb-12">
              <div className="bg-[#002D72] px-8 py-16 text-white border-b-4 border-teal-500">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 uppercase leading-none">Career Blueprint</h1>
                <p className="text-blue-200 font-bold text-base uppercase tracking-widest">Participant: {userData.fullName}</p>
              </div>
              
              <div className="p-8 md:p-16">
                <div className="report-render text-slate-600 leading-relaxed">
                  {reportData.public.split('\n').map((line, i) => {
                    const cleanLine = line.replace(/\*\*/g, '').trim();
                    if (!cleanLine && i > 0) return <div key={i} className="h-6" />;
                    const isMain = cleanLine.match(/^\d+\.\s+TITLE/) || cleanLine.match(/^[A-Z\s]{10,}$/) || cleanLine.startsWith('# ');
                    const isSub = cleanLine.match(/^\d+\.\s+[A-Z]/) || cleanLine.startsWith('## ');
                    
                    if (isMain) return <h1 key={i} className="text-2xl md:text-3xl font-bold text-[#002D72] uppercase mb-8 mt-12 border-b border-slate-100 pb-4">{cleanLine.replace(/^#+ /, '')}</h1>;
                    if (isSub) return <h2 key={i} className="text-lg md:text-xl font-bold text-slate-800 uppercase mt-12 mb-6 border-l-4 border-teal-500 pl-5 py-1 bg-slate-50/50">{cleanLine.replace(/^#+ /, '')}</h2>;
                    if (cleanLine.match(/^[•\-\*]/)) return <div key={i} className="flex gap-4 mb-4 ml-2"><div className="w-1.5 h-1.5 bg-teal-500 mt-2.5 shrink-0 rounded-full"></div><span className="text-slate-700 font-medium text-base md:text-lg leading-relaxed">{cleanLine.replace(/^[•\-\*]\s+/, '')}</span></div>;
                    return <p key={i} className="mb-6 text-slate-700 font-medium text-base md:text-lg leading-relaxed">{cleanLine}</p>;
                  })}
                </div>

                <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left"><h4 className="text-[10px] font-black uppercase text-[#002D72] mb-2 tracking-widest">Session Complete</h4><p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Save your strategic findings as a professional PDF document.</p></div>
                  <button onClick={downloadReport} className="bg-[#002D72] text-white font-bold text-xs uppercase tracking-widest px-10 py-5 rounded-sm shadow-xl active:scale-95 transition-all">Download PDF Report</button>
                </div>

                {reportData.owner && (
                  <div className="mt-20 p-8 bg-slate-50 border border-slate-200 rounded-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Internal Admin View (Owner Copy)</h4>
                    <div className="font-mono text-[10px] text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {reportData.owner}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {phase === 'SUCCESS' && (
          <div className="max-w-2xl w-full py-16 text-center animate-in fade-in zoom-in-95">
            <div className="bg-white border border-slate-200 p-12 shadow-2xl rounded-sm">
              <div className="w-16 h-16 bg-teal-500 rounded-full mx-auto mb-8 flex items-center justify-center text-white"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg></div>
              <h2 className="text-3xl font-black text-[#002D72] uppercase tracking-tight mb-4">Discovery Saved</h2>
              <p className="text-slate-500 text-base mb-10">Your diagnostic session has been successfully archived.</p>
              <button onClick={() => window.location.reload()} className="bg-[#002D72] text-white font-bold text-xs uppercase tracking-widest px-10 py-5 rounded-sm">New Session</button>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full bg-white border-t border-slate-200 px-8 py-3 text-[9px] text-slate-400 flex justify-between uppercase tracking-widest font-bold z-50">
        <div className="flex gap-6"><span>© {new Date().getFullYear()} Elvex Partners</span><a href="https://elvexpartners.com" target="_blank" className="text-[#002D72]">elvexpartners.com</a></div>
        <div className="hidden md:flex gap-6"><span>Diagnostic Protocol v2.5</span><span>Secure Data Environment</span></div>
      </footer>
    </div>
  );
};

export default App;
