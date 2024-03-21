import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DungeonMasterFactory } from 'test/factories/make-dungeon-master'

import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Get dungeon master profile (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let dungeonMasterFactory: DungeonMasterFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DungeonMasterFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    dungeonMasterFactory = moduleRef.get(DungeonMasterFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /me', async () => {
    const dungeonMaster = await dungeonMasterFactory.makePrismaDungeonMaster()
    const dungeonMasterId = dungeonMaster.id.toString()
    const accessToken = jwtService.sign({ sub: dungeonMasterId })

    const response = await request(app.getHttpServer())
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.profile).toStrictEqual({
      id: dungeonMasterId,
      name: dungeonMaster.name,
      email: dungeonMaster.email,
    })
  })
})
