'use client'

const BASE_URL = 'https://ai-support-bot-blo4.onrender.com'

export const extractionService = {
  /**
   * Uploads an audio file to the admin/upload endpoint.
   * Matches the multipart/form-data requirement.
   */
  extractFromAudio: async (file: File) => {
    const formData = new FormData()
    formData.append('files', file) // API expects an array/list of files

    const response = await fetch(`${BASE_URL}/admin/upload`, {
      method: 'POST',
      body: formData,
      // Note: Do not set Content-Type header manually when sending FormData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail?.[0]?.msg || 'Upload failed')
    }

    return response.json()
  },

  /**
   * Sends transcript text to the chat endpoint.
   * Uses the ChatRequest schema: { session_id, question }.
   */
  extractFromTranscript: async (
    text: string,
    sessionId: string = 'default-session',
  ) => {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        question: text,
      }),
    })

    if (!response.ok) {
      throw new Error('Analysis failed')
    }

    return response.json()
  },

  /**
   * Purges the session memory.
   * Matches the DELETE /session/{session_id} endpoint.
   */
  purgeSession: async (sessionId: string) => {
    const response = await fetch(`${BASE_URL}/session/${sessionId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Purge failed')
    }

    return response.json()
  },

  /**
   * Lists uploaded document IDs.
   * Matches GET /admin/docs.
   */
  listDocs: async () => {
    const response = await fetch(`${BASE_URL}/admin/docs`, {
      method: 'GET',
      headers: { accept: 'application/json' },
    })
    return response.json()
  },
}
