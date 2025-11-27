import { useMutation, type UseMutationResult } from '@tanstack/react-query';

export interface FileUploadInput {
  file: File;
  /**
   * Optional custom file name. If not provided, uses the file's original name.
   */
  customFileName?: string;
}

export interface FileUploadResponse {
  fileUrl: string;
  fileKey: string;
  fileName: string;
  contentType: string;
}

/**
 * Custom hook for uploading files to S3 via CreaoFileUpload API.
 *
 * This hook handles the complete two-step upload process:
 * 1. Generates a presigned S3 URL from the CreaoFileUpload API
 * 2. Uploads the file directly to S3 using the presigned URL
 *
 * Supports multiple file types including:
 * - Profile images (avatar, banner)
 * - Portfolio images for artist profiles
 * - Timeline post images
 * - Commission request sample images
 * - DM message image attachments
 *
 * @example
 * ```tsx
 * const uploadFile = useCreaoFileUpload();
 *
 * const handleUpload = async (file: File) => {
 *   try {
 *     const result = await uploadFile.mutateAsync({ file });
 *     console.log('File uploaded:', result.fileUrl);
 *   } catch (error) {
 *     console.error('Upload failed:', error);
 *   }
 * };
 * ```
 */
export function useCreaoFileUpload(): UseMutationResult<
  FileUploadResponse,
  Error,
  FileUploadInput
> {
  return useMutation({
    mutationFn: async (input: FileUploadInput): Promise<FileUploadResponse> => {
      if (!input.file || !(input.file instanceof File)) {
        throw new Error('A valid File object is required');
      }

      const fileName = input.customFileName || input.file.name;
      const contentType = input.file.type || 'application/octet-stream';

      // Convert to base64 data URL so it persists across reloads and can be stored in DB.
      const fileUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(input.file);
      });

      return {
        fileUrl,
        fileKey: fileName,
        fileName,
        contentType,
      };
    },
  });
}
