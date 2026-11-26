export type Mission = {
  id: string;
  field: string;
  title: string;
  user: string;
  features: [string, string, string];
  stretch: string;
};

export const missions: Mission[] = [
  { id: "savings", field: "Finance", title: "Savings goal simulator", user: "students saving for something big", features: ["Enter a goal and a monthly amount", "Show how many months it takes", "Show a progress bar"], stretch: "Compare two monthly amounts side by side" },
  { id: "split", field: "Any major", title: "Group expense splitter", user: "friends sharing costs", features: ["Add people", "Add expenses and who paid", "Show who owes whom"], stretch: "Copy a summary to share" },
  { id: "sprint", field: "IT", title: "Study sprint tracker", user: "students preparing for exams", features: ["Start and pause a 25-minute timer", "Name each session", "List the sessions finished today"], stretch: "Keep the list after a reload" },
  { id: "event", field: "Management", title: "Event budget planner", user: "a student club planning an event", features: ["Set a total budget", "Add cost lines by category", "Warn when over budget"], stretch: "Show spending by category" },
  { id: "pricing", field: "Business computing", title: "Pricing calculator", user: "someone starting a small side business", features: ["Enter fixed costs, unit cost and price", "Show profit per unit", "Show the break-even quantity"], stretch: "Handle a price below the unit cost with a clear message" },
  { id: "grades", field: "Any major", title: "Grade target calculator", user: "students planning their semester", features: ["Add courses with coefficients", "Show the weighted average", "Show the score needed on the last exam"], stretch: "Say clearly when the target is out of reach" },
];
