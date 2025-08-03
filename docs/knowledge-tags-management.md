# 知识库标签管理模块使用说明

本文档基于Dify API文档《知识库 API.md》编写，详细说明了知识库标签管理相关接口的使用方法和规范。

## API端点

### 新增知识库类型标签

```
POST /datasets/tags
```

### 获取知识库类型标签

```
GET /datasets/tags
```

### 修改知识库类型标签名称

```
PATCH /datasets/tags
```

### 删除知识库类型标签

```
DELETE /datasets/tags
```

### 绑定知识库到知识库类型标签

```
POST /datasets/tags/binding
```

### 解绑知识库和知识库类型标签

```
POST /datasets/tags/unbinding
```

### 查询知识库已绑定的标签

```
POST /datasets/{dataset_id}/tags
```

## 新增知识库类型标签

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | string | 是 | 新标签名称，最大长度为50 |

### 响应格式

```typescript
{
  id: string,
  name: string,
  type: string,
  binding_count: number
}
```

## 获取知识库类型标签

### 响应格式

```typescript
[
  {
    id: string,
    name: string,
    type: string,
    binding_count: number
  }
]
```

## 修改知识库类型标签名称

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | string | 是 | 修改后的标签名称，最大长度为50 |
| tag_id | string | 是 | 标签 ID |

### 响应格式

```typescript
{
  id: string,
  name: string,
  type: string,
  binding_count: number
}
```

## 删除知识库类型标签

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| tag_id | string | 是 | 标签 ID |

### 响应格式

```typescript
{
  result: 'success'
}
```

## 绑定知识库到知识库类型标签

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| tag_ids | array[string] | 是 | 标签 ID 列表 |
| target_id | string | 是 | 知识库 ID |

### 响应格式

```typescript
{
  result: 'success'
}
```

## 解绑知识库和知识库类型标签

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| tag_id | string | 是 | 标签 ID |
| target_id | string | 是 | 知识库 ID |

### 响应格式

```typescript
{
  result: 'success'
}
```

## 查询知识库已绑定的标签

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |

### 响应格式

```typescript
{
  data: [
    {
      id: string,
      name: string
    }
  ],
  total: number
}
```

## 错误响应

| 状态码 | 错误码 | 描述 |
|--------|--------|------|
| 400 | invalid_param | 请求参数错误 |
| 404 | - | 标签不存在 |
| 403 | - | 权限不足 |
| 500 | - | 服务内部异常 |

## 使用示例

### 新增知识库类型标签

```typescript
import { createKnowledgeTag } from './knowledge-tags';

const tag = await createKnowledgeTag({
  name: '技术文档'
});

console.log('标签创建成功:', tag.id);
console.log('标签名称:', tag.name);
console.log('绑定数量:', tag.binding_count);
```

### 获取知识库类型标签

```typescript
import { getKnowledgeTags } from './knowledge-tags';

const tags = await getKnowledgeTags();

console.log('知识库标签列表:');
tags.forEach(tag => {
  console.log(`- ${tag.name} (${tag.id}): 绑定 ${tag.binding_count} 个知识库`);
});
```

### 修改知识库类型标签名称

```typescript
import { updateKnowledgeTag } from './knowledge-tags';

const updated = await updateKnowledgeTag({
  name: '更新后的标签名称',
  tag_id: 'tag_id'
});

console.log('标签更新成功:', updated.name);
```

### 删除知识库类型标签

```typescript
import { deleteKnowledgeTag } from './knowledge-tags';

const result = await deleteKnowledgeTag({
  tag_id: 'tag_id'
});

console.log('标签删除结果:', result.result);
```

### 绑定知识库到标签

```typescript
import { bindDatasetToTags } from './knowledge-tags';

const result = await bindDatasetToTags({
  tag_ids: ['tag_id_1', 'tag_id_2'],
  target_id: 'dataset_id'
});

console.log('绑定结果:', result.result);
```

### 解绑知识库和标签

```typescript
import { unbindDatasetFromTag } from './knowledge-tags';

const result = await unbindDatasetFromTag({
  tag_id: 'tag_id',
  target_id: 'dataset_id'
});

console.log('解绑结果:', result.result);
```

### 查询知识库已绑定的标签

