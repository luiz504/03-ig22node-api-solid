import { hash } from 'bcryptjs'
import { prisma } from '~/lib/prisma'

interface RegisterUseCaseDTO {
  name: string
  email: string
  password: string
}
export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseDTO) {
  const userWithSameEmail = await prisma.user.findUnique({ where: { email } })

  if (userWithSameEmail) {
    throw new Error('Email already exists.')
  }

  const password_hash = await hash(password, 6)

  await prisma.user.create({ data: { name, email, password_hash } })
}
