# 工作流执行模块

工作流执行模块提供了执行Dify工作流的功能，支持流式和阻塞两种响应模式，包含浏览器和Node.js环境的不同实现。

## 功能

- 执行工作流
- 支持流式和阻塞两种响应模式
- 完整的错误处理和类型安全
- 支持文件上传和复杂输入
- 浏览器和Node.js环境兼容
- 修复了Authorization头部配置问题

## 安装

该模块已包含在项目中，无需额外安装。

## 使用方法

### 执行工作流（自动模式）

根据`response_mode`参数自动选择阻塞或流式模式：

```typescript
import { executeWorkflow } from './workflow';

// 阻塞模式
const response = await executeWorkflow({
  inputs: {
    query: '处理这段文本'
  },
  user: 'user-identifier',
  response_mode: 'blocking'
});

console.log('Response:', response);

// 流式模式
const streamHandler = await executeWorkflow({
  inputs: {
    query: '处理这段文本'
  },
  user: 'user-identifier',
  response_mode: 'streaming'
}) as (onEvent: (event: WorkflowStreamEvent) => void) => Promise<void>;

await streamHandler((event) => {
  console.log('Stream event:', event);
});
```

### 执行工作流（阻塞模式）

```typescript
import { executeBlockingWorkflow } from './workflow';

const response = await executeBlockingWorkflow({
  inputs: {
    query: '处理这段文本'
  },
  user: 'user-identifier'
});

console.log('Response:', response);
```

### 执行工作流（流式模式）

```typescript
import { executeStreamingWorkflow } from './workflow';

await executeStreamingWorkflow({
  inputs: {
    query: '处理这段文本'
  },
  user: 'user-identifier'
}, (event) => {
  console.log('Stream event:', event);
});
```

### 执行工作流（Node.js流式模式）

Node.js环境下使用专用的流式处理函数，避免浏览器兼容性问题：

```typescript
import { sendStreamingWorkflowNode } from './workflow/workflow-node-stream';

await sendStreamingWorkflowNode({
  inputs: {
    query: '处理这段文本'
  },
  user: 'user-identifier'
}, (event) => {
  console.log('Node.js stream event:', event);
});
```

### 执行带文件的工作流

```typescript
import { executeBlockingWorkflow } from './workflow';

const response = await executeBlockingWorkflow({
  inputs: {
    documents: [
      {
        type: 'document',
        transfer_method: 'local_file',
        upload_file_id: 'file-id-from-upload'
      }
    ]
  },
  user: 'user-identifier'
});

console.log('Response:', response);
```

### 错误处理

```typescript
import { executeWorkflow, WorkflowError } from './workflow';

try {
  const response = await executeWorkflow({
    inputs: {
      query: '处理这段文本'
    },
    user: 'user-identifier',
    response_mode: 'blocking'
  });
} catch (error) {
  if (error instanceof WorkflowError) {
    console.error('Workflow execution failed:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
  }
}
```

## API

### `executeWorkflow(options)`

执行工作流，根据`response_mode`参数选择阻塞或流式模式。

#### 参数

- `options` (WorkflowRequest): 工作流执行选项
  - `inputs` (Record<string, any>): App定义的变量值
  - `user` (string): 用户标识
  - `response_mode` (string): 响应模式 ('streaming' | 'blocking')

#### 返回值

- 阻塞模式：返回一个Promise，解析为工作流响应对象
- 流式模式：返回一个Promise，解析为流事件处理函数

### `executeBlockingWorkflow(options)`

执行工作流（阻塞模式）。

#### 参数

- `options` (Omit<WorkflowRequest, 'response_mode'>): 工作流执行选项（不包含response_mode）

#### 返回值

返回一个Promise，解析为工作流响应对象：

```typescript
{
  workflow_run_id: string;    // 工作流执行ID
  task_id: string;            // 任务ID
  data: WorkflowFinishedData; // 完成数据
}
```

### `executeStreamingWorkflow(options, onEvent)`

执行工作流（流式模式）。

#### 参数

- `options` (Omit<WorkflowRequest, 'response_mode'>): 工作流执行选项（不包含response_mode）
- `onEvent` ((event: WorkflowStreamEvent) => void): 接收流事件的回调函数

#### 流事件格式

```typescript
{
  event: string;              // 事件类型 ('workflow_started' | 'node_started' | 'node_finished' | 'workflow_finished' | 'error')
  workflow_run_id: string;    // 工作流执行ID（可选）
  data: WorkflowFinishedData; // 完成数据（可选）
}
```

### `sendStreamingWorkflowNode(options, onEvent)`

Node.js环境下的工作流流式处理函数，使用原生Node.js流式处理，避免浏览器兼容性问题。

#### 参数

- `options` (Omit<WorkflowRequest, 'response_mode'>): 工作流执行选项（不包含response_mode）
- `onEvent` ((event: WorkflowStreamEvent) => void): 接收流事件的回调函数

#### 返回值

返回一个Promise，在流式处理完成时解析。

#### 特点

- 使用Node.js原生流式处理
- 避免fetchEventSource的浏览器兼容性问题
- 支持完整的SSE事件处理
- 自动处理流结束和错误情况
- 支持工作流节点级别的事件监控

#### 支持的事件类型

- `workflow_started`: 工作流开始执行
- `workflow_finished`: 工作流执行完成
- `workflow_failed`: 工作流执行失败
- `node_started`: 节点开始执行
- `node_finished`: 节点执行完成
- `agent_log`: Agent日志事件

#### 异常

当API调用失败时，会抛出 `WorkflowError` 异常，包含以下属性：

- `message` (string): 错误消息
- `status` (number | null): HTTP状态码
- `code` (string | null): 错误码
- `details` (any): 错误详情

## 响应模式

### 阻塞模式 (blocking)

等待执行完毕后返回完整响应，适用于简单的自动化任务。

### 流式模式 (streaming)

基于SSE（Server-Sent Events）实时返回响应，适用于需要实时监控工作流执行进度的场景。

### Node.js流式模式

Node.js环境下使用原生流式处理，解决了fetchEventSource在Node.js环境中的兼容性问题，提供更稳定的工作流流式处理体验，支持详细的节点级别事件监控。

## 错误码

常见的错误码包括：

- `400`: 请求参数错误
- `500`: 服务内部异常

## 修复记录

### v1.0.0 修复内容

1. **Authorization头部配置问题**
   - 修复了`client.defaults.headers.common['Authorization']`返回undefined的问题
   - 改为直接使用`getConfig().apiKey`获取API密钥

2. **Node.js环境兼容性**
   - 新增`sendStreamingWorkflowNode`函数，专门用于Node.js环境
   - 解决了fetchEventSource在Node.js环境中的兼容性问题
   - 使用原生Node.js流式处理，提供更稳定的体验
   - 支持详细的工作流节点级别事件监控

3. **类型安全改进**
   - 完善了TypeScript类型定义
   - 增强了错误处理机制
   - 添加了完整的事件类型支持

4. **测试功能完善**
   - 实现了实际的功能测试用例
   - 添加了Node.js流式处理的专用测试
   - 提供了完整的错误处理示例