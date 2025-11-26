import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { postMainOfficialApiPresignS3Upload } from '@/sdk/api-clients/CreaoFileUpload';

export interface FileUploadInput {
  file: File;
  /**
   * Optional custom file name. If not provided, uses the file's original name.
   */
  customFileName?: string;
}

export interface FileUploadResponse {
  /**
   * The permanent URL where the uploaded file can be accessed.
   */
  fileUrl: string;
  /**
   * The S3 key (path) of the uploaded file.
   */
  fileKey: string;
  /**
   * The original file name.
   */
  fileName: string;
  /**
   * The MIME type of the uploaded file.
   */
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
      // Validate input
      if (!input.file || !(input.file instanceof File)) {
        throw new Error('A valid File object is required');
      }

      const fileName = input.customFileName || input.file.name;
      const contentType = input.file.type;

      if (!fileName) {
        throw new Error('File name is required');
      }

      if (!contentType) {
        throw new Error('File content type is required');
      }

      // Step 1: Get presigned URL from CreaoFileUpload API
      const presignResponse = await postMainOfficialApiPresignS3Upload({
        body: {
          fileName,
          contentType,
        },
        headers: {
          'X-CREAO-API-NAME': 'CreaoFileUpload',
          'X-CREAO-API-PATH': '/main/official-api/presign-s3-upload',
          'X-CREAO-API-ID': '68b68b97ac476c8df7efbeaf',
        },
      });

      // Handle API errors
      if (presignResponse.error) {
        const errorMessage =
          presignResponse.error.message || 'Failed to generate presigned URL';
        throw new Error(errorMessage);
      }

      // Validate response data
      if (!presignResponse.data) {
        throw new Error('No response data received from presigned URL API');
      }

      const { presignedUrl, realFileUrl, fileKey } = presignResponse.data;

      if (!presignedUrl) {
        throw new Error('No presigned URL returned from API');
      }

      if (!realFileUrl) {
        throw new Error('No file URL returned from API');
      }

      if (!fileKey) {
        throw new Error('No file key returned from API');
      }

      // Step 2: Upload file to S3 using presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
        },
        body: input.file,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => 'Unknown error');
        throw new Error(
          `Failed to upload file to S3: ${uploadResponse.status} ${uploadResponse.statusText}. ${errorText}`
        );
      }

      // Return the uploaded file information
      return {
        fileUrl: realFileUrl,
        fileKey,
        fileName,
        contentType,
      };
    },
  });
}
