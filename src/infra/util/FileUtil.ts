import { v4 as uuidV4 } from 'uuid';

export const fs = window.require('fs');
export const os = window.require('os');
export const path = window.require('path');

/**
 * 创建文件夹
 * @param dir 目录
 */
export const mkdir = (dir: string) => {
  fs.mkdirSync(dir, {
    recursive: true,
  });
};

/**
 * uuid v4 随机生成 文件id
 */
export const fileId = (): string => {
  return uuidV4();
};

/**
 * 读取文件
 */
export const read = (path: string): void => {
  return fs.readFileSync(path, 'utf8');
};
