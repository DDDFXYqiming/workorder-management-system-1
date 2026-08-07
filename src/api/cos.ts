import COS from 'cos-js-sdk-v5'
import { config } from '@/config'

/** 初始化 COS 实例：临时密钥由后端 /api/tx/v1/cos/sts 签发 */
export const cos = new COS({
  getAuthorization: (_options, callback) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/api/tx/v1/cos/sts', true)
    xhr.onload = () => {
      try {
        const { data } = JSON.parse(xhr.responseText) as { data: string }
        const parsed = JSON.parse(data) as {
          credentials: { tmpSecretId: string; tmpSecretKey: string; sessionToken: string }
          startTime: number
          expiredTime: number
        }
        callback({
          TmpSecretId: parsed.credentials.tmpSecretId,
          TmpSecretKey: parsed.credentials.tmpSecretKey,
          SecurityToken: parsed.credentials.sessionToken,
          StartTime: parsed.startTime,
          ExpiredTime: parsed.expiredTime,
        })
      } catch (err) {
        console.error('获取 COS 临时密钥失败', err)
        callback({} as never)
      }
    }
    xhr.send()
  },
})

/** 上传文件到 COS，返回文件名 */
export function uploadToCos(file: File, userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const name = `${userId}_${Date.now()}_${file.name}`
    cos.putObject(
      {
        Bucket: config.cosBucket,
        Region: config.cosRegion,
        Key: `ticket/${name}`,
        StorageClass: 'STANDARD',
        Body: file,
      },
      (err) => {
        if (err) reject(err)
        else resolve(name)
      },
    )
  })
}
