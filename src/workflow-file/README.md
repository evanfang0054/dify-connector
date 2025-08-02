# 工作流文件上传模块

工作流文件上传模块提供了上传文件到Dify API的功能，专门用于工作流执行。

## 功能

- 上传文件用于工作流执行
- 支持多种文件类型（Buffer, ReadableStream, File）
- 完整的错误处理和类型安全

## 安装

该模块已包含在项目中，无需额外安装。

## 使用方法

### 上传文件用于工作流

```typescript
import { uploadWorkflowFile } from './workflow-file';

// 使用Buffer上传文件
const buffer = fs.readFileSync('path/to/file.txt');
const response = await uploadWorkflowFile({
  file: buffer,
  filename: 'file.txt',
  user: 'user-identifier'
});

console.log('File uploaded:', response);
```

### 错误处理

```typescript
import { uploadWorkflowFile, FileUploadError } from './workflow-file';

try {
  const response = await uploadWorkflowFile({
    file: buffer,
    filename: 'file.txt',
    user: 'user-identifier'
  });
} catch (error) {
  if (error instanceof FileUploadError) {
    console.error('File upload failed:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
  }
}
```

## API

### `uploadWorkflowFile(options)`

上传文件用于工作流。

#### 参数

- `options` (object): 文件上传选项
  - `file` (Buffer | ReadableStream | File): 要上传的文件
  - `filename` (string): 文件名
  - `user` (string): 用户标识

#### 返回值

返回一个Promise，解析为文件上传响应对象：

```typescript
{
  id: string;           // 文件ID
  name: string;         // 文件名
  size: number;         // 文件大小（字节）
  extension: string;    // 文件扩展名
  mime_type: string;    // MIME类型
  created_by: string;   // 上传者ID
  created_at: number;   // 上传时间戳
}
```

#### 异常

当API调用失败时，会抛出 `FileUploadError` 异常，包含以下属性：

- `message` (string): 错误消息
- `status` (number | null): HTTP状态码
- `code` (string | null): 错误码
- `details` (any): 错误详情

## 支持的文件类型

- `Buffer`: Node.js Buffer对象
- `ReadableStream`: ReadableStream对象
- `File`: 浏览器环境中的File对象

## 错误码

常见的错误码包括：

- `400`: 请求参数错误
- `413`: 文件太大
- `415`: 不支持的文件类型
- `500`: 服务内部异常
- `503`: 存储服务错误