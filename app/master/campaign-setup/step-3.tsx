import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import {
  campaignSchema,
  createEntity,
  dbKeys,
  sessionIdFromCampaignId,
  normalizeStoredCampaign,
  type Campaign,
  type CharacterTemplate,
  type ItemTemplate,
} from '@/database';
import { useCampaign } from '@/contexts/campaign-context';
import {
  MIN_SELECTED_CHARACTERS,
  MAX_SELECTED_CHARACTERS,
} from '@/screens/master/campaign-setup-step2';
import { CampaignSetupStep3Screen, MOCK_ARTIFACTS } from '@/screens/master/campaign-setup-step3';
import { campaignSetupStore } from '@/stores/campaign-setup-store';

const CampaignSetupStep3Route = () => {
  const router = useRouter();
  const {
    ready,
    error,
    worklet,
    runWithoutCampaignRefresh,
    setError,
    setActiveCampaign,
    setCampaigns,
  } = useCampaign();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalize = async (step3AvailableItemIds?: string[]) => {
    if (isSubmitting) {
      return;
    }

    if (!ready) {
      Alert.alert(
        'Storage not ready',
        error ?? 'P2P storage is still initializing. Please wait a moment and try again.',
      );
      return;
    }

    const { name, description, characters } = campaignSetupStore;
    const availableItemIds = step3AvailableItemIds ?? campaignSetupStore.availableItemIds;

    if (availableItemIds.length === 0) {
      Alert.alert(
        'No artifacts selected',
        'Turn on at least one artifact before finalizing your campaign.',
      );
      return;
    }

    if (!name.trim() || !description.trim()) {
      Alert.alert(
        'Missing campaign details',
        'Go back and complete the campaign name and description.',
      );
      return;
    }

    const selectedCharacters = characters.filter((character) => character.selected);

    if (
      selectedCharacters.length < MIN_SELECTED_CHARACTERS ||
      selectedCharacters.length > MAX_SELECTED_CHARACTERS
    ) {
      Alert.alert(
        'Missing heroes',
        `Go back and select ${MIN_SELECTED_CHARACTERS} to ${MAX_SELECTED_CHARACTERS} heroes for your campaign.`,
      );
      return;
    }

    const availableArtifacts = MOCK_ARTIFACTS.filter((artifact) =>
      availableItemIds.includes(artifact.id),
    );

    try {
      await runWithoutCampaignRefresh(async () => {
        // --- Prepare UI ---
        setIsSubmitting(true);
        setError(null);

        // --- 1. Create campaign ---
        let campaign: Campaign;

        try {
          campaign = createEntity<Campaign>({
            name: name.trim(),
            description: description.trim(),
            activeChapterId: null,
          });
          campaign = {
            ...campaign,
            sessionId: sessionIdFromCampaignId(campaign.id),
          };

          setActiveCampaign(campaign);

          // Open a dedicated P2P database for this campaign.
          await worklet.openCampaign(campaign.id);
          // Save the new campaign record.
          await worklet.put(dbKeys.campaign(campaign.id), campaign);

          // Read which campaigns already exist on this device.
          const campaignIds = (await worklet.get<string[]>(dbKeys.metaCampaignList())) ?? [];

          if (!campaignIds.includes(campaign.id)) {
            // Register the new campaign in the local campaign list.
            await worklet.put(dbKeys.metaCampaignList(), [campaign.id, ...campaignIds]);
          }
        } catch (error) {
          setIsSubmitting(false);
          Alert.alert(
            'Unable to create campaign',
            error instanceof Error ? error.message : 'Something went wrong.',
          );
          return;
        }

        // --- 2. Create character templates ---
        try {
          // Ensure the new campaign database is open before writing templates.
          await worklet.openCampaign(campaign.id);

          for (const character of selectedCharacters) {
            const template = createEntity<CharacterTemplate>({
              campaignId: campaign.id,
              name: character.name,
              class: character.class,
              description: '',
              stats: character.stats,
              imageUri: character.imageUri,
            });

            // Save the character template record.
            await worklet.put(dbKeys.characterTemplate(template.id), template);
            // Index the template under this campaign so it can be listed later.
            await worklet.put(
              `${dbKeys.indexCharacterTemplatesByCampaign(campaign.id)}${template.id}`,
              template.id,
            );
          }
        } catch (error) {
          setIsSubmitting(false);
          Alert.alert(
            'Unable to create heroes',
            error instanceof Error ? error.message : 'Something went wrong.',
          );
          return;
        }

        // --- 3. Create item templates ---
        try {
          // Ensure the new campaign database is open before writing templates.
          await worklet.openCampaign(campaign.id);

          for (const artifact of availableArtifacts) {
            const template = createEntity<ItemTemplate>({
              campaignId: campaign.id,
              name: artifact.name,
              description: artifact.description,
              stats: {},
            });

            // Save the item template record.
            await worklet.put(dbKeys.itemTemplate(template.id), template);
            // Index the template under this campaign so it can be listed later.
            await worklet.put(
              `${dbKeys.indexItemTemplatesByCampaign(campaign.id)}${template.id}`,
              template.id,
            );
          }
        } catch (error) {
          setIsSubmitting(false);
          Alert.alert(
            'Unable to create artifacts',
            error instanceof Error ? error.message : 'Something went wrong.',
          );
          return;
        }

        // --- 4. Reload campaign list for the selection screen ---
        try {
          const preserveOpenCampaignId = campaign.id;
          // Read every campaign ID stored on this device.
          const listedCampaignIds = (await worklet.get<string[]>(dbKeys.metaCampaignList())) ?? [];
          const nextCampaigns: Campaign[] = [];

          for (const campaignId of listedCampaignIds) {
            // Open each campaign database to read its record.
            await worklet.openCampaign(campaignId);
            const listedCampaignValue = await worklet.get(dbKeys.campaign(campaignId));

            if (!listedCampaignValue) {
              if (preserveOpenCampaignId !== campaignId) {
                // Close campaigns we opened only for reading.
                await worklet.closeCampaign();
              }
              continue;
            }

            nextCampaigns.push(campaignSchema.parse(normalizeStoredCampaign(listedCampaignValue)));

            if (preserveOpenCampaignId !== campaignId) {
              // Close campaigns we opened only for reading.
              await worklet.closeCampaign();
            }
          }

          // Keep the campaign we just created open in the worklet.
          await worklet.openCampaign(preserveOpenCampaignId);

          setCampaigns(nextCampaigns);
        } catch (error) {
          setIsSubmitting(false);
          Alert.alert(
            'Unable to reload campaigns',
            error instanceof Error ? error.message : 'Something went wrong.',
          );
          return;
        }

        setIsSubmitting(false);
        campaignSetupStore.reset();
        router.replace({
          pathname: '/master/campaign-created',
          params: {
            sessionId: campaign.sessionId,
            campaignName: campaign.name,
            characterCount: String(selectedCharacters.length),
            itemCount: String(availableArtifacts.length),
          },
        });
      });
    } catch (finalizeError) {
      setIsSubmitting(false);
      Alert.alert(
        'Unable to finalize campaign',
        finalizeError instanceof Error ? finalizeError.message : 'Something went wrong.',
      );
    }
  };

  return (
    <CampaignSetupStep3Screen
      isSubmitting={isSubmitting}
      onBack={() => router.back()}
      onFinalize={handleFinalize}
    />
  );
};

export default CampaignSetupStep3Route;
