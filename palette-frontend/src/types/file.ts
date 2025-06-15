export interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string; // For uploaded files
  preview?: string; // For local preview
}

export interface FileUploadResult {
  success: boolean;
  file?: FileData;
  error?: string;
} 