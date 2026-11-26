import { missions } from "@/lib/missions";
import { PromptBuilder } from "./PromptBuilder";

export default async function PromptPage({ searchParams }: { searchParams: Promise<{ mission?: string | string[] }> }) {
  const { mission } = await searchParams;
  const found = missions.find((m) => m.id === mission) ?? null;
  return <PromptBuilder key={found?.id ?? "blank"} mission={found} />;
}
