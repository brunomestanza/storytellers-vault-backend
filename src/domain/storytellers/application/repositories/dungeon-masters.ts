import { DungeonMaster } from '../../enterprise/entities/dungeon-master'

export abstract class DungeonMastersRepository {
  abstract create(dungeonMaster: DungeonMaster): Promise<void>
  abstract findById(id: string): Promise<DungeonMaster | null>
  abstract findByEmail(email: string): Promise<DungeonMaster | null>
}
