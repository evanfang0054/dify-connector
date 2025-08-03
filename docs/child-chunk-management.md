# 文档子分段管理模块使用说明

本文档基于Dify API文档《知识库 API.md》编写，详细说明了文档子分段管理相关接口的使用方法和规范。

## API端点

### 新增文档子分段

```
POST /datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks
```

### 查询文档子分段

```
GET /datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks
```

### 更新文档子分段

```
PATCH /datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks/{child_chunk_id}
```

### 删除文档子分段

```
DELETE /datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks/{child_chunk_id}
```

## 新增文档子分段

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| document_id | string | 是 | 文档 ID |
| segment_id | string | 是 | 分段 ID |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| content | string | 是 | 子分段内容 |

### 响应格式

```typescript
{
  data: {
    id: string,
    segment_id: string,
    content: string,
    word_count: number,
    tokens: number,
    index_node_id: string,
    index_node_hash: string,
    status: string,
    created_by: string,
    created_at: number,
    indexing_at: number,
    completed_at: number,
    error: string | null,
    stopped_at: number | null
  }
}
```

## 查询文档子分段

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| document_id | string | 是 | 文档 ID |
| segment_id | string | 是 | 分段 ID |

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| page | integer | 否 | 页码，默认1 |
| limit | integer | 否 | 每页数量，默认20，最大100 |

### 响应格式

```typescript
{
  data: [
    {
      id: string,
      segment_id: string,
      content: string,
      word_count: number,
      tokens: number,
      index_node_id: string,
      index_node_hash: string,
      status: string,
      created_by: string,
      created_at: number,
      indexing_at: number,
      completed_at: number,
      error: string | null,
      stopped_at: number | null
    }
  ],
  total: number,
  total_pages: number,
  page: number,
  limit: number
}
```

## 更新文档子分段

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| document_id | string | 是 | 文档 ID |
| segment_id | string | 是 | 分段 ID |
| child_chunk_id | string | 是 | 子分段 ID |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| content | string | 是 | 子分段内容 |

### 响应格式

```typescript
{
  data: {
    id: string,
    segment_id: string,
    content: string,
    word_count: number,
    tokens: number,
    index_node_id: string,
    index_node_hash: string,
    status: string,
    created_by: string,
    created_at: number,
    indexing_at: number,
    completed_at: number,
    error: string | null,
    stopped_at: number | null
  }
}
```

## 删除文档子分段

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| document_id | string | 是 | 文档 ID |
| segment_id | string | 是 | 分段 ID |
| child_chunk_id | string | 是 | 子分段 ID |

### 响应

成功时返回 `204 No Content`

## 错误响应

| 状态码 | 错误码 | 描述 |
|--------|--------|------|
| 400 | invalid_param | 请求参数错误 |
| 404 | - | 子分段不存在 |
| 403 | - | 权限不足 |
| 500 | - | 服务内部异常 |

## 使用示例

### 新增文档子分段

```typescript
import { createChildChunk } from './child-chunk';

const childChunk = await createChildChunk('dataset_id', 'document_id', 'segment_id', {
  content: '这是子分段的详细内容，用于进一步细分父分段的内容。'
});

console.log('子分段创建成功:', childChunk.data.id);
console.log('内容:', childChunk.data.content);
```

### 查询文档子分段

```typescript
import { getChildChunks } from './child-chunk';

const childChunks = await getChildChunks('dataset_id', 'document_id', 'segment_id', {
  keyword: '详细内容',
  page: 1,
  limit: 10
});

console.log('子分段列表:', childChunks.data);
console.log('总数:', childChunks.total);
console.log('总页数:', childChunks.total_pages);
```

### 更新文档子分段

```typescript
import { updateChildChunk } from './child-chunk';

const updated = await updateChildChunk('dataset_id', 'document_id', 'segment_id', 'child_chunk_id', {
  content: '更新后的子分段内容，包含更详细的信息。'
});

console.log('子分段更新成功:', updated.data.content);
```

### 删除文档子分段

```typescript
import { deleteChildChunk } from './child-chunk';

await deleteChildChunk('dataset_id', 'document_id', 'segment_id', 'child_chunk_id');
console.log('子分段删除成功');
```

### 完整的工作流程示例

```typescript
import { createChildChunk, getChildChunks, updateChildChunk, deleteChildChunk } from './child-chunk';

async function manageChildChunks() {
  // 1. 创建子分段
  const newChunk = await createChildChunk('dataset_id', 'document_id', 'segment_id', {
    content: '这是一个新的子分段内容'
  });
  
  console.log('创建的子分段ID:', newChunk.data.id);
  
  // 2. 查询所有子分段
  const allChunks = await getChildChunks('dataset_id', 'document_id', 'segment_id');
  console.log('所有子分段数量:', allChunks.total);
  
  // 3. 分页查询
  const page1Chunks = await getChildChunks('dataset_id', 'document_id', 'segment_id', {
    page: 1,
    limit: 5
  });
  console.log('第一页子分段:', page1Chunks.data.length);
  
  // 4. 更新子分段
  if (newChunk.data.id) {
    const updated = await updateChildChunk(
      'dataset_id', 
      'document_id', 
      'segment_id', 
      newChunk.data.id, 
      { content: '更新后的子分段内容' }
    );
    console.log('更新成功:', updated.data.content);
  }
  
  // 5. 删除子分段
  if (newChunk.data.id) {
    await deleteChildChunk('dataset_id', 'document_id', 'segment_id', newChunk.data.id);
    console.log('删除成功');
  }
}

// 执行管理流程
manageChildChunks().catch(console.error);
```

### 批量操作示例

```typescript
import { createChildChunk, getChildChunks } from './child-chunk';

async function batchCreateChildChunks() {
  const segmentId = 'segment_id';
  const contents = [
    '第一个子分段内容',
    '第二个子分段内容', 
    '第三个子分段内容'
  ];
  
  const createdChunks = [];
  
  // 批量创建子分段
  for (const content of contents) {
    const chunk = await createChildChunk('dataset_id', 'document_id', segmentId, {
      content
    });
    createdChunks.push(chunk.data);
  }
  
  console.log(`成功创建 ${createdChunks.length} 个子分段`);
  
  // 验证创建结果
  const allChunks = await getChildChunks('dataset_id', 'document_id', segmentId);
  console.log('当前总子分段数:', allChunks.total);
  
  return createdChunks;
}

// 执行批量创建
batchCreateChildChunks().catch(console.error);
```

### 搜索和筛选示例

```typescript
import { getChildChunks } from './child-chunk';

async function searchChildChunks() {
  // 搜索包含特定关键词的子分段
  const searchResults = await getChildChunks('dataset_id', 'document_id', 'segment_id', {
    keyword: '重要'
  });
  
  console.log('包含"重要"的子分段:', searchResults.data);
  
  // 分页浏览
  const pageSize = 2;
  const totalPages = Math.ceil(searchResults.total / pageSize);
  
  for (let page = 1; page <= totalPages; page++) {
    const pageResults = await getChildChunks('dataset_id', 'document_id', 'segment_id', {
      page,
      limit: pageSize
    });
    
    console.log(`第${page}页子分段:`);
    pageResults.data.forEach(chunk => {
      console.log(`- ${chunk.id}: ${chunk.content.substring(0, 50)}...`);
    });
  }
}

// 执行搜索
searchChildChunks().catch(console.error);
```