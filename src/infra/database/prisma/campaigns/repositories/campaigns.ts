import { Injectable } from '@nestjs/common'

import { CampaignsRepository } from '@/domain/storytellers/application/repositories/campaigns'
import { Campaign } from '@/domain/storytellers/enterprise/entities/campaign'

import { PrismaService } from '../../prisma.service'
import { PrismaCampaignMapper } from '../mappers/campaign-mapper'
import { PrismaCampaignWithCharactersMapper } from '../mappers/campaign-with-characters-mapper'

@Injectable()
export class PrismaCampaignsRepository implements CampaignsRepository {
  constructor(private prisma: PrismaService) {}

  async create(campaign: Campaign): Promise<void> {
    const prismaCampaign = PrismaCampaignWithCharactersMapper.toPrisma(campaign)
    // We format when creating, because prisma dont accept the campaignId property
    const formattedCharacters = prismaCampaign.characters.map((chararacter) => {
      return {
        id: chararacter.id,
        name: chararacter.name,
        initiativeRollBonus: chararacter.initiativeRollBonus,
        actualLifePoints: chararacter.actualLifePoints,
        maxLifePoints: chararacter.maxLifePoints,
        createdAt: chararacter.createdAt,
        updatedAt: null,
      }
    })

    await this.prisma.campaign.create({
      data: {
        id: prismaCampaign.id,
        name: prismaCampaign.name,
        description: prismaCampaign.description,
        rpgSystem: prismaCampaign.rpgSystem,
        dungeonMasterId: prismaCampaign.dungeonMasterId,
        characters: { create: formattedCharacters },
      },
    })
  }

  async findByDungeonMasterId(dungeonMasterId: string): Promise<Campaign[]> {
    const prismaCampaigns = await this.prisma.campaign.findMany({
      where: { dungeonMasterId },
    })

    return prismaCampaigns.map(PrismaCampaignMapper.toDomain)
  }
}
