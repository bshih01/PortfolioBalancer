import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { SectorInfo, Targets } from "../services/api";

interface Props {
  sectors: Record<string, SectorInfo>;
  targets: Targets;
}

export default function TargetComparison({ sectors, targets }: Props) {
  const allSectors = new Set([...Object.keys(sectors), ...Object.keys(targets)]);
  const data = [...allSectors].map((name) => ({
    name,
    actual: sectors[name]?.percent || 0,
    target: targets[name] || 0,
  }));

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Actual vs Target</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} angle={-30} textAnchor="end" height={60} />
          <YAxis tick={{ fill: "#94a3b8" }} unit="%" />
          <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#e2e8f0" }} />
          <Legend />
          <Bar dataKey="actual" fill="#3b82f6" name="Actual %" radius={[4, 4, 0, 0]} />
          <Bar dataKey="target" fill="#475569" name="Target %" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
