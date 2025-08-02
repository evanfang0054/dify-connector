// 使用示例 - Dify API连接器

// 1. 配置环境变量
// 在项目根目录创建 .env 文件并设置：
// API_BASE_URL=https://api.dify.ai/v1
// API_KEY=your-api-key-here

import { 
  uploadFile,
  sendBlockingMessage,
  sendStreamingMessage,
  uploadWorkflowFile,
  executeBlockingWorkflow,
  executeStreamingWorkflow
} from './index';
import * as fs from 'fs';

async function example() {
  try {
    // 示例1: 发送简单的聊天消息（阻塞模式）
    console.log('示例1: 发送简单的聊天消息...');
    const chatResponse = await sendBlockingMessage({
      query: '你好！',
      user: 'user123',
      inputs: {}
    });
    console.log('聊天响应:', chatResponse.answer);

    // 示例2: 上传文件并用于聊天
    console.log('\n示例2: 上传文件并用于聊天...');
    // 注意：这里需要有一个实际的文件路径
    // const fileBuffer = fs.readFileSync('path/to/your/file.txt');
    // const fileResponse = await uploadFile({
    //   file: fileBuffer,
    //   filename: 'test-file.txt',
    //   user: 'user123'
    // });
    // console.log('文件上传成功:', fileResponse.id);
    //
    // const chatWithFileResponse = await sendBlockingMessage({
    //   query: '分析这个文件的内容',
    //   user: 'user123',
    //   files: [{
    //     type: 'document',
    //     transfer_method: 'local_file',
    //     upload_file_id: fileResponse.id
    //   }]
    // });
    // console.log('带文件的聊天响应:', chatWithFileResponse.answer);

    // 示例3: 流式聊天消息
    console.log('\n示例3: 流式聊天消息...');
    console.log('注意：流式处理在Node.js环境中可能无法正常工作，需要在浏览器环境中使用');
    // console.log('流式响应:');
    // await sendStreamingMessage({
    //   query: '写一首关于春天的诗',
    //   user: 'user123',
    //   inputs: {}
    // }, (event: any) => {
    //   if (event.event === 'message') {
    //     process.stdout.write(event.answer || '');
    //   } else if (event.event === 'message_end') {
    //     console.log('\n流式响应结束');
    //   }
    // });

    // 示例4: 执行工作流（阻塞模式）
    console.log('\n示例4: 执行工作流...');
    // 注意：这里需要替换为实际的工作流输入
    // const workflowResponse = await executeBlockingWorkflow({
    //   inputs: {
    //     query: '处理这段文本'
    //   },
    //   user: 'user123'
    // });
    // console.log('工作流执行结果:', workflowResponse.data.status);

    // 示例5: 流式工作流执行
    console.log('\n示例5: 流式工作流执行...');
    console.log('工作流流式响应:');
    // 注意：这里需要替换为实际的工作流输入
    // await executeStreamingWorkflow({
    //   inputs: {
    //     query: '处理大量数据'
    //   },
    //   user: 'user123'
    // }, (event) => {
    //   console.log('工作流事件:', event.event);
    // });

    console.log('\n所有示例演示完毕！');
  } catch (error) {
    console.error('示例执行失败:', error);
  }
}

// 运行示例
example();