import { makeAutoObservable } from 'mobx';

import { type CampaignSetupStep1Fields, type CampaignSetupStep2Fields } from '@/database/entities';

const emptyStep1Fields: CampaignSetupStep1Fields = {
  name: '',
  description: '',
};

const emptyStep2Fields: CampaignSetupStep2Fields = {
  characters: [],
  selectedCharacterIds: [],
};

export class CampaignSetupStore {
  name = emptyStep1Fields.name;
  description = emptyStep1Fields.description;
  characters = emptyStep2Fields.characters;
  selectedCharacterIds = emptyStep2Fields.selectedCharacterIds;

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
    this.selectedCharacterIds = values.selectedCharacterIds;
  }

  resetStep2() {
    this.characters = emptyStep2Fields.characters;
    this.selectedCharacterIds = emptyStep2Fields.selectedCharacterIds;
  }
}

export const campaignSetupStore = new CampaignSetupStore();
