# 聊天消息模块使用说明

本文档基于Dify API文档《发送对话消息.md》编写，详细说明了聊天消息模块的使用方法和规范。

## API端点

```
POST /chat-messages
```

## 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| query | string | 是 | 用户输入/提问内容 |
| user | string | 是 | 用户标识，应用内唯一 |
| response_mode | string | 否 | 响应模式，可选值：`streaming`（默认）、`blocking` |
| inputs | object | 否 | App定义的变量值，支持文件类型 |
| conversation_id | string | 否 | 会话ID，用于继续之前的对话 |
| files | array | 否 | 文件列表，仅当模型支持Vision能力时可用 |
| auto_generate_name | boolean | 否 | 自动生成会话标题，默认为true |

### 文件对象格式

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
  event: 'message',
  task_id: string,
  id: string,
  message_id: string,
  conversation_id: string,
  mode: 'chat',
  answer: string,
  metadata: {
    usage: {
      prompt_tokens: number,
      prompt_unit_price: string,
      prompt_price_unit: string,
      prompt_price: string,
      completion_tokens: number,
      completion_unit_price: string,
      completion_price_unit: string,
      completion_price: string,
      total_tokens: number,
      total_price: string,
      currency: string,
      latency: number
    },
    retriever_resources: [
      {
        position: number,
        dataset_id: string,
        dataset_name: string,
        document_id: string,
        document_name: string,
        segment_id: string,
        score: number,
        content: string
      }
    ]
  },
  created_at: number
}
```

### 流式模式响应

流式响应通过SSE（Server-Sent Events）返回一系列事件：

```
data: {"event": "message", "task_id": "...", "answer": "Hello"}

data: {"event": "message", "task_id": "...", "answer": "Hello World"}

data: {"event": "message_end", "task_id": "..."}
```

## 错误响应

| 状态码 | 错误码 | 描述 |
|--------|--------|------|
| 400 | invalid_param | 请求参数错误 |
| 400 | app_unavailable | 应用不可用 |
| 400 | provider_not_initialize | 提供商未初始化 |
| 400 | provider_quota_exceeded | 提供商配额超限 |
| 400 | model_currently_not_support | 模型当前不支持 |
| 400 | completion_request_error | 完成请求错误 |
| 404 | - | 对话不存在 |
| 500 | - | 服务内部异常 |

## 使用示例

### 基础对话

```typescript
import { sendBlockingMessage } from './chat';

const response = await sendBlockingMessage({
  query: '你好，世界！',
  user: 'user123'
});

console.log(response.answer);
```

### 带文件的对话

```typescript
import { sendBlockingMessage } from './chat';

const response = await sendBlockingMessage({
  query: '分析这张图片',
  user: 'user123',
  files: [
    {
      type: 'image',
      transfer_method: 'remote_url',
      url: 'https://example.com/image.jpg'
    }
  ]
});
```

### 流式对话

```typescript
import { sendStreamingMessage } from './chat';

await sendStreamingMessage({
  query: '写一篇关于AI的文章',
  user: 'user123'
}, (event) => {
  if (event.event === 'message') {
    process.stdout.write(event.answer);
  } else if (event.event === 'message_end') {
    console.log('\n对话结束');
  }
});
```