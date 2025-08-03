import { getClient } from '../client';
import { type DifyConfig } from '../config';
import { Metadata, MetadataSchema } from '../types';
import { MetadataError } from '../error';

/**
 * 元数据管理模块
 * 用于管理知识库文档和文本段的元数据
 */

/**
 * 为文档添加元数据
 * @param options 添加元数据的选项
 * @param config 可选配置对象
 * @returns 添加的元数据对象
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function addDocumentMetadata(
  options: {
    document_id: string;
    key: string;
    value: string;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  },
  config?: Partial<DifyConfig>
): Promise<Metadata> {
  try {
    const client = getClient(config);
    const response = await client.post(`/documents/${options.document_id}/metadata`, options);
    
    // 验证响应数据
    const validatedData = MetadataSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new MetadataError(error);
  }
}

/**
 * 为文本段添加元数据
 * @param options 添加元数据的选项
 * @param config 可选配置对象
 * @returns 添加的元数据对象
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function addSegmentMetadata(
  options: {
    segment_id: string;
    key: string;
    value: string;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  },
  config?: Partial<DifyConfig>
): Promise<Metadata> {
  try {
    const client = getClient(config);
    const response = await client.post(`/segments/${options.segment_id}/metadata`, options);
    
    // 验证响应数据
    const validatedData = MetadataSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new MetadataError(error);
  }
}

/**
 * 获取文档的元数据列表
 * @param documentId 文档ID
 * @param config 可选配置对象
 * @returns 元数据对象数组
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function getDocumentMetadata(
  documentId: string,
  config?: Partial<DifyConfig>
): Promise<Metadata[]> {
  try {
    const client = getClient(config);
    const response = await client.get(`/documents/${documentId}/metadata`);
    
    // 验证响应数据
    const validatedData = response.data.map((item: any) => 
      MetadataSchema.parse(item)
    );
    return validatedData;
  } catch (error: any) {
    throw new MetadataError(error);
  }
}

/**
 * 获取文本段的元数据列表
 * @param segmentId 文本段ID
 * @param config 可选配置对象
 * @returns 元数据对象数组
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function getSegmentMetadata(
  segmentId: string,
  config?: Partial<DifyConfig>
): Promise<Metadata[]> {
  try {
    const client = getClient(config);
    const response = await client.get(`/segments/${segmentId}/metadata`);
    
    // 验证响应数据
    const validatedData = response.data.map((item: any) => 
      MetadataSchema.parse(item)
    );
    return validatedData;
  } catch (error: any) {
    throw new MetadataError(error);
  }
}

/**
 * 更新文档元数据
 * @param options 更新元数据的选项
 * @param config 可选配置对象
 * @returns 更新后的元数据对象
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function updateDocumentMetadata(
  options: {
    document_id: string;
    metadata_id: string;
    key?: string;
    value?: string;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  },
  config?: Partial<DifyConfig>
): Promise<Metadata> {
  try {
    const client = getClient(config);
    const { document_id, metadata_id, ...updateData } = options;
    const response = await client.patch(`/documents/${document_id}/metadata/${metadata_id}`, updateData);
    
    // 验证响应数据
    const validatedData = MetadataSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new MetadataError(error);
  }
}

/**
 * 更新文本段元数据
 * @param options 更新元数据的选项
 * @param config 可选配置对象
 * @returns 更新后的元数据对象
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function updateSegmentMetadata(
  options: {
    segment_id: string;
    metadata_id: string;
    key?: string;
    value?: string;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  },
  config?: Partial<DifyConfig>
): Promise<Metadata> {
  try {
    const client = getClient(config);
    const { segment_id, metadata_id, ...updateData } = options;
    const response = await client.patch(`/segments/${segment_id}/metadata/${metadata_id}`, updateData);
    
    // 验证响应数据
    const validatedData = MetadataSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new MetadataError(error);
  }
}

/**
 * 删除文档元数据
 * @param options 删除元数据的选项
 * @param config 可选配置对象
 * @returns 删除操作的结果
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function deleteDocumentMetadata(
  options: {
    document_id: string;
    metadata_id: string;
  },
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getClient(config);
    const response = await client.delete(`/documents/${options.document_id}/metadata/${options.metadata_id}`);
    
    return {
      success: true,
      message: response.data.message || '文档元数据删除成功'
    };
  } catch (error: any) {
    throw new MetadataError(error);
  }
}

/**
 * 删除文本段元数据
 * @param options 删除元数据的选项
 * @param config 可选配置对象
 * @returns 删除操作的结果
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function deleteSegmentMetadata(
  options: {
    segment_id: string;
    metadata_id: string;
  },
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getClient(config);
    const response = await client.delete(`/segments/${options.segment_id}/metadata/${options.metadata_id}`);
    
    return {
      success: true,
      message: response.data.message || '文本段元数据删除成功'
    };
  } catch (error: any) {
    throw new MetadataError(error);
  }
}

/**
 * 批量添加文档元数据
 * @param options 批量添加元数据的选项
 * @param config 可选配置对象
 * @returns 添加的元数据对象数组
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function addDocumentMetadataBatch(
  options: {
    document_id: string;
    metadata: Array<{
      key: string;
      value: string;
      type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    }>;
  },
  config?: Partial<DifyConfig>
): Promise<Metadata[]> {
  try {
    const client = getClient(config);
    const response = await client.post(`/documents/${options.document_id}/metadata/batch`, options);
    
    // 验证响应数据
    const validatedData = response.data.map((item: any) => 
      MetadataSchema.parse(item)
    );
    return validatedData;
  } catch (error: any) {
    throw new MetadataError(error);
  }
}

/**
 * 批量添加文本段元数据
 * @param options 批量添加元数据的选项
 * @param config 可选配置对象
 * @returns 添加的元数据对象数组
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function addSegmentMetadataBatch(
  options: {
    segment_id: string;
    metadata: Array<{
      key: string;
      value: string;
      type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    }>;
  },
  config?: Partial<DifyConfig>
): Promise<Metadata[]> {
  try {
    const client = getClient(config);
    const response = await client.post(`/segments/${options.segment_id}/metadata/batch`, options);
    
    // 验证响应数据
    const validatedData = response.data.map((item: any) => 
      MetadataSchema.parse(item)
    );
    return validatedData;
  } catch (error: any) {
    throw new MetadataError(error);
  }
}

/**
 * 根据元数据键值对搜索文档
 * @param options 搜索选项
 * @param config 可选配置对象
 * @returns 匹配的文档列表
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function searchDocumentsByMetadata(
  options: {
    dataset_id: string;
    metadata_key: string;
    metadata_value: string;
    operator?: 'equals' | 'contains' | 'starts_with' | 'ends_with';
  },
  config?: Partial<DifyConfig>
): Promise<any[]> {
  try {
    const client = getClient(config);
    const { dataset_id, ...searchParams } = options;
    const response = await client.get(`/datasets/${dataset_id}/documents/search-by-metadata`, {
      params: searchParams
    });
    
    return response.data;
  } catch (error: any) {
    throw new MetadataError(error);
  }
}

/**
 * 根据元数据键值对搜索文本段
 * @param options 搜索选项
 * @param config 可选配置对象
 * @returns 匹配的文本段列表
 * @throws {MetadataError} 当API调用失败时抛出错误
 */
export async function searchSegmentsByMetadata(
  options: {
    dataset_id: string;
    metadata_key: string;
    metadata_value: string;
    operator?: 'equals' | 'contains' | 'starts_with' | 'ends_with';
  },
  config?: Partial<DifyConfig>
): Promise<any[]> {
  try {
    const client = getClient(config);
    const { dataset_id, ...searchParams } = options;
    const response = await client.get(`/datasets/${dataset_id}/segments/search-by-metadata`, {
      params: searchParams
    });
    
    return response.data;
  } catch (error: any) {
    throw new MetadataError(error);
  }
}