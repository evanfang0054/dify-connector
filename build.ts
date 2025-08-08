import { build, BuildOptions } from 'esbuild';
import { resolve } from 'path';
import { execSync } from 'child_process';

// 项目根目录
const rootDir = process.cwd();
const srcDir = resolve(rootDir, 'src');
const distDir = resolve(rootDir, 'dist');

// 基础构建配置
const baseConfig: BuildOptions = {
  entryPoints: [resolve(srcDir, 'index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  sourcemap: true,
  minify: true,
  treeShaking: true,
  metafile: true,
  external: [
    'axios',
    'dotenv',
    'form-data',
    'zod',
    '@microsoft/fetch-event-source',
    'eventsource'
  ],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
};


// CommonJS 构建配置
const cjsConfig: BuildOptions = {
  ...baseConfig,
  format: 'cjs',
  outdir: resolve(distDir, 'cjs'),
  entryNames: '[name]',
  banner: {
    js: '"use strict";'
  }
};

// ES Module 构建配置
const esmConfig: BuildOptions = {
  ...baseConfig,
  format: 'esm',
  outdir: resolve(distDir, 'esm'),
  entryNames: '[name]',
  banner: {
    js: '// Dify API Connector - ES Module'
  }
};

// 类型定义生成
async function generateTypes() {
  console.log('📝 生成类型定义...');
  execSync('tsc -p tsconfig.types.json', { stdio: 'inherit' });
}

// 清理输出目录
async function clean() {
  console.log('🧹 清理输出目录...');
  execSync('rm -rf dist', { stdio: 'inherit' });
}

// 构建函数
async function buildProject() {
  try {
    await clean();
    
    console.log('🔨 构建 CommonJS 格式...');
    await build(cjsConfig);
    
    console.log('🔨 构建 ES Module 格式...');
    await build(esmConfig);
    
    console.log('📝 生成类型定义...');
    await generateTypes();
    
    console.log('✅ 构建完成！');
    
    // 显示构建统计
    console.log('\n📊 构建统计:');
    console.log('CommonJS:', resolve(distDir, 'cjs'));
    console.log('ES Module:', resolve(distDir, 'esm'));
    console.log('类型定义:', resolve(distDir, 'types'));
    
    // 显示构建分析
    try {
      const { statSync } = await import('fs');
      const esmStats = statSync(resolve(distDir, 'esm/index.js'));
      const cjsStats = statSync(resolve(distDir, 'cjs/index.js'));
      
      console.log('\n📈 构建分析:');
      console.log('ESM Bundle Size:', (esmStats.size / 1024).toFixed(2), 'KB');
      console.log('CJS Bundle Size:', (cjsStats.size / 1024).toFixed(2), 'KB');
    } catch (error) {
      console.log('⚠️  无法读取构建分析文件');
    }
    
  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

// 开发模式构建
async function buildDev() {
  const devConfig: BuildOptions = {
    ...baseConfig,
    minify: false,
    sourcemap: true,
    metafile: false
  };
  
  try {
    await build({
      ...devConfig,
      format: 'esm',
      outdir: resolve(distDir, 'esm')
    });
    
    await build({
      ...devConfig,
      format: 'cjs',
      outdir: resolve(distDir, 'cjs')
    });
    
    console.log('🚀 开发模式构建完成');
  } catch (error) {
    console.error('❌ 开发构建失败:', error);
    process.exit(1);
  }
}


// 命令行参数处理
const command = process.argv[2];

switch (command) {
  case 'dev':
    buildDev();
    break;
  case 'clean':
    clean();
    break;
  case 'types':
    generateTypes();
    break;
  default:
    buildProject();
    break;
}