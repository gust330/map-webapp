import { CapturePanel } from "@/components/capture/CapturePanel";

export default function CapturePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[#f5f5f5]">
          Capturar
        </h1>
        <p className="text-sm text-[#a1a1aa]">
          Pensa em voz alta. A MAP organiza o resto.
        </p>
      </div>
      <CapturePanel />
    </div>
  );
}
