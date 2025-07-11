import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const createRoomRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms',
    {
      schema: {
        body: z.object({
          name: z.string().min(1, 'Room name is required'),
          description: z.string().optional(),
        }),
      },
    },
    async (req, res) => {
      const { name, description } = req.body

      const [newRoom] = await db
        .insert(schema.rooms)
        .values({ name, description })
        .returning()

      if (!newRoom) {
        throw new Error('Failed to create room')
      }

      return res.status(201).send({ roomId: newRoom.id })
    }
  )
}
