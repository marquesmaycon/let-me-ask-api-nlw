import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

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
      const {
        params: { roomId },
        body: { question },
      } = req

      const [newQuestion] = await db
        .insert(schema.questions)
        .values({ roomId, question })
        .returning()

      if (!newQuestion) {
        throw new Error('Failed to create question')
      }

      return res.status(201).send({ questionId: newQuestion.id })
    }
  )
}
