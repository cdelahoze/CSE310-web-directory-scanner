"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { scanDirectoryAction, uploadFileAction } from "./actions";

// Remove the 'async' keyword from the main function
export default function Home() {
  const [targetPath, setTargetPath] = useState("./uploads");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleScan = async (path: string) => {
    setLoading(true);
    setError(null);
    const result = await scanDirectoryAction(path);
    if (result.success) {
      setData(result.data);
    } else {
      setError(result.error || "Error scanning directory.");
    }
    setLoading(false);
  };

  useEffect(() => {
    handleScan(targetPath);
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUploadStatus("Uploading file...");

    const res = await uploadFileAction(formData);
    if (res.success) {
      setUploadStatus(`File '${res.fileName}' uploaded successfully to ./uploads!`);
      handleScan(targetPath); // Re-scan to refresh the tree
    } else {
      setUploadStatus(`Upload error: ${res.error}`);
    }
  };

  return (
    <main className="page-shell">
      <div className="page-content">

        {/* Header & navigation to second page */}
        <header className="page-header">
          <div>
            <h1 className="page-title">TakTaim Web Explorer</h1>
            <p className="page-subtitle">Interactive file explorer and manager with Next.js</p>
          </div>
          <Link
            href="/analytics"
            className="primary-button"
          >
            View Analytics →
          </Link>
        </header>

        {/* Interactive search / path form */}
        <div className="page-panel page-panel-inner flex gap-3 flex-wrap items-center">
          <input
            type="text"
            value={targetPath}
            onChange={(e) => setTargetPath(e.target.value)}
            placeholder="Enter path to scan (e.g. ./src or ./uploads)"
            className="flex-1 min-w-[220px] bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => handleScan(targetPath)}
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
          >
            {loading ? "Scanning..." : "Scan Path"}
          </button>
        </div>

        {/* File upload component */}
        <div className="page-panel page-panel-inner">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Upload New File to Server</h3>
          <form onSubmit={handleUpload} className="flex gap-3 items-center">
            <input
              type="file"
              name="file"
              required
              className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-cyan-300 hover:file:bg-slate-600"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              Upload File
            </button>
          </form>
          {uploadStatus && <p className="text-xs text-cyan-300 mt-2">{uploadStatus}</p>}
        </div>

        {/* Results display */}
        {error && <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl text-sm">{error}</div>}

        {data && (
          <>
            <div className="metric-grid">
              <div className="metric-card">
                <h3 className="metric-label">Directories</h3>
                <p className="metric-value">{data.stats.totalDirectories}</p>
              </div>
              <div className="metric-card">
                <h3 className="metric-label">Files</h3>
                <p className="metric-value">{data.stats.totalFiles}</p>
              </div>
              <div className="metric-card">
                <h3 className="metric-label">Total Size</h3>
                <p className="metric-value">{(data.stats.totalSizeBytes / 1024).toFixed(2)} KB</p>
              </div>
            </div>

            <section className="page-panel page-panel-inner">
              <h2 className="text-lg font-semibold mb-4 text-slate-200">📁 Directory Structure ({targetPath})</h2>
              <div className="tree-shell">
                <TreeNode node={data.rootNode} depth={0} />
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function TreeNode({ node, depth }: { node: any; depth: number }) {
  const isDir = node.metadata.isDirectory;
  const icon = isDir ? "📁" : "📄";
  const sizeLabel = isDir ? "" : ` (${(node.metadata.size / 1024).toFixed(2)} KB)`;
  
  const fileLink = !isDir ? `/files/${encodeURIComponent(node.metadata.name)}` : null;

  return (
    <div style={{ paddingLeft: `${depth * 1.2}rem` }} className="py-1">
      <span className="flex items-center gap-2 hover:bg-slate-900 px-2 py-0.5 rounded transition-colors">
        <span>{icon}</span>
        
        {fileLink ? (
          <Link
            href={fileLink}
            className="text-cyan-300 hover:underline font-medium flex-1 flex items-center justify-between"
          >
            <span>{node.metadata.name}</span>
            <span className="text-slate-500 text-xs font-normal">{sizeLabel} — [View Details →]</span>
          </Link>
        ) : (
          <>
            <span className={isDir ? "font-semibold text-cyan-200" : "text-slate-300"}>
              {node.metadata.name}
            </span>
            <span className="text-slate-500 text-xs">{sizeLabel}</span>
          </>
        )}
      </span>

      {isDir && node.children && node.children.length > 0 && (
        <div>
          {node.children.map((child: any, index: number) => (
            <TreeNode key={index} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}