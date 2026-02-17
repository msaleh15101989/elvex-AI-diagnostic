
import { Question, FrameworkMetadata } from './types';

export const FRAMEWORK_METADATA: FrameworkMetadata = {
  name: "AI Future Fit Discovery Assessment™",
  owner: "Elvex Partners LLC-FZ",
  author: "Moataz Saleh",
  tagline: "Determining your economic contribution style in the era of intelligence."
};

export const ASSESSMENT_QUESTIONS: Question[] = [
  // SECTION: MULTIPLE CHOICE (Q1 - Q18)
  {
    id: 1,
    part: "Work Satisfaction",
    text: "When you finish a task, what makes you feel like you truly succeeded?",
    type: 'choice',
    options: {
      A: "Finding a key insight or a logical solution to a complex problem.",
      B: "Seeing someone else succeed or grow because of my support.",
      C: "Creating something original, like a new design or a unique story.",
      D: "Improving a process so that everything runs more efficiently.",
      E: "Successfully influencing a decision or winning a new opportunity.",
      F: "Launching a new product or delivering measurable results quickly."
    }
  },
  {
    id: 2,
    part: "Natural Focus",
    text: "If you had a free day to work on anything, what would you naturally choose?",
    type: 'choice',
    options: {
      A: "Researching deep topics and analyzing trends.",
      B: "Mentoring others or building a community.",
      C: "Designing new concepts or creative projects.",
      D: "Organizing systems and optimizing workflows.",
      E: "Networking and persuading others to join a vision.",
      F: "Building a business or starting a new project."
    }
  },
  {
    id: 3,
    part: "Core Frustrations",
    text: "What is most likely to drain your energy at work?",
    type: 'choice',
    options: {
      A: "Being forced to ignore data or logical patterns.",
      B: "Working in an environment where people feel unsupported.",
      C: "Being stuck in a role with no room for original ideas.",
      D: "Constant chaos and a complete lack of structure.",
      E: "Missing out on growth opportunities due to slow decisions.",
      F: "Endless talking without any actual execution or 'doing'."
    }
  },
  {
    id: 4,
    part: "Exciting Progress",
    text: "What kind of progress gets you most excited?",
    type: 'choice',
    options: {
      A: "Discovering a new 'why' or a strategic insight.",
      B: "A breakthrough in team dynamics or culture.",
      C: "A creative breakthrough that changes a brand or product.",
      D: "A system that can now handle 10x more work.",
      E: "A massive increase in market reach or sales.",
      F: "Taking full ownership of an outcome and delivering it."
    }
  },
  {
    id: 5,
    part: "Daily Superpower",
    text: "Which of these best describes your natural talent?",
    type: 'choice',
    options: {
      A: "Analyzing complex information to find the right path.",
      B: "Developing the potential of the people around me.",
      C: "Bringing new, creative ideas to life.",
      D: "Making sure operations run smoothly and perfectly.",
      E: "Winning people over and growing influence.",
      F: "Moving fast and building things from the ground up."
    }
  },
  {
    id: 6,
    part: "Problem Solving",
    text: "How do you usually start solving a new problem?",
    type: 'choice',
    options: {
      A: "Studying the facts and logical patterns first.",
      B: "Talking to the people involved to understand their needs.",
      C: "Brainstorming a completely different way to look at it.",
      D: "Breaking it down into a step-by-step process.",
      E: "Identifying who needs to be convinced to move forward.",
      F: "Testing a small version of the solution immediately."
    }
  },
  {
    id: 7,
    part: "Personal Style",
    text: "Which word would your colleagues use to describe you best?",
    type: 'choice',
    options: {
      A: "Analytical",
      B: "Empathetic",
      C: "Creative",
      D: "Structured",
      E: "Persuasive",
      F: "Practical"
    }
  },
  {
    id: 8,
    part: "AI Application",
    text: "What is your primary goal when using AI tools today?",
    type: 'choice',
    options: {
      A: "To research, analyze data, and build strategies.",
      B: "To improve how I coach and communicate with others.",
      C: "To generate content, visuals, or new designs.",
      D: "To automate tasks and create efficient workflows.",
      E: "To improve marketing, sales, and market reach.",
      F: "To build new products and launch ventures faster."
    }
  },
  {
    id: 9,
    part: "Automation View",
    text: "How do you feel about AI taking over repetitive tasks?",
    type: 'choice',
    options: {
      A: "I want to move into even higher-level strategic thinking.",
      B: "I want to help people adapt to this new way of working.",
      C: "I want more time to create unique human work.",
      D: "I want to scale systems at a much faster pace.",
      E: "I want to focus more on market impact and growth.",
      F: "I want to build my own assets and own the results."
    }
  },
  {
    id: 10,
    part: "Work Environment",
    text: "In which environment do you perform your best work?",
    type: 'choice',
    options: {
      A: "Where quality and deep thinking are valued.",
      B: "Where supporting others is the main priority.",
      C: "Where there is total freedom to experiment.",
      D: "Where there are clear processes and high efficiency.",
      E: "Where the focus is on growth and winning.",
      F: "Where I have ownership and can move quickly."
    }
  },
  {
    id: 11,
    part: "Pressure Handling",
    text: "How does your style change when you are under pressure?",
    type: 'choice',
    options: {
      A: "I become more focused on precision and logic.",
      B: "I become more protective and supportive of the team.",
      C: "I become more inventive in finding shortcuts.",
      D: "I become more organized and process-driven.",
      E: "I become more decisive and assertive.",
      F: "I become more action-oriented and relentless."
    }
  },
  {
    id: 12,
    part: "Project Priorities",
    text: "When leading a project, what is your top priority?",
    type: 'choice',
    options: {
      A: "Ensuring the strategy is sound and logical.",
      B: "Ensuring the team is motivated and aligned.",
      C: "Ensuring the output is unique and creative.",
      D: "Ensuring the workflow is perfectly efficient.",
      E: "Ensuring the market impact is maximized.",
      F: "Ensuring the project is finished and delivered."
    }
  },
  {
    id: 13,
    part: "Team Role",
    text: "Which role do you naturally fill in a team meeting?",
    type: 'choice',
    options: {
      A: "The critical thinker who spots errors in the plan.",
      B: "The connector who makes sure everyone is heard.",
      C: "The ideator who suggests the 'wild' new direction.",
      D: "The organizer who takes notes and builds the timeline.",
      E: "The advocate who pushes for the best market outcome.",
      F: "The driver who asks 'how soon can we start?'"
    }
  },
  {
    id: 14,
    part: "Growth Focus",
    text: "What skill do you most want to improve right now?",
    type: 'choice',
    options: {
      A: "My ability to use data for better decision-making.",
      B: "My ability to lead and coach a high-performing team.",
      C: "My ability to use new tools for creative production.",
      D: "My ability to build automated business systems.",
      E: "My ability to influence and grow a brand's reach.",
      F: "My ability to build and scale a new venture."
    }
  },
  {
    id: 15,
    part: "Communication",
    text: "What is your preferred way to share a big idea?",
    type: 'choice',
    options: {
      A: "Using facts, data points, and a logical structure.",
      B: "Through a 1-on-1 conversation or coaching session.",
      C: "Using a visual presentation or a creative story.",
      D: "By showing a clear plan and process map.",
      E: "By pitching the growth and impact potential.",
      F: "By showing a working prototype or early results."
    }
  },
  {
    id: 16,
    part: "Problem Lens",
    text: "How do you see most problems in business?",
    type: 'choice',
    options: {
      A: "As information that needs to be better understood.",
      B: "As people challenges that need to be resolved.",
      C: "As opportunities to reinvent how things look.",
      D: "As inefficient systems that need to be fixed.",
      E: "As barriers to growth that need to be removed.",
      F: "As tasks that need to be finished immediately."
    }
  },
  {
    id: 17,
    part: "Efficiency Tilt",
    text: "What does 'Efficiency' mean to you?",
    type: 'choice',
    options: {
      A: "Finding the smartest path with the least waste.",
      B: "Helping people work together without conflict.",
      C: "Spending less time on boring tasks to spend more on art.",
      D: "Building a machine that works while I sleep.",
      E: "Converting effort into results at the highest rate.",
      F: "Shipping a product faster than anyone else."
    }
  },
  {
    id: 18,
    part: "Strategic Tilt",
    text: "What is your long-term goal in your career?",
    type: 'choice',
    options: {
      A: "To be a respected expert and advisor.",
      B: "To be a leader who changes people's lives.",
      C: "To leave a legacy of original creative work.",
      D: "To build a system that scales globally.",
      E: "To have massive market influence and impact.",
      F: "To build and own a portfolio of successful projects."
    }
  },
  // SECTION: SCALES (Q19 - Q23)
  {
    id: 19,
    part: "Comfort with Uncertainty",
    text: "I am comfortable making big moves even when the future is not clear.",
    subtext: "(1: I prefer certainty - 5: I embrace risk)",
    type: 'scale',
    min: 1,
    max: 5
  },
  {
    id: 20,
    part: "Ownership Desire",
    text: "I prefer to have full responsibility for the final outcome of my work.",
    subtext: "(1: I prefer shared responsibility - 5: I love total ownership)",
    type: 'scale',
    min: 1,
    max: 5
  },
  {
    id: 21,
    part: "Need for Structure",
    text: "I perform best when there are clear rules and a defined process to follow.",
    subtext: "(1: I hate rules - 5: I need clear structure)",
    type: 'scale',
    min: 1,
    max: 5
  },
  {
    id: 22,
    part: "Continuous Learning",
    text: "I am constantly spending my own time learning new technologies or skills.",
    subtext: "(1: Not really - 5: Always)",
    type: 'scale',
    min: 1,
    max: 5
  },
  {
    id: 23,
    part: "Impact Drive",
    text: "My main goal is to have a high visible impact on the market or industry.",
    subtext: "(1: I prefer to work quietly - 5: I want high visibility)",
    type: 'scale',
    min: 1,
    max: 5
  }
];
