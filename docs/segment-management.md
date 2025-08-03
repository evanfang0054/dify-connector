# 文档分段管理模块使用说明

本文档基于Dify API文档《知识库 API.md》编写，详细说明了文档分段管理相关接口的使用方法和规范。

## API端点

### 新增分段

```
POST /datasets/{dataset_id}/documents/{document_id}/segments
```

### 查询文档分段

```
GET /datasets/{dataset_id}/documents/{document_id}/segments
```

### 获取分段详情

```
GET /datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}
```

### 更新分段

```
POST /datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}
```

### 删除分段

```
DELETE /datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}
```

## 新增分段

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| document_id | string | 是 | 文档 ID |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| segments | array[object] | 是 | 分段列表 |

### 分段对象格式

```typescript
{
  content: string,      // 文本内容/问题内容，必填
  answer?: string,      // 答案内容，Q&A模式下必填
  keywords?: string[]   // 关键字列表，可选
}
```

### 响应格式

```typescript
{
  data: [
    {
      id: string,
      position: number,
      document_id: string,
      content: string,
      answer: string,
      word_count: number,
      tokens: number,
      keywords: string[],
      index_node_id: string,
      index_node_hash: string,
      hit_count: number,
      enabled: boolean,
      disabled_at: number | null,
      disabled_by: string | null,
      status: string,
      created_by: string,
      created_at: number,
      indexing_at: number,
      completed_at: number,
      error: string | null,
      stopped_at: number | null
    }
  ],
  doc_form: string
}
```

## 查询文档分段

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| document_id | string | 是 | 文档 ID |

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| status | string | 否 | 搜索状态，如：`completed` |
| page | string | 否 | 页码 |
| limit | string | 否 | 返回条数，默认20，范围1-100 |

### 响应格式

```typescript
{
  data: [
    {
      id: string,
      position: number,
      document_id: string,
      content: string,
      answer: string,
      word_count: number,
      tokens: number,
      keywords: string[],
      index_node_id: string,
      index_node_hash: string,
      hit_count: number,
      enabled: boolean,
      disabled_at: number | null,
      disabled_by: string | null,
      status: string,
      created_by: string,
      created_at: number,
      indexing_at: number,
      completed_at: number,
      error: string | null,
      stopped_at: number | null
    }
  ],
  doc_form: string,
  has_more: boolean,
  limit: number,
  total: number,
  page: number
}
```

## 获取分段详情

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| document_id | string | 是 | 文档 ID |
| segment_id | string | 是 | 分段 ID |

### 响应格式

```typescript
{
  data: {
    id: string,
    position: number,
    document_id: string,
    content: string,
    sign_content: string,
    answer: string,
    word_count: number,
    tokens: number,
    keywords: string[],
    index_node_id: string,
    index_node_hash: string,
    hit_count: number,
    enabled: boolean,
    status: string,
    created_by: string,
    created_at: number,
    updated_at: number,
    indexing_at: number,
    completed_at: number,
    error: string | null,
    child_chunks: any[]
  },
  doc_form: string
}
```

## 更新分段

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| document_id | string | 是 | 文档 ID |
| segment_id | string | 是 | 分段 ID |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| segment | object | 是 | 分段更新数据 |

### 分段更新格式

```typescript
{
  content: string,                    // 文本内容/问题内容，必填
  answer?: string,                    // 答案内容，Q&A模式下必填
  keywords?: string[],                // 关键字列表，可选
  enabled?: boolean,                  // 是否启用，可选
  regenerate_child_chunks?: boolean   // 是否重新生成子分段，可选
}
```

### 响应格式

```typescript
{
  data: {
    id: string,
    position: number,
    document_id: string,
    content: string,
    answer: string,
    word_count: number,
    tokens: number,
    keywords: string[],
    index_node_id: string,
    index_node_hash: string,
    hit_count: number,
    enabled: boolean,
    disabled_at: number | null,
    disabled_by: string | null,
    status: string,
    created_by: string,
    created_at: number,
    indexing_at: number,
    completed_at: number,
    error: string | null,
    stopped_at: number | null
  },
  doc_form: string
}
```

## 删除分段

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| document_id | string | 是 | 文档 ID |
| segment_id | string | 是 | 分段 ID |

### 响应

成功时返回 `204 No Content`

## 错误响应

| 状态码 | 错误码 | 描述 |
|--------|--------|------|
| 400 | invalid_param | 请求参数错误 |
| 404 | - | 分段不存在 |
| 403 | - | 权限不足 |
| 500 | - | 服务内部异常 |

## 使用示例

### 新增分段

```typescript
import { createSegments } from './segment';

const segments = await createSegments('dataset_id', 'document_id', {
  segments: [
    {
      content: '什么是人工智能？',
      answer: '人工智能（AI）是计算机科学的一个分支，致力于创建能够执行通常需要人类智能的任务的系统。',
      keywords: ['人工智能', 'AI', '计算机科学']
    },
    {
      content: '机器学习的基本概念',
      answer: '机器学习是人工智能的一个子领域，专注于开发能够从数据中学习并做出预测或决策的算法。',
      keywords: ['机器学习', '算法', '预测']
    }
  ]
});

console.log('分段创建成功:', segments.data);
```

### 查询文档分段

```typescript
import { getDocumentSegments } from './segment';

const segments = await getDocumentSegments('dataset_id', 'document_id', {
  keyword: '人工智能',
  status: 'completed',
  page: 1,
  limit: 10
});

console.log('分段列表:', segments.data);
console.log('总数:', segments.total);
```

### 获取分段详情

```typescript
import { getSegmentDetail } from './segment';

const segment = await getSegmentDetail('dataset_id', 'document_id', 'segment_id');

console.log('分段详情:', segment.data);
console.log('内容:', segment.data.content);
console.log('答案:', segment.data.answer);
```

### 更新分段

```typescript
import { updateSegment } from './segment';

const updated = await updateSegment('dataset_id', 'document_id', 'segment_id', {
  segment: {
    content: '更新后的问题内容',
    answer: '更新后的答案内容',
    keywords: ['更新', '关键词'],
    enabled: true
  }
});

console.log('分段更新成功:', updated.data);
```

### 删除分段

```typescript
import { deleteSegment } from './segment';

await deleteSegment('dataset_id', 'document_id', 'segment_id');
console.log('分段删除成功');
```

### 批量操作示例

```typescript
import { createSegments, getDocumentSegments } from './segment';

// 批量创建分段
const newSegments = await createSegments('dataset_id', 'document_id', {
  segments: [
    { content: '问题1', answer: '答案1', keywords: ['关键词1'] },
    { content: '问题2', answer: '答案2', keywords: ['关键词2'] },
    { content: '问题3', answer: '答案3', keywords: ['关键词3'] }
  ]
});

// 获取所有分段
const allSegments = await getDocumentSegments('dataset_id', 'document_id');
console.log('文档中的所有分段:', allSegments.data);

// 按状态筛选
const completedSegments = await getDocumentSegments('dataset_id', 'document_id', {
  status: 'completed'
});
console.log('已完成的分段:', completedSegments.data);
```