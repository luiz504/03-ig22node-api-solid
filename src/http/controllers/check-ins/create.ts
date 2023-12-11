import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '~/use-cases/factories/make-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({ gymId: z.string() })
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine(
      (value) => {
        return Math.abs(value) <= 90
      },
      { message: 'Invalid latitude value.' },
    ),
    longitude: z.number().refine(
      (value) => {
        return Math.abs(value) <= 180
      },
      { message: 'Invalid longitude value.' },
    ),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const checkInUseCase = makeCheckInUseCase()
  await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}