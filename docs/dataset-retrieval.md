# 知识库检索模块使用说明

本文档基于Dify API文档《知识库 API.md》编写，详细说明了知识库检索相关接口的使用方法和规范。

## API端点

### 检索知识库

```
POST /datasets/{dataset_id}/retrieve
```

### 获取嵌入模型列表

```
GET /workspaces/current/models/model-types/text-embedding
```

## 检索知识库

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| dataset_id | string | 是 | 知识库 ID |

### 请求参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| query | string | 是 | 检索关键词 |
| retrieval_model | object | 否 | 检索参数配置 |
| external_retrieval_model | object | 否 | 外部检索模型配置（未启用字段） |

### 检索模型配置

```typescript
{
  search_method: 'keyword_search' | 'semantic_search' | 'full_text_search' | 'hybrid_search',
  reranking_enable?: boolean,
  reranking_mode?: {
    reranking_provider_name: string,
    reranking_model_name: string
  },
  weights?: number,
  top_k?: number,
  score_threshold_enabled?: boolean,
  score_threshold?: number,
  metadata_filtering_conditions?: {
    logical_operator: 'and' | 'or',
    conditions: Array<{
      name: string,
      comparison_operator: string,
      value: string | number | null
    }>
  }
}
```

### 比较运算符说明

#### 字符串比较
- `contains`: 包含
- `not contains`: 不包含  
- `start with`: 以...开头
- `end with`: 以...结尾
- `is`: 等于
- `is not`: 不等于
- `empty`: 为空
- `not empty`: 不为空

#### 数值比较
- `=`: 等于
- `≠`: 不等于
- `>`: 大于
- `<`: 小于
- `≥`: 大于等于
- `≤`: 小于等于

#### 时间比较
- `before`: 早于
- `after`: 晚于

### 响应格式

```typescript
{
  query: {
    content: string
  },
  records: [
    {
      segment: {
        id: string,
        position: number,
        document_id: string,
        content: string,
        answer: string | null,
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
        stopped_at: number | null,
        document: {
          id: string,
          data_source_type: string,
          name: string
        }
      },
      score: number,
      tsne_position: any | null
    }
  ]
}
```

## 获取嵌入模型列表

### 响应格式

```typescript
{
  data: [
    {
      provider: string,
      label: {
        zh_Hans: string,
        en_US: string
      },
      icon_small: {
        zh_Hans: string,
        en_US: string
      },
      icon_large: {
        zh_Hans: string,
        en_US: string
      },
      status: string,
      models: [
        {
          model: string,
          label: {
            zh_Hans: string,
            en_US: string
          },
          model_type: string,
          features: any | null,
          fetch_from: string,
          model_properties: {
            context_size: number
          },
          deprecated: boolean,
          status: string,
          load_balancing_enabled: boolean
        }
      ]
    }
  ]
}
```

## 错误响应

| 状态码 | 错误码 | 描述 |
|--------|--------|------|
| 400 | invalid_param | 请求参数错误 |
| 404 | - | 知识库不存在 |
| 403 | - | 权限不足 |
| 500 | - | 服务内部异常 |

## 使用示例

### 基础检索

```typescript
import { retrieveDataset } from './retrieval';

const result = await retrieveDataset('dataset_id', {
  query: '什么是人工智能？'
});

console.log('查询内容:', result.query.content);
console.log('检索结果数量:', result.records.length);

result.records.forEach((record, index) => {
  console.log(`\n结果 ${index + 1}:`);
  console.log(`- 分段ID: ${record.segment.id}`);
  console.log(`- 文档: ${record.segment.document.name}`);
  console.log(`- 内容: ${record.segment.content.substring(0, 100)}...`);
  console.log(`- 分数: ${record.score}`);
  console.log(`- 命中次数: ${record.segment.hit_count}`);
});
```

### 高级检索配置

```typescript
import { retrieveDataset } from './retrieval';

const result = await retrieveDataset('dataset_id', {
  query: '机器学习算法',
  retrieval_model: {
    search_method: 'hybrid_search',
    reranking_enable: true,
    reranking_mode: {
      reranking_provider_name: 'zhipuai',
      reranking_model_name: 'rerank-model'
    },
    top_k: 5,
    score_threshold_enabled: true,
    score_threshold: 0.5,
    metadata_filtering_conditions: {
      logical_operator: 'and',
      conditions: [
        {
          name: 'document_name',
          comparison_operator: 'contains',
          value: '技术文档'
        },
        {
          name: 'category',
          comparison_operator: 'is',
          value: 'AI'
        }
      ]
    }
  }
});

console.log('高级检索结果:', result.records.length);
```

### 不同检索方法

```typescript
import { retrieveDataset } from './retrieval';

// 关键字检索
const keywordResult = await retrieveDataset('dataset_id', {
  query: '深度学习',
  retrieval_model: {
    search_method: 'keyword_search',
    top_k: 10
  }
});

// 语义检索
const semanticResult = await retrieveDataset('dataset_id', {
  query: '深度学习',
  retrieval_model: {
    search_method: 'semantic_search',
    reranking_enable: false,
    top_k: 5
  }
});

// 全文检索
const fullTextResult = await retrieveDataset('dataset_id', {
  query: '深度学习',
  retrieval_model: {
    search_method: 'full_text_search',
    top_k: 8
  }
});

// 混合检索
const hybridResult = await retrieveDataset('dataset_id', {
  query: '深度学习',
  retrieval_model: {
    search_method: 'hybrid_search',
    reranking_enable: true,
    weights: 0.7,
    top_k: 5
  }
});

console.log('关键字检索结果:', keywordResult.records.length);
console.log('语义检索结果:', semanticResult.records.length);
console.log('全文检索结果:', fullTextResult.records.length);
console.log('混合检索结果:', hybridResult.records.length);
```

