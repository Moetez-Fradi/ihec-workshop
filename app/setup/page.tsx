import { PageTitle } from "@/components/ui";

const browserSteps = [
  "Download the starter file below and double-click it. It should open in your browser.",
  "Open any AI chat tool you can use.",
  "Paste your prompt and ask for one HTML file with the CSS and JavaScript inside.",
  "Open the starter file in a text editor (Notepad works), replace everything with the new code, and save.",
  "Refresh the browser tab, test, and send a follow-up prompt.",
];

export default function SetupPage() {
  return (
    <>
      <PageTitle kicker="Before we start" title="Get set up">
        Start with the browser path. It needs no installation. Use VS Code with an AI assistant if you want to go further.
      </PageTitle>

      <section className="card mb-5">
        <h2 className="text-xl font-bold text-mint">Path A: chat and browser</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          {browserSteps.map((s) => <li key={s}>{s}</li>)}
        </ol>
        <a href="/starter.html" download className="btn mt-4">Download starter file</a>
      </section>

      <section className="card">
        <h2 className="text-xl font-bold text-amber">Path B: VS Code and an AI assistant</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Install <a className="underline" href="https://code.visualstudio.com" target="_blank" rel="noreferrer">Visual Studio Code</a>.</li>
          <li>Add OpenAI Codex or the coding assistant you already have, and sign in with your own account.</li>
          <li>Open an empty folder, put the starter file in it, and ask the assistant to change it.</li>
          <li>Read what changed before you accept it.</li>
        </ol>
        <p className="mt-4 text-sm text-mute">
          Free plans have limits that change often. If you hit one, switch to path A and keep going. Never paste passwords, keys or private data into a prompt.
        </p>
      </section>
    </>
  );
}
