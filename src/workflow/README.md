# 工作流执行模块

工作流执行模块提供了执行Dify工作流的功能，支持流式和阻塞两种响应模式。

## 功能

- 执行工作流
- 支持流式和阻塞两种响应模式
- 完整的错误处理和类型安全
- 支持文件上传和复杂输入

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

## 错误码

常见的错误码包括：

- `400`: 请求参数错误
- `500`: 服务内部异常