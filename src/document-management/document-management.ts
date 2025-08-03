import { getClient } from '../client';
import { type DifyConfig } from '../config';
import { 
  DatasetDocumentObject, 
  CreateDocumentRequest,
  DatasetDocumentObjectSchema
} from '../types';
import { DocumentError } from '../error';
import { isBuffer, isReadableStream, isFile } from '../utils';
import FormData from 'form-data';

/**
 * 创建文档
 * @param options 创建文档的选项
 * @param config 可选配置对象
 * @returns 创建的文档对象
 * @throws {DocumentError} 当API调用失败时抛出错误
 */
export async function createDocument(
  options: CreateDocumentRequest,
  config?: Partial<DifyConfig>
): Promise<DatasetDocumentObject> {
  try {
    const client = getClient(config);
    const response = await client.post('/documents', options);
    
    // 验证响应数据
    const validatedData = DatasetDocumentObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DocumentError(error);
  }
}

/**
 * 上传文件创建文档
 * @param options 上传文件创建文档的选项
 * @param config 可选配置对象
 * @returns 创建的文档对象
 * @throws {DocumentError} 当API调用失败时抛出错误
 */
export async function uploadDocument(
  options: {
    dataset_id: string;
    file: Buffer | ReadableStream | File;
    name?: string;
    description?: string;
    indexing_technique?: string;
    process_rule?: any;
  },
  config?: Partial<DifyConfig>
): Promise<DatasetDocumentObject> {
  try {
    const client = getClient(config);
    
    // 创建FormData
    const formData = new FormData();
    
    // 添加文件数据
    if (isBuffer(options.file)) {
      formData.append('file', options.file, {
        filename: options.name || 'uploaded_file',
      });
    } else if (isReadableStream(options.file)) {
      formData.append('file', options.file, {
        filename: options.name || 'uploaded_file',
      });
    } else if (isFile(options.file)) {
      // 处理浏览器环境中的File对象
      formData.append('file', options.file, options.name || 'uploaded_file');
    } else {
      throw new DocumentError({
        message: 'Unsupported file type. Supported types are Buffer, ReadableStream, and File.',
        code: 'UNSUPPORTED_FILE_TYPE',
        status: 400
      });
    }
    
    // 添加数据集ID
    formData.append('dataset_id', options.dataset_id);
    
    // 添加可选字段
    if (options.name) {
      formData.append('name', options.name);
    }
    if (options.description) {
      formData.append('description', options.description);
    }
    if (options.indexing_technique) {
      formData.append('indexing_technique', options.indexing_technique);
    }
    if (options.process_rule) {
      formData.append('process_rule', JSON.stringify(options.process_rule));
    }
    
    // 发送文件上传请求
    const response = await client.post('/documents/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    
    // 验证响应数据
    const validatedData = DatasetDocumentObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DocumentError(error);
  }
}

/**
 * 获取指定数据集的文档列表
 * @param datasetId 数据集ID
 * @param config 可选配置对象
 * @returns 文档对象数组
 * @throws {DocumentError} 当API调用失败时抛出错误
 */
export async function getDocuments(
  datasetId: string,
  config?: Partial<DifyConfig>
): Promise<DatasetDocumentObject[]> {
  try {
    const client = getClient(config);
    const response = await client.get(`/datasets/${datasetId}/documents`);
    
    // 验证响应数据
    const validatedData = response.data.map((item: any) => 
      DatasetDocumentObjectSchema.parse(item)
    );
    return validatedData;
  } catch (error: any) {
    throw new DocumentError(error);
  }
}

/**
 * 获取指定文档的详细信息
 * @param documentId 文档ID
 * @param config 可选配置对象
 * @returns 文档对象
 * @throws {DocumentError} 当API调用失败时抛出错误
 */
export async function getDocument(
  documentId: string,
  config?: Partial<DifyConfig>
): Promise<DatasetDocumentObject> {
  try {
    const client = getClient(config);
    const response = await client.get(`/documents/${documentId}`);
    
    // 验证响应数据
    const validatedData = DatasetDocumentObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DocumentError(error);
  }
}

/**
 * 更新文档
 * @param documentId 文档ID
 * @param options 更新选项
 * @param config 可选配置对象
 * @returns 更新后的文档对象
 * @throws {DocumentError} 当API调用失败时抛出错误
 */
export async function updateDocument(
  documentId: string,
  options: Partial<CreateDocumentRequest>,
  config?: Partial<DifyConfig>
): Promise<DatasetDocumentObject> {
  try {
    const client = getClient(config);
    const response = await client.patch(`/documents/${documentId}`, options);
    
    // 验证响应数据
    const validatedData = DatasetDocumentObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DocumentError(error);
  }
}

/**
 * 删除文档
 * @param documentId 文档ID
 * @param config 可选配置对象
 * @returns 删除操作的结果
 * @throws {DocumentError} 当API调用失败时抛出错误
 */
export async function deleteDocument(
  documentId: string,
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getClient(config);
    const response = await client.delete(`/documents/${documentId}`);
    
    return {
      success: true,
      message: response.data.message || '文档删除成功'
    };
  } catch (error: any) {
    throw new DocumentError(error);
  }
}

/**
 * 获取文档的文本段列表
 * @param documentId 文档ID
 * @param config 可选配置对象
 * @returns 文本段对象数组
 * @throws {DocumentError} 当API调用失败时抛出错误
 */
export async function getDocumentSegments(
  documentId: string,
  config?: Partial<DifyConfig>
): Promise<any[]> {
  try {
    const client = getClient(config);
    const response = await client.get(`/documents/${documentId}/segments`);
    
    return response.data;
  } catch (error: any) {
    throw new DocumentError(error);
  }
}