```typescript
import { getDatasetTags } from './knowledge-tags';

const result = await getDatasetTags('dataset_id');

console.log('知识库绑定的标签:');
result.data.forEach(tag => {
  console.log(`- ${tag.name} (${tag.id})`);
});

console.log('总标签数:', result.total);
```

### 完整的标签管理流程

```typescript
import {
  createKnowledgeTag,
  getKnowledgeTags,
  updateKnowledgeTag,
  bindDatasetToTags,
  getDatasetTags,
  unbindDatasetFromTag,
  deleteKnowledgeTag
} from './knowledge-tags';

async function manageKnowledgeTags() {
  // 1. 创建多个标签
  const techTag = await createKnowledgeTag({ name: '技术文档' });
  const productTag = await createKnowledgeTag({ name: '产品文档' });
  const apiTag = await createKnowledgeTag({ name: 'API文档' });
  
  console.log('创建的标签:', [techTag, productTag, apiTag]);
  
  // 2. 获取所有标签
  const allTags = await getKnowledgeTags();
  console.log('当前所有标签:', allTags);
  
  // 3. 更新标签名称
  const updatedTag = await updateKnowledgeTag({
    name: '技术规范文档',
    tag_id: techTag.id
  });
  console.log('更新后的标签:', updatedTag.name);
  
  // 4. 绑定知识库到标签
  const datasetId = 'dataset_id';
  await bindDatasetToTags({
    tag_ids: [techTag.id, productTag.id],
    target_id: datasetId
  });
  console.log('知识库绑定标签完成');
  
  // 5. 查询知识库绑定的标签
  const boundTags = await getDatasetTags(datasetId);
  console.log('知识库绑定的标签:', boundTags.data);
  
  // 6. 解绑某个标签
  await unbindDatasetFromTag({
    tag_id: techTag.id,
    target_id: datasetId
  });
  console.log('解绑标签完成');
  
  // 7. 验证解绑结果
  const remainingTags = await getDatasetTags(datasetId);
  console.log('剩余的标签:', remainingTags.data);
  
  // 8. 清理（可选）
  // await deleteKnowledgeTag({ tag_id: techTag.id });
  // await deleteKnowledgeTag({ tag_id: productTag.id });
  // await deleteKnowledgeTag({ tag_id: apiTag.id });
  // console.log('标签清理完成');
}

// 执行标签管理流程
manageKnowledgeTags().catch(console.error);
```

### 批量操作示例

```typescript
import { createKnowledgeTag, getKnowledgeTags, bindDatasetToTags } from './knowledge-tags';

async function batchTagManagement() {
  // 批量创建标签
  const tagNames = ['前端文档', '后端文档', '数据库文档', '运维文档', '测试文档'];
  const createdTags = [];
  
  for (const name of tagNames) {
    const tag = await createKnowledgeTag({ name });
    createdTags.push(tag);
  }
  
  console.log(`批量创建 ${createdTags.length} 个标签`);
  
  // 为多个知识库批量绑定标签
  const datasetIds = ['dataset_1', 'dataset_2', 'dataset_3'];
  const frontendTag = createdTags.find(t => t.name === '前端文档');
  const backendTag = createdTags.find(t => t.name === '后端文档');
  
  for (const datasetId of datasetIds) {
    await bindDatasetToTags({
      tag_ids: [frontendTag.id, backendTag.id],
      target_id: datasetId
    });
    console.log(`知识库 ${datasetId} 标签绑定完成`);
  }
  
  // 验证绑定结果
  const allTags = await getKnowledgeTags();
  allTags.forEach(tag => {
    console.log(`${tag.name}: 绑定 ${tag.binding_count} 个知识库`);
  });
}

// 执行批量操作
batchTagManagement().catch(console.error);
```

### 标签分类和管理

