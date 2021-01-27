import { defineConfig } from 'umi';

export default defineConfig({
  chunks: ['app'],
  nodeModulesTransform: {
    type: 'none',
  },
  /**
   * package.json 配置 "renderer"."sourceDirectory": null
   * 配置 打包输出路径 ('dist/renderer') 代替渲染进程打包文件
   */
  outputPath: 'dist/renderer',
  fastRefresh: {},
  history: { type: 'hash' },
  dynamicImport: {},
  runtimePublicPath: true,
  // 配置 './' 用于 直接electron main进程直接访问 index.html
  publicPath: './',
  dva: {
    immer: true,
    hmr: false,
  },
});
