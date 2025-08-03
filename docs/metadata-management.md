# 元数据管理模块使用说明

本文档基于Dify API文档《知识库 API.md》编写，详细说明了知识库元数据管理相关接口的使用方法和规范。

## API端点

### 新增元数据

```
POST /datasets/{dataset_id}/metadata
```

### 更新元数据

```
PATCH /datasets/{dataset_id}/metadata/{metadata_id}
```

### 删除元数据

```
DELETE /datasets/{dataset_id}/metadata/{metadata_id}
```

### 查询知识库元数据列表

```
GET /datasets/{dataset_id}/metadata
```

### 启用/禁用内置元数据

```
POST /datasets/{dataset_id}/metadata/built-in/{action}
```

### 更新文档元数据

```
POST /datasets/{dataset_id}/documents/metadata
```

## 新增元数据

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| type | string | 是 | 元数据类型 |
| name | string | 是 | 元数据名称 |

### 响应格式

```typescript
{
  id: string,
  type: string,
  name: string
}
```

## 更新元数据

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| metadata_id | string | 是 | 元数据 ID |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | string | 是 | 元数据名称 |

### 响应格式

```typescript
{
  id: string,
  type: string,
  name: string
}
```

## 删除元数据

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| metadata_id | string | 是 | 元数据 ID |

### 响应

成功时返回 `204 No Content`

## 查询知识库元数据列表

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |

### 响应格式

```typescript
{
  doc_metadata: [
    {
      id: string,
      name: string,
      type: string,
      use_count: number
    }
  ],
  built_in_field_enabled: boolean
}
```

## 启用/禁用内置元数据

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |
| action | string | 是 | 操作类型：`enable` 或 `disable` |

### 响应

成功时返回 `200 OK`

## 更新文档元数据

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| operation_data | array[object] | 是 | 操作数据列表 |

### 操作数据格式

```typescript
{
  document_id: string,          // 文档 ID
  metadata_list: array[object]  // 元数据列表
}
```

### 元数据列表格式

```typescript
{
  id: string,     // 元数据 ID
  value: string,  // 元数据值
  name: string    // 元数据名称
}
```

### 响应

成功时返回 `200 OK`

## 错误响应

| 状态码 | 错误码 | 描述 |
|--------|--------|------|
| 400 | invalid_param | 请求参数错误 |
| 400 | invalid_metadata | 元数据内容不正确 |
| 404 | - | 元数据不存在 |
| 403 | - | 权限不足 |
| 500 | - | 服务内部异常 |

## 使用示例

### 新增元数据

```typescript
import { createMetadata } from './metadata';

const metadata = await createMetadata('dataset_id', {
  type: 'string',
  name: 'category'
});

console.log('元数据创建成功:', metadata.id);
console.log('名称:', metadata.name);
```

### 更新元数据

```typescript
import { updateMetadata } from './metadata';

const updated = await updateMetadata('dataset_id', 'metadata_id', {
  name: 'updated_category'
});

console.log('元数据更新成功:', updated.name);
```

### 查询元数据列表

```typescript
import { getMetadataList } from './metadata';

const list = await getMetadataList('dataset_id');

console.log('元数据列表:');
list.doc_metadata.forEach(metadata => {
  console.log(`- ${metadata.name} (${metadata.type}): 使用次数 ${metadata.use_count}`);
});

console.log('内置字段启用状态:', list.built_in_field_enabled);
```

### 更新文档元数据

```typescript
import { updateDocumentsMetadata } from './metadata';

await updateDocumentsMetadata('dataset_id', {
  operation_data: [
    {
      document_id: 'document_id_1',
      metadata_list: [
        {
          id: 'metadata_id_1',
          value: '技术文档',
          name: 'category'
        },
        {
          id: 'metadata_id_2', 
          value: '2024',
          name: 'year'
        }
      ]
    },
    {
      document_id: 'document_id_2',
      metadata_list: [
        {
          id: 'metadata_id_1',
          value: '产品文档',
          name: 'category'
        }
      ]
    }
  ]
});

console.log('文档元数据更新成功');
```

### 启用/禁用内置元数据

```typescript
import { toggleBuiltInMetadata } from './metadata';

// 启用内置元数据
await toggleBuiltInMetadata('dataset_id', 'enable');
console.log('内置元数据已启用');

// 禁用内置元数据
await toggleBuiltInMetadata('dataset_id', 'disable');
console.log('内置元数据已禁用');
```

### 完整的元数据管理流程

