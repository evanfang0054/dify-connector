# 工作流执行模块使用说明

本文档基于Dify API文档《执行 workflow.md》编写，详细说明了工作流执行模块的使用方法和规范。

## API端点

```
POST /workflows/run
```

## 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| inputs | object | 是 | App定义的变量值，支持文件列表类型 |
| response_mode | string | 是 | 响应模式，可选值：`streaming`、`blocking` |
| user | string | 是 | 用户标识，应用内唯一 |

### 输入文件对象格式

```typescript
{
  type: 'document' | 'image' | 'audio' | 'video' | 'custom',
  transfer_method: 'remote_url' | 'local_file',
  url?: string,           // 当transfer_method为remote_url时必须
  upload_file_id?: string // 当transfer_method为local_file时必须
}
```

## 响应格式

### 阻塞模式响应

```typescript
{
  workflow_run_id: string,
  task_id: string,
  data: {
    id: string,
    workflow_id: string,
    status: 'running' | 'succeeded' | 'failed' | 'stopped',
    outputs: object,      // 输出内容（可选）
    error: string,        // 错误原因（可选）
    elapsed_time: number, // 耗时（秒，可选）
    total_tokens: number, // 总使用tokens（可选）
    total_steps: number,  // 总步数
    created_at: number,   // 开始时间
    finished_at: number   // 结束时间
  }
}
```

### 流式模式响应

流式响应通过SSE（Server-Sent Events）返回一系列事件：

```
data: {"event": "workflow_started", "workflow_run_id": "..."}

data: {"event": "node_started", "data": {...}}

data: {"event": "node_finished", "data": {...}}

data: {"event": "workflow_finished", "data": {...}}
```

## 错误响应

| 状态码 | 错误码 | 描述 |
|--------|--------|------|
| 400 | invalid_param | 请求参数错误 |
| 400 | app_unavailable | 应用不可用 |
| 400 | provider_not_initialize | 提供商未初始化 |
| 400 | provider_quota_exceeded | 提供商配额超限 |
| 400 | model_currently_not_support | 模型当前不支持 |
| 400 | workflow_request_error | 工作流请求错误 |
| 500 | - | 服务内部异常 |

## 使用示例

### 基础工作流执行

```typescript
import { executeBlockingWorkflow } from './workflow';

const response = await executeBlockingWorkflow({
  inputs: {
    user_query: '请帮我翻译这段文字',
    target_language: '法语'
  },
  user: 'user123'
});

console.log('工作流状态:', response.data.status);
console.log('输出结果:', response.data.outputs);
```

### 带文件的工作流执行

```typescript
import { executeBlockingWorkflow } from './workflow';

const response = await executeBlockingWorkflow({
  inputs: {
    my_documents: [
      {
        type: 'document',
        transfer_method: 'local_file',
        upload_file_id: '已上传的文件ID'
      },
      {
        type: 'image',
        transfer_method: 'remote_url',
        url: 'https://example.com/image.jpg'
      }
    ]
  },
  user: 'user123'
});

console.log('工作流执行结果:', response.data);
```

### 流式工作流执行

```typescript
import { executeStreamingWorkflow } from './workflow';

await executeStreamingWorkflow({
  inputs: {
    query: '处理大量数据'
  },
  user: 'user123'
}, (event) => {
  switch (event.event) {
    case 'workflow_started':
      console.log('工作流开始执行');
      break;
    case 'node_started':
      console.log('节点开始:', event.data?.id);
      break;
    case 'node_finished':
      console.log('节点完成:', event.data?.id);
      break;
    case 'workflow_finished':
      console.log('工作流执行完成:', event.data?.status);
      break;
    case 'error':
      console.error('工作流执行出错:', event.data);
      break;
  }
});
```