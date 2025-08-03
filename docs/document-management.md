# 文档管理模块使用说明

本文档基于Dify API文档《知识库 API.md》编写，详细说明了知识库文档管理相关接口的使用方法和规范。

## API端点

### 通过文本创建文档

```
POST /datasets/{dataset_id}/document/create-by-text
```

### 通过文件创建文档

```
POST /datasets/{dataset_id}/document/create-by-file
```

### 通过文本更新文档

```
POST /datasets/{dataset_id}/documents/{document_id}/update-by-text
```

### 通过文件更新文档

```
POST /datasets/{dataset_id}/documents/{document_id}/update-by-file
```

### 获取文档列表

```
GET /datasets/{dataset_id}/documents
```

### 获取文档详情

```
GET /datasets/{dataset_id}/documents/{document_id}
```

### 删除文档

```
DELETE /datasets/{dataset_id}/documents/{document_id}
```

### 获取文档嵌入状态

```
GET /datasets/{dataset_id}/documents/{batch}/indexing-status
```

### 获取上传文件

```
GET /datasets/{dataset_id}/documents/{document_id}/upload-file
```

### 更新文档状态

```
PATCH /datasets/{dataset_id}/documents/status/{action}
```

## 通过文本创建文档

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | string | 是 | 文档名称 |
| text | string | 是 | 文档内容 |
| indexing_technique | string | 是 | 索引方式：`high_quality`（高质量）、`economy`（经济） |
| doc_form | string | 否 | 索引内容形式：`text_model`、`hierarchical_model`、`qa_model` |
| doc_language | string | 否 | Q&A模式下文档语言，如：`English`、`Chinese` |
| process_rule | object | 是 | 处理规则 |

### 处理规则配置

```typescript
{
  mode: 'automatic' | 'custom' | 'hierarchical',
  rules?: {
    pre_processing_rules: Array<{
      id: 'remove_extra_spaces' | 'remove_urls_emails',
      enabled: boolean
    }>,
    segmentation: {
      separator: string,
      max_tokens: number,
      parent_mode?: 'full-doc' | 'paragraph',
      subchunk_segmentation?: {
        separator: string,
        max_tokens: number,
        chunk_overlap?: number
      }
    }
  }
}
```

### 响应格式

```typescript
{
  document: {
    id: string,
    position: number,
    data_source_type: string,
    data_source_info: {
      upload_file_id: string
    },
    dataset_process_rule_id: string,
    name: string,
    created_from: string,
    created_by: string,
    created_at: number,
    tokens: number,
    indexing_status: string,
    error: string | null,
    enabled: boolean,
    disabled_at: number | null,
    disabled_by: string | null,
    archived: boolean,
    display_status: string,
    word_count: number,
    hit_count: number,
    doc_form: string
  },
  batch: string
}
```

## 通过文件创建文档

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| data | string | 是 | JSON字符串，包含文档配置 |
| file | binary | 是 | 要上传的文件 |

### data字段格式

```typescript
{
  original_document_id?: string,  // 源文档ID（用于更新）
  indexing_technique: 'high_quality' | 'economy',
  doc_form: 'text_model' | 'hierarchical_model' | 'qa_model',
  doc_language?: string,
  process_rule: {
    mode: 'automatic' | 'custom' | 'hierarchical',
    rules?: {
      pre_processing_rules: Array<{
        id: string,
        enabled: boolean
      }>,
      segmentation: {
        separator: string,
        max_tokens: number,
        parent_mode?: string,
        subchunk_segmentation?: {
          separator: string,
          max_tokens: number,
          chunk_overlap?: number
        }
      }
    }
  }
}
```

## 获取文档列表

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词（仅搜索文档名称） |
| page | string | 否 | 页码 |
| limit | string | 否 | 返回条数，默认20，范围1-100 |

### 响应格式

```typescript
{
  data: [
    {
      id: string,
      position: number,
      data_source_type: string,
      data_source_info: any,
      dataset_process_rule_id: string | null,
      name: string,
      created_from: string,
      created_by: string,
      created_at: number,
      tokens: number,
      indexing_status: string,
      error: string | null,
      enabled: boolean,
      disabled_at: number | null,
      disabled_by: string | null,
      archived: boolean
    }
  ],
  has_more: boolean,
  limit: number,
  total: number,
  page: number
}
```

## 获取文档详情

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| document_id | string | 是 | 文档 ID |

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| metadata | string | 否 | metadata过滤条件：`all`、`only`、`without`，默认`all` |

### 响应格式

