"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Camera, Printer, X } from "lucide-react";
import { errorMessage } from "@/lib/format";
import { useDialog } from "./use-dialog";
export function ItemQR({ id, name }: { id: string; name: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(`${window.location.origin}/items/${id}`);
  }, [id]);
  return (
    <div className="qr-label">
      <div className="qr-code">
        {url ? (
          <QRCodeSVG value={url} size={138} level="M" marginSize={2} />
        ) : (
          <span>Preparing QR…</span>
        )}
      </div>
      <strong>{name}</strong>
      <span className="mono small">
        MM / {id.padStart(3, "0")} · SCAN TO RENT
      </span>
      <button className="text-button no-print" onClick={() => window.print()}>
        <Printer size={14} /> Print label
      </button>
    </div>
  );
}
export function ScanButton() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button className="button" onClick={() => setOpen(true)}>
        <Camera size={17} /> Scan an item
      </button>
      {open && <Scanner onClose={close} />}
    </>
  );
}
function Scanner({ onClose }: { onClose: () => void }) {
  useDialog(true, onClose);
  const decodedOnce = useRef(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const scanner = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  useEffect(
    () => () => {
      if (scanner.current?.isScanning)
        void scanner.current.stop().catch(() => {});
    },
    [],
  );
  async function start() {
    setStarted(true);
    setError(null);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      scanner.current = new Html5Qrcode("qr-scanner");
      await scanner.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decoded) => {
          if (decodedOnce.current) return;
          try {
            const url = new URL(decoded, window.location.origin);
            if (
              url.origin !== window.location.origin ||
              !/^\/items\/[1-9]\d*$/.test(url.pathname)
            )
              throw new Error(
                "Scan a MeterMend item label from this workshop.",
              );
            decodedOnce.current = true;
            void scanner.current?.stop().then(() => {
              onClose();
              router.push(url.pathname);
            });
          } catch (e) {
            setError(errorMessage(e));
          }
        },
        () => {},
      );
    } catch (e) {
      setError(errorMessage(e));
      setStarted(false);
    }
  }
  return (
    <div className="modal-backdrop">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scan-title"
      >
        <div className="section-heading">
          <h2 id="scan-title">Scan the item label</h2>
          <button
            className="icon-button"
            aria-label="Close scanner"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        <p className="muted">
          Point your camera at the QR label on the equipment.
        </p>
        <div id="qr-scanner" />
        {!started && (
          <button className="button primary full" onClick={() => void start()}>
            <Camera size={17} /> Enable camera
          </button>
        )}
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <p className="small muted">
          Camera access requires HTTPS or localhost. You can also open an item
          from the equipment list.
        </p>
      </section>
    </div>
  );
}