```typescript
import { 
  createMetadata, 
  updateMetadata, 
  getMetadataList, 
  deleteMetadata,
  updateDocumentsMetadata 
} from './metadata';

async function manageMetadata() {
  const datasetId = 'dataset_id';
  
  // 1. 创建多个元数据字段
  const categoryMeta = await createMetadata(datasetId, {
    type: 'string',
    name: 'category'
  });
  
  const yearMeta = await createMetadata(datasetId, {
    type: 'string', 
    name: 'year'
  });
  
  const authorMeta = await createMetadata(datasetId, {
    type: 'string',
    name: 'author'
  });
  
  console.log('创建的元数据字段:', [categoryMeta, yearMeta, authorMeta]);
  
  // 2. 更新元数据名称
  const updatedCategory = await updateMetadata(datasetId, categoryMeta.id, {
    name: 'document_category'
  });
  console.log('更新后的名称:', updatedCategory.name);
  
  // 3. 查询元数据列表
  const metadataList = await getMetadataList(datasetId);
  console.log('当前元数据列表:', metadataList.doc_metadata);
  
  // 4. 为文档设置元数据
  await updateDocumentsMetadata(datasetId, {
    operation_data: [
      {
        document_id: 'doc_1',
        metadata_list: [
          { id: categoryMeta.id, value: '技术文档', name: 'document_category' },
          { id: yearMeta.id, value: '2024', name: 'year' },
          { id: authorMeta.id, value: '张三', name: 'author' }
        ]
      },
      {
        document_id: 'doc_2', 
        metadata_list: [
          { id: categoryMeta.id, value: '产品文档', name: 'document_category' },
          { id: yearMeta.id, value: '2024', name: 'year' }
        ]
      }
    ]
  });
  
  console.log('文档元数据设置完成');
  
  // 5. 清理（可选）
  // await deleteMetadata(datasetId, categoryMeta.id);
  // await deleteMetadata(datasetId, yearMeta.id);
  // await deleteMetadata(datasetId, authorMeta.id);
  // console.log('元数据删除完成');
}

// 执行元数据管理流程
manageMetadata().catch(console.error);
```

### 批量操作示例

```typescript
import { createMetadata, getMetadataList } from './metadata';

async function batchCreateMetadata() {
  const datasetId = 'dataset_id';
  const metadataDefinitions = [
    { type: 'string', name: 'category' },
    { type: 'string', name: 'priority' },
    { type: 'string', name: 'department' },
    { type: 'string', name: 'project' }
  ];
  
  const createdMetadata = [];
  
  // 批量创建元数据
  for (const definition of metadataDefinitions) {
    const metadata = await createMetadata(datasetId, definition);
    createdMetadata.push(metadata);
  }
  
  console.log(`成功创建 ${createdMetadata.length} 个元数据字段`);
  
  // 验证创建结果
  const metadataList = await getMetadataList(datasetId);
  console.log('当前元数据总数:', metadataList.doc_metadata.length);
  
  return createdMetadata;
}

// 执行批量创建
batchCreateMetadata().catch(console.error);
```

### 元数据查询和筛选

```typescript
import { getMetadataList } from './metadata';

async function analyzeMetadata() {
  const datasetId = 'dataset_id';
  
  // 获取元数据列表
  const metadataList = await getMetadataList(datasetId);
  
  console.log('=== 元数据分析报告 ===');
  console.log(`总元数据字段数: ${metadataList.doc_metadata.length}`);
  console.log(`内置字段启用状态: ${metadataList.built_in_field_enabled}`);
  
  // 分析每个元数据字段的使用情况
  metadataList.doc_metadata.forEach(metadata => {
    console.log(`\n字段: ${metadata.name}`);
    console.log(`类型: ${metadata.type}`);
    console.log(`使用次数: ${metadata.use_count}`);
    
    if (metadata.use_count === 0) {
      console.log('⚠️  该字段未被使用，考虑删除');
    } else if (metadata.use_count > 10) {
      console.log('🔥 该字段使用频繁，很重要');
    }
  });
  
  // 按使用频率排序
  const sortedByUsage = [...metadataList.doc_metadata].sort((a, b) => b.use_count - a.use_count);
  
  console.log('\n=== 按使用频率排序 ===');
  sortedByUsage.forEach((metadata, index) => {
    console.log(`${index + 1}. ${metadata.name}: ${metadata.use_count} 次`);
  });
}

// 执行分析
analyzeMetadata().catch(console.error);
```