import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DungeonMasterFactory } from 'test/factories/make-dungeon-master'

import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create campaign (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtService: JwtService
  let dungeonMasterFactory: DungeonMasterFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DungeonMasterFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    dungeonMasterFactory = moduleRef.get(DungeonMasterFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /campaigns', async () => {
    const dungeonMaster = await dungeonMasterFactory.makePrismaDungeonMaster()
    const accessToken = jwtService.sign({ sub: dungeonMaster.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'An adventures legend',
        description:
          'The adventures have to find an magic sword, to kill an evil dragon!',
        rpgSystem: 'Dungeons and Dragons 5e',
        characters: [
          {
            name: 'Tovus, the Fighter',
            initiativeRollBonus: 2,
            actualLifePoints: 10,
            maxLifePoints: 19,
          },
        ],
      })

    const dataOnDatabase = await prisma.campaign.findFirst({
      where: { name: 'An adventures legend' },
    })

    expect(response.statusCode).toBe(201)
    expect(dataOnDatabase).toBeTruthy()
  })
})
