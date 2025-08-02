# Dify API连接器

Dify API连接器是一个基于Node.js的中间层服务，旨在简化本地服务与Dify AI平台的集成。该连接器提供统一的API接口来执行三种核心操作：发送对话消息、上传文件和执行工作流。

## 功能特性

- **类型安全**: 使用TypeScript和Zod进行完整的类型检查和验证
- **错误处理**: 标准化的错误处理机制
- **多种模式支持**: 支持阻塞和流式响应模式
- **文件上传**: 支持聊天和工作流的文件上传功能
- **SSE流处理**: 使用@microsoft/fetch-event-source处理服务端事件流
- **配置管理**: 通过环境变量管理API配置

## 模块组成

1. **核心配置模块** (`config/`) - 管理API基础URL和认证密钥
2. **HTTP客户端模块** (`client/`) - 封装Axios实例和通用请求逻辑
3. **类型定义模块** (`types/`) - 包含所有API接口的Zod模式和TypeScript类型
4. **对话消息模块** (`chat/`) - 实现发送对话消息功能
5. **文件上传模块** (`file/`) - 实现普通文件上传功能
6. **工作流文件上传模块** (`workflow-file/`) - 实现工作流专用文件上传功能
7. **工作流模块** (`workflow/`) - 实现执行工作流功能
8. **错误处理模块** (`error/`) - 标准化错误处理和响应
9. **工具模块** (`utils/`) - 通用工具函数

## 安装

```bash
pnpm install
```

## 配置

创建 `.env` 文件并设置以下环境变量：

```env
API_BASE_URL=https://api.dify.ai/v1
API_KEY=your-api-key-here
```

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

## 文档

详细使用说明请参考以下文档：

- [聊天消息模块](./src/chat/README.md)
- [文件上传模块](./src/file/README.md)
- [工作流文件上传模块](./src/workflow-file/README.md)
- [工作流执行模块](./src/workflow/README.md)
- [API规范文档](./docs/)

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

## 许可证

MIT