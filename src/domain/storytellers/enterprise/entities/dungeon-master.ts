import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface DungeonMasterProps {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
}

export class DungeonMaster extends Entity<DungeonMasterProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<DungeonMasterProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const dungeonMaster = new DungeonMaster(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return dungeonMaster
  }
}