```typescript
import { createKnowledgeTag, getKnowledgeTags, bindDatasetToTags } from './knowledge-tags';

async function organizeTagsByCategory() {
  // 按类别创建标签
  const tagCategories = {
    '技术领域': ['前端开发', '后端开发', '移动开发', 'DevOps'],
    '文档类型': ['API文档', '用户手册', '开发指南', '部署文档'],
    '项目阶段': ['需求分析', '设计文档', '开发文档', '测试文档'],
    '业务领域': ['金融科技', '电商平台', '企业管理', '教育培训']
  };
  
  const createdTags = {};
  
  // 批量创建标签
  for (const [category, names] of Object.entries(tagCategories)) {
    createdTags[category] = [];
    
    for (const name of names) {
      const tag = await createKnowledgeTag({ name });
      createdTags[category].push(tag);
    }
    
    console.log(`${category}类别创建 ${createdTags[category].length} 个标签`);
  }
  
  // 模拟为不同类型知识库分配标签
  const datasetCategories = {
    'web_project': ['前端开发', '后端开发', 'API文档'],
    'mobile_app': ['移动开发', '用户手册', '开发指南'],
    'fintech_system': ['金融科技', 'API文档', '部署文档'],
    'ecommerce_platform': ['电商平台', '测试文档', '部署文档']
  };
  
  for (const [datasetId, tagNames] of Object.entries(datasetCategories)) {
    const tagIds = [];
    
    // 查找对应的标签ID
    for (const categoryName of Object.keys(createdTags)) {
      const tags = createdTags[categoryName];
      const matchingTags = tags.filter(tag => tagNames.includes(tag.name));
      tagIds.push(...matchingTags.map(t => t.id));
    }
    
    await bindDatasetToTags({
      tag_ids: tagIds,
      target_id: datasetId
    });
    
    console.log(`知识库 ${datasetId} 绑定 ${tagIds.length} 个标签`);
  }
  
  // 分析标签使用情况
  const allTags = await getKnowledgeTags();
  console.log('\n=== 标签使用情况分析 ===');
  
  const sortedByUsage = allTags.sort((a, b) => b.binding_count - a.binding_count);
  
  console.log('最常用的标签 (Top 10):');
  sortedByUsage.slice(0, 10).forEach((tag, index) => {
    console.log(`${index + 1}. ${tag.name}: ${tag.binding_count} 个知识库`);
  });
  
  console.log('\n未使用的标签:');
  const unusedTags = allTags.filter(tag => tag.binding_count === 0);
  unusedTags.forEach(tag => {
    console.log(`- ${tag.name}`);
  });
}

// 执行标签组织
organizeTagsByCategory().catch(console.error);
```

### 标签搜索和筛选

```typescript
import { getKnowledgeTags, getDatasetTags } from './knowledge-tags';

async function searchAndFilterTags() {
  // 获取所有标签
  const allTags = await getKnowledgeTags();
  
  console.log('=== 标签搜索和筛选功能 ===');
  
  // 按名称搜索标签
  const searchTerm = '文档';
  const matchingTags = allTags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  console.log(`\n包含"${searchTerm}"的标签:`);
  matchingTags.forEach(tag => {
    console.log(`- ${tag.name} (绑定 ${tag.binding_count} 个知识库)`);
  });
  
  // 按绑定数量筛选
  console.log('\n按绑定数量分类:');
  const popularTags = allTags.filter(tag => tag.binding_count >= 5);
  const normalTags = allTags.filter(tag => tag.binding_count > 0 && tag.binding_count < 5);
  const unusedTags = allTags.filter(tag => tag.binding_count === 0);
  
  console.log(`热门标签 (≥5个知识库): ${popularTags.length} 个`);
  console.log(`普通标签 (1-4个知识库): ${normalTags.length} 个`);
  console.log(`未使用标签: ${unusedTags.length} 个`);
  
  // 查询特定知识库的标签
  const datasetId = 'dataset_id';
  const datasetTags = await getDatasetTags(datasetId);
  
  console.log(`\n知识库 ${datasetId} 的标签 (${datasetTags.total} 个):`);
  datasetTags.data.forEach(tag => {
    console.log(`- ${tag.name}`);
  });
  
  // 标签使用统计
  console.log('\n标签使用统计:');
  const totalBindings = allTags.reduce((sum, tag) => sum + tag.binding_count, 0);
  const avgBindings = totalBindings / allTags.length;
  
  console.log(`总绑定次数: ${totalBindings}`);
  console.log(`平均每个标签绑定: ${avgBindings.toFixed(1)} 个知识库`);
  console.log(`标签总数: ${allTags.length}`);
}

// 执行搜索和筛选
searchAndFilterTags().catch(console.error);
```