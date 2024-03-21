import { DungeonMaster } from '@/domain/storytellers/enterprise/entities/dungeon-master'

export class DungeonMasterPresenter {
  static toHttp(dungeonMaster: DungeonMaster) {
    return {
      id: dungeonMaster.id.toString(),
      name: dungeonMaster.name,
      email: dungeonMaster.email,
    }
  }
}
