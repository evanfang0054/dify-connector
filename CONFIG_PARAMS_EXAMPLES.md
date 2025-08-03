# 配置参数功能使用示例

本文档详细展示了如何使用 Dify 连接器新增的配置参数功能。

## 概述

从版本 1.1.0 开始，Dify 连接器支持在运行时传入配置参数，同时保持完全的向后兼容性。这使得以下场景成为可能：

- **多租户应用**：为不同租户使用不同的 Dify 实例
- **环境切换**：在开发、测试、生产环境间动态切换
- **动态配置**：从数据库或其他来源获取配置
- **A/B 测试**：同时使用不同的 API 配置进行测试

## 基本使用

### 1. 使用环境变量配置（原有方式）

```typescript
import { sendBlockingMessage } from './dist/index.js';

// 不传配置参数，自动使用环境变量
const response = await sendBlockingMessage({
  query: '你好，世界！',
  user: 'user123'
});
```

### 2. 使用参数配置（新功能）

```typescript
import { sendBlockingMessage, createConfig } from './dist/index.js';

// 创建配置对象
const config = {
  apiBaseUrl: 'https://your-dify-instance.com/v1',
  apiKey: 'your-api-key'
};

// 使用配置参数
const response = await sendBlockingMessage({
  query: '你好，世界！',
  user: 'user123'
}, config);
```

### 3. 混合使用

```typescript
import { sendBlockingMessage, uploadFile } from './dist/index.js';

// 不同的 API 调用可以使用不同的配置
const config1 = {
  apiBaseUrl: 'https://api1.dify.ai/v1',
  apiKey: 'key1'
};

const config2 = {
  apiBaseUrl: 'https://api2.dify.ai/v1',
  apiKey: 'key2'
};

// 使用 config1 发送消息
const messageResponse = await sendBlockingMessage({
  query: '消息内容',
  user: 'user123'
}, config1);

// 使用 config2 上传文件
const fileResponse = await uploadFile({
  file: fileBuffer,
  filename: 'document.pdf',
  user: 'user123'
}, config2);

// 不传配置参数，使用环境变量
const envResponse = await sendBlockingMessage({
  query: '使用环境变量',
  user: 'user123'
});
```

## 支持配置参数的函数

所有主要的 API 函数都支持可选的配置参数：

### 聊天消息模块
```typescript
// 基础消息发送
sendMessage(options, config?)

// 阻塞模式
sendBlockingMessage(options, config?)

// 流式模式（浏览器环境）
sendStreamingMessage(options, onMessage, config?)

// 流式模式（Node.js 环境）
sendStreamingMessageNode(options, onMessage, config?)
```

### 文件上传模块
```typescript
// 普通文件上传
uploadFile(options, config?)

// 工作流文件上传
uploadWorkflowFile(options, config?)
```

### 工作流模块
```typescript
// 基础工作流执行
executeWorkflow(options, config?)

// 阻塞模式工作流
executeBlockingWorkflow(options, config?)

// 流式模式工作流
executeStreamingWorkflow(options, onEvent, config?)

// Node.js 流式工作流
sendStreamingWorkflowNode(options, onEvent, config?)
```

### 知识库管理模块 (v1.2.0+)
```typescript
// 数据集管理
createDataset(options, config?)
getDatasets(config?)
getDataset(datasetId, config?)
updateDataset(datasetId, options, config?)
deleteDataset(datasetId, config?)

// 文档管理
createDocument(options, config?)
uploadDocument(options, config?)
getDocuments(datasetId, config?)
getDocument(documentId, config?)
updateDocument(documentId, options, config?)
deleteDocument(documentId, config?)

// 段落管理
createSegment(options, config?)
getSegments(datasetId, config?)
getSegment(segmentId, config?)
updateSegment(segmentId, options, config?)
deleteSegment(segmentId, config?)

// 子块管理
createChildChunk(options, config?)
getChildChunks(segmentId, config?)
getChildChunk(childChunkId, config?)
updateChildChunk(childChunkId, options, config?)
deleteChildChunk(childChunkId, config?)

// 元数据管理
addDocumentMetadata(options, config?)
addSegmentMetadata(options, config?)
getDocumentMetadata(documentId, config?)
getSegmentMetadata(segmentId, config?)
updateDocumentMetadata(options, config?)
updateSegmentMetadata(options, config?)
deleteDocumentMetadata(options, config?)
deleteSegmentMetadata(options, config?)

// 数据集检索
retrieveFromDataset(options, config?)
hybridSearch(options, config?)
advancedRetrieval(options, config?)

// 知识标签管理
createKnowledgeTag(options, config?)
getKnowledgeTags(config?)
addTagToDocument(options, config?)
```