```typescript
{
  id: string,
  position: number,
  data_source_type: string,
  data_source_info: {
    upload_file: any
  },
  dataset_process_rule_id: string,
  dataset_process_rule: {
    mode: string,
    rules: {
      pre_processing_rules: Array<any>,
      segmentation: {
        separator: string,
        max_tokens: number,
        chunk_overlap: number
      },
      parent_mode: string,
      subchunk_segmentation: {
        separator: string,
        max_tokens: number,
        chunk_overlap: number
      }
    }
  },
  document_process_rule: {
    id: string,
    dataset_id: string,
    mode: string,
    rules: {
      pre_processing_rules: Array<any>,
      segmentation: {
        separator: string,
        max_tokens: number,
        chunk_overlap: number
      },
      parent_mode: string,
      subchunk_segmentation: {
        separator: string,
        max_tokens: number,
        chunk_overlap: number
      }
    }
  },
  name: string,
  created_from: string,
  created_by: string,
  created_at: number,
  tokens: number | null,
  indexing_status: string,
  completed_at: number | null,
  updated_at: number,
  indexing_latency: number | null,
  error: string | null,
  enabled: boolean,
  disabled_at: number | null,
  disabled_by: string | null,
  archived: boolean,
  segment_count: number,
  average_segment_length: number,
  hit_count: number | null,
  display_status: string,
  doc_form: string,
  doc_language: string
}
```

## 获取文档嵌入状态

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| batch | string | 是 | 上传文档的批次号 |

### 响应格式

```typescript
{
  data: [
    {
      id: string,
      indexing_status: string,
      processing_started_at: number,
      parsing_completed_at: number,
      cleaning_completed_at: number,
      splitting_completed_at: number,
      completed_at: number | null,
      paused_at: number | null,
      error: string | null,
      stopped_at: number | null,
      completed_segments: number,
      total_segments: number
    }
  ]
}
```

## 更新文档状态

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| action | string | 是 | 操作类型：`enable`（启用）、`disable`（禁用）、`archive`（归档）、`un_archive`（取消归档） |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| document_ids | array[string] | 是 | 文档ID列表 |

### 响应格式

```typescript
{
  result: 'success'
}
```

## 错误响应

| 状态码 | 错误码 | 描述 |
|--------|--------|------|
| 400 | no_file_uploaded | 未上传文件 |
| 400 | too_many_files | 文件过多 |
| 400 | file_too_large | 文件太大 |
| 400 | unsupported_file_type | 不支持的文件类型 |
| 400 | high_quality_dataset_only | 仅支持高质量数据集 |
| 400 | dataset_not_initialized | 数据集正在初始化或索引中 |
| 403 | archived_document_immutable | 归档文档不可编辑 |
| 400 | document_already_finished | 文档已处理完成 |
| 400 | document_indexing | 文档正在处理中，不可编辑 |
| 404 | - | 文档不存在 |
| 500 | - | 服务内部异常 |

## 使用示例

### 通过文本创建文档

```typescript
import { createDocumentByText } from './document';

const document = await createDocumentByText('dataset_id', {
  name: '产品说明文档',
  text: '这是一个产品说明文档的详细内容...',
  indexing_technique: 'high_quality',
  doc_form: 'text_model',
  process_rule: {
    mode: 'automatic'
  }
});

console.log('文档创建成功:', document.id);
```

### 通过文件创建文档

```typescript
import { createDocumentByFile } from './document';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('document.pdf');
const document = await createDocumentByFile('dataset_id', {
  file: fileBuffer,
  filename: 'document.pdf',
  data: {
    indexing_technique: 'high_quality',
    doc_form: 'text_model',
    process_rule: {
      mode: 'automatic'
    }
  }
});

console.log('文档创建成功:', document.id);
```

### 获取文档列表

```typescript
import { getDocumentList } from './document';

const list = await getDocumentList('dataset_id', {
  page: 1,
  limit: 10,
  keyword: '产品'
});

console.log('文档列表:', list.data);
console.log('总数:', list.total);
```

### 获取文档嵌入状态

```typescript
import { getDocumentIndexingStatus } from './document';

const status = await getDocumentIndexingStatus('dataset_id', 'batch_id');

console.log('处理状态:', status.data[0].indexing_status);
console.log('进度:', `${status.data[0].completed_segments}/${status.data[0].total_segments}`);
```

### 更新文档状态

```typescript
import { updateDocumentStatus } from './document';

await updateDocumentStatus('dataset_id', 'enable', {
  document_ids: ['doc_id_1', 'doc_id_2']
});

console.log('文档状态更新成功');
```