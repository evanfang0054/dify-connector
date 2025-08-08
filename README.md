# Dify API 连接器

Dify API 连接器是一个全面的 Node.js 连接器，为 Dify AI 平台提供统一的 API 接口，支持对话消息、文件上传、工作流执行和完整的知识库管理功能。项目使用 TypeScript 和 Zod 进行类型安全验证，支持阻塞和流式响应模式。

## 功能特性

### 🚀 核心功能
- **类型安全**: 使用 TypeScript 和 Zod 进行完整的类型检查和验证
- **错误处理**: 标准化的错误处理机制，包含详细的错误信息和状态码
- **多种模式支持**: 支持阻塞和流式响应模式，适用于不同场景
- **SSE 流处理**: 使用 @microsoft/fetch-event-source 处理服务端事件流
- **开发工具支持**: 内置 tsx 支持，可直接运行 TypeScript 测试文件

### 🔧 配置管理
- **环境变量配置**: 支持传统的环境变量配置方式
- **运行时参数配置**: 支持在运行时动态传入配置参数
- **多租户支持**: 可以为不同租户使用不同的 API 配置
- **混合使用**: 支持在同一应用中混合使用环境变量和参数配置
- **向后兼容**: 完全向后兼容，现有代码无需修改

### 📁 文件上传
- **聊天文件上传**: 支持对话消息中的文件上传功能
- **工作流文件上传**: 支持工作流执行中的文件上传功能
- **多格式支持**: 支持 Buffer、ReadableStream 和 File 对象
- **类型安全**: 完整的文件上传类型定义和验证

### 🔄 工作流执行
- **阻塞模式**: 同步执行工作流，等待完整结果
- **流式模式**: 异步执行工作流，实时接收事件流
- **Node.js 流式处理**: 专门针对 Node.js 环境优化的流式工作流处理
- **错误处理**: 完整的工作流错误处理和状态跟踪

### 🧠 知识库管理
- **数据集管理**: 数据集的创建、查询、更新、删除
- **文档管理**: 文档的上传、查询、更新、删除
- **段落管理**: 文本段的创建、查询、更新、删除，支持批量操作
- **子块管理**: 子块的创建、查询、更新、删除，支持细粒度文本处理
- **元数据管理**: 文档和文本段的元数据管理，支持批量操作
- **检索功能**: 基础检索、混合搜索、高级检索、相似度搜索
- **标签管理**: 知识标签的创建、查询、管理，支持文档和段落标签

### 🎯 检索策略
- **语义搜索**: 基于向量相似度的语义检索
- **全文搜索**: 基于关键词的全文检索
- **混合搜索**: 结合语义搜索和全文搜索的混合检索策略
- **高级检索**: 支持过滤器和复杂检索条件的高级检索功能

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
pnpm install dify-connector
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
import { sendBlockingMessage, createConfig } from 'dify-connector';

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
import { sendBlockingMessage } from 'dify-connector';

const response = await sendBlockingMessage({
  query: '你好，世界！',
  user: 'user123'
});

console.log(response.answer);
```

### 发送流式对话消息（注意：主要在浏览器环境中可用）

```typescript
import { sendStreamingMessage } from 'dify-connector';

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
import { sendStreamingMessageNode } from 'dify-connector';

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
import { uploadFile } from 'dify-connector';
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
import { executeBlockingWorkflow } from 'dify-connector';

const response = await executeBlockingWorkflow({
  inputs: {
    query: '处理这段文本'
  },
  user: 'user123'
});

console.log('工作流状态:', response.data.status);
```

### Node.js环境下的流式工作流

```typescript
import { sendStreamingWorkflowNode } from 'dify-connector';

// Node.js环境下的流式工作流处理
await sendStreamingWorkflowNode({
  inputs: {
    query: '处理这段文本',
    target_language: '中文'
  },
  user: 'user123'
}, (event) => {
  console.log('📡 收到SSE事件:', event.event);
  console.log('   工作流ID:', event.workflow_run_id);
  console.log('   任务ID:', event.task_id);
  
  switch (event.event) {
    case 'workflow_started':
      console.log('   ✅ 工作流开始执行');
      break;
    case 'workflow_finished':
      console.log('   ✅ 工作流执行完成');
      if (event.data) {
        console.log('   执行状态:', event.data.status);
        console.log('   耗时:', event.data.elapsed_time, '秒');
        if (event.data.outputs) {
          console.log('   输出结果:', event.data.outputs);
        }
      }
      break;
    case 'node_started':
      console.log('   🔧 节点开始执行');
      break;
    case 'node_finished':
      console.log('   🔧 节点执行完成');
      break;
    case 'workflow_failed':
      console.log('   ❌ 工作流执行失败');
      break;
  }
});
```

### 知识库管理

```typescript
import { 
  createDataset, 
  uploadDocument, 
  createSegment, 
  retrieveFromDataset 
} from 'dify-connector';

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

### 知识库管理文档
知识库管理功能包含以下模块，详细的API使用说明请参考源码中的类型定义和注释：

- **数据集管理** (`dataset-management/`) - 数据集的创建、查询、更新、删除
- **文档管理** (`document-management/`) - 文档的上传、查询、更新、删除
- **段落管理** (`segment-management/`) - 文本段的创建、查询、更新、删除，支持批量操作
- **子块管理** (`child-chunk-management/`) - 子块的创建、查询、更新、删除，支持细粒度文本处理
- **元数据管理** (`metadata-management/`) - 文档和文本段的元数据管理，支持批量操作
- **数据集检索** (`dataset-retrieval/`) - 基础检索、混合搜索、高级检索
- **知识标签管理** (`knowledge-tags-management/`) - 知识标签的创建、查询、管理

### API文档
详细的API规范文档请参考 `docs/` 目录：

- [聊天消息API](./docs/chat-messages.md)
- [文件上传API](./docs/file-upload.md)
- [工作流文件上传API](./docs/workflow-file-upload.md)
- [工作流执行API](./docs/workflow-execution.md)
- [数据集管理API](./docs/dataset-management.md)
- [文档管理API](./docs/document-management.md)
- [段落管理API](./docs/segment-management.md)
- [子块管理API](./docs/child-chunk-management.md)
- [元数据管理API](./docs/metadata-management.md)
- [数据集检索API](./docs/dataset-retrieval.md)
- [知识标签管理API](./docs/knowledge-tags-management.md)

### 其他文档
- [配置参数功能示例](./CONFIG_PARAMS_EXAMPLES.md)
- [更新日志](./CHANGELOG.md)

## 错误处理

所有模块都提供标准化的错误处理：

```typescript
import { sendBlockingMessage, ChatMessageError } from 'dify-connector';

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

### 基本功能测试
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

# 测试Node.js流式工作流功能
pnpm run test-workflow-node-stream
```

### 知识库管理测试
```bash
# 测试知识库管理功能
pnpm run test-knowledge-base
```

### 配置参数测试
```bash
# 测试配置参数功能
pnpm run test-config-params
```

### 综合测试
```bash
# 测试所有功能
pnpm run test-all

# 测试实际功能调用
pnpm run test-actual

# 运行示例代码
pnpm run example
```

### TypeScript 开发测试

对于开发期间的快速测试，可以使用 tsx 直接运行 TypeScript 源码文件：

```bash
# 运行单个测试文件（无需预先构建）
npx tsx tests/test-connector.ts
npx tsx tests/test-knowledge-base.ts
npx tsx tests/test-config-params.ts
npx tsx tests/test-workflow-node-stream.ts

# 运行类型检查
pnpm run type-check

# 构建项目
pnpm build
```

## 依赖

### 环境要求
- Node.js >= 20
- pnpm 包管理器

### 核心依赖
- **TypeScript** - 类型安全的 JavaScript 超集
- **Zod** - 运行时类型验证
- **Axios** - HTTP 客户端
- **@microsoft/fetch-event-source** - 浏览器环境 SSE 流处理
- **dotenv** - 环境变量管理
- **form-data** - 文件上传处理
- **eventsource** - Node.js 环境 SSE 支持

### 开发依赖
- **tsx** - TypeScript 执行器（用于开发测试）
- **@types/node** - Node.js 类型定义
- **esbuild** - 构建工具
- **tslib** - TypeScript 运行时库

## 版本信息

### 当前版本：v1.3.0

### 版本历史
- **v1.3.0** - 新增 Node.js 流式工作流处理功能，优化测试脚本
- **v1.2.0** - 新增完整的知识库管理功能，包含7个专门模块
- **v1.1.0** - 新增运行时参数配置支持，完全向后兼容
- **v1.0.0** - 初始版本，包含核心功能

### 更新日志
详细的更新信息请参考 [更新日志](./CHANGELOG.md)

## 许可证

MIT