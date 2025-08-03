# 更新日志

本文档记录了 Dify 连接器的所有重要变更。

## [1.2.0] - 2025-08-03

### 新增功能

#### 🧠 知识库管理模块
新增完整的知识库管理功能，包含7个专门模块：

**数据集管理 (`dataset-management/`):**
- `createDataset()` - 创建数据集
- `getDatasets()` - 获取数据集列表
- `getDataset()` - 获取单个数据集详情
- `updateDataset()` - 更新数据集
- `deleteDataset()` - 删除数据集

**文档管理 (`document-management/`):**
- `createDocument()` - 创建文档
- `uploadDocument()` - 上传文档
- `getDocuments()` - 获取文档列表
- `getDocument()` - 获取单个文档详情
- `updateDocument()` - 更新文档
- `deleteDocument()` - 删除文档

**段落管理 (`segment-management/`):**
- `createSegment()` - 创建文本段
- `getSegments()` - 获取文本段列表
- `getSegment()` - 获取单个文本段详情
- `updateSegment()` - 更新文本段
- `deleteSegment()` - 删除文本段

**子块管理 (`child-chunk-management/`):**
- `createChildChunk()` - 创建子块
- `getChildChunks()` - 获取子块列表
- `getChildChunk()` - 获取单个子块详情
- `updateChildChunk()` - 更新子块
- `deleteChildChunk()` - 删除子块
- `createChildChunksBatch()` - 批量创建子块
- `deleteChildChunksBatch()` - 批量删除子块

**元数据管理 (`metadata-management/`):**
- `addDocumentMetadata()` - 为文档添加元数据
- `addSegmentMetadata()` - 为文本段添加元数据
- `getDocumentMetadata()` - 获取文档元数据
- `getSegmentMetadata()` - 获取文本段元数据
- `updateDocumentMetadata()` - 更新文档元数据
- `updateSegmentMetadata()` - 更新文本段元数据
- `deleteDocumentMetadata()` - 删除文档元数据
- `deleteSegmentMetadata()` - 删除文本段元数据
- `addDocumentMetadataBatch()` - 批量添加文档元数据
- `addSegmentMetadataBatch()` - 批量添加文本段元数据

**数据集检索 (`dataset-retrieval/`):**
- `retrieveFromDataset()` - 基础检索
- `hybridSearch()` - 混合搜索
- `advancedRetrieval()` - 高级检索

**知识标签管理 (`knowledge-tags-management/`):**
- `createKnowledgeTag()` - 创建知识标签
- `getKnowledgeTags()` - 获取知识标签列表
- `addTagToDocument()` - 为文档添加标签

#### 🔧 新增错误类型
- `DatasetError` - 数据集相关错误
- `DocumentError` - 文档相关错误
- `SegmentError` - 文本段相关错误
- `ChildChunkError` - 子块相关错误
- `MetadataError` - 元数据相关错误
- `KnowledgeTagError` - 知识标签相关错误

#### 📚 新增类型定义
- 完整的知识库管理相关类型定义
- 严格的 Zod 模式验证
- 支持 TypeScript 类型检查

#### 🧪 测试功能
- 新增 `test-knowledge-base` 测试脚本
- 完整的知识库管理模块测试覆盖

### 改进

#### 🔄 架构优化
- 采用7层模块化架构设计
- 每个模块都有独立的职责和清晰的接口
- 统一的错误处理和类型验证

#### 📦 包管理
- 更新 package.json 版本至 1.2.0
- 添加新的测试脚本

### 使用示例

```typescript
// 创建数据集
const dataset = await createDataset({
  name: '我的知识库',
  description: '用于测试的知识库',
  provider: 'vendor',
  permission: 'only_me',
  data_source_type: 'upload_file'
});

// 上传文档
const document = await uploadDocument({
  dataset_id: dataset.id,
  file: fileBuffer,
  filename: 'document.pdf',
  original_file_name: '原始文档.pdf'
});

// 创建文本段
const segment = await createSegment({
  dataset_id: dataset.id,
  document_id: document.id,
  content: '这是一段测试文本',
  keywords: ['测试', '文本']
});

// 检索内容
const results = await retrieveFromDataset({
  query: '测试查询',
  dataset_id: dataset.id,
  top_k: 4,
  retrieve_strategy: 'semantic_search'
});
```

## [1.1.0] - 2025-08-02

### 新增功能

#### 🚀 运行时参数配置支持
- 新增 `createConfig()` 函数用于创建配置对象
- 新增 `getOrCreateConfig()` 函数用于智能选择配置来源
- 所有 API 函数现在支持可选的配置参数
- 支持在运行时动态传入 API 配置

#### 🔧 支持配置参数的 API 函数
**聊天消息模块：**
- `sendMessage(options, config?)`
- `sendBlockingMessage(options, config?)`
- `sendStreamingMessage(options, onMessage, config?)`
- `sendStreamingMessageNode(options, onMessage, config?)`

**文件上传模块：**
- `uploadFile(options, config?)`
- `uploadWorkflowFile(options, config?)`

**工作流模块：**
- `executeWorkflow(options, config?)`
- `executeBlockingWorkflow(options, config?)`
- `executeStreamingWorkflow(options, onEvent, config?)`
- `sendStreamingWorkflowNode(options, onEvent, config?)`

#### 📚 新增文档
- [配置参数功能示例](./CONFIG_PARAMS_EXAMPLES.md) - 详细的使用示例和最佳实践

### 改进

#### 🔄 向后兼容性
- 保持完全向后兼容，现有代码无需修改
- 不传配置参数时自动使用环境变量
- 所有现有功能保持不变

#### 🛠️ 开发体验
- 完整的 TypeScript 类型支持
- 更好的错误处理和类型检查
- 灵活的配置管理方式

### 使用示例

```typescript
// 原有方式（环境变量）- 仍然支持
const response = await sendBlockingMessage({
  query: '你好',
  user: 'user123'
});

// 新功能（参数配置）
const config = { apiBaseUrl: 'https://your-api.com/v1', apiKey: 'your-key' };
const response = await sendBlockingMessage({
  query: '你好',
  user: 'user123'
}, config);
```

## [1.0.0] - 2025-08-01

### 初始版本

#### 核心功能
- **聊天消息处理**：支持阻塞和流式对话消息
- **文件上传**：支持聊天和工作流的文件上传
- **工作流执行**：支持阻塞和流式工作流执行
- **Node.js 流式处理**：支持 Node.js 环境下的 SSE 流处理
- **类型安全**：完整的 TypeScript 和 Zod 类型定义
- **错误处理**：标准化的错误处理机制

#### 模块组成
- 配置管理模块
- HTTP 客户端模块
- 聊天消息模块
- 文件上传模块
- 工作流文件上传模块
- 工作流执行模块
- 错误处理模块
- 工具函数模块

#### 技术栈
- Node.js >= 20
- TypeScript
- Axios
- @microsoft/fetch-event-source
- Zod
- dotenv
- form-data

---

**版本号说明：**
- 主版本号：不兼容的 API 修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正