import { getClient } from '../client';
import { type DifyConfig } from '../config';
import { 
  DocumentSegmentObject,
  DocumentSegmentObjectSchema
} from '../types';
import { SegmentError } from '../error';

/**
 * 创建文本段
 * @param options 创建文本段的选项
 * @param config 可选配置对象
 * @returns 创建的文本段对象
 * @throws {SegmentError} 当API调用失败时抛出错误
 */
export async function createSegment(
  options: {
    document_id: string;
    content: string;
    keyword_list?: string[];
  },
  config?: Partial<DifyConfig>
): Promise<DocumentSegmentObject> {
  try {
    const client = getClient(config);
    const response = await client.post('/segments', options);
    
    // 验证响应数据
    const validatedData = DocumentSegmentObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new SegmentError(error);
  }
}

/**
 * 获取指定文档的文本段列表
 * @param documentId 文档ID
 * @param config 可选配置对象
 * @returns 文本段对象数组
 * @throws {SegmentError} 当API调用失败时抛出错误
 */
export async function getSegments(
  documentId: string,
  config?: Partial<DifyConfig>
): Promise<DocumentSegmentObject[]> {
  try {
    const client = getClient(config);
    const response = await client.get(`/documents/${documentId}/segments`);
    
    // 验证响应数据
    const validatedData = response.data.map((item: any) => 
      DocumentSegmentObjectSchema.parse(item)
    );
    return validatedData;
  } catch (error: any) {
    throw new SegmentError(error);
  }
}

/**
 * 获取指定文本段的详细信息
 * @param segmentId 文本段ID
 * @param config 可选配置对象
 * @returns 文本段对象
 * @throws {SegmentError} 当API调用失败时抛出错误
 */
export async function getSegment(
  segmentId: string,
  config?: Partial<DifyConfig>
): Promise<DocumentSegmentObject> {
  try {
    const client = getClient(config);
    const response = await client.get(`/segments/${segmentId}`);
    
    // 验证响应数据
    const validatedData = DocumentSegmentObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new SegmentError(error);
  }
}

/**
 * 更新文本段
 * @param segmentId 文本段ID
 * @param options 更新选项
 * @param config 可选配置对象
 * @returns 更新后的文本段对象
 * @throws {SegmentError} 当API调用失败时抛出错误
 */
export async function updateSegment(
  segmentId: string,
  options: {
    content?: string;
    keyword_list?: string[];
  },
  config?: Partial<DifyConfig>
): Promise<DocumentSegmentObject> {
  try {
    const client = getClient(config);
    const response = await client.patch(`/segments/${segmentId}`, options);
    
    // 验证响应数据
    const validatedData = DocumentSegmentObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new SegmentError(error);
  }
}

/**
 * 删除文本段
 * @param segmentId 文本段ID
 * @param config 可选配置对象
 * @returns 删除操作的结果
 * @throws {SegmentError} 当API调用失败时抛出错误
 */
export async function deleteSegment(
  segmentId: string,
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getClient(config);
    const response = await client.delete(`/segments/${segmentId}`);
    
    return {
      success: true,
      message: response.data.message || '文本段删除成功'
    };
  } catch (error: any) {
    throw new SegmentError(error);
  }
}

/**
 * 批量创建文本段
 * @param options 批量创建文本段的选项
 * @param config 可选配置对象
 * @returns 创建的文本段对象数组
 * @throws {SegmentError} 当API调用失败时抛出错误
 */
export async function createSegmentsBatch(
  options: {
    document_id: string;
    segments: Array<{
      content: string;
      keyword_list?: string[];
    }>;
  },
  config?: Partial<DifyConfig>
): Promise<DocumentSegmentObject[]> {
  try {
    const client = getClient(config);
    const response = await client.post('/segments/batch', options);
    
    // 验证响应数据
    const validatedData = response.data.map((item: any) => 
      DocumentSegmentObjectSchema.parse(item)
    );
    return validatedData;
  } catch (error: any) {
    throw new SegmentError(error);
  }
}

/**
 * 批量删除文本段
 * @param options 批量删除文本段的选项
 * @param config 可选配置对象
 * @returns 删除操作的结果
 * @throws {SegmentError} 当API调用失败时抛出错误
 */
export async function deleteSegmentsBatch(
  options: {
    segment_ids: string[];
  },
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string; deleted_count: number }> {
  try {
    const client = getClient(config);
    const response = await client.post('/segments/batch/delete', options);
    
    return {
      success: true,
      message: response.data.message || '文本段批量删除成功',
      deleted_count: response.data.deleted_count || 0
    };
  } catch (error: any) {
    throw new SegmentError(error);
  }
}

/**
 * 启用文本段
 * @param segmentId 文本段ID
 * @param config 可选配置对象
 * @returns 启用后的文本段对象
 * @throws {SegmentError} 当API调用失败时抛出错误
 */
export async function enableSegment(
  segmentId: string,
  config?: Partial<DifyConfig>
): Promise<DocumentSegmentObject> {
  try {
    const client = getClient(config);
    const response = await client.post(`/segments/${segmentId}/enable`);
    
    // 验证响应数据
    const validatedData = DocumentSegmentObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new SegmentError(error);
  }
}

/**
 * 禁用文本段
 * @param segmentId 文本段ID
 * @param config 可选配置对象
 * @returns 禁用后的文本段对象
 * @throws {SegmentError} 当API调用失败时抛出错误
 */
export async function disableSegment(
  segmentId: string,
  config?: Partial<DifyConfig>
): Promise<DocumentSegmentObject> {
  try {
    const client = getClient(config);
    const response = await client.post(`/segments/${segmentId}/disable`);
    
    // 验证响应数据
    const validatedData = DocumentSegmentObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new SegmentError(error);
  }
}