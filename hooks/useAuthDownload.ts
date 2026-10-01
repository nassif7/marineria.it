import { useState } from 'react'
import { File, Paths } from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { useSession } from '@/Providers/SessionProvider'
import { withTmpCode } from './useAuthBrowser'

// %PDF — if the site answers with a login/error page instead, we don't want to hand
// the user an HTML file named .pdf.
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46]

const isPdf = (file: File) => {
  const handle = file.open()
  try {
    const head = handle.readBytes(PDF_MAGIC.length)
    return PDF_MAGIC.every((byte, i) => head[i] === byte)
  } finally {
    handle.close()
  }
}

const useAuthDownload = () => {
  const { auth } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  // Downloads an authenticated PDF from the website and opens the share sheet
  // (Save to Files / Drive / etc). Throws if the response isn't a PDF.
  const downloadPdf = async (url: string, fileName: string) => {
    if (isLoading) return
    setIsLoading(true)
    let file: File
    try {
      const destination = new File(Paths.cache, fileName)
      file = await File.downloadFileAsync(await withTmpCode(url, auth.token), destination, {
        idempotent: true,
      })
      if (!isPdf(file)) {
        file.delete()
        throw new Error('Downloaded file is not a PDF')
      }
    } finally {
      // Stop loading before the share sheet — shareAsync only resolves once it's dismissed.
      setIsLoading(false)
    }
    await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' })
  }

  return { downloadPdf, isLoading }
}

export default useAuthDownload
