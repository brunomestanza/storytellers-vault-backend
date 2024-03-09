import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create dungeon master account (E2E)', () => {
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

  test('[POST] /dungeon-masters', async () => {
    const fakeEmail = faker.internet.email()

    const response = await request(app.getHttpServer())
      .post('/dungeon-masters')
      .send({
        name: faker.person.fullName(),
        email: fakeEmail,
        password: faker.internet.password(),
      })

    const dataOnDatabase = await prisma.dungeonMaster.findUnique({
      where: { email: fakeEmail },
    })

    expect(response.statusCode).toBe(201)
    expect(dataOnDatabase).toBeTruthy()
    expect(response.body.accessToken).toBeTruthy()
  })
})
