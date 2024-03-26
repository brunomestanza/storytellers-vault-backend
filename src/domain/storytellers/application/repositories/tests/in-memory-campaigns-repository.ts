import { Campaign } from '@/domain/storytellers/enterprise/entities/campaign'

import { CampaignsRepository } from '../campaigns'

export class InMemoryCampaignsRepository implements CampaignsRepository {
  public items: Campaign[] = []

  async create(campaign: Campaign): Promise<void> {
    this.items.push(campaign)
  }

  async findByDungeonMasterId(dungeonMasterId: string): Promise<Campaign[]> {
    return this.items.filter(
      (item) => item.dungeonMasterId.toString() === dungeonMasterId,
    )
  }
}
