import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Authenticate dungeon master (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const fakeEmail = faker.internet.email()
    const fakePassword = faker.internet.password()

    await prisma.dungeonMaster.create({
      data: {
        name: faker.person.fullName(),
        email: fakeEmail,
        password: await hash(fakePassword, 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: fakeEmail,
      password: fakePassword,
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.accessToken).toBeTruthy()
  })
})
