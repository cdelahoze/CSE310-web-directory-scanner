/**
 * 1. Define the metadata interface.
 * Interface representing the metadata of a file.
 * Defines the strict structure for storing information about each file or folder:
 */

export interface IFileMetadata {
  name: string;
  path: string;
  size: number; // in bytes
  isDirectory: boolean;
  extension: string;
  createdAt: Date;
  modifiedAt: Date;
}