import { CopyBlock, PageTitle } from "@/components/ui";

const steps = [
  { title: "1. Start vague, on purpose", text: "Build a budget app" },
  {
    title: "2. Ask for a spec first",
    text: `I want a savings goal simulator for students on a tight monthly budget.
Before writing code, list: the smallest set of features, what the user can do, the screen states (empty, filled, error, success), and the edge cases.
Keep it short and ask me anything that is unclear.`,
  },
  {
    title: "3. Structured prompt with design cues",
    text: `## Role
You are a front-end developer who cares about clear design.

## Context
Students on a tight monthly budget want to know when they can afford something.

## Task
Build a savings goal simulator.
Features:
- Enter a goal, the amount already saved and a monthly amount
- Show how many months are left
- Show a progress bar

## Design direction
- clean editorial grid
- high-contrast typography
- generous whitespace
- calm neutral palette with one accent

## Constraints
Works on a phone. No sign-up and no external services. Handle empty, zero and negative input with clear messages. Labelled inputs.

## Output format
One HTML file with CSS and JavaScript inside. Then list how to test it.`,
  },
  {
    title: "4. Break it, then fix one thing",
    text: `What I did: I set the monthly amount to 0.
What happened: [describe what you see]
What I expected: a message saying the goal can't be reached with 0 per month.

Fix only this. Keep the design. Explain the cause and how to test it.`,
  },
  {
    title: "5. Review before you ship",
    text: `Review this code. List real bugs, unsafe patterns and accessibility problems, most serious first.
For each one, show how I can reproduce it. Don't change any code yet.`,
  },
];

export default function LiveBuildPage() {
  return (
    <>
      <PageTitle kicker="Follow along" title="Live build: savings simulator">
        Copy each prompt in order. Your results will differ from ours, and that is normal: test what you get.
      </PageTitle>
      <div className="space-y-4">
        {steps.map((s) => <CopyBlock key={s.title} title={s.title} text={s.text} />)}
      </div>
    </>
  );
}
