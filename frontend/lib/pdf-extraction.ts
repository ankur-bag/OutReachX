'use server'

import * as PdfParse from 'pdf-parse-new'

export async function extractPdfText(fileBuffer: Buffer): Promise<string> {
  try {
    const data = await PdfParse(fileBuffer)
    return data.text
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
