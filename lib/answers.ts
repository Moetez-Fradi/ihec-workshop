/** Only imported by server code, so students can't read answers before the reveal. */
export const answers: Record<string, { index: number; why: string }> = {
  "lie-1": { index: 2, why: "Arrays have no built-in .sum(). Use reduce(). The sort claim is true because items are compared as text by default." },
  "lie-2": { index: 1, why: "min doesn't stop typing. A user can still enter -5, so your code has to check the value." },
  "check-1": { index: 0, why: "Understand the cause first, or you can't judge the fix." },
  "check-2": { index: 1, why: "It is small, easy to test and low risk." },
  "check-3": { index: 0, why: "Plan what you store and who can see it before any code exists." },
  "quiz-1": { index: 1, why: "It predicts a token, adds it and repeats. Some tools can also search, but that is an extra feature." },
  "quiz-2": { index: 2, why: "Role, Context, Task, Constraints, Output format. Never put passwords in a prompt." },
  "quiz-3": { index: 2, why: "Concrete cues leave less to guess." },
  "quiz-4": { index: 2, why: "Anything sent to the browser can be read by whoever opens the page." },
  "quiz-5": { index: 1, why: "It gives the tool the evidence it needs." },
};
