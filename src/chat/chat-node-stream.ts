// Node.js环境下的流式处理实现
// 使用TransformStream处理SSE流

import { getClient } from '../client';
import { ChatRequest } from '../types';
import { ChatMessageError } from '../error';
import axios, { AxiosResponse } from 'axios';

/**
 * 在Node.js环境中发送流式对话消息
 * 使用TransformStream处理SSE流
 * @param options 对话消息选项
 * @param onMessage 接收流事件的回调函数
 * @throws {ChatMessageError} 当API调用失败时抛出错误
 */
export async function sendStreamingMessageNode(
  options: Omit<ChatRequest, 'response_mode'>,
  onMessage: (event: any) => void
): Promise<void> {
  try {
    // 获取配置好的客户端
    const client = getClient();
    
    // 构建请求配置
    const config = {
      method: 'post',
      url: '/chat-messages',
      data: {
        ...options,
        response_mode: 'streaming',
        inputs: options.inputs || {}
      },
      responseType: 'stream' as const,
      headers: {
        'Authorization': client.defaults.headers.common['Authorization'],
        'Content-Type': 'application/json',
      },
    };
    
    // 发送流式请求
    const response: AxiosResponse = await client(config);
    
    // 检查响应状态
    if (response.status >= 400) {
      throw new ChatMessageError({
        message: `HTTP Error: ${response.status}`,
        status: response.status,
        code: response.statusText,
        details: response.data
      });
    }
    
    // 处理流式响应
    return new Promise<void>((resolve, reject) => {
      let buffer = '';
      
      // 监听数据流
      response.data.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        
        // 处理完整的SSE事件
        let lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // 保留不完整的最后一行
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              onMessage(data);
              
              // 如果是结束事件，则完成处理
              if (data.event === 'message_end') {
                resolve();
              }
            } catch (parseError) {
              console.error('Error parsing SSE message:', parseError);
            }
          }
        }
      });
      
      // 监听流结束
      response.data.on('end', () => {
        resolve();
      });
      
      // 监听错误
      response.data.on('error', (error: any) => {
        reject(new ChatMessageError(error));
      });
    });
  } catch (error: any) {
    throw new ChatMessageError(error);
  }
}