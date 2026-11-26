"use client";
import { PageTitle } from "@/components/ui";
import { useStored } from "@/components/useStored";

const items = [
  "I clicked every button and tried every input.",
  "I tried empty, zero, negative and very large values.",
  "I checked the results by hand with a simple example.",
  "I checked facts, links and library names the AI gave me.",
  "It is usable on a narrow screen and with the keyboard.",
  "No passwords, keys or private data are in the code or my prompts.",
  "I can explain what the main parts of the code do.",
  "The design takes inspiration from my reference without copying it.",
];

const none: string[] = [];

export default function ReviewPage() {
  const [checked, setChecked] = useStored<string[]>("p2p:review", none);
  return (
    <>
      <PageTitle kicker="Wrap-up" title="Before you ship">
        {checked.length} of {items.length} checked.
      </PageTitle>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <label className="card flex cursor-pointer items-start gap-3">
              <input type="checkbox" className="mt-1 size-5 accent-mint" checked={checked.includes(item)} onChange={(e) => setChecked(e.target.checked ? [...checked, item] : checked.filter((c) => c !== item))} />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
