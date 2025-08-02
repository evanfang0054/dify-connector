// 测试Node.js环境下的流式处理功能

import { sendStreamingMessageNode } from './index';

async function testNodeStreaming() {
  try {
    console.log('测试Node.js环境下的流式处理功能...');
    
    // 测试流式消息
    await sendStreamingMessageNode({
      query: '写一首关于技术的诗，简短一些',
      user: 'nodejs-test-user'
    }, (event: any) => {
      switch (event.event) {
        case 'message':
          process.stdout.write(event.answer || '');
          break;
        case 'message_end':
          console.log('\n\n消息结束');
          break;
        case 'error':
          console.log('\n错误:', event);
          break;
        default:
          console.log('\n未知事件:', event.event);
      }
    });
    
    console.log('Node.js流式处理测试完成');
  } catch (error) {
    console.error('Node.js流式处理测试失败:', error);
  }
}

// 运行测试
testNodeStreaming();