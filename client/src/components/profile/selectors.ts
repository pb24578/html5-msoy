import { createAsyncSelectorResults } from 'async-selector-kit';
import { getProfilesMatch, ProfilesMatch } from '../../shared/routes';
import { fetchProfile } from './api';

export const [getProfile, isProfileLoading, getProfileError] = createAsyncSelectorResults(
  {
    id: 'get-profile',
    async: async (profilesMatch: ProfilesMatch) => {
      if (!profilesMatch || !profilesMatch.params || !profilesMatch.params.id) return null;
      const profileId = Number(profilesMatch.params.id);
      const profile = await fetchProfile(profileId);
      return profile;
    },
    defaultValue: null,
  },
  [getProfilesMatch],
);
