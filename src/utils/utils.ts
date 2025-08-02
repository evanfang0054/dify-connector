/**
 * 检查值是否为Buffer
 * @param value 要检查的值
 * @returns 如果是Buffer则返回true，否则返回false
 */
export function isBuffer(value: any): value is Buffer {
  return value !== null && value !== undefined && typeof value === 'object' && value.type === 'Buffer';
}

/**
 * 检查值是否为ReadableStream
 * @param value 要检查的值
 * @returns 如果是ReadableStream则返回true，否则返回false
 */
export function isReadableStream(value: any): value is ReadableStream {
  return value !== null && value !== undefined && typeof value === 'object' && typeof value.getReader === 'function';
}

/**
 * 检查值是否为File（浏览器环境）
 * @param value 要检查的值
 * @returns 如果是File则返回true，否则返回false
 */
export function isFile(value: any): value is File {
  return value !== null && value !== undefined && typeof value === 'object' && value.constructor.name === 'File';
}