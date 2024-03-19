import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

// import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Character,
  CharacterProps,
} from '@/domain/storytellers/enterprise/entities/character'
import { PrismaCharacterMapper } from '@/infra/database/prisma/campaigns/mappers/character-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeCharacter(
  overrideProps: Partial<CharacterProps> = {},
  id?: UniqueEntityId,
) {
  const character = Character.create(
    {
      name: faker.person.fullName(),
      initiativeRollBonus: 2,
      actualLifePoints: 10,
      campaignId: new UniqueEntityId(),
      maxLifePoints: 19,
      ...overrideProps,
    },
    id,
  )

  return character
}

@Injectable()
export class CharacterFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDungeonMaster(
    data: Partial<CharacterProps> = {},
  ): Promise<Character> {
    const character = makeCharacter(data)
    await this.prisma.character.create({
      data: PrismaCharacterMapper.toPrisma(character),
    })

    return character
  }
}
