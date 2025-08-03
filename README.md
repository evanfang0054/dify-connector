# Dify API连接器

Dify API连接器是一个基于Node.js的中间层服务，旨在简化本地服务与Dify AI平台的集成。该连接器提供统一的API接口来执行多种核心操作：发送对话消息、上传文件、执行工作流和管理知识库。

## 功能特性

- **类型安全**: 使用TypeScript和Zod进行完整的类型检查和验证
- **错误处理**: 标准化的错误处理机制
- **多种模式支持**: 支持阻塞和流式响应模式
- **文件上传**: 支持聊天和工作流的文件上传功能
- **SSE流处理**: 使用@microsoft/fetch-event-source处理服务端事件流
- **配置管理**: 支持环境变量和运行时参数配置
- **多租户支持**: 可以为不同租户使用不同的API配置
- **向后兼容**: 完全向后兼容，现有代码无需修改
- **知识库管理**: 完整的知识库管理功能，支持数据集、文档、段落、子块、元数据、检索和标签管理 (v1.2.0+)

## 模块组成

### 核心模块
1. **核心配置模块** (`config/`) - 管理API基础URL和认证密钥
2. **HTTP客户端模块** (`client/`) - 封装Axios实例和通用请求逻辑
3. **类型定义模块** (`types/`) - 包含所有API接口的Zod模式和TypeScript类型
4. **错误处理模块** (`error/`) - 标准化错误处理和响应
5. **工具模块** (`utils/`) - 通用工具函数

### 功能模块
6. **对话消息模块** (`chat/`) - 实现发送对话消息功能
7. **文件上传模块** (`file/`) - 实现普通文件上传功能
8. **工作流文件上传模块** (`workflow-file/`) - 实现工作流专用文件上传功能
9. **工作流模块** (`workflow/`) - 实现执行工作流功能

### 知识库管理模块 (v1.2.0+)
10. **数据集管理模块** (`dataset-management/`) - 数据集的创建、查询、更新、删除
11. **文档管理模块** (`document-management/`) - 文档的上传、查询、更新、删除
12. **段落管理模块** (`segment-management/`) - 文本段的创建、查询、更新、删除
13. **子块管理模块** (`child-chunk-management/`) - 子块的创建、查询、更新、删除
14. **元数据管理模块** (`metadata-management/`) - 文档和文本段的元数据管理
15. **数据集检索模块** (`dataset-retrieval/`) - 基础检索、混合搜索、高级检索
16. **知识标签管理模块** (`knowledge-tags-management/`) - 知识标签的创建、查询、管理

## 安装

```bash
pnpm install
```

## 配置

### 环境变量配置（推荐方式）

创建 `.env` 文件并设置以下环境变量：

```env
API_BASE_URL=https://api.dify.ai/v1
API_KEY=your-api-key-here
```

### 运行时参数配置（新功能）

除了环境变量，现在支持在运行时传入配置参数：

```typescript
import { sendBlockingMessage, createConfig } from './dist/index.js';

// 创建配置对象
const config = createConfig({
  apiBaseUrl: 'https://your-dify-instance.com/v1',
  apiKey: 'your-api-key'
});

// 使用配置参数
const response = await sendBlockingMessage({
  query: '你好，世界！',
  user: 'user123'
}, config);
```

### 混合使用

可以在同一个应用中混合使用环境变量和参数配置：

```typescript
// 部分调用使用配置参数
const response1 = await sendBlockingMessage({
  query: '使用配置参数',
  user: 'user123'
}, { apiKey: 'custom-key' });

// 部分调用使用环境变量
const response2 = await sendBlockingMessage({
  query: '使用环境变量',
  user: 'user123'
});
```

详细的配置参数使用示例请参考 [配置参数示例文档](./CONFIG_PARAMS_EXAMPLES.md)。

## 使用方法

### 发送对话消息

```typescript
import { sendBlockingMessage } from './chat';

const response = await sendBlockingMessage({
  query: '你好，世界！',
  user: 'user123'
});

console.log(response.answer);
```

### 发送流式对话消息（注意：主要在浏览器环境中可用）

