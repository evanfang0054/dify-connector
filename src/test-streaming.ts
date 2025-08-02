// 流式消息测试文件
// 用于测试sendStreamingMessage功能

import { sendStreamingMessage } from './index';

async function testStreamingMessage() {
  try {
    console.log('测试流式消息功能...');
    
    // 发送流式消息请求
    await sendStreamingMessage({
      query: '写一首关于技术的诗',
      user: 'test-user',
      inputs: {}
    }, (event: any) => {
      // 处理流式事件
      switch (event.event) {
        case 'message':
          // 在实际应用中，我们会在这里处理消息内容
          console.log('收到消息片段:', event.answer?.substring(0, 50) + '...');
          break;
        case 'message_end':
          console.log('消息结束');
          break;
        case 'error':
          console.log('流式处理错误:', event);
          break;
        default:
          console.log('未知事件:', event.event);
      }
    });
    
    console.log('流式消息测试完成');
  } catch (error) {
    console.error('流式消息测试失败:', error);
  }
}

// 运行测试
testStreamingMessage();