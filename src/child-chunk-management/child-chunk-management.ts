import { getClient } from '../client';
import { type DifyConfig } from '../config';
import { ChildChunkError } from '../error';

/**
 * 子块对象类型
 */
export interface ChildChunkObject {
  id: string;
  segment_id: string;
  content: string;
  position: number;
  word_count: number;
  tokens: number;
  keyword_list?: string[];
  created_at: number;
  updated_at: number;
  status: 'waiting' | 'indexing' | 'completed' | 'failed';
}

/**
 * 创建子块请求类型
 */
export interface CreateChildChunkRequest {
  segment_id: string;
  content: string;
  keyword_list?: string[];
}

/**
 * 创建子块
 * @param options 创建子块的选项
 * @param config 可选配置对象
 * @returns 创建的子块对象
 * @throws {ChildChunkError} 当API调用失败时抛出错误
 */
export async function createChildChunk(
  options: CreateChildChunkRequest,
  config?: Partial<DifyConfig>
): Promise<ChildChunkObject> {
  try {
    const client = getClient(config);
    const response = await client.post('/child-chunks', options);
    
    return response.data;
  } catch (error: any) {
    throw new ChildChunkError(error);
  }
}

/**
 * 获取指定文本段的子块列表
 * @param segmentId 文本段ID
 * @param config 可选配置对象
 * @returns 子块对象数组
 * @throws {ChildChunkError} 当API调用失败时抛出错误
 */
export async function getChildChunks(
  segmentId: string,
  config?: Partial<DifyConfig>
): Promise<ChildChunkObject[]> {
  try {
    const client = getClient(config);
    const response = await client.get(`/segments/${segmentId}/child-chunks`);
    
    return response.data;
  } catch (error: any) {
    throw new ChildChunkError(error);
  }
}

/**
 * 获取指定子块的详细信息
 * @param childChunkId 子块ID
 * @param config 可选配置对象
 * @returns 子块对象
 * @throws {ChildChunkError} 当API调用失败时抛出错误
 */
export async function getChildChunk(
  childChunkId: string,
  config?: Partial<DifyConfig>
): Promise<ChildChunkObject> {
  try {
    const client = getClient(config);
    const response = await client.get(`/child-chunks/${childChunkId}`);
    
    return response.data;
  } catch (error: any) {
    throw new ChildChunkError(error);
  }
}

/**
 * 更新子块
 * @param childChunkId 子块ID
 * @param options 更新选项
 * @param config 可选配置对象
 * @returns 更新后的子块对象
 * @throws {ChildChunkError} 当API调用失败时抛出错误
 */
export async function updateChildChunk(
  childChunkId: string,
  options: {
    content?: string;
    keyword_list?: string[];
  },
  config?: Partial<DifyConfig>
): Promise<ChildChunkObject> {
  try {
    const client = getClient(config);
    const response = await client.patch(`/child-chunks/${childChunkId}`, options);
    
    return response.data;
  } catch (error: any) {
    throw new ChildChunkError(error);
  }
}

/**
 * 删除子块
 * @param childChunkId 子块ID
 * @param config 可选配置对象
 * @returns 删除操作的结果
 * @throws {ChildChunkError} 当API调用失败时抛出错误
 */
export async function deleteChildChunk(
  childChunkId: string,
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getClient(config);
    const response = await client.delete(`/child-chunks/${childChunkId}`);
    
    return {
      success: true,
      message: response.data.message || '子块删除成功'
    };
  } catch (error: any) {
    throw new ChildChunkError(error);
  }
}

/**
 * 批量创建子块
 * @param options 批量创建子块的选项
 * @param config 可选配置对象
 * @returns 创建的子块对象数组
 * @throws {ChildChunkError} 当API调用失败时抛出错误
 */
export async function createChildChunksBatch(
  options: {
    segment_id: string;
    child_chunks: Array<{
      content: string;
      keyword_list?: string[];
    }>;
  },
  config?: Partial<DifyConfig>
): Promise<ChildChunkObject[]> {
  try {
    const client = getClient(config);
    const response = await client.post('/child-chunks/batch', options);
    
    return response.data;
  } catch (error: any) {
    throw new ChildChunkError(error);
  }
}

/**
 * 批量删除子块
 * @param options 批量删除子块的选项
 * @param config 可选配置对象
 * @returns 删除操作的结果
 * @throws {ChildChunkError} 当API调用失败时抛出错误
 */
export async function deleteChildChunksBatch(
  options: {
    child_chunk_ids: string[];
  },
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string; deleted_count: number }> {
  try {
    const client = getClient(config);
    const response = await client.post('/child-chunks/batch/delete', options);
    
    return {
      success: true,
      message: response.data.message || '子块批量删除成功',
      deleted_count: response.data.deleted_count || 0
    };
  } catch (error: any) {
    throw new ChildChunkError(error);
  }
}

/**
 * 启用子块
 * @param childChunkId 子块ID
 * @param config 可选配置对象
 * @returns 启用后的子块对象
 * @throws {ChildChunkError} 当API调用失败时抛出错误
 */
export async function enableChildChunk(
  childChunkId: string,
  config?: Partial<DifyConfig>
): Promise<ChildChunkObject> {
  try {
    const client = getClient(config);
    const response = await client.post(`/child-chunks/${childChunkId}/enable`);
    
    return response.data;
  } catch (error: any) {
    throw new ChildChunkError(error);
  }
}

/**
 * 禁用子块
 * @param childChunkId 子块ID
 * @param config 可选配置对象
 * @returns 禁用后的子块对象
 * @throws {ChildChunkError} 当API调用失败时抛出错误
 */
export async function disableChildChunk(
  childChunkId: string,
  config?: Partial<DifyConfig>
): Promise<ChildChunkObject> {
  try {
    const client = getClient(config);
    const response = await client.post(`/child-chunks/${childChunkId}/disable`);
    
    return response.data;
  } catch (error: any) {
    throw new ChildChunkError(error);
  }
}