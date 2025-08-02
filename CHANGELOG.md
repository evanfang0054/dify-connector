# 更新日志

本文档记录了 Dify 连接器的所有重要变更。

## [1.1.0] - 2024-08-02

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

## [1.0.0] - 2024-07-25

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