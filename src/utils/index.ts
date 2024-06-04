// 将blob对象转换为域名结合式的url
export const blobToDownload = (blob: Blob, fileName: string) => {
  const blobUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = blobUrl
  link.download = decodeURIComponent(fileName)
  document.body.appendChild(link)
  link.click()
  link.parentNode ? link.parentNode.removeChild(link) : document.body.removeChild(link)
  window.URL.revokeObjectURL(blobUrl)
}

// fetch通用文件下载
export const fetchFile = (
  reqConfig: {
    url: string
    token: string
    submitData: Record<string, unknown>
  },
  fileName?: string
) => {
  const { url, token, submitData } = reqConfig

  let resFileName
  const options = {
    method: 'post',
    url: `${url}`,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: token
    },
    body: JSON.stringify({ ...submitData })
  }
  fetch(url, options)
    .then((response) => {
      const contentDisposition = response?.clone()?.headers?.get('content-disposition')
      resFileName = contentDisposition?.split(';')?.[1]?.split('filename=')?.[1] ?? ''
      return response.blob()
    })
    .then((res) => {
      blobToDownload(res, decodeURIComponent(fileName ?? resFileName))
    })
}

export function returnFileSize(number: number) {
  if (number < 1024) {
    return [number, 'bytes']
  } else if (number >= 1024 && number < 1048576) {
    return [(number / 1024).toFixed(1), 'KB']
  } else if (number >= 1048576) {
    return [(number / 1048576).toFixed(1), 'MB']
  }
}
