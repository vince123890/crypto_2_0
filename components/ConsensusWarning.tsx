interface ConsensusWarningProps {
  consensusCount: number;
  consensusWarning: boolean;
}

export function ConsensusWarning({ consensusCount, consensusWarning }: ConsensusWarningProps) {
  if (!consensusWarning) {
    return (
      <div className="rounded-lg border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
        ✅ Konsensus: {consensusCount} sinyal searah (syarat minimum ≥3 terpenuhi)
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber-800 bg-amber-950/40 px-3 py-2 text-sm text-amber-300">
      ⚠ Konsensus rendah: hanya {consensusCount} sinyal searah (butuh ≥3). Pertimbangkan untuk menunggu konfirmasi
      lebih lanjut sebelum eksekusi.
    </div>
  );
}
