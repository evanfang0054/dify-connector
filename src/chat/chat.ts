import { getClient } from '../client';
import { getOrCreateConfig, type DifyConfig } from '../config';
import { ChatRequest, ChatResponse, ChatStreamEvent } from '../types';
import { ChatMessageError } from '../error';
import { fetchEventSource } from '@microsoft/fetch-event-source';

/**
 * 发送对话消息
 * 支持流式和阻塞两种模式
 * @param options 对话消息选项
 * @param config 可选配置对象
 * @returns 对话响应或流事件处理函数
 * @throws {ChatMessageError} 当API调用失败时抛出错误
 */
export async function sendMessage(
  options: ChatRequest, 
  config?: Partial<DifyConfig>
): Promise<ChatResponse | ((onMessage: (event: ChatStreamEvent) => void) => Promise<void>)> {
  try {
    // 获取配置好的客户端
    const client = getClient(config);
    const difyConfig = getOrCreateConfig(config);
    
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
            'Authorization': `Bearer ${difyConfig.apiKey}`,
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
 * @param config 可选配置对象
 * @returns 对话响应
 * @throws {ChatMessageError} 当API调用失败时抛出错误
 */
export async function sendBlockingMessage(
  options: Omit<ChatRequest, 'response_mode'>, 
  config?: Partial<DifyConfig>
): Promise<ChatResponse> {
  return sendMessage({
    ...options,
    response_mode: 'blocking'
  }, config) as Promise<ChatResponse>;
}

/**
 * 发送对话消息（流式模式）
 * @param options 对话消息选项
 * @param onMessage 接收流事件的回调函数
 * @param config 可选配置对象
 * @throws {ChatMessageError} 当API调用失败时抛出错误
 */
export async function sendStreamingMessage(
  options: Omit<ChatRequest, 'response_mode'>,
  onMessage: (event: ChatStreamEvent) => void,
  config?: Partial<DifyConfig>
): Promise<void> {
  const streamHandler = await sendMessage({
    ...options,
    response_mode: 'streaming'
  }, config) as ((onMessage: (event: ChatStreamEvent) => void) => Promise<void>);
  
  await streamHandler(onMessage);
}