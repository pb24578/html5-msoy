import { createSelector, createAsyncSelectorResults } from 'async-selector-kit';
import { IState } from '../../store';
import routes from '../../shared/routes';

const getLocation = (state: IState) => state.router.location;

/**
 * Return the profile id from the URL parameters.
 */
const getProfileId = createSelector([getLocation], (location) => {
  const profileId = location.pathname.replace(routes.profiles.pathname, '').replace('/', '');
  if (profileId && !Number.isNaN(profileId)) {
    return Number(profileId);
  }
  return null;
});

export const [fetchProfile] = createAsyncSelectorResults(
  {
    id: 'fetch-profile',
    async: async (profileId) => {
      if (!profileId) return null;
      return null;
    },
    defaultValue: null,
  },
  [getProfileId],
);
