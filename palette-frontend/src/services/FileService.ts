export interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  preview?: string;
}

export interface FileUploadResult {
  success: boolean;
  file?: FileData;
  error?: string;
}

export class FileService {
  private static readonly MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  static validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 4MB limit' };
    }
    
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'File type not supported' };
    }
    
    return { valid: true };
  }

  static async processFile(file: File): Promise<FileUploadResult> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      const fileData: FileData = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        preview: await this.createPreview(file)
      };

      return { success: true, file: fileData };
    } catch (error) {
      return { success: false, error: 'Failed to process file' };
    }
  }

  private static async createPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  static async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return result.url;
  }
} 