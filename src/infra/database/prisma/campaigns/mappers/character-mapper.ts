import { Character as PrismaCharacter } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Character as DomainCharacter } from '@/domain/storytellers/enterprise/entities/character'

export class PrismaCharacterMapper {
  static toDomain(raw: PrismaCharacter): DomainCharacter {
    return DomainCharacter.create(
      {
        name: raw.name,
        initiativeRollBonus: raw.initiativeRollBonus,
        actualLifePoints: raw.actualLifePoints,
        maxLifePoints: raw.maxLifePoints,
        campaignId: new UniqueEntityId(raw.campaignId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(raw: DomainCharacter): PrismaCharacter {
    return {
      id: raw.id.toString(),
      name: raw.name,
      initiativeRollBonus: raw.initiativeRollBonus,
      actualLifePoints: raw.actualLifePoints,
      maxLifePoints: raw.maxLifePoints,
      campaignId: raw.campaignId.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? null,
    }
  }
}
