import { Campaign } from '../../enterprise/entities/campaign'

export abstract class CampaignsRepository {
  abstract create(campaign: Campaign): Promise<void>
}
