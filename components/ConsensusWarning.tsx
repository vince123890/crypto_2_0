interface ConsensusWarningProps {
  consensusCount: number;
  consensusWarning: boolean;
}

export function ConsensusWarning({ consensusCount, consensusWarning }: ConsensusWarningProps) {
  if (!consensusWarning) {
    return (
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-300">
        Konsensus: {consensusCount} sinyal searah (syarat minimum ≥3 terpenuhi)
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm text-amber-300">
      Konsensus rendah: hanya {consensusCount} sinyal searah (butuh ≥3). Pertimbangkan untuk menunggu konfirmasi
      lebih lanjut sebelum eksekusi.
    </div>
  );
}
