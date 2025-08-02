// Node.js环境下的工作流流式处理实现
// 基于Dify API规范的SSE流式数据处理

import { getClient } from '../client';
import { type DifyConfig } from '../config';
import { WorkflowRequest, WorkflowStreamEvent } from '../types';
import { WorkflowError } from '../error';
import { AxiosResponse } from 'axios';

/**
 * 在Node.js环境中发送流式工作流执行请求
 * 基于Dify API的SSE流式数据格式规范
 * @param options 工作流执行选项
 * @param onEvent 接收流事件的回调函数
 * @param config 可选配置对象
 * @throws {WorkflowError} 当API调用失败时抛出错误
 */
export async function sendStreamingWorkflowNode(
  options: Omit<WorkflowRequest, 'response_mode'>,
  onEvent: (event: WorkflowStreamEvent) => void,
  config?: Partial<DifyConfig>
): Promise<void> {
  try {
    // 获取配置好的客户端
    const client = getClient(config);
    
    // 构建请求配置，严格按照Dify API规范
    const requestConfig = {
      method: 'post',
      url: '/workflows/run',
      data: {
        ...options,
        response_mode: 'streaming',
        inputs: options.inputs || {}
      },
      responseType: 'stream' as const,
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache'
      }
    };
    
    // 发送流式请求
    const response: AxiosResponse = await client(requestConfig);
    
    // 检查响应状态
    if (response.status >= 400) {
      throw new WorkflowError({
        message: `HTTP Error: ${response.status}`,
        status: response.status,
        code: response.statusText,
        details: response.data
      });
    }
    
    // 处理流式响应，基于SSE格式规范
    return new Promise<void>((resolve, reject) => {
      let buffer = '';
      let isCompleted = false;
      
      // 监听数据流
      response.data.on('data', (chunk: Buffer) => {
        if (isCompleted) return;
        
        buffer += chunk.toString();
        
        // 按照SSE规范处理：每个事件以 '\n\n' 结尾
        let lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // 保留不完整的最后一行
        
        for (const line of lines) {
          // 跳过空行和注释行
          if (!line.trim() || line.startsWith(':')) {
            continue;
          }
          
          // 解析SSE事件格式
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.substring(6));
              
              // 构造标准的事件对象
              const streamEvent: WorkflowStreamEvent = {
                event: eventData.event || 'unknown',
                workflow_run_id: eventData.workflow_run_id,
                task_id: eventData.task_id,
                data: eventData.data || null
              };
              
              // 回调处理事件
              onEvent(streamEvent);
              
              // 根据Dify API规范，处理结束事件
              if (eventData.event === 'workflow_finished' || 
                  eventData.event === 'workflow_failed' || 
                  eventData.event === 'error') {
                isCompleted = true;
                resolve();
              }
            } catch (parseError) {
              console.error('Error parsing SSE message:', parseError);
              console.error('Raw data:', line);
            }
          }
        }
      });
      
      // 监听流结束
      response.data.on('end', () => {
        if (!isCompleted) {
          console.log('Stream ended naturally');
          resolve();
        }
      });
      
      // 监听错误
      response.data.on('error', (error: any) => {
        if (!isCompleted) {
          reject(new WorkflowError(error));
        }
      });
    });
  } catch (error: any) {
    throw new WorkflowError(error);
  }
}