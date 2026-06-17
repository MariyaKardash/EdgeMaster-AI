import { makeAutoObservable } from 'mobx';

import {
  type CampaignSetupStep1Fields,
  type CampaignSetupStep2Fields,
  type CampaignSetupStep3Fields,
} from '@/database/entities';

const emptyStep1Fields: CampaignSetupStep1Fields = {
  name: '',
  description: '',
};

const emptyStep2Fields: CampaignSetupStep2Fields = {
  characters: [],
};

const emptyStep3Fields: CampaignSetupStep3Fields = {
  availableItemIds: [],
};

export class CampaignSetupStore {
  name = emptyStep1Fields.name;
  description = emptyStep1Fields.description;
  characters = emptyStep2Fields.characters;
  availableItemIds = emptyStep3Fields.availableItemIds;

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

  setStep2(values: CampaignSetupStep2Fields) {
    this.characters = values.characters;
  }

  resetStep2() {
    this.characters = emptyStep2Fields.characters;
  }

  setStep3(values: CampaignSetupStep3Fields) {
    this.availableItemIds = values.availableItemIds;
  }

  resetStep3() {
    this.availableItemIds = emptyStep3Fields.availableItemIds;
  }

  reset() {
    this.resetStep1();
    this.resetStep2();
    this.resetStep3();
  }
}

export const campaignSetupStore = new CampaignSetupStore();
