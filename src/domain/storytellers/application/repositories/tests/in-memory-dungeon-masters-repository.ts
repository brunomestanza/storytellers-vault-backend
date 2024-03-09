import { DungeonMaster } from '@/domain/storytellers/enterprise/entities/dungeon-master'

import { DungeonMastersRepository } from '../dungeon-masters'

export class InMemoryDungeonMastersRepository
  implements DungeonMastersRepository
{
  public items: DungeonMaster[] = []

  async create(dungeonMaster: DungeonMaster): Promise<void> {
    this.items.push(dungeonMaster)
  }

  async findByEmail(email: string): Promise<DungeonMaster | null> {
    const dungeonMaster = this.items.find((item) => item.email === email)

    if (!dungeonMaster) {
      return null
    }

    return dungeonMaster
  }
}