## 配置工具函数

### 创建配置
```typescript
import { createConfig } from './dist/index.js';

const config = createConfig({
  apiBaseUrl: 'https://your-api.com/v1',
  apiKey: 'your-key'
});
```

### 获取或创建配置
```typescript
import { getOrCreateConfig } from './dist/index.js';

// 如果有配置参数就使用，否则使用环境变量
const config = getOrCreateConfig(configParam);
```

## 实际应用场景

### 1. 多租户应用
```typescript
// 为不同租户使用不同的配置
const tenantConfigs = {
  tenant1: { 
    apiBaseUrl: 'https://tenant1.dify.ai/v1', 
    apiKey: 'key1',
    timeout: 30000 // 租户特定的超时设置
  },
  tenant2: { 
    apiBaseUrl: 'https://tenant2.dify.ai/v1', 
    apiKey: 'key2',
    timeout: 60000
  }
};

// 租户请求处理器
class TenantService {
  async handleChatRequest(tenantId: string, query: string, user: string) {
    const config = tenantConfigs[tenantId];
    if (!config) {
      throw new Error(`未找到租户 ${tenantId} 的配置`);
    }
    
    return await sendBlockingMessage({ query, user }, config);
  }
  
  async handleFileUpload(tenantId: string, file: Buffer, filename: string, user: string) {
    const config = tenantConfigs[tenantId];
    if (!config) {
      throw new Error(`未找到租户 ${tenantId} 的配置`);
    }
    
    return await uploadFile({ file, filename, user }, config);
  }
}
```

### 2. 测试环境切换
```typescript
// 环境配置管理
const configs = {
  development: { 
    apiBaseUrl: 'http://localhost:8000/v1', 
    apiKey: 'dev-key' 
  },
  staging: { 
    apiBaseUrl: 'https://staging.dify.ai/v1', 
    apiKey: 'staging-key' 
  },
  production: { 
    apiBaseUrl: 'https://api.dify.ai/v1', 
    apiKey: 'prod-key' 
  }
};

// 环境感知的服务类
class DifyService {
  private currentEnv: keyof typeof configs;
  
  constructor(env: keyof typeof configs = 'development') {
    this.currentEnv = env;
  }
  
  setEnvironment(env: keyof typeof configs) {
    this.currentEnv = env;
  }
  
  async sendMessage(query: string, user: string) {
    const config = configs[this.currentEnv];
    console.log(`[${this.currentEnv}] 发送消息: ${query}`);
    
    return await sendBlockingMessage({ query, user }, config);
  }
  
  async executeWorkflow(inputs: Record<string, any>, user: string) {
    const config = configs[this.currentEnv];
    console.log(`[${this.currentEnv}] 执行工作流`);
    
    return await executeBlockingWorkflow({ inputs, user }, config);
  }
}

// 使用示例
const service = new DifyService('development');
await service.sendMessage('测试消息', 'user123');

service.setEnvironment('production');
await service.sendMessage('生产环境消息', 'user123');
```

