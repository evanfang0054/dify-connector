import { getClient } from '../client';
import { getConfig } from '../config';
import { WorkflowRequest, WorkflowResponse, WorkflowStreamEvent } from '../types';
import { WorkflowError } from '../error';
import { fetchEventSource } from '@microsoft/fetch-event-source';

/**
 * 执行工作流
 * 支持流式和阻塞两种模式
 * @param options 工作流执行选项
 * @returns 工作流响应或流事件处理函数
 * @throws {WorkflowError} 当API调用失败时抛出错误
 */
export async function executeWorkflow(options: WorkflowRequest): Promise<WorkflowResponse | ((onEvent: (event: WorkflowStreamEvent) => void) => Promise<void>)> {
  try {
    // 获取配置好的客户端
    const client = getClient();
    
    // 根据响应模式选择处理方式
    if (options.response_mode === 'blocking') {
      // 阻塞模式 - 直接返回完整响应
      const response = await client.post('/workflows/run', options);
      return response.data;
    } else {
      // 流式模式 - 返回事件处理函数
      return async (onEvent: (event: WorkflowStreamEvent) => void) => {
        // 构建请求URL
        const url = `${client.defaults.baseURL}/workflows/run`;
        
        // 构建请求体
        const body = JSON.stringify(options);
        
        // 使用fetchEventSource处理SSE流
        await fetchEventSource(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getConfig().apiKey}`,
            'Content-Type': 'application/json',
          },
          body,
          onmessage(event) {
            try {
              // 解析事件数据
              const data = JSON.parse(event.data);
              onEvent(data);
            } catch (error) {
              console.error('Error parsing SSE message:', error);
            }
          },
          onerror(error) {
            throw new WorkflowError(error);
          },
        });
      };
    }
  } catch (error: any) {
    // 处理错误并转换为标准化错误
    throw new WorkflowError(error);
  }
}

/**
 * 执行工作流（阻塞模式）
 * @param options 工作流执行选项
 * @returns 工作流响应
 * @throws {WorkflowError} 当API调用失败时抛出错误
 */
export async function executeBlockingWorkflow(options: Omit<WorkflowRequest, 'response_mode'> & { response_mode?: 'blocking' }): Promise<WorkflowResponse> {
  return executeWorkflow({
    ...options,
    response_mode: 'blocking'
  }) as Promise<WorkflowResponse>;
}

/**
 * 执行工作流（流式模式）
 * @param options 工作流执行选项
 * @param onEvent 接收流事件的回调函数
 * @throws {WorkflowError} 当API调用失败时抛出错误
 */
export async function executeStreamingWorkflow(
  options: Omit<WorkflowRequest, 'response_mode'> & { response_mode?: 'streaming' },
  onEvent: (event: WorkflowStreamEvent) => void
): Promise<void> {
  const streamHandler = await executeWorkflow({
    ...options,
    response_mode: 'streaming'
  }) as ((onEvent: (event: WorkflowStreamEvent) => void) => Promise<void>);
  
  await streamHandler(onEvent);
}