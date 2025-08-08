// 完整的工作流功能测试
// 实际调用executeBlockingWorkflow和executeStreamingWorkflow函数

import { executeBlockingWorkflow, executeStreamingWorkflow } from '../src/index';

async function testWorkflowActual() {
  try {
    console.log('开始实际工作流功能测试...\n');

    // 1. 测试executeBlockingWorkflow函数调用
    console.log('1. 测试executeBlockingWorkflow函数调用...');
    const blockingResult = await executeBlockingWorkflow({
      inputs: {
        query: '测试工作流执行'
      },
      response_mode: 'blocking',
      user: 'test-user'
    });
    console.log('   阻塞模式执行结果:', blockingResult);
    console.log('   阻塞模式测试完成\n');

    // 2. 测试executeStreamingWorkflow函数调用
    console.log('2. 测试executeStreamingWorkflow函数调用...');
    await executeStreamingWorkflow({
      inputs: {
        query: '测试流式工作流执行'
      },
      response_mode: 'streaming',
      user: 'test-user'
    }, (event) => {
      console.log('   流式事件:', event.event);
      if (event.data) {
        console.log('   事件数据:', JSON.stringify(event.data, null, 2));
      }
    });
    console.log('   流式模式测试完成\n');

    console.log('工作流功能测试完成！');
    console.log('所有函数均已正确导入并可调用');

  } catch (error: any) {
    console.error('工作流功能测试失败:', error);
    if (error.response) {
      console.error('错误响应:', error.response.data);
      console.error('错误状态:', error.response.status);
    }
  }
}

// 运行测试
testWorkflowActual();
