import { DungeonMaster } from '../../enterprise/entities/dungeon-master'

export abstract class DungeonMastersRepository {
  abstract create(dungeonMaster: DungeonMaster): Promise<void>
  abstract findByEmail(email: string): Promise<DungeonMaster | null>
}
