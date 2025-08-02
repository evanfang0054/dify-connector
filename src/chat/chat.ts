import { getClient } from '../client';
import { ChatRequest, ChatResponse, ChatStreamEvent } from '../types';
import { ChatMessageError } from '../error';
import { fetchEventSource } from '@microsoft/fetch-event-source';

/**
 * 发送对话消息
 * 支持流式和阻塞两种模式
 * @param options 对话消息选项
 * @returns 对话响应或流事件处理函数
 * @throws {ChatMessageError} 当API调用失败时抛出错误
 */
export async function sendMessage(options: ChatRequest): Promise<ChatResponse | ((onMessage: (event: ChatStreamEvent) => void) => Promise<void>)> {
  try {
    // 获取配置好的客户端
    const client = getClient();
    
    // 根据响应模式选择处理方式
    if (options.response_mode === 'blocking') {
      // 阻塞模式 - 直接返回完整响应
      const response = await client.post('/chat-messages', options);
      return response.data;
    } else {
      // 流式模式 - 返回事件处理函数
      return async (onMessage: (event: ChatStreamEvent) => void) => {
        // 构建请求URL
        const url = `${client.defaults.baseURL}/chat-messages`;
        
        // 构建请求体
        const body = JSON.stringify(options);
        
        // 使用fetchEventSource处理SSE流
        await fetchEventSource(url, {
          method: 'POST',
          headers: {
            'Authorization': client.defaults.headers.common['Authorization'] as string,
            'Content-Type': 'application/json',
          },
          body,
          onmessage(event) {
            try {
              // 解析事件数据
              const data = JSON.parse(event.data);
              onMessage(data);
            } catch (error) {
              console.error('Error parsing SSE message:', error);
            }
          },
          onerror(error) {
            throw new ChatMessageError(error);
          },
        });
      };
    }
  } catch (error: any) {
    // 处理错误并转换为标准化错误
    throw new ChatMessageError(error);
  }
}

/**
 * 发送对话消息（阻塞模式）
 * @param options 对话消息选项
 * @returns 对话响应
 * @throws {ChatMessageError} 当API调用失败时抛出错误
 */
export async function sendBlockingMessage(options: Omit<ChatRequest, 'response_mode'>): Promise<ChatResponse> {
  return sendMessage({
    ...options,
    response_mode: 'blocking'
  }) as Promise<ChatResponse>;
}

/**
 * 发送对话消息（流式模式）
 * @param options 对话消息选项
 * @param onMessage 接收流事件的回调函数
 * @throws {ChatMessageError} 当API调用失败时抛出错误
 */
export async function sendStreamingMessage(
  options: Omit<ChatRequest, 'response_mode'>,
  onMessage: (event: ChatStreamEvent) => void
): Promise<void> {
  const streamHandler = await sendMessage({
    ...options,
    response_mode: 'streaming'
  }) as ((onMessage: (event: ChatStreamEvent) => void) => Promise<void>);
  
  await streamHandler(onMessage);
}