### 元数据过滤检索

```typescript
import { retrieveDataset } from './retrieval';

// 按文档名称过滤
const nameFiltered = await retrieveDataset('dataset_id', {
  query: 'API文档',
  retrieval_model: {
    search_method: 'semantic_search',
    top_k: 10,
    metadata_filtering_conditions: {
      logical_operator: 'and',
      conditions: [
        {
          name: 'document_name',
          comparison_operator: 'contains',
          value: 'API'
        }
      ]
    }
  }
});

// 复合条件过滤
const complexFiltered = await retrieveDataset('dataset_id', {
  query: '技术规范',
  retrieval_model: {
    search_method: 'hybrid_search',
    top_k: 15,
    metadata_filtering_conditions: {
      logical_operator: 'and',
      conditions: [
        {
          name: 'category',
          comparison_operator: 'is',
          value: '技术文档'
        },
        {
          name: 'year',
          comparison_operator: '≥',
          value: 2023
        },
        {
          name: 'priority',
          comparison_operator: 'is',
          value: '高'
        }
      ]
    }
  }
});

// OR条件过滤
const orFiltered = await retrieveDataset('dataset_id', {
  query: '产品特性',
  retrieval_model: {
    search_method: 'semantic_search',
    top_k: 20,
    metadata_filtering_conditions: {
      logical_operator: 'or',
      conditions: [
        {
          name: 'category',
          comparison_operator: 'contains',
          value: '产品'
        },
        {
          name: 'category',
          comparison_operator: 'contains',
          value: '特性'
        }
      ]
    }
  }
});
```

### 获取嵌入模型列表

```typescript
import { getEmbeddingModels } from './retrieval';

const models = await getEmbeddingModels();

console.log('可用的嵌入模型提供商:');
models.data.forEach(provider => {
  console.log(`\n提供商: ${provider.label.zh_Hans} (${provider.provider})`);
  console.log(`状态: ${provider.status}`);
  
  console.log('模型列表:');
  provider.models.forEach(model => {
    console.log(`  - ${model.model}: ${model.label.zh_Hans}`);
    console.log(`    上下文大小: ${model.model_properties.context_size}`);
    console.log(`    状态: ${model.status}`);
    console.log(`    已弃用: ${model.deprecated}`);
  });
});
```

### 检索结果分析

```typescript
import { retrieveDataset } from './retrieval';

async function analyzeRetrievalResults() {
  const result = await retrieveDataset('dataset_id', {
    query: '人工智能技术',
    retrieval_model: {
      search_method: 'hybrid_search',
      top_k: 10,
      score_threshold_enabled: true,
      score_threshold: 0.3
    }
  });
  
  console.log('=== 检索结果分析 ===');
  console.log(`总检索结果: ${result.records.length} 条`);
  
  // 分析分数分布
  const scores = result.records.map(r => r.score);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  
  console.log(`平均分数: ${avgScore.toFixed(4)}`);
  console.log(`最高分数: ${maxScore.toFixed(4)}`);
  console.log(`最低分数: ${minScore.toFixed(4)}`);
  
  // 分析文档分布
  const docDistribution = {};
  result.records.forEach(record => {
    const docName = record.segment.document.name;
    docDistribution[docName] = (docDistribution[docName] || 0) + 1;
  });
  
  console.log('\n文档分布:');
  Object.entries(docDistribution).forEach(([docName, count]) => {
    console.log(`- ${docName}: ${count} 条结果`);
  });
  
  // 分析关键词
  const allKeywords = result.records.flatMap(r => r.segment.keywords);
  const keywordCount = {};
  allKeywords.forEach(keyword => {
    keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
  });
  
  console.log('\n热门关键词:');
  Object.entries(keywordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([keyword, count]) => {
      console.log(`- ${keyword}: ${count} 次`);
    });
  
  return result;
}

// 执行分析
analyzeRetrievalResults().catch(console.error);
```

### 智能检索建议

```typescript
import { retrieveDataset } from './retrieval';

async function smartSearch(query: string, datasetId: string) {
  // 首先尝试语义检索
  const semanticResult = await retrieveDataset(datasetId, {
    query,
    retrieval_model: {
      search_method: 'semantic_search',
      top_k: 5,
      score_threshold_enabled: true,
      score_threshold: 0.6
    }
  });
  
  // 如果语义检索结果不足，尝试混合检索
  if (semanticResult.records.length < 3) {
    const hybridResult = await retrieveDataset(datasetId, {
      query,
      retrieval_model: {
        search_method: 'hybrid_search',
        top_k: 10,
        reranking_enable: true,
        score_threshold_enabled: true,
        score_threshold: 0.4
      }
    });
    
    console.log('语义检索结果不足，使用混合检索补充');
    return hybridResult;
  }
  
  return semanticResult;
}

// 使用智能检索
smartSearch('深度学习框架', 'dataset_id')
  .then(result => {
    console.log('智能检索完成，获得', result.records.length, '条结果');
  })
  .catch(console.error);
```