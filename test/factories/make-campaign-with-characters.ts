import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Campaign,
  CampaignProps,
} from '@/domain/storytellers/enterprise/entities/campaign'
import { PrismaCampaignWithCharactersMapper } from '@/infra/database/prisma/campaigns/mappers/campaign-with-characters-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeCampaignWithCharacters(
  overrideProps: Partial<CampaignProps> = {},
  id?: UniqueEntityId,
) {
  const campaign = Campaign.create(
    {
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      dungeonMasterId: new UniqueEntityId(),
      rpgSystem: faker.commerce.productName(),
      characters: [],
      ...overrideProps,
    },
    id,
  )

  return campaign
}

@Injectable()
export class CampaignFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCampaignWithCharacters(
    data: Partial<CampaignProps> = {},
  ): Promise<Campaign> {
    const campaign = makeCampaignWithCharacters(data)
    const prismaCampaign = PrismaCampaignWithCharactersMapper.toPrisma(campaign)

    await this.prisma.campaign.create({
      data: {
        ...prismaCampaign,
        characters: { create: prismaCampaign.characters },
      },
    })

    return campaign
  }
}
