import { Campaign } from '@/domain/storytellers/enterprise/entities/campaign'

export class CampaignPresenter {
  static toHttp(campaign: Campaign) {
    return {
      id: campaign.id.toString(),
      name: campaign.name,
    }
  }
}
