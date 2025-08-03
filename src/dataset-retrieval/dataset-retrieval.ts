import { getClient } from '../client';
import { type DifyConfig } from '../config';
import { 
  DatasetRetrievalRequest, 
  DatasetRetrievalResponse,
  DatasetRetrievalResponseSchema
} from '../types';
import { DatasetError } from '../error';

/**
 * 知识库检索模块
 * 提供对知识库数据的检索功能
 */

/**
 * 执行知识库检索
 * @param options 检索选项
 * @param config 可选配置对象
 * @returns 检索结果
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function retrieveFromDataset(
  options: DatasetRetrievalRequest,
  config?: Partial<DifyConfig>
): Promise<DatasetRetrievalResponse> {
  try {
    const client = getClient(config);
    const response = await client.post('/datasets/retrieval', options);
    
    // 验证响应数据
    const validatedData = DatasetRetrievalResponseSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}

/**
 * 执行多数据集检索
 * @param options 多数据集检索选项
 * @param config 可选配置对象
 * @returns 检索结果
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function retrieveFromMultipleDatasets(
  options: {
    query: string;
    dataset_ids: string[];
    top_k?: number;
    score_threshold?: number;
    retrieve_strategy?: 'semantic_search' | 'full_text_search' | 'hybrid_search';
  },
  config?: Partial<DifyConfig>
): Promise<DatasetRetrievalResponse> {
  try {
    const client = getClient(config);
    const response = await client.post('/datasets/multi-retrieval', options);
    
    // 验证响应数据
    const validatedData = DatasetRetrievalResponseSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}

/**
 * 执行带过滤器的知识库检索
 * @param options 带过滤器的检索选项
 * @param config 可选配置对象
 * @returns 检索结果
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function retrieveWithFilters(
  options: {
    query: string;
    dataset_id: string;
    top_k?: number;
    score_threshold?: number;
    retrieve_strategy?: 'semantic_search' | 'full_text_search' | 'hybrid_search';
    filters?: {
      document_ids?: string[];
      metadata_filters?: Array<{
        key: string;
        value: string;
        operator?: 'equals' | 'contains' | 'starts_with' | 'ends_with';
      }>;
    };
  },
  config?: Partial<DifyConfig>
): Promise<DatasetRetrievalResponse> {
  try {
    const client = getClient(config);
    const response = await client.post('/datasets/retrieval-with-filters', options);
    
    // 验证响应数据
    const validatedData = DatasetRetrievalResponseSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}

/**
 * 执行混合检索（语义搜索 + 全文搜索）
 * @param options 混合检索选项
 * @param config 可选配置对象
 * @returns 检索结果
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function hybridSearch(
  options: {
    query: string;
    dataset_id: string;
    top_k?: number;
    score_threshold?: number;
    semantic_weight?: number; // 语义搜索权重，默认0.5
    fulltext_weight?: number; // 全文搜索权重，默认0.5
    reranking_model?: {
      reranking_provider_name: string;
      reranking_model_name: string;
    };
  },
  config?: Partial<DifyConfig>
): Promise<DatasetRetrievalResponse> {
  try {
    const client = getClient(config);
    const response = await client.post('/datasets/hybrid-search', options);
    
    // 验证响应数据
    const validatedData = DatasetRetrievalResponseSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}

/**
 * 执行相似性搜索
 * @param options 相似性搜索选项
 * @param config 可选配置对象
 * @returns 检索结果
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function similaritySearch(
  options: {
    query: string;
    dataset_id: string;
    top_k?: number;
    score_threshold?: number;
    search_method?: 'semantic_search' | 'full_text_search' | 'hybrid_search';
  },
  config?: Partial<DifyConfig>
): Promise<DatasetRetrievalResponse> {
  try {
    const client = getClient(config);
    const response = await client.post('/datasets/similarity-search', options);
    
    // 验证响应数据
    const validatedData = DatasetRetrievalResponseSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}

/**
 * 获取检索统计信息
 * @param options 统计信息查询选项
 * @param config 可选配置对象
 * @returns 检索统计信息
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function getRetrievalStats(
  options: {
    dataset_id: string;
    start_time?: number;
    end_time?: number;
  },
  config?: Partial<DifyConfig>
): Promise<{
  total_queries: number;
  average_score: number;
  top_queries: Array<{
    query: string;
    count: number;
    average_score: number;
  }>;
  document_hit_counts: Array<{
    document_id: string;
    document_name: string;
    hit_count: number;
  }>;
}> {
  try {
    const client = getClient(config);
    const response = await client.get(`/datasets/${options.dataset_id}/retrieval-stats`, {
      params: {
        start_time: options.start_time,
        end_time: options.end_time,
      },
    });
    
    return response.data;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}

/**
 * 获取检索建议
 * @param options 检索建议选项
 * @param config 可选配置对象
 * @returns 检索建议
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function getRetrievalSuggestions(
  options: {
    query: string;
    dataset_id: string;
    limit?: number;
  },
  config?: Partial<DifyConfig>
): Promise<{
  suggestions: Array<{
    text: string;
    score: number;
  }>;
}> {
  try {
    const client = getClient(config);
    const response = await client.get(`/datasets/${options.dataset_id}/retrieval-suggestions`, {
      params: {
        query: options.query,
        limit: options.limit || 5,
      },
    });
    
    return response.data;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}

/**
 * 执行高级检索
 * @param options 高级检索选项
 * @param config 可选配置对象
 * @returns 检索结果
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function advancedRetrieval(
  options: {
    query: string;
    dataset_id: string;
    top_k?: number;
    score_threshold?: number;
    retrieve_strategy?: 'semantic_search' | 'full_text_search' | 'hybrid_search';
    reranking_enable?: boolean;
    reranking_model?: {
      reranking_provider_name: string;
      reranking_model_name: string;
    };
    filters?: {
      document_ids?: string[];
      segment_ids?: string[];
      metadata_filters?: Array<{
        key: string;
        value: string;
        operator?: 'equals' | 'contains' | 'starts_with' | 'ends_with';
      }>;
    };
    boost_fields?: Array<{
      field_name: string;
      boost_factor: number;
    }>;
  },
  config?: Partial<DifyConfig>
): Promise<DatasetRetrievalResponse> {
  try {
    const client = getClient(config);
    const response = await client.post('/datasets/advanced-retrieval', options);
    
    // 验证响应数据
    const validatedData = DatasetRetrievalResponseSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}