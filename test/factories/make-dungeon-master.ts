import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PrismaDungeonMasterMapper } from '@/infra/database/prisma/campaigns/mappers/dungeon-masters-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import {
  DungeonMaster,
  DungeonMasterProps,
} from '../../src/domain/storytellers/enterprise/entities/dungeon-master'

export function makeDungeonMaster(
  overrideProps: Partial<DungeonMasterProps> = {},
  id?: UniqueEntityId,
) {
  const dungeonMaster = DungeonMaster.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...overrideProps,
    },
    id,
  )

  return dungeonMaster
}

@Injectable()
export class DungeonMasterFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDungeonMaster(
    data: Partial<DungeonMasterProps> = {},
  ): Promise<DungeonMaster> {
    const dungeonMaster = makeDungeonMaster(data)
    await this.prisma.dungeonMaster.create({
      data: PrismaDungeonMasterMapper.toPrisma(dungeonMaster),
    })

    return dungeonMaster
  }
}
