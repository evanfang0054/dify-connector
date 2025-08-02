import { z } from 'zod';

// ████████   基础类型定义   ████████

/**
 * 输入文件对象类型
 * 用于定义聊天消息和workflow中的文件参数
 */
export const InputFileObjectSchema = z.object({
  type: z.enum(['document', 'image', 'audio', 'video', 'custom']),
  transfer_method: z.enum(['remote_url', 'local_file']),
  url: z.string().url().optional(),
  upload_file_id: z.string().uuid().optional(),
}).refine((data) => {
  if (data.transfer_method === 'remote_url') {
    return data.url !== undefined;
  } else {
    return data.upload_file_id !== undefined;
  }
}, {
  message: "当 transfer_method 为 'remote_url' 时必须有 url，为 'local_file' 时必须有 upload_file_id"
});

export type InputFileObject = z.infer<typeof InputFileObjectSchema>;

/**
 * 用量信息类型
 */
export const UsageSchema = z.object({
  prompt_tokens: z.number().int(),
  prompt_unit_price: z.string(),
  prompt_price_unit: z.string(),
  prompt_price: z.string(),
  completion_tokens: z.number().int(),
  completion_unit_price: z.string(),
  completion_price_unit: z.string(),  
  completion_price: z.string(),
  total_tokens: z.number().int(),
  total_price: z.string(),
  currency: z.string(),
  latency: z.number(),
});

export type Usage = z.infer<typeof UsageSchema>;

/**
 * 检索资源类型
 */
export const RetrieverResourceSchema = z.object({
  position: z.number().int(),
  dataset_id: z.string().uuid(),
  dataset_name: z.string(),
  document_id: z.string().uuid(),
  document_name: z.string(),
  segment_id: z.string().uuid(),
  score: z.number(),
  content: z.string(),
});

export type RetrieverResource = z.infer<typeof RetrieverResourceSchema>;

/**
 * 响应元数据类型
 */
export const ResponseMetadataSchema = z.object({
  usage: UsageSchema,
  retriever_resources: z.array(RetrieverResourceSchema).optional(),
});

export type ResponseMetadata = z.infer<typeof ResponseMetadataSchema>;

// ████████   聊天消息相关类型   ████████

/**
 * 聊天请求类型
 * 基于发送对话消息API的请求结构
 */
