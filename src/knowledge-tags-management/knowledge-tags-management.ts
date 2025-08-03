import { getClient } from '../client';
import { type DifyConfig } from '../config';
import { 
  KnowledgeTagObject, 
  CreateKnowledgeTagRequest,
  KnowledgeTagObjectSchema
} from '../types';
import { KnowledgeTagError } from '../error';

/**
 * 知识库标签管理模块
 * 用于管理知识库的标签系统
 */

/**
 * 创建知识库标签
 * @param options 创建标签的选项
 * @param config 可选配置对象
 * @returns 创建的标签对象
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function createKnowledgeTag(
  options: CreateKnowledgeTagRequest,
  config?: Partial<DifyConfig>
): Promise<KnowledgeTagObject> {
  try {
    const client = getClient(config);
    const response = await client.post('/knowledge-tags', options);
    
    // 验证响应数据
    const validatedData = KnowledgeTagObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 获取知识库标签列表
 * @param config 可选配置对象
 * @returns 标签对象数组
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function getKnowledgeTags(
  config?: Partial<DifyConfig>
): Promise<KnowledgeTagObject[]> {
  try {
    const client = getClient(config);
    const response = await client.get('/knowledge-tags');
    
    // 验证响应数据
    const validatedData = response.data.map((item: any) => 
      KnowledgeTagObjectSchema.parse(item)
    );
    return validatedData;
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 获取指定标签的详细信息
 * @param tagId 标签ID
 * @param config 可选配置对象
 * @returns 标签对象
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function getKnowledgeTag(
  tagId: string,
  config?: Partial<DifyConfig>
): Promise<KnowledgeTagObject> {
  try {
    const client = getClient(config);
    const response = await client.get(`/knowledge-tags/${tagId}`);
    
    // 验证响应数据
    const validatedData = KnowledgeTagObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 更新知识库标签
 * @param tagId 标签ID
 * @param options 更新选项
 * @param config 可选配置对象
 * @returns 更新后的标签对象
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function updateKnowledgeTag(
  tagId: string,
  options: Partial<CreateKnowledgeTagRequest>,
  config?: Partial<DifyConfig>
): Promise<KnowledgeTagObject> {
  try {
    const client = getClient(config);
    const response = await client.patch(`/knowledge-tags/${tagId}`, options);
    
    // 验证响应数据
    const validatedData = KnowledgeTagObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 删除知识库标签
 * @param tagId 标签ID
 * @param config 可选配置对象
 * @returns 删除操作的结果
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function deleteKnowledgeTag(
  tagId: string,
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getClient(config);
    const response = await client.delete(`/knowledge-tags/${tagId}`);
    
    return {
      success: true,
      message: response.data.message || '标签删除成功'
    };
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 为文档添加标签
 * @param options 为文档添加标签的选项
 * @param config 可选配置对象
 * @returns 添加标签的结果
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function addTagToDocument(
  options: {
    document_id: string;
    tag_id: string;
  },
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getClient(config);
    const response = await client.post(`/documents/${options.document_id}/tags`, options);
    
    return {
      success: true,
      message: response.data.message || '标签添加成功'
    };
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 为文本段添加标签
 * @param options 为文本段添加标签的选项
 * @param config 可选配置对象
 * @returns 添加标签的结果
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function addTagToSegment(
  options: {
    segment_id: string;
    tag_id: string;
  },
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getClient(config);
    const response = await client.post(`/segments/${options.segment_id}/tags`, options);
    
    return {
      success: true,
      message: response.data.message || '标签添加成功'
    };
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 从文档移除标签
 * @param options 从文档移除标签的选项
 * @param config 可选配置对象
 * @returns 移除标签的结果
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function removeTagFromDocument(
  options: {
    document_id: string;
    tag_id: string;
  },
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getClient(config);
    const response = await client.delete(`/documents/${options.document_id}/tags/${options.tag_id}`);
    
    return {
      success: true,
      message: response.data.message || '标签移除成功'
    };
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 从文本段移除标签
 * @param options 从文本段移除标签的选项
 * @param config 可选配置对象
 * @returns 移除标签的结果
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function removeTagFromSegment(
  options: {
    segment_id: string;
    tag_id: string;
  },
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getClient(config);
    const response = await client.delete(`/segments/${options.segment_id}/tags/${options.tag_id}`);
    
    return {
      success: true,
      message: response.data.message || '标签移除成功'
    };
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 获取文档的标签列表
 * @param documentId 文档ID
 * @param config 可选配置对象
 * @returns 标签对象数组
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function getDocumentTags(
  documentId: string,
  config?: Partial<DifyConfig>
): Promise<KnowledgeTagObject[]> {
  try {
    const client = getClient(config);
    const response = await client.get(`/documents/${documentId}/tags`);
    
    // 验证响应数据
    const validatedData = response.data.map((item: any) => 
      KnowledgeTagObjectSchema.parse(item)
    );
    return validatedData;
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 获取文本段的标签列表
 * @param segmentId 文本段ID
 * @param config 可选配置对象
 * @returns 标签对象数组
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function getSegmentTags(
  segmentId: string,
  config?: Partial<DifyConfig>
): Promise<KnowledgeTagObject[]> {
  try {
    const client = getClient(config);
    const response = await client.get(`/segments/${segmentId}/tags`);
    
    // 验证响应数据
    const validatedData = response.data.map((item: any) => 
      KnowledgeTagObjectSchema.parse(item)
    );
    return validatedData;
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 批量为文档添加标签
 * @param options 批量为文档添加标签的选项
 * @param config 可选配置对象
 * @returns 添加标签的结果
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function addTagsToDocumentBatch(
  options: {
    document_id: string;
    tag_ids: string[];
  },
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string; added_count: number }> {
  try {
    const client = getClient(config);
    const response = await client.post(`/documents/${options.document_id}/tags/batch`, options);
    
    return {
      success: true,
      message: response.data.message || '标签批量添加成功',
      added_count: response.data.added_count || 0
    };
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 批量为文本段添加标签
 * @param options 批量为文本段添加标签的选项
 * @param config 可选配置对象
 * @returns 添加标签的结果
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function addTagsToSegmentBatch(
  options: {
    segment_id: string;
    tag_ids: string[];
  },
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string; added_count: number }> {
  try {
    const client = getClient(config);
    const response = await client.post(`/segments/${options.segment_id}/tags/batch`, options);
    
    return {
      success: true,
      message: response.data.message || '标签批量添加成功',
      added_count: response.data.added_count || 0
    };
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 根据标签搜索文档
 * @param options 根据标签搜索文档的选项
 * @param config 可选配置对象
 * @returns 匹配的文档列表
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function searchDocumentsByTags(
  options: {
    dataset_id: string;
    tag_ids: string[];
    operator?: 'AND' | 'OR';
  },
  config?: Partial<DifyConfig>
): Promise<any[]> {
  try {
    const client = getClient(config);
    const { dataset_id, ...searchParams } = options;
    const response = await client.get(`/datasets/${dataset_id}/documents/search-by-tags`, {
      params: searchParams
    });
    
    return response.data;
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}

/**
 * 根据标签搜索文本段
 * @param options 根据标签搜索文本段的选项
 * @param config 可选配置对象
 * @returns 匹配的文本段列表
 * @throws {KnowledgeTagError} 当API调用失败时抛出错误
 */
export async function searchSegmentsByTags(
  options: {
    dataset_id: string;
    tag_ids: string[];
    operator?: 'AND' | 'OR';
  },
  config?: Partial<DifyConfig>
): Promise<any[]> {
  try {
    const client = getClient(config);
    const { dataset_id, ...searchParams } = options;
    const response = await client.get(`/datasets/${dataset_id}/segments/search-by-tags`, {
      params: searchParams
    });
    
    return response.data;
  } catch (error: any) {
    throw new KnowledgeTagError(error);
  }
}