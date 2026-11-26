"use client";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

/** QR code for a page on whatever domain the site is currently served from. */
export function QrCode({ path, label }: { path: string; label: string }) {
  const [code, setCode] = useState<{ url: string; image: string } | null>(null);

  useEffect(() => {
    let stopped = false;
    const url = new URL(path, window.location.origin).toString();
    QRCode.toDataURL(url, { width: 900, margin: 2 }).then((image) => {
      if (!stopped) setCode({ url, image });
    });
    return () => {
      stopped = true;
    };
  }, [path]);

  return (
    <figure className="text-center">
      {code ? (
        // eslint-disable-next-line @next/next/no-img-element -- generated data URL, nothing to optimise
        <img src={code.image} alt={`QR code for ${code.url}`} className="mx-auto w-full max-w-[260px] rounded-xl" />
      ) : (
        <div className="mx-auto aspect-square w-full max-w-[260px] rounded-xl bg-panel" />
      )}
      <figcaption className="mt-2">
        <span className="block font-semibold">{label}</span>
        <span className="block break-all text-sm text-mute">{code?.url}</span>
        {code && (
          <a href={code.image} download={`qr-${path.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "home"}.png`} className="text-sm text-mint underline">
            Download PNG
          </a>
        )}
      </figcaption>
    </figure>
  );
}
