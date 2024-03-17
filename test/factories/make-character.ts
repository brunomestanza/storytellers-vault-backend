import { faker } from '@faker-js/faker'

// import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Character,
  CharacterProps,
} from '@/domain/storytellers/enterprise/entities/character'

export function makeCharacter(
  overrideProps: Partial<CharacterProps> = {},
  id?: UniqueEntityId,
) {
  const character = Character.create(
    {
      name: faker.person.fullName(),
      initiativeRollBonus: 2,
      actualLifePoints: 10,
      maxLifePoints: 19,
      ...overrideProps,
    },
    id,
  )

  return character
}

// @Injectable()
// export class DungeonMasterFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaDungeonMaster(
//     data: Partial<DungeonMasterProps> = {},
//   ): Promise<DungeonMaster> {
//     const dungeonMaster = makeDungeonMaster(data)
//     await this.prisma.dungeonMaster.create({
//       data: PrismaDungeonMasterMapper.toPrisma(dungeonMaster),
//     })

//     return dungeonMaster
//   }
// }