```typescript
import { sendStreamingMessage } from './chat';

// 注意：流式处理主要设计用于浏览器环境
await sendStreamingMessage({
  query: '写一首诗',
  user: 'user123'
}, (event) => {
  if (event.event === 'message') {
    console.log('消息片段:', event.answer);
  } else if (event.event === 'message_end') {
    console.log('消息结束');
  }
});
```

### Node.js环境下的流式处理

```typescript
import { sendStreamingMessageNode } from './chat';

// Node.js环境下的流式处理现已支持
await sendStreamingMessageNode({
  query: '写一首诗',
  user: 'user123'
}, (event) => {
  if (event.event === 'message') {
    process.stdout.write(event.answer);
  } else if (event.event === 'message_end') {
    console.log('\n消息结束');
  }
});
```

### 上传文件

```typescript
import { uploadFile } from './file';
import * as fs from 'fs';

const buffer = fs.readFileSync('path/to/document.pdf');

const response = await uploadFile({
  file: buffer,
  filename: 'document.pdf',
  user: 'user123'
});

console.log('文件ID:', response.id);
```

### 执行工作流

```typescript
import { executeBlockingWorkflow } from './workflow';

const response = await executeBlockingWorkflow({
  inputs: {
    query: '处理这段文本'
  },
  user: 'user123'
});

console.log('工作流状态:', response.data.status);
```

### 知识库管理 (v1.2.0+)

```typescript
import { 
  createDataset, 
  uploadDocument, 
  createSegment, 
  retrieveFromDataset 
} from './dist/index.js';

// 创建数据集
const dataset = await createDataset({
  name: '我的知识库',
  description: '用于测试的知识库',
  provider: 'vendor',
  permission: 'only_me',
  data_source_type: 'upload_file'
});

// 上传文档
import * as fs from 'fs';
const buffer = fs.readFileSync('path/to/document.pdf');

const document = await uploadDocument({
  dataset_id: dataset.id,
  file: buffer,
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

console.log('检索结果:', results);
```

## 文档

详细使用说明请参考以下文档：

### 核心功能文档
- [聊天消息模块](./src/chat/README.md)
- [文件上传模块](./src/file/README.md)
- [工作流文件上传模块](./src/workflow-file/README.md)
- [工作流执行模块](./src/workflow/README.md)

### 知识库管理文档 (v1.2.0+)
- [数据集管理](./src/dataset-management/README.md)
- [文档管理](./src/document-management/README.md)
- [段落管理](./src/segment-management/README.md)
- [子块管理](./src/child-chunk-management/README.md)
- [元数据管理](./src/metadata-management/README.md)
- [数据集检索](./src/dataset-retrieval/README.md)
- [知识标签管理](./src/knowledge-tags-management/README.md)

### 其他文档
- [API规范文档](./docs/)
- [配置参数功能示例](./CONFIG_PARAMS_EXAMPLES.md)
- [更新日志](./CHANGELOG.md)

## 错误处理

所有模块都提供标准化的错误处理：

```typescript
import { sendBlockingMessage, ChatMessageError } from './chat';

try {
  const response = await sendBlockingMessage({
    query: '你好，世界！',
    user: 'user123'
  });
} catch (error) {
  if (error instanceof ChatMessageError) {
    console.error('聊天消息错误:', error.message);
    console.error('状态码:', error.status);
    console.error('错误码:', error.code);
  }
}
```

## 构建

```bash
pnpm build
```

## 测试

项目包含多个测试脚本，用于验证不同功能：

```bash
# 测试基本连接器功能
pnpm run test-connector

# 测试流式处理功能
pnpm run test-streaming

# 测试Node.js环境下的流式处理功能
pnpm run test-node-streaming

# 测试文件上传功能
pnpm run test-file-upload

# 测试工作流功能
pnpm run test-workflow

# 测试知识库管理功能 (v1.2.0+)
pnpm run test-knowledge-base

# 测试所有功能
pnpm run test-all

# 测试实际功能调用
pnpm run test-actual
```

## 依赖

- Node.js >= 20
- TypeScript
- Axios
- @microsoft/fetch-event-source
- Zod
- dotenv
- form-data
- eventsource (用于Node.js环境下的SSE流处理)

## 许可证

MIT