### 3. 动态配置与缓存
```typescript
// 配置缓存管理
class ConfigManager {
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5分钟缓存
  
  async getConfig(userId: string): Promise<any> {
    const cacheKey = `user_${userId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.config;
    }
    
    // 从数据库获取配置
    const config = await this.fetchConfigFromDatabase(userId);
    
    // 缓存配置
    this.cache.set(cacheKey, {
      config,
      timestamp: Date.now()
    });
    
    return config;
  }
  
  private async fetchConfigFromDatabase(userId: string): Promise<any> {
    // 模拟数据库查询
    // 实际应用中这里会查询数据库或配置服务
    return {
      apiBaseUrl: 'https://user-specific.dify.ai/v1',
      apiKey: `user_${userId}_key`,
      timeout: 30000
    };
  }
  
  clearCache(userId?: string) {
    if (userId) {
      this.cache.delete(`user_${userId}`);
    } else {
      this.cache.clear();
    }
  }
}

// 动态配置服务
class DynamicDifyService {
  private configManager = new ConfigManager();
  
  async sendMessage(query: string, user: string) {
    const config = await this.configManager.getConfig(user);
    return await sendBlockingMessage({ query, user }, config);
  }
  
  async uploadFile(file: Buffer, filename: string, user: string) {
    const config = await this.configManager.getConfig(user);
    return await uploadFile({ file, filename, user }, config);
  }
  
  // 用户配置更新时清除缓存
  onUserConfigUpdated(userId: string) {
    this.configManager.clearCache(userId);
  }
}
```

### 4. A/B 测试和负载均衡
```typescript
// A/B 测试配置
const abTestConfigs = [
  {
    name: 'model-a',
    apiBaseUrl: 'https://model-a.dify.ai/v1',
    apiKey: 'model-a-key',
    weight: 0.5 // 50% 流量
  },
  {
    name: 'model-b',
    apiBaseUrl: 'https://model-b.dify.ai/v1',
    apiKey: 'model-b-key',
    weight: 0.5 // 50% 流量
  }
];

class ABTestService {
  private configs = abTestConfigs;
  
  // 根据权重选择配置
  private selectConfig(): any {
    const random = Math.random();
    let cumulative = 0;
    
    for (const config of this.configs) {
      cumulative += config.weight;
      if (random <= cumulative) {
        return config;
      }
    }
    
    return this.configs[this.configs.length - 1];
  }
  
  async sendMessage(query: string, user: string) {
    const config = this.selectConfig();
    console.log(`使用配置: ${config.name}`);
    
    try {
      return await sendBlockingMessage({ query, user }, config);
    } catch (error) {
      console.error(`配置 ${config.name} 调用失败:`, error);
      throw error;
    }
  }
  
  // 获取A/B测试统计
  getStats() {
    return {
      configs: this.configs.map(c => ({
        name: c.name,
        weight: c.weight
      }))
    };
  }
}
```

### 5. 故障转移和重试机制
```typescript
// 故障转移配置
const failoverConfigs = [
  {
    name: 'primary',
    apiBaseUrl: 'https://primary.dify.ai/v1',
    apiKey: 'primary-key',
    isPrimary: true
  },
  {
    name: 'secondary',
    apiBaseUrl: 'https://secondary.dify.ai/v1',
    apiKey: 'secondary-key',
    isPrimary: false
  },
  {
    name: 'backup',
    apiBaseUrl: 'https://backup.dify.ai/v1',
    apiKey: 'backup-key',
    isPrimary: false
  }
];

class FailoverService {
  private configs = failoverConfigs;
  
  async sendMessageWithFailover(query: string, user: string, maxRetries = 2) {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const config = this.selectConfig(attempt);
      
      try {
        console.log(`尝试 ${attempt + 1}: 使用 ${config.name}`);
        return await sendBlockingMessage({ query, user }, config);
      } catch (error) {
        lastError = error as Error;
        console.error(`${config.name} 调用失败:`, error.message);
        
        if (attempt < maxRetries) {
          console.log('切换到备用配置...');
          await this.delay(1000 * (attempt + 1)); // 指数退避
        }
      }
    }
    
