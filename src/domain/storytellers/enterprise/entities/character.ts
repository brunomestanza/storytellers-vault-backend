import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface CharacterProps {
  name: string
  initiativeRollBonus: number
  actualLifePoints: number
  maxLifePoints: number
  createdAt: Date
  updatedAt?: Date | null
}

export class Character extends Entity<CharacterProps> {
  get name() {
    return this.props.name
  }

  get initiativeRollBonus() {
    return this.props.initiativeRollBonus
  }

  get actualLifePoints() {
    return this.props.actualLifePoints
  }

  get maxLifePoints() {
    return this.props.maxLifePoints
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<CharacterProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const character = new Character(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return character
  }
}
