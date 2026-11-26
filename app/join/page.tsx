import { QrCode } from "@/components/QrCode";

export default function JoinPage() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">QR codes</h1>
      <p className="mb-8 text-mute">Download these from the live site, then drop them into the slides.</p>
      <div className="grid gap-8 sm:grid-cols-3">
        <QrCode path="/" label="Workshop site" />
        <QrCode path="/vote" label="Live vote" />
        <QrCode path="/labs/prompt" label="Prompt Lab" />
      </div>
    </>
  );
}
