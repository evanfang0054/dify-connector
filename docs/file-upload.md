# 文件上传模块使用说明

本文档基于Dify API文档《上传文件.md》编写，详细说明了文件上传模块的使用方法和规范。

## API端点

```
POST /files/upload
```

## 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| file | binary | 是 | 要上传的文件 |
| user | string | 是 | 用户标识，必须和发送消息接口传入user保持一致 |

## 响应格式

```typescript
{
  id: string,        // 文件ID
  name: string,      // 文件名
  size: number,      // 文件大小（字节）
  extension: string, // 文件后缀
  mime_type: string, // 文件MIME类型
  created_by: string, // 上传人ID
  created_at: number  // 上传时间戳
}
```

## 错误响应

| 状态码 | 错误码 | 描述 |
|--------|--------|------|
| 400 | no_file_uploaded | 未上传文件 |
| 400 | too_many_files | 文件过多 |
| 400 | unsupported_preview | 不支持预览 |
| 400 | unsupported_estimate | 不支持估算 |
| 413 | file_too_large | 文件太大 |
| 415 | unsupported_file_type | 不支持的文件类型 |
| 500 | - | 服务内部异常 |
| 503 | s3_connection_failed | S3连接失败 |
| 503 | s3_permission_denied | S3权限拒绝 |
| 503 | s3_file_too_large | S3文件太大 |

## 支持的文件类型

支持应用程序所支持的所有格式，具体取决于Dify平台的配置。

## 使用示例

### 上传本地文件

```typescript
import { uploadFile } from './file';
import * as fs from 'fs';

// 读取文件为Buffer
const buffer = fs.readFileSync('path/to/document.pdf');

const response = await uploadFile({
  file: buffer,
  filename: 'document.pdf',
  user: 'user123'
});

console.log('文件上传成功:', response.id);
```

### 上传Stream文件

```typescript
import { uploadFile } from './file';
import * as fs from 'fs';

// 创建文件读取流
const stream = fs.createReadStream('path/to/image.jpg');

const response = await uploadFile({
  file: stream,
  filename: 'image.jpg',
  user: 'user123'
});

console.log('文件上传成功:', response.id);
```

### 在对话中使用上传的文件

```typescript
import { uploadFile, sendBlockingMessage } from './chat';

// 首先上传文件
const fileResponse = await uploadFile({
  file: buffer,
  filename: 'document.pdf',
  user: 'user123'
});

// 然后在对话中引用该文件
const chatResponse = await sendBlockingMessage({
  query: '总结这份文档的内容',
  user: 'user123',
  files: [
    {
      type: 'document',
      transfer_method: 'local_file',
      upload_file_id: fileResponse.id
    }
  ]
});
```