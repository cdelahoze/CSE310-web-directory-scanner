import React from "react";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";

interface PageProps {
  params: Promise<{
    filename: string;
  }>;
}

export default async function FileDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const decodedFileName = decodeURIComponent(resolvedParams.filename);
  const uploadsDir = path.join(process.cwd(), "uploads");
  const filePath = path.join(uploadsDir, decodedFileName);

  let fileStats = null;
  let error = null;

  try {
    const stats = await fs.stat(filePath);
    fileStats = {
      name: decodedFileName,
      sizeBytes: stats.size,
      sizeKB: (stats.size / 1024).toFixed(2),
      createdAt: stats.birthtime.toLocaleString("en-US"),
      modifiedAt: stats.mtime.toLocaleString("en-US"),
      extension: path.extname(decodedFileName) || "No extension",
      fullPath: filePath,
    };
  } catch (err: any) {
    error = `Could not retrieve the details for file '${decodedFileName}' in ./uploads.`;
  }

  return (
    <main className="page-shell">
      <div className="page-content" style={{ maxWidth: "56rem" }}>

        {/* Header with back button */}
        <header className="page-header">
          <div>
            <h1 className="page-title">File Inspector</h1>
            <p className="page-subtitle">
              Dynamic view generated for: <span className="text-cyan-300 font-mono">{decodedFileName}</span>
            </p>
          </div>
          <Link
            href="/"
            className="primary-button"
          >
            ← Back to Explorer
          </Link>
        </header>

        {error ? (
          <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl text-sm">
            {error}
          </div>
        ) : (
          fileStats && (
            <div className="page-panel page-panel-inner space-y-4">
              <h2 className="text-lg font-bold text-slate-200 border-b border-slate-700 pb-2">
                📄 System Metadata
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="detail-card">
                  <span className="label">File Name</span>
                  <span className="value">{fileStats.name}</span>
                </div>

                <div className="detail-card">
                  <span className="label">Extension</span>
                  <span className="value">{fileStats.extension}</span>
                </div>

                <div className="detail-card">
                  <span className="label">Disk Size</span>
                  <span className="value">{fileStats.sizeKB} KB ({fileStats.sizeBytes} bytes)</span>
                </div>

                <div className="detail-card">
                  <span className="label">Creation Date</span>
                  <span className="value">{fileStats.createdAt}</span>
                </div>
              </div>

              <div className="detail-card text-xs">
                <span className="label">Absolute Server Path</span>
                <span className="value break-all">{fileStats.fullPath}</span>
              </div>
            </div>
          )
        )}

      </div>
    </main>
  );
}