    throw lastError || new Error('所有重试都失败了');
  }
  
  private selectConfig(attempt: number): any {
    // 首次尝试使用主配置，后续使用备用配置
    if (attempt === 0) {
      return this.configs.find(c => c.isPrimary) || this.configs[0];
    } else {
      const backupConfigs = this.configs.filter(c => !c.isPrimary);
      return backupConfigs[(attempt - 1) % backupConfigs.length];
    }
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 6. 知识库管理多实例配置 (v1.2.0+)
```typescript
// 知识库多实例配置
const knowledgeBaseConfigs = {
  // 产品文档知识库
  product_docs: {
    apiBaseUrl: 'https://product-docs.dify.ai/v1',
    apiKey: 'product-docs-key',
    datasetId: 'product-dataset-id'
  },
  // 技术支持知识库
  support_docs: {
    apiBaseUrl: 'https://support-docs.dify.ai/v1',
    apiKey: 'support-docs-key',
    datasetId: 'support-dataset-id'
  },
  // 培训材料知识库
  training_docs: {
    apiBaseUrl: 'https://training-docs.dify.ai/v1',
    apiKey: 'training-docs-key',
    datasetId: 'training-dataset-id'
  }
};

// 知识库管理服务
class KnowledgeBaseService {
  private configs = knowledgeBaseConfigs;
  
  // 在指定的知识库中检索信息
  async searchKnowledgeBase(
    baseType: keyof typeof knowledgeBaseConfigs,
    query: string,
    options: {
      top_k?: number;
      retrieve_strategy?: string;
      score_threshold?: number;
    } = {}
  ) {
    const config = this.configs[baseType];
    if (!config) {
      throw new Error(`未找到知识库配置: ${baseType}`);
    }
    
    console.log(`在 ${baseType} 知识库中搜索: ${query}`);
    
    return await retrieveFromDataset({
      query,
      dataset_id: config.datasetId,
      top_k: options.top_k || 5,
      retrieve_strategy: options.retrieve_strategy || 'semantic_search',
      score_threshold: options.score_threshold || 0.5
    }, config);
  }
  
  // 上传文档到指定知识库
  async uploadToKnowledgeBase(
    baseType: keyof typeof knowledgeBaseConfigs,
    file: Buffer,
    filename: string,
    options: {
      original_file_name?: string;
      description?: string;
    } = {}
  ) {
    const config = this.configs[baseType];
    if (!config) {
      throw new Error(`未找到知识库配置: ${baseType}`);
    }
    
    console.log(`上传文档到 ${baseType} 知识库: ${filename}`);
    
    return await uploadDocument({
      dataset_id: config.datasetId,
      file,
      filename,
      original_file_name: options.original_file_name || filename,
      description: options.description || ''
    }, config);
  }
  
  // 创建跨知识库的混合搜索
  async hybridSearchAcrossBases(
    query: string,
    baseTypes: Array<keyof typeof knowledgeBaseConfigs> = ['product_docs', 'support_docs'],
    options: {
      top_k?: number;
      semantic_weight?: number;
      fulltext_weight?: number;
    } = {}
  ) {
    const promises = baseTypes.map(async (baseType) => {
      const config = this.configs[baseType];
      if (!config) return null;
      
      try {
        return await hybridSearch({
          query,
          dataset_id: config.datasetId,
          top_k: options.top_k || 3,
          semantic_weight: options.semantic_weight || 0.6,
          fulltext_weight: options.fulltext_weight || 0.4
        }, config);
      } catch (error) {
        console.error(`${baseType} 知识库搜索失败:`, error);
        return null;
      }
    });
    
    const results = await Promise.all(promises);
    return results.filter(result => result !== null);
  }
  
  // 获取所有知识库的统计信息
  async getAllKnowledgeBaseStats() {
    const promises = Object.entries(this.configs).map(async ([baseType, config]) => {
      try {
        const dataset = await getDataset(config.datasetId, config);
        return {
          baseType,
          name: dataset.name,
          documentCount: dataset.document_count,
          wordCount: dataset.word_count,
          createdAt: dataset.created_at
        };
      } catch (error) {
        console.error(`${baseType} 知识库统计获取失败:`, error);
        return {
          baseType,
          error: '无法获取统计信息'
        };
      }
    });
    
    return await Promise.all(promises);
  }
}

// 使用示例
const kbService = new KnowledgeBaseService();

// 在产品文档中搜索
const productResults = await kbService.searchKnowledgeBase(
  'product_docs',
  '如何安装产品',
  { top_k: 3 }
);

// 上传文档到技术支持知识库
const uploadResult = await kbService.uploadToKnowledgeBase(
  'support_docs',
  fileBuffer,
  'troubleshooting-guide.pdf',
  {
    original_file_name: '故障排除指南.pdf',
    description: '常见问题故障排除指南'
  }
);

// 跨知识库混合搜索
const hybridResults = await kbService.hybridSearchAcrossBases(
  '系统性能优化',
  ['product_docs', 'support_docs'],
  { top_k: 2 }
);

// 获取所有知识库统计
const allStats = await kbService.getAllKnowledgeBaseStats();
console.log('知识库统计:', allStats);
```

## 最佳实践

### 1. 配置验证
```typescript
import { createConfig } from './dist/index.js';

// 好的做法：验证配置对象
const config = createConfig({
  apiBaseUrl: 'https://your-api.com/v1',
  apiKey: 'your-key'
});

// 检查必需的配置
if (!config.apiKey) {
  throw new Error('API 密钥是必需的');
}
```

### 2. 错误处理
```typescript
async function safeSendMessage(query: string, user: string, config?: any) {
  try {
    return await sendBlockingMessage({ query, user }, config);
  } catch (error) {
    if (error.code === 'invalid_api_key') {
      // 处理认证错误
      console.error('API 密钥无效:', error.message);
    } else if (error.status === 429) {
      // 处理限流错误
      console.error('请求过于频繁:', error.message);
    } else {
      // 处理其他错误
      console.error('发送消息失败:', error.message);
    }
    throw error;
  }
}
```

### 3. 配置管理
```typescript
// 集中配置管理
class ConfigService {
  private static instance: ConfigService;
  private configs: Map<string, any> = new Map();
  
  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }
  
  registerConfig(name: string, config: any) {
    this.configs.set(name, createConfig(config));
  }
  
  getConfig(name: string): any {
    return this.configs.get(name);
  }
  
  listConfigs(): string[] {
    return Array.from(this.configs.keys());
  }
}

// 使用示例
const configService = ConfigService.getInstance();
configService.registerConfig('production', {
  apiBaseUrl: 'https://api.dify.ai/v1',
  apiKey: 'prod-key'
});
```

## 注意事项

1. **向后兼容**：所有现有代码无需修改，不传配置参数时会自动使用环境变量
2. **配置验证**：传入的配置会经过 Zod 验证，确保格式正确
3. **优先级**：配置参数优先级高于环境变量
4. **类型安全**：所有配置参数都有完整的 TypeScript 类型定义
5. **安全性**：不要在前端代码中暴露 API 密钥，配置参数主要用于服务端
6. **性能**：频繁创建配置对象可能影响性能，建议复用配置对象

## 故障排除

### 常见问题

**Q: 配置参数不生效怎么办？**
A: 检查配置对象格式是否正确，确保包含必需的 `apiBaseUrl` 和 `apiKey` 字段。

**Q: 如何调试配置问题？**
A: 可以使用 `getOrCreateConfig()` 函数来检查配置是否正确加载：

```typescript
const config = getOrCreateConfig(yourConfig);
console.log('当前配置:', config);
```

**Q: 支持哪些配置参数？**
A: 目前支持 `apiBaseUrl` 和 `apiKey` 参数，未来可能会支持更多配置选项。

**Q: 配置参数和环境变量如何共存？**
A: 传入配置参数时优先使用参数，不传时使用环境变量，可以混合使用。