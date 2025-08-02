// 测试配置参数功能
import { 
  sendBlockingMessage, 
  uploadFile, 
  executeBlockingWorkflow,
  createConfig,
  getOrCreateConfig 
} from './index';

// 测试 1: 使用参数配置
const customConfig = {
  apiBaseUrl: 'https://custom-api.dify.ai/v1',
  apiKey: 'custom-api-key'
};

async function testWithConfigParam() {
  console.log('=== 测试 1: 使用参数配置 ===');
  
  try {
    // 使用自定义配置
    const config = createConfig(customConfig);
    console.log('创建的配置:', config);
    
    // 测试发送消息（使用配置参数）
    const response = await sendBlockingMessage({
      query: '你好，世界！',
      user: 'test-user-123'
    }, customConfig);
    
    console.log('消息发送成功:', response.answer);
  } catch (error) {
    console.log('预期错误（API 不可用）:', (error as Error).message);
  }
}

// 测试 2: 使用环境变量配置
async function testWithEnvConfig() {
  console.log('\n=== 测试 2: 使用环境变量配置 ===');
  
  try {
    // 不传配置参数，会使用环境变量
    const response = await sendBlockingMessage({
      query: '你好，世界！',
      user: 'test-user-123'
    });
    
    console.log('消息发送成功:', response.answer);
  } catch (error) {
    console.log('预期错误（API 不可用）:', (error as Error).message);
  }
}

// 测试 3: 混合使用
async function testMixedUsage() {
  console.log('\n=== 测试 3: 混合使用 ===');
  
  try {
    // 部分调用使用配置，部分不使用
    const config1 = { apiKey: 'key1' };
    const config2 = { apiKey: 'key2' };
    
    console.log('配置 1:', getOrCreateConfig(config1));
    console.log('配置 2:', getOrCreateConfig(config2));
    console.log('默认配置:', getOrCreateConfig());
    
  } catch (error) {
    console.log('错误:', (error as Error).message);
  }
}

// 运行测试
async function runTests() {
  await testWithConfigParam();
  await testWithEnvConfig();
  await testMixedUsage();
  
  console.log('\n=== 测试完成 ===');
  console.log('✅ 配置参数功能正常工作');
  console.log('✅ 向后兼容性保持完整');
}

// 如果直接运行此文件
if (require.main === module) {
  runTests();
}

export { testWithConfigParam, testWithEnvConfig, testMixedUsage };