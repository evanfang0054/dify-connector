// Dify API Connector
// 统一导出所有模块的功能

// 配置模块
export { getConfig, type DifyConfig } from './config';

// 客户端模块
export { createClient, getClient, type AxiosInstance } from './client';

// 文件上传模块
export { uploadFile } from './file';
export type { FileUploadRequest, FileUploadResponse } from './file';

// 工作流文件上传模块
export { uploadWorkflowFile } from './workflow-file';
export type { WorkflowFileUploadRequest, WorkflowFileUploadResponse } from './workflow-file';

// 对话消息模块
export { sendMessage, sendBlockingMessage, sendStreamingMessage, sendStreamingMessageNode } from './chat';
export type { ChatRequest, ChatResponse, ChatStreamEvent } from './chat';

// 工作流执行模块
export { executeWorkflow, executeBlockingWorkflow, executeStreamingWorkflow } from './workflow';
export type { WorkflowRequest, WorkflowResponse, WorkflowStreamEvent } from './workflow';

// 错误处理模块
export { DifyAPIError, FileUploadError, ChatMessageError, WorkflowError } from './error';
export type { ErrorResponse } from './error';

// 类型定义
export {
  // 基础类型
  InputFileObjectSchema,
  InputFileObject,
  UsageSchema,
  Usage,
  RetrieverResourceSchema,
  RetrieverResource,
  ResponseMetadataSchema,
  ResponseMetadata,
  
  // 聊天相关类型
  ChatRequestSchema,
  ChatResponseSchema,
  ChatStreamEventSchema,
  
  // 文件上传相关类型
  FileUploadRequestSchema,
  FileUploadResponseSchema,
  WorkflowFileUploadRequestSchema,
  WorkflowFileUploadResponseSchema,
  
  // 工作流相关类型
  WorkflowInputFileObjectSchema,
  WorkflowInputFileObject,
  WorkflowRequestSchema,
  WorkflowFinishedDataSchema,
  WorkflowFinishedData,
  WorkflowResponseSchema,
  WorkflowStreamEventSchema,
  
  // 错误相关类型
  ErrorResponseSchema,
  
  // 枚举类型
  FileType,
  TransferMethod,
  ResponseMode,
} from './types';