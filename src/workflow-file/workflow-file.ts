import { getClient } from '../client';
import { WorkflowFileUploadResponse } from '../types';
import { FileUploadError } from '../error';
import { isBuffer, isReadableStream, isFile } from '../utils';
import FormData from 'form-data';

/**
 * 上传文件用于工作流
 * @param options 文件上传选项
 * @returns 上传文件的响应信息
 * @throws {FileUploadError} 当API调用失败时抛出错误
 */
export async function uploadWorkflowFile(options: {
  file: Buffer | ReadableStream | File;
  filename: string;
  user: string;
}): Promise<WorkflowFileUploadResponse> {
  try {
    // 获取配置好的客户端
    const client = getClient();
    
    // 创建FormData
    const formData = new FormData();
    
    // 添加文件数据
    if (isBuffer(options.file)) {
      formData.append('file', options.file, {
        filename: options.filename,
      });
    } else if (isReadableStream(options.file)) {
      formData.append('file', options.file, {
        filename: options.filename,
      });
    } else if (isFile(options.file)) {
      // 处理浏览器环境中的File对象
      formData.append('file', options.file, options.filename);
    } else {
      throw new FileUploadError({
        message: 'Unsupported file type. Supported types are Buffer, ReadableStream, and File.',
        code: 'UNSUPPORTED_FILE_TYPE',
        status: 400
      });
    }
    
    // 添加用户标识
    formData.append('user', options.user);
    
    // 发送文件上传请求
    const response = await client.post('/files/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    
    // 验证并返回响应数据
    return response.data;
  } catch (error: any) {
    // 处理错误并转换为标准化错误
    throw new FileUploadError(error);
  }
}