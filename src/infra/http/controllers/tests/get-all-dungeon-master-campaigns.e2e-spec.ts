import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CampaignFactory } from 'test/factories/make-campaign-with-characters'
import { DungeonMasterFactory } from 'test/factories/make-dungeon-master'

import { AppModule } from '@/app.module'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Get all dungeon master campaigns (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let dungeonMasterFactory: DungeonMasterFactory
  let campaignFactory: CampaignFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DungeonMasterFactory, CampaignFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    dungeonMasterFactory = moduleRef.get(DungeonMasterFactory)
    campaignFactory = moduleRef.get(CampaignFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /dungeon-masters/all/campaigns', async () => {
    const dungeonMaster = await dungeonMasterFactory.makePrismaDungeonMaster()
    const dungeonMasterId = dungeonMaster.id.toString()
    const campaign = await campaignFactory.makePrismaCampaignWithCharacters({
      dungeonMasterId: new UniqueEntityId(dungeonMasterId),
    })
    const accessToken = jwtService.sign({ sub: dungeonMasterId })

    const response = await request(app.getHttpServer())
      .get('/dungeon-masters/all/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.campaigns[0]).toStrictEqual({
      id: campaign.id.toString(),
      name: campaign.name,
    })
  })
})
