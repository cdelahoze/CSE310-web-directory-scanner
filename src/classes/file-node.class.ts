/**
 * Class representing a file node in a file system.
 * Each node contains metadata about a file or folder.
 * This class encapsulates a node within the tree structure
 * (representing a file or directory) and stores references to its child nodes:
 */
import { IFileMetadata } from "../interfaces/file-metadata.interface";

export class FileNode {
  public metadata: IFileMetadata;
  public children: FileNode[];

  constructor(metadata: IFileMetadata) {
    this.metadata = metadata;
    this.children = [];
  }

  /**
   * Adds a child node (file or folder) if the current node is a directory.
   */

  public addChild(childNode: FileNode): void {
    if (!this.metadata.isDirectory) {
      throw new Error(
        `Cannot add child to '${this.metadata.name}' because it is not a directory.`,
      );
    }
    this.children.push(childNode);
  }

  /**
   * Returns the size in readable format (KB, MB, GB).
   */

  public getFormattedSize(): string {
    const bytes = this.metadata.size;
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}
