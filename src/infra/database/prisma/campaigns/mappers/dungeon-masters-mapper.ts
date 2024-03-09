import { DungeonMaster as PrismaDungeonMaster } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DungeonMaster as DomainDungeonMaster } from '@/domain/storytellers/enterprise/entities/dungeon-master'

export class PrismaDungeonMasterMapper {
  static toDomain(raw: PrismaDungeonMaster): DomainDungeonMaster {
    return DomainDungeonMaster.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(raw: DomainDungeonMaster): PrismaDungeonMaster {
    return {
      id: raw.id.toString(),
      email: raw.email,
      name: raw.name,
      password: raw.password,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? null,
    }
  }
}