export const ChatRequestSchema = z.object({
  query: z.string().min(1, '用户输入内容不能为空'),
  user: z.string().min(1, '用户标识不能为空'),
  response_mode: z.enum(['streaming', 'blocking']).default('streaming'),
  inputs: z.record(z.union([z.string(), z.number(), z.boolean(), InputFileObjectSchema])).default({}).optional(),
  conversation_id: z.string().uuid().optional(),
  files: z.array(InputFileObjectSchema).optional(),
  auto_generate_name: z.boolean().default(true).optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

/**
 * 聊天响应类型（阻塞模式）
 */
export const ChatResponseSchema = z.object({
  event: z.enum(['message', 'agent_message', 'error']),
  task_id: z.string().uuid(),
  id: z.string().uuid(),
  message_id: z.string().uuid(),
  conversation_id: z.string().uuid(),
  mode: z.literal('chat'),
  answer: z.string(),
  metadata: ResponseMetadataSchema,
  created_at: z.number().int(),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;

/**
 * 聊天流事件类型（流式模式）
 */
export const ChatStreamEventSchema = z.object({
  event: z.enum(['message', 'agent_message', 'error', 'message_end']),
  task_id: z.string().uuid().optional(),
  message_id: z.string().uuid().optional(),
  conversation_id: z.string().uuid().optional(),
  answer: z.string().optional(),
  created_at: z.number().int().optional(),
});

export type ChatStreamEvent = z.infer<typeof ChatStreamEventSchema>;

// ████████   文件上传相关类型   ████████

/**
 * 文件上传请求类型（聊天）
 * 基于普通文件上传API的请求结构
 */
export const FileUploadRequestSchema = z.object({
  file: z.any(), // 文件数据可以是 Buffer, ReadableStream 或 File
  user: z.string().min(1, '用户标识不能为空'),
});

export type FileUploadRequest = z.infer<typeof FileUploadRequestSchema>;

/**
 * 文件上传响应类型（聊天）
 */
export const FileUploadResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  size: z.number().int(),
  extension: z.string(),
  mime_type: z.string(),
  created_by: z.string().uuid(),
  created_at: z.number().int(),
});

export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>;

/**
 * 文件上传请求类型（workflow）
 * 基于工作流文件上传API的请求结构，与聊天版相同
 */
export const WorkflowFileUploadRequestSchema = z.object({
  file: z.any(), // 文件数据可以是 Buffer, ReadableStream 或 File
  user: z.string().min(1, '用户标识不能为空'),
});

export type WorkflowFileUploadRequest = z.infer<typeof WorkflowFileUploadRequestSchema>;

/**
 * 文件上传响应类型（workflow）
 * 与聊天版格式相同
 */
export const WorkflowFileUploadResponseSchema = FileUploadResponseSchema;
export type WorkflowFileUploadResponse = z.infer<typeof WorkflowFileUploadResponseSchema>;

// ████████   工作流相关类型   ████████

/**
 * 工作流输入文件对象类型
 * 用于工作流中的文件列表变量
 */
export const WorkflowInputFileObjectSchema = z.object({
  type: z.enum(['document', 'image', 'audio', 'video', 'custom']),
  transfer_method: z.enum(['remote_url', 'local_file']),
  url: z.string().url().optional(),
  upload_file_id: z.string().uuid().optional(),
}).refine((data) => {
  if (data.transfer_method === 'remote_url') {
    return data.url !== undefined;
  } else {
    return data.upload_file_id !== undefined;
  }
}, {
  message: "当 transfer_method 为 'remote_url' 时必须有 url，为 'local_file' 时必须有 upload_file_id"
});

export type WorkflowInputFileObject = z.infer<typeof WorkflowInputFileObjectSchema>;

/**
 * 工作流执行请求类型
 * 基于执行workflow API的请求结构
 */
export const WorkflowRequestSchema = z.object({
  inputs: z.record(z.union([
    z.string(), 
    z.number(), 
    z.boolean(),
    z.array(WorkflowInputFileObjectSchema),
    z.object({})
  ])),
  user: z.string().min(1, '用户标识不能为空'),
  response_mode: z.enum(['streaming', 'blocking']),
});

export type WorkflowRequest = z.infer<typeof WorkflowRequestSchema>;

/**
 * 工作流完成数据类型
 */
export const WorkflowFinishedDataSchema = z.object({
  id: z.string().uuid(),
  workflow_id: z.string().uuid(),
  status: z.enum(['running', 'succeeded', 'failed', 'stopped']),
  outputs: z.record(z.any()).optional(),
  error: z.string().optional(),
  elapsed_time: z.number().optional(),
  total_tokens: z.number().int().optional(),
  total_steps: z.number().int().default(0),
  created_at: z.number().int(),
  finished_at: z.number().int(),
});

export type WorkflowFinishedData = z.infer<typeof WorkflowFinishedDataSchema>;

/**
 * 工作流响应类型（阻塞模式）
 */
export const WorkflowResponseSchema = z.object({
  workflow_run_id: z.string().uuid(),
  task_id: z.string().uuid(),
  data: WorkflowFinishedDataSchema,
});

export type WorkflowResponse = z.infer<typeof WorkflowResponseSchema>;

/**
 * 工作流流事件类型（流式模式）
 */
export const WorkflowStreamEventSchema = z.object({
  event: z.enum(['workflow_started', 'node_started', 'node_finished', 'workflow_finished', 'error']),
  workflow_run_id: z.string().uuid().optional(),
  data: WorkflowFinishedDataSchema.optional(),
});

export type WorkflowStreamEvent = z.infer<typeof WorkflowStreamEventSchema>;

// ████████   错误响应类型   ████████

/**
 * 错误响应类型
 * 基于所有API中定义的错误响应结构
 */
export const ErrorResponseSchema = z.object({
  status: z.number().int().nullable().optional(),
  code: z.string().nullable().optional(),
  message: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * 文件类型枚举
 */
export const FileType = {
  DOCUMENT: 'document',
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  CUSTOM: 'custom',
} as const;

export type FileType = typeof FileType[keyof typeof FileType];

/**
 * 传输方式枚举
 */
export const TransferMethod = {
  REMOTE_URL: 'remote_url',
  LOCAL_FILE: 'local_file',
} as const;

export type TransferMethod = typeof TransferMethod[keyof typeof TransferMethod];

/**
 * 响应模式枚举
 */
export const ResponseMode = {
  STREAMING: 'streaming',
  BLOCKING: 'blocking',
} as const;

export type ResponseMode = typeof ResponseMode[keyof typeof ResponseMode];