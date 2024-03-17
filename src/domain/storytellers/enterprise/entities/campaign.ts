import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { Character } from './character'

export interface CampaignProps {
  name: string
  description: string
  rpgSystem: string
  dungeonMasterId: string
  characters: Character[]
  createdAt: Date
  updatedAt?: Date | null
}

export class Campaign extends Entity<CampaignProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get rpgSystem() {
    return this.props.rpgSystem
  }

  get dungeonMasterId() {
    return this.props.dungeonMasterId
  }

  get characters() {
    return this.props.characters
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<CampaignProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const campaign = new Campaign(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return campaign
  }
}
