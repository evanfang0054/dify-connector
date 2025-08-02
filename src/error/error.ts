import { ErrorResponse } from '../types';

/**
 * Dify API错误类
 * 标准化API错误处理
 */
export class DifyAPIError extends Error {
  public status: number | null;
  public code: string | null;
  public details: any;

  constructor(error: any) {
    // 调用父类构造函数
    super(error.message || 'Unknown error occurred');

    // 设置错误名称
    this.name = 'DifyAPIError';

    // 设置默认值
    this.status = null;
    this.code = null;
    this.details = null;

    // 如果是Axios错误
    if (error.isAxiosError && error.response) {
      const response = error.response;
      this.status = response.status;
      
      // 如果响应数据符合ErrorResponse格式
      if (response.data && typeof response.data === 'object') {
        this.code = response.data.code || null;
        this.message = response.data.message || this.message;
        this.details = response.data;
      }
    } 
    // 如果是Dify错误响应格式
    else if (error.status && error.message) {
      this.status = error.status;
      this.code = error.code || null;
      this.message = error.message;
      this.details = error;
    }

    // 保持堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DifyAPIError);
    }
  }

  /**
   * 检查是否为特定错误码
   * @param code 错误码
   * @returns 如果匹配则返回true
   */
  public isErrorCode(code: string): boolean {
    return this.code === code;
  }

  /**
   * 检查是否为特定HTTP状态码
   * @param status HTTP状态码
   * @returns 如果匹配则返回true
   */
  public isStatus(status: number): boolean {
    return this.status === status;
  }

  /**
   * 转换为字符串表示
   * @returns 错误的字符串表示
   */
  public toString(): string {
    let str = `${this.name}: ${this.message}`;
    if (this.status) {
      str += ` (Status: ${this.status})`;
    }
    if (this.code) {
      str += ` (Code: ${this.code})`;
    }
    return str;
  }
}

/**
 * 文件上传错误类
 * 专门处理文件上传相关的错误
 */
export class FileUploadError extends DifyAPIError {
  constructor(error: any) {
    super(error);
    this.name = 'FileUploadError';
  }
}

/**
 * 聊天消息错误类
 * 专门处理聊天消息相关的错误
 */
export class ChatMessageError extends DifyAPIError {
  constructor(error: any) {
    super(error);
    this.name = 'ChatMessageError';
  }
}

/**
 * 工作流执行错误类
 * 专门处理工作流执行相关的错误
 */
export class WorkflowError extends DifyAPIError {
  constructor(error: any) {
    super(error);
    this.name = 'WorkflowError';
  }
}