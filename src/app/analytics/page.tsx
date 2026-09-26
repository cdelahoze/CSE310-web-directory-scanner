import React from "react";
import Link from "next/link";
import { scanDirectoryAction } from "../actions";

export default async function AnalyticsPage() {
  const result = await scanDirectoryAction("./uploads");

  if (!result.success || !result.data) {
    return (
      <main className="p-8 bg-slate-900 min-h-screen text-white">
        <h1 className="text-xl font-bold text-red-500">Error loading analytics</h1>
      </main>
    );
  }

  const { stats } = result.data;

  return (
    <main className="page-shell">
      <div className="page-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Analytics Dashboard</h1>
            <p className="page-subtitle">
              Detailed breakdown of storage and system metrics.
            </p>
          </div>
          <Link
            href="/"
            className="primary-button"
          >
            ← Back to Explorer
          </Link>
        </header>

        <div className="metric-grid">
          <div className="page-panel page-panel-inner">
            <h2 className="text-lg font-bold text-slate-200 mb-3">Metrics Summary</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><strong className="text-cyan-400">Total Directories:</strong> {stats.totalDirectories}</li>
              <li><strong className="text-cyan-400">Total Files:</strong> {stats.totalFiles}</li>
              <li><strong className="text-cyan-400">Total Size:</strong> {(stats.totalSizeBytes / 1024).toFixed(2)} KB</li>
            </ul>
          </div>

          <div className="page-panel page-panel-inner">
            <h2 className="text-lg font-bold text-slate-200 mb-3">Storage Distribution</h2>
            <p className="text-sm text-slate-400">
              Data is scanned and calculated in real time on the Node.js server.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}