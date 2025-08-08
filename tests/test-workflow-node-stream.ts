// Node.js环境下的工作流流式处理测试
// 基于Dify API规范的SSE流式数据格式测试

import { sendStreamingWorkflowNode } from '../src/index';

async function testWorkflowNodeStream() {
  try {
    console.log('开始Node.js工作流流式处理测试...\n');

    // 测试sendStreamingWorkflowNode函数调用
    console.log('测试sendStreamingWorkflowNode函数调用...');
    
    await sendStreamingWorkflowNode({
      inputs: {
        query: '测试Node.js流式工作流执行',
        target_language: '中文'
      },
      user: 'test-user'
    }, (event) => {
      console.log('📡 收到SSE事件:');
      console.log(`   事件类型: ${event.event}`);
      console.log(`   工作流ID: ${event.workflow_run_id || 'N/A'}`);
      console.log(`   任务ID: ${event.task_id || 'N/A'}`);
      
      // 根据不同事件类型处理数据
      switch (event.event) {
        case 'workflow_started':
          console.log('   ✅ 工作流开始执行');
          break;
        case 'workflow_finished':
          console.log('   ✅ 工作流执行完成');
          if (event.data) {
            console.log(`   执行状态: ${event.data.status}`);
            console.log(`   耗时: ${event.data.elapsed_time || 0}秒`);
            if (event.data.outputs) {
              console.log('   输出结果:', JSON.stringify(event.data.outputs, null, 2));
            }
          }
          break;
        case 'workflow_failed':
          console.log('   ❌ 工作流执行失败');
          if (event.data && event.data.error) {
            console.log(`   错误信息: ${event.data.error}`);
          }
          break;
        case 'node_started':
          console.log('   🔧 节点开始执行');
          break;
        case 'node_finished':
          console.log('   🔧 节点执行完成');
          break;
        case 'agent_log':
          console.log('   🤖 Agent日志');
          if (event.data) {
            console.log(`   日志内容: ${JSON.stringify(event.data, null, 2)}`);
          }
          break;
        case 'error':
          console.log('   ❌ 错误事件');
          if (event.data) {
            console.log(`   错误详情: ${JSON.stringify(event.data, null, 2)}`);
          }
          break;
        default:
          console.log('   📝 未知事件类型');
      }
      
      console.log('   ──────────────────────────────────');
    });

    console.log('✅ Node.js工作流流式处理测试完成！');

  } catch (error: any) {
    console.error('❌ Node.js工作流流式处理测试失败:', error);
    if (error.response) {
      console.error('错误响应:', error.response.data);
      console.error('错误状态:', error.response.status);
    } else if (error.message) {
      console.error('错误消息:', error.message);
    }
  }
}

// 运行测试
testWorkflowNodeStream();
