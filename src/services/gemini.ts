import { GoogleGenAI } from '@google/genai'

import { env } from '../env.ts'

export const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
})

const model = 'gemini-2.5-flash'

export async function transcribeAudio(audioBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: 'Transcreva o áudio para portugês do Brasil. Seja preciso e natural, mantenha a pontuação adequada e divida o texto em parágrafos quando for apropriedado',
      },
      {
        inlineData: {
          mimeType,
          data: audioBase64,
        },
      },
    ],
  })

  // TO DO => verificar audios sem fala e lançar erro
  if (!response.text) {
    throw new Error('Failed to transcribe audio')
  }

  return response.text
}

const embeddingConfigs = {
  model: 'text-embedding-004',
  taskType: 'RETRIEVAL_DOCUMENT',
}

export async function generateEmbbedings(text: string) {
  const response = await gemini.models.embedContent({
    model: embeddingConfigs.model,
    contents: [{ text }],
    config: { taskType: embeddingConfigs.taskType },
  })

  if (!response.embeddings?.[0].values) {
    throw new Error('Failed to generate embeddings')
  }

  return response.embeddings[0].values
}

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  if (transcriptions.length === 0) {
    return null
  }

  const context = transcriptions.join('\n\n')

  const prompt = `
    Com base no texto fornecido abaixo como contexto, responsa a pergunta de forma clara e precisa em português do Brasil. 
    
    CONTEXTO: ${context}

    PERGUNTA: ${question}

    INSTRUÇÕES:
    - Use apenas informações contidas no context enviado.
    - Se a resposta não estiver no contexto, responda que não há informações suficientes para responder a pergunta.
    - Seja objetivo, mantenha um tom educativo e profissional.
    - Cite trechos relevantes do contexto na resposta, se necessário.
    - Se for citar o contexto, utilize o termo "Conteúdo da aula
  `.trim()

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  })

  if (!response.text) {
    throw new Error('Failed to generate answer')
  }

  return response.text
}
