# 对话消息模块

对话消息模块提供了向Dify API发送对话消息的功能，支持流式和阻塞两种响应模式。

## 功能

- 发送对话消息
- 支持流式和阻塞两种响应模式
- 完整的错误处理和类型安全
- 支持文件上传和会话管理

## 安装

该模块已包含在项目中，无需额外安装。

## 使用方法

### 发送对话消息（自动模式）

根据`response_mode`参数自动选择阻塞或流式模式：

```typescript
import { sendMessage } from './chat';

// 阻塞模式
const response = await sendMessage({
  query: '你好，世界！',
  user: 'user-identifier',
  response_mode: 'blocking'
});

console.log('Response:', response);

// 流式模式
const streamHandler = await sendMessage({
  query: '你好，世界！',
  user: 'user-identifier',
  response_mode: 'streaming'
}) as (onMessage: (event: ChatStreamEvent) => void) => Promise<void>;

await streamHandler((event) => {
  console.log('Stream event:', event);
});
```

### 发送对话消息（阻塞模式）

```typescript
import { sendBlockingMessage } from './chat';

const response = await sendBlockingMessage({
  query: '你好，世界！',
  user: 'user-identifier'
});

console.log('Response:', response);
```

### 发送对话消息（流式模式）

```typescript
import { sendStreamingMessage } from './chat';

await sendStreamingMessage({
  query: '你好，世界！',
  user: 'user-identifier'
}, (event) => {
  console.log('Stream event:', event);
});
```

### 发送带文件的对话消息

```typescript
import { sendBlockingMessage } from './chat';

const response = await sendBlockingMessage({
  query: '分析这张图片',
  user: 'user-identifier',
  files: [{
    type: 'image',
    transfer_method: 'remote_url',
    url: 'https://example.com/image.jpg'
  }]
});

console.log('Response:', response);
```

### 继续会话

```typescript
import { sendBlockingMessage } from './chat';

const response = await sendBlockingMessage({
  query: '继续之前的对话',
  user: 'user-identifier',
  conversation_id: 'conversation-id-from-previous-response'
});

console.log('Response:', response);
```

### 错误处理

```typescript
import { sendMessage, ChatMessageError } from './chat';

try {
  const response = await sendMessage({
    query: '你好，世界！',
    user: 'user-identifier',
    response_mode: 'blocking'
  });
} catch (error) {
  if (error instanceof ChatMessageError) {
    console.error('Chat message failed:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
  }
}
```

## API

### `sendMessage(options)`

发送对话消息，根据`response_mode`参数选择阻塞或流式模式。

#### 参数

- `options` (ChatRequest): 对话消息选项
  - `query` (string): 用户输入/提问内容
  - `user` (string): 用户标识
  - `response_mode` (string, optional): 响应模式 ('streaming' | 'blocking')，默认为'streaming'
  - `inputs` (Record<string, any>, optional): App定义的变量值
  - `conversation_id` (string, optional): 会话ID
  - `files` (InputFileObject[], optional): 文件列表
  - `auto_generate_name` (boolean, optional): 自动生成会话标题，默认为true

#### 返回值

- 阻塞模式：返回一个Promise，解析为对话响应对象
- 流式模式：返回一个Promise，解析为流事件处理函数

### `sendBlockingMessage(options)`

发送对话消息（阻塞模式）。

#### 参数

- `options` (Omit<ChatRequest, 'response_mode'>): 对话消息选项（不包含response_mode）

#### 返回值

返回一个Promise，解析为对话响应对象：

```typescript
{
  event: string;           // 事件类型
  task_id: string;         // 任务ID
  id: string;              // 唯一ID
  message_id: string;      // 消息唯一ID
  conversation_id: string; // 会话ID
  mode: string;            // App模式
  answer: string;          // 完整回复内容
  metadata: ResponseMetadata; // 元数据
  created_at: number;      // 消息创建时间戳
}
```

### `sendStreamingMessage(options, onMessage)`

发送对话消息（流式模式）。

#### 参数

- `options` (Omit<ChatRequest, 'response_mode'>): 对话消息选项（不包含response_mode）
- `onMessage` ((event: ChatStreamEvent) => void): 接收流事件的回调函数

#### 流事件格式

```typescript
{
  event: string;           // 事件类型 ('message' | 'agent_message' | 'error' | 'message_end')
  task_id: string;         // 任务ID（可选）
  message_id: string;      // 消息唯一ID（可选）
  conversation_id: string; // 会话ID（可选）
  answer: string;          // 回复内容（可选）
  created_at: number;      // 创建时间戳（可选）
}
```

#### 异常

当API调用失败时，会抛出 `ChatMessageError` 异常，包含以下属性：

- `message` (string): 错误消息
- `status` (number | null): HTTP状态码
- `code` (string | null): 错误码
- `details` (any): 错误详情

## 响应模式

### 阻塞模式 (blocking)

等待执行完毕后返回完整响应，适用于简单的问答场景。

### 流式模式 (streaming)

基于SSE（Server-Sent Events）实时返回响应，适用于需要实时显示回答的场景。

## 错误码

常见的错误码包括：

- `400`: 请求参数错误
- `404`: 对话不存在
- `500`: 服务内部异常