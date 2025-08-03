# 知识库管理模块使用说明

本文档基于Dify API文档《知识库 API.md》编写，详细说明了知识库管理相关接口的使用方法和规范。

## API端点

### 创建知识库

```
POST /datasets
```

### 获取知识库列表

```
GET /datasets
```

### 获取知识库详情

```
GET /datasets/{dataset_id}
```

### 更新知识库

```
PATCH /datasets/{dataset_id}
```

### 删除知识库

```
DELETE /datasets/{dataset_id}
```

## 创建知识库

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | string | 是 | 知识库名称 |
| description | string | 否 | 知识库描述 |
| indexing_technique | string | 否 | 索引模式：`high_quality`（高质量）、`economy`（经济） |
| permission | string | 否 | 权限：`only_me`（仅自己）、`all_team_members`（所有团队成员）、`partial_members`（部分团队成员） |
| provider | string | 否 | Provider：`vendor`（上传文件）、`external`（外部知识库） |
| external_knowledge_api_id | string | 否 | 外部知识库 API_ID |
| external_knowledge_id | string | 否 | 外部知识库 ID |
| embedding_model | string | 否 | Embedding 模型名称 |
| embedding_model_provider | string | 否 | Embedding 模型供应商 |
| retrieval_model | object | 否 | 检索模式配置 |

### 检索模式配置

```typescript
{
  search_method: 'hybrid_search' | 'semantic_search' | 'full_text_search',
  reranking_enable: boolean,
  reranking_model?: {
    reranking_provider_name: string,
    reranking_model_name: string
  },
  top_k: number,
  score_threshold_enabled: boolean,
  score_threshold: number
}
```

### 响应格式

```typescript
{
  id: string,
  name: string,
  description: string | null,
  provider: string,
  permission: string,
  data_source_type: string | null,
  indexing_technique: string | null,
  app_count: number,
  document_count: number,
  word_count: number,
  created_by: string,
  created_at: number,
  updated_by: string,
  updated_at: number,
  embedding_model: string | null,
  embedding_model_provider: string | null,
  embedding_available: boolean | null
}
```

## 获取知识库列表

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| tag_ids | array[string] | 否 | 标签 ID 列表 |
| page | integer | 否 | 页码，默认为 1 |
| limit | string | 否 | 返回条数，默认 20，范围 1-100 |
| include_all | boolean | 否 | 是否包含所有数据集，默认为 false |

### 响应格式

```typescript
{
  data: [
    {
      id: string,
      name: string,
      description: string,
      permission: string,
      data_source_type: string,
      indexing_technique: string,
      app_count: number,
      document_count: number,
      word_count: number,
      created_by: string,
      created_at: string,
      updated_by: string,
      updated_at: string
    }
  ],
  has_more: boolean,
  limit: number,
  total: number,
  page: number
}
```

## 获取知识库详情

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |

### 响应格式

```typescript
{
  id: string,
  name: string,
  description: string,
  provider: string,
  permission: string,
  data_source_type: string | null,
  indexing_technique: string | null,
  app_count: number,
  document_count: number,
  word_count: number,
  created_by: string,
  created_at: number,
  updated_by: string,
  updated_at: number,
  embedding_model: string | null,
  embedding_model_provider: string | null,
  embedding_available: boolean,
  retrieval_model_dict: {
    search_method: string,
    reranking_enable: boolean,
    reranking_mode: string | null,
    reranking_model: {
      reranking_provider_name: string,
      reranking_model_name: string
    },
    weights: number | null,
    top_k: number,
    score_threshold_enabled: boolean,
    score_threshold: number | null
  },
  tags: array,
  doc_form: string | null,
  external_knowledge_info: {
    external_knowledge_id: string | null,
    external_knowledge_api_id: string | null,
    external_knowledge_api_name: string | null,
    external_knowledge_api_endpoint: string | null
  },
  external_retrieval_model: {
    top_k: number,
    score_threshold: number,
    score_threshold_enabled: boolean | null
  }
}
```

## 更新知识库

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| indexing_technique | string | 否 | 索引模式：`high_quality`、`economy` |
| permission | string | 否 | 权限：`only_me`、`all_team_members`、`partial_members` |
| embedding_model_provider | string | 否 | 嵌入模型提供商 |
| embedding_model | string | 否 | 嵌入模型 |
| retrieval_model | object | 否 | 检索参数配置 |
| partial_member_list | array | 否 | 部分团队成员 ID 列表 |

### 响应格式

与获取知识库详情相同，包含更新后的知识库信息。

## 删除知识库

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |

### 响应

成功时返回 `204 No Content`

## 错误响应

| 状态码 | 错误码 | 描述 |
|--------|--------|------|
| 400 | dataset_name_duplicate | 知识库名称重复 |
| 404 | - | 知识库不存在 |
| 403 | - | 权限不足 |
| 500 | - | 服务内部异常 |

## 使用示例

### 创建知识库

```typescript
import { createDataset } from './dataset';

const dataset = await createDataset({
  name: '我的知识库',
  description: '用于存储产品文档',
  indexing_technique: 'high_quality',
  permission: 'only_me',
  retrieval_model: {
    search_method: 'semantic_search',
    reranking_enable: false,
    top_k: 3,
    score_threshold_enabled: false
  }
});

console.log('知识库创建成功:', dataset.id);
```

### 获取知识库列表

```typescript
import { getDatasetList } from './dataset';

const list = await getDatasetList({
  page: 1,
  limit: 10,
  keyword: '产品'
});

console.log('知识库列表:', list.data);
console.log('总数:', list.total);
```

### 更新知识库

```typescript
import { updateDataset } from './dataset';

const updated = await updateDataset('dataset_id', {
  name: '更新后的知识库名称',
  indexing_technique: 'high_quality',
  permission: 'all_team_members'
});

console.log('知识库更新成功:', updated.name);
```

### 删除知识库

```typescript
import { deleteDataset } from './dataset';

await deleteDataset('dataset_id');
console.log('知识库删除成功');
```