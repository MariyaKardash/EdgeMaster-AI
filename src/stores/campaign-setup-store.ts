import { makeAutoObservable } from 'mobx';

import { type CampaignSetupStep1Fields } from '@/database/entities';

const emptyStep1Fields: CampaignSetupStep1Fields = {
  name: '',
  description: '',
};

export class CampaignSetupStore {
  name = emptyStep1Fields.name;
  description = emptyStep1Fields.description;

  constructor() {
    makeAutoObservable(this);
  }

  setStep1(values: CampaignSetupStep1Fields) {
    this.name = values.name;
    this.description = values.description;
  }

  resetStep1() {
    this.name = emptyStep1Fields.name;
    this.description = emptyStep1Fields.description;
  }
}

export const campaignSetupStore = new CampaignSetupStore();
