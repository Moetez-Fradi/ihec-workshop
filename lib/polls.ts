export type Poll = {
  id: string;
  group: string;
  question: string;
} & ({ kind: "choice"; options: string[] } | { kind: "text" });

const yesNo = ["Yes", "No"];
const explainOrCode = ["An explanation first", "Code right away"];

/** In the order they come up during the workshop. Correct answers live in answers.ts. */
export const polls: Poll[] = [
  { id: "idea", group: "Opening", kind: "text", question: "What would you build if code wasn't the blocker?" },
  { id: "used-ai", group: "Opening", kind: "choice", question: "Have you used an AI chat tool?", options: yesNo },
  { id: "built-ai", group: "Opening", kind: "choice", question: "Have you built something that runs with AI help?", options: yesNo },
  { id: "lie-1", group: "Spot the lie", kind: "choice", question: "Which JavaScript claim is false?", options: ["[10, 1, 5].sort() gives [1, 10, 5]", "0.1 + 0.2 === 0.3 is false", "Every array has a built-in .sum() method"] },
  { id: "lie-2", group: "Spot the lie", kind: "choice", question: "Which HTML claim is false?", options: ["An <img> should have alt text", "type=\"number\" with min=\"0\" makes typing -5 impossible", "By default, a <button> inside a <form> submits it"] },
  { id: "check-1", group: "Mini-check", kind: "choice", question: "You don't understand an error message. What do you ask for?", options: explainOrCode },
  { id: "check-2", group: "Mini-check", kind: "choice", question: "You need a button that clears a form. What do you ask for?", options: explainOrCode },
  { id: "check-3", group: "Mini-check", kind: "choice", question: "Your app will store personal data. What do you ask for?", options: explainOrCode },
  { id: "quiz-1", group: "Quiz", kind: "choice", question: "How does a language model write an answer?", options: ["It looks up a stored answer", "It predicts one token after another", "It copies the first web result"] },
  { id: "quiz-2", group: "Quiz", kind: "choice", question: "Which is NOT one of the five parts of our prompt?", options: ["Role", "Constraints", "Password", "Output format"] },
  { id: "quiz-3", group: "Quiz", kind: "choice", question: "Which design instruction is the most useful?", options: ["Make it look modern", "Make it pop", "Two columns, large headings, one accent color"] },
  { id: "quiz-4", group: "Quiz", kind: "choice", question: "Where can a secret API key safely go?", options: ["In the page's JavaScript", "In a prompt to a chat tool", "On the server, in an environment variable"] },
  { id: "quiz-5", group: "Quiz", kind: "choice", question: "Your app breaks. What is the best follow-up prompt?", options: ["It doesn't work, fix it", "What I did, what happened, what I expected", "Rewrite everything"] },
  { id: "demo", group: "Wrap-up", kind: "text", question: "What did you build? One line." },
  { id: "confidence", group: "Wrap-up", kind: "choice", question: "Could you build another prototype on your own?", options: ["Yes", "With a little help", "Not yet"] },
];

export const pollById = new Map(polls.map((p) => [p.id, p]));

export type LiveState = { pollId: string | null; open: boolean; revealed: boolean };

export type LiveView = {
  state: LiveState;
  total: number;
  counts: number[] | null;
  texts: { id: string; text: string }[] | null;
  answer: { index: number; why: string } | null;
  mine: string | null;
  persistent: boolean;
};
