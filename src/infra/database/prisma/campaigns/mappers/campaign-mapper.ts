import { Campaign as PrismaCampaign } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Campaign as DomainCampaign } from '@/domain/storytellers/enterprise/entities/campaign'

export class PrismaCampaignMapper {
  static toDomain(raw: PrismaCampaign): DomainCampaign {
    return DomainCampaign.create(
      {
        name: raw.name,
        description: raw.description,
        dungeonMasterId: new UniqueEntityId(raw.dungeonMasterId),
        rpgSystem: raw.rpgSystem,
        characters: [],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(raw: DomainCampaign): PrismaCampaign {
    return {
      id: raw.id.toString(),
      name: raw.name,
      description: raw.description,
      dungeonMasterId: raw.dungeonMasterId.toString(),
      rpgSystem: raw.rpgSystem,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? null,
    }
  }
}
