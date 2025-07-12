import { and, eq, sql } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { generateAnswer, generateEmbbedings } from '../../services/gemini.ts'

export const createQuestion: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1, 'Question name is required'),
        }),
      },
    },
    async (req, res) => {
      const { roomId } = req.params
      const { question } = req.body

      const embeddings = await generateEmbbedings(question)
      const embeddingsString = `[${embeddings.join(',')}]`

      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsString}::vector)`,
        })
        .from(schema.audioChunks)
        .where(
          and(
            eq(schema.audioChunks.roomId, roomId),
            sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsString}::vector) > 0.7`
          )
        )
        .orderBy(
          sql`${schema.audioChunks.embeddings} <=> ${embeddingsString}::vector`
        )
        .limit(5)

      const transcriptions = chunks.map((chunk) => chunk.transcription)
      const answer = await generateAnswer(question, transcriptions)

      const [newQuestion] = await db
        .insert(schema.questions)
        .values({ roomId, question, answer })
        .returning({
          id: schema.questions.id,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        })

      if (!newQuestion) {
        throw new Error('Failed to create question')
      }

      return res.status(201).send({ question: newQuestion })
    }
  )
}
