import { createAsyncSelectorResults } from 'async-selector-kit';
import { getProfilesMatch, ProfilesMatch } from '../../shared/routes';

export const [fetchProfile] = createAsyncSelectorResults(
  {
    id: 'fetch-profile',
    async: async (profilesMatch: ProfilesMatch) => {
      if (!profilesMatch || !profilesMatch.params || !profilesMatch.params.id) return null;
      const profileId = Number(profilesMatch.params.id);
      return profileId;
    },
    defaultValue: null,
  },
  [getProfilesMatch],
);
