/** 统一配置：全部来自环境变量，避免硬编码 */
export const config = {
  /** 后端 API 基础地址 */
  backendUrl: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080',
  /** 是否启用 MSW Mock */
  enableMock: import.meta.env.VITE_ENABLE_MOCK !== 'false',
  /** 腾讯云 COS 存储桶 */
  cosBucket: import.meta.env.VITE_COS_BUCKET ?? '',
  /** 腾讯云 COS 地域 */
  cosRegion: import.meta.env.VITE_COS_REGION ?? 'ap-shanghai',
}
