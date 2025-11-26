// Use these request functions from "./sdk.gen.ts" or "./index.ts":
//
//   /**
//    * Generate presigned URL for S3 upload
//    *
//    * Creates a presigned URL that allows direct upload to S3 bucket.
//    * After getting the presigned URL, you must make a separate PUT request to that URL with the file content to complete the upload.
//    */
//   export function postMainOfficialApiPresignS3Upload(opts: PostMainOfficialApiPresignS3UploadData): Promise<{
//     error?: PostMainOfficialApiPresignS3UploadErrors[keyof PostMainOfficialApiPresignS3UploadErrors],
//     data?: PostMainOfficialApiPresignS3UploadResponses[keyof PostMainOfficialApiPresignS3UploadResponses],
//     request: Request,
//     response: Response }>;
//
//
// NOTICE: Please use default values from original openapi schema:
//
//    {
//      "openapi": "3.0.0",
//      "info": {
//        "title": "File Upload API",
//        "description": "API for generating presigned URLs for direct S3 uploads.\n\nThis is a two-step process:\n1. First, call this endpoint to get a presigned URL\n2. Then, use a PUT request to the presigned URL to upload the file directly to S3",
//        "version": "1.0.0"
//      },
//      "servers": [
//        {
//          "url": "https://api-production.creao.ai/execute-apis/v2"
//        }
//      ],
//      "paths": {
//        "/main/official-api/presign-s3-upload": {
//          "post": {
//            "summary": "Generate presigned URL for S3 upload",
//            "description": "Creates a presigned URL that allows direct upload to S3 bucket.\nAfter getting the presigned URL, you must make a separate PUT request to that URL with the file content to complete the upload.",
//            "security": [
//              {
//                "bearerAuth": []
//              }
//            ],
//            "requestBody": {
//              "required": true,
//              "content": {
//                "application/json": {
//                  "schema": {
//                    "type": "object",
//                    "required": [
//                      "fileName",
//                      "contentType"
//                    ],
//                    "properties": {
//                      "fileName": {
//                        "type": "string",
//                        "description": "Name of the file to be uploaded",
//                        "example": "document.pdf"
//                      },
//                      "contentType": {
//                        "type": "string",
//                        "description": "MIME type of the file",
//                        "example": "application/pdf"
//                      }
//                    }
//                  }
//                }
//              }
//            },
//            "responses": {
//              "200": {
//                "description": "Presigned URL generated successfully",
//                "content": {
//                  "application/json": {
//                    "schema": {
//                      "type": "object",
//                      "properties": {
//                        "success": {
//                          "type": "boolean",
//                          "example": true
//                        },
//                        "presignedUrl": {
//                          "type": "string",
//                          "description": "URL to upload the file to using a PUT request",
//                          "example": "https://creao-user-upload-dev.s3.us-west-2.amazonaws.com/user123/abc-file.pdf?X-Amz-Algorithm=..."
//                        },
//                        "realFileUrl": {
//                          "type": "string",
//                          "description": "The permanent URL where the file will be accessible after upload",
//                          "example": "https://creao-user-upload-dev.s3.us-west-2.amazonaws.com/user123/abc-file.pdf"
//                        },
//                        "fileKey": {
//                          "type": "string",
//                          "description": "The key (path) of the file in S3",
//                          "example": "user123/abc-file.pdf"
//                        },
//                        "expiresIn": {
//                          "type": "integer",
//                          "description": "Expiration time of the presigned URL in seconds",
//                          "example": 900
//                        }
//                      }
//                    }
//                  }
//                }
//              },
//              "400": {
//                "description": "Bad request",
//                "content": {
//                  "application/json": {
//                    "schema": {
//                      "type": "object",
//                      "properties": {
//                        "message": {
//                          "type": "string",
//                          "example": "fileName is required and must be a string"
//                        }
//                      }
//                    }
//                  }
//                }
//              },
//              "401": {
//                "description": "Unauthorized",
//                "content": {
//                  "application/json": {
//                    "schema": {
//                      "type": "object",
//                      "properties": {
//                        "message": {
//                          "type": "string",
//                          "example": "User not authenticated"
//                        }
//                      }
//                    }
//                  }
//                }
//              },
//              "500": {
//                "description": "Server error",
//                "content": {
//                  "application/json": {
//                    "schema": {
//                      "type": "object",
//                      "properties": {
//                        "message": {
//                          "type": "string",
//                          "example": "Failed to generate presigned URL: Error message"
//                        }
//                      }
//                    }
//                  }
//                }
//              }
//            },
//            "parameters": [
//              {
//                "$ref": "#/components/parameters/CreaoApiNameHeader"
//              },
//              {
//                "$ref": "#/components/parameters/CreaoApiPathHeader"
//              },
//              {
//                "$ref": "#/components/parameters/CreaoApiIdHeader"
//              }
//            ]
//          }
//        }
//      },
//      "components": {
//        "securitySchemes": {
//          "bearerAuth": {
//            "type": "http",
//            "scheme": "bearer",
//            "bearerFormat": "JWT"
//          }
//        },
//        "schemas": {
//          "PresignedUrlUsage": {
//            "type": "object",
//            "description": "After receiving the presigned URL, you need to make a PUT request to that URL with the file content.\nExample using fetch:\n```javascript\nconst response = await fetch(presignedUrl, {\n  method: 'PUT',\n  headers: {\n    'Content-Type': contentType\n  },\n  body: fileData // The actual file content\n});\n\nif (response.ok) {\n  // File uploaded successfully\n  // You can now access the file at realFileUrl\n}\n```"
//          }
//        },
//        "parameters": {
//          "CreaoApiNameHeader": {
//            "name": "X-CREAO-API-NAME",
//            "in": "header",
//            "required": true,
//            "schema": {
//              "type": "string",
//              "default": "CreaoFileUpload"
//            },
//            "description": "API name identifier - must be \"CreaoFileUpload\""
//          },
//          "CreaoApiIdHeader": {
//            "name": "X-CREAO-API-ID",
//            "in": "header",
//            "required": true,
//            "schema": {
//              "type": "string",
//              "default": "68b68b97ac476c8df7efbeaf"
//            },
//            "description": "API ID identifier - must be \"68b68b97ac476c8df7efbeaf\""
//          },
//          "CreaoApiPathHeader": {
//            "name": "X-CREAO-API-PATH",
//            "in": "header",
//            "required": true,
//            "schema": {
//              "type": "string",
//              "default": "/main/official-api/presign-s3-upload"
//            },
//            "description": "API path identifier - must be \"/main/official-api/presign-s3-upload\""
//          }
//        }
//      }
//    }
//
// 

export type ClientOptions = {
    baseUrl: 'https://api-production.creao.ai/execute-apis/v2' | (string & {});
};

/**
 * After receiving the presigned URL, you need to make a PUT request to that URL with the file content.
 * Example using fetch:
 * ```javascript
 * const response = await fetch(presignedUrl, {
 * method: 'PUT',
 * headers: {
 * 'Content-Type': contentType
 * },
 * body: fileData // The actual file content
 * });
 *
 * if (response.ok) {
 * // File uploaded successfully
 * // You can now access the file at realFileUrl
 * }
 * ```
 */
export type PresignedUrlUsage = {
    [key: string]: unknown;
};

/**
 * API name identifier - must be "CreaoFileUpload"
 */
export type CreaoApiNameHeader = string;

/**
 * API ID identifier - must be "68b68b97ac476c8df7efbeaf"
 */
export type CreaoApiIdHeader = string;

/**
 * API path identifier - must be "/main/official-api/presign-s3-upload"
 */
export type CreaoApiPathHeader = string;

export type PostMainOfficialApiPresignS3UploadData = {
    body: {
        /**
         * Name of the file to be uploaded
         */
        fileName: string;
        /**
         * MIME type of the file
         */
        contentType: string;
    };
    headers: {
        /**
         * API name identifier - must be "CreaoFileUpload"
         */
        'X-CREAO-API-NAME': string;
        /**
         * API path identifier - must be "/main/official-api/presign-s3-upload"
         */
        'X-CREAO-API-PATH': string;
        /**
         * API ID identifier - must be "68b68b97ac476c8df7efbeaf"
         */
        'X-CREAO-API-ID': string;
    };
    path?: never;
    query?: never;
    url: '/main/official-api/presign-s3-upload';
};

export type PostMainOfficialApiPresignS3UploadErrors = {
    /**
     * Bad request
     */
    400: {
        message?: string;
    };
    /**
     * Unauthorized
     */
    401: {
        message?: string;
    };
    /**
     * Server error
     */
    500: {
        message?: string;
    };
};

export type PostMainOfficialApiPresignS3UploadError = PostMainOfficialApiPresignS3UploadErrors[keyof PostMainOfficialApiPresignS3UploadErrors];

export type PostMainOfficialApiPresignS3UploadResponses = {
    /**
     * Presigned URL generated successfully
     */
    200: {
        success?: boolean;
        /**
         * URL to upload the file to using a PUT request
         */
        presignedUrl?: string;
        /**
         * The permanent URL where the file will be accessible after upload
         */
        realFileUrl?: string;
        /**
         * The key (path) of the file in S3
         */
        fileKey?: string;
        /**
         * Expiration time of the presigned URL in seconds
         */
        expiresIn?: number;
    };
};

export type PostMainOfficialApiPresignS3UploadResponse = PostMainOfficialApiPresignS3UploadResponses[keyof PostMainOfficialApiPresignS3UploadResponses];
