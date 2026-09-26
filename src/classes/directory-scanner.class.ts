/**
 * 1. Create the DirectoryScanner class with recursive logic.
 * Class representing a directory scanner.
 * This class traverses a directory and builds a file-node tree (FileNode)
 * that represents the hierarchy of files and folders.
 */
import * as fs from "fs/promises";
import * as path from "path";
import { FileNode } from "./file-node.class";
import { IFileMetadata } from "../interfaces/file-metadata.interface";
import { DirectoryNotFoundError, AccessDeniedError } from "../utils/custom-errors";

export class DirectoryScanner {
  public async scanRecursivelyAsync(targetPath: string): Promise<FileNode> {
    const absolutePath = path.resolve(targetPath);

    let stats;
    try {
      stats = await fs.stat(absolutePath);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new DirectoryNotFoundError(targetPath);
      }
      if (error.code === "EACCES" || error.code === "EPERM") {
        throw new AccessDeniedError(targetPath);
      }
      throw error;
    }

    const name = path.basename(absolutePath);
    const metadata: IFileMetadata = {
      name: name || absolutePath,
      path: absolutePath,
      size: stats.size,
      isDirectory: stats.isDirectory(),
      extension: stats.isDirectory() ? "" : path.extname(name),
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime
    };

    const node = new FileNode(metadata);

    if (!stats.isDirectory()) {
      return node;
    }

    try {
      const items = await fs.readdir(absolutePath);
      const childrenNodes = await Promise.all(
        items.map((item) => this.scanRecursivelyAsync(path.join(absolutePath, item)))
      );
      childrenNodes.forEach((childNode) => node.addChild(childNode));
    } catch (error: any) {
      if (error.code === "EACCES" || error.code === "EPERM") {
        console.warn(`[Warning] Permiso denegado en subdirectorio: ${absolutePath}`);
      } else {
        throw error;
      }
    }

    return node;
  }

  public flattenTree(rootNode: FileNode): FileNode[] {
    let list: FileNode[] = [rootNode];
    for (const child of rootNode.children) {
      list = list.concat(this.flattenTree(child));
    }
    return list;
  }

  public filterByExtension(flatList: FileNode[], extension: string): FileNode[] {
    return flatList.filter(
      (node) => !node.metadata.isDirectory && node.metadata.extension.toLowerCase() === extension.toLowerCase()
    );
  }

  public getSummaryStats(flatList: FileNode[]): { totalFiles: number; totalDirectories: number; totalSizeBytes: number } {
    const files = flatList.filter((node) => !node.metadata.isDirectory);
    const directories = flatList.filter((node) => node.metadata.isDirectory);
    const totalSizeBytes = files.reduce((sum, file) => sum + file.metadata.size, 0);

    return {
      totalFiles: files.length,
      totalDirectories: directories.length,
      totalSizeBytes
    };
  }
}