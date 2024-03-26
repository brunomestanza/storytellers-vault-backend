import {
  Campaign as PrismaCampaign,
  Character as PrismaCharacter,
} from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Campaign as DomainCampaign } from '@/domain/storytellers/enterprise/entities/campaign'

import { PrismaCharacterMapper } from './character-mapper'

type PrismaCampaignWithCharacters = PrismaCampaign & {
  characters: PrismaCharacter[]
}

export class PrismaCampaignWithCharactersMapper {
  static toDomain(raw: PrismaCampaignWithCharacters): DomainCampaign {
    return DomainCampaign.create(
      {
        dungeonMasterId: new UniqueEntityId(raw.dungeonMasterId),
        name: raw.name,
        description: raw.description,
        rpgSystem: raw.rpgSystem,
        characters: raw.characters.map(PrismaCharacterMapper.toDomain),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(raw: DomainCampaign): PrismaCampaignWithCharacters {
    return {
      id: raw.id.toString(),
      dungeonMasterId: raw.dungeonMasterId.toString(),
      name: raw.name,
      description: raw.description,
      rpgSystem: raw.rpgSystem,
      characters: raw.characters.map(PrismaCharacterMapper.toPrisma),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? null,
    }
  }
}
