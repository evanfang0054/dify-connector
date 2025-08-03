// Dify API Connector
// 统一导出所有模块的功能

// 配置模块
export { getConfig, createConfig, getOrCreateConfig, type DifyConfig } from './config';

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

// 知识库管理模块
export {
  createDataset,
  getDatasets,
  getDataset,
  updateDataset,
  deleteDataset,
} from './dataset-management';

export {
  createDocument,
  uploadDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  getDocumentSegments,
} from './document-management';

export {
  createSegment,
  getSegments,
  getSegment,
  updateSegment,
  deleteSegment,
  createSegmentsBatch,
  deleteSegmentsBatch,
  enableSegment,
  disableSegment,
} from './segment-management';

export {
  createChildChunk,
  getChildChunks,
  getChildChunk,
  updateChildChunk,
  deleteChildChunk,
  createChildChunksBatch,
  deleteChildChunksBatch,
  enableChildChunk,
  disableChildChunk,
} from './child-chunk-management';

export {
  addDocumentMetadata,
  addSegmentMetadata,
  getDocumentMetadata,
  getSegmentMetadata,
  updateDocumentMetadata,
  updateSegmentMetadata,
  deleteDocumentMetadata,
  deleteSegmentMetadata,
  addDocumentMetadataBatch,
  addSegmentMetadataBatch,
  searchDocumentsByMetadata,
  searchSegmentsByMetadata,
} from './metadata-management';

export {
  retrieveFromDataset,
  retrieveFromMultipleDatasets,
  retrieveWithFilters,
  hybridSearch,
  similaritySearch,
  getRetrievalStats,
  getRetrievalSuggestions,
  advancedRetrieval,
} from './dataset-retrieval';

export {
  createKnowledgeTag,
  getKnowledgeTags,
  getKnowledgeTag,
  updateKnowledgeTag,
  deleteKnowledgeTag,
  addTagToDocument,
  addTagToSegment,
  removeTagFromDocument,
  removeTagFromSegment,
  getDocumentTags,
  getSegmentTags,
  addTagsToDocumentBatch,
  addTagsToSegmentBatch,
  searchDocumentsByTags,
  searchSegmentsByTags,
} from './knowledge-tags-management';

// 错误处理模块
export { 
  DifyAPIError, 
  FileUploadError, 
  ChatMessageError, 
  WorkflowError,
  DatasetError,
  DocumentError,
  SegmentError,
  ChildChunkError,
  MetadataError,
  KnowledgeTagError,
} from './error';
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
  
  // 知识库相关类型
  DocumentObjectSchema,
  DocumentObject,
  DatasetRetrievalRequestSchema,
  DatasetRetrievalRequest,
  DatasetRetrievalResponseSchema,
  DatasetRetrievalResponse,
  DatasetObjectSchema,
  DatasetObject,
  CreateDatasetRequestSchema,
  CreateDatasetRequest,
  DatasetDocumentObjectSchema,
  DatasetDocumentObject,
  CreateDocumentRequestSchema,
  CreateDocumentRequest,
  DocumentSegmentObjectSchema,
  DocumentSegmentObject,
  RetrievalSettingsSchema,
  RetrievalSettings,
  MetadataSchema,
  Metadata,
  KnowledgeTagObjectSchema,
  KnowledgeTagObject,
  CreateKnowledgeTagRequestSchema,
  CreateKnowledgeTagRequest,
  
  // 错误相关类型
  ErrorResponseSchema,
  
  // 枚举类型
  FileType,
  TransferMethod,
  ResponseMode,
} from './types';

// 子块管理相关类型
export type {
  ChildChunkObject,
  CreateChildChunkRequest,
} from './child-chunk-management';