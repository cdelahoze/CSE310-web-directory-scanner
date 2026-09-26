"use server";

import { DirectoryScanner } from "../classes/directory-scanner.class";
import type { FileNode } from "../classes/file-node.class";
import fs from "fs/promises";
import path from "path";

export async function scanDirectoryAction(targetPath: string = "./src") {
  const scanner = new DirectoryScanner();

  try {
    const rootNode: FileNode = await scanner.scanRecursivelyAsync(targetPath);
    const flatList = scanner.flattenTree(rootNode);
    const stats = scanner.getSummaryStats(flatList);

    return {
      success: true,
      data: {
        rootNode: JSON.parse(JSON.stringify(rootNode)),
        stats
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error scanning the directory."
    };
  }
}

// Action to upload a file to the server
export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file was provided." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to the ./uploads folder
    const uploadDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    return { success: true, fileName: file.name };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}