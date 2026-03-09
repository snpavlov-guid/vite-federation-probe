import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createIntegrationStore,
  getAccessTokenFromTestAuth,
} from '../../../test/integration/helpers';
const keycloakMock = vi.hoisted(() => ({
  authenticated: true,
  token: '',
  updateToken: vi.fn(async () => true),
}));

vi.mock('../../Auth', () => ({
  keycloak: keycloakMock,
}));

type LeagueDataSliceModule = {
  fetchRplTournaments: typeof import('../model/leagueDataSlice').fetchRplTournaments;
  leagueDataReducer: typeof import('../model/leagueDataSlice').leagueDataReducer;
};

let fetchRplTournaments: LeagueDataSliceModule['fetchRplTournaments'];
let leagueDataReducer: LeagueDataSliceModule['leagueDataReducer'];

describe('LeagueData backend integration', () => {
  beforeAll(async () => {
    const module = (await import('../model/leagueDataSlice')) as LeagueDataSliceModule;
    fetchRplTournaments = module.fetchRplTournaments;
    leagueDataReducer = module.leagueDataReducer;
  });

  beforeEach(() => {
    keycloakMock.authenticated = true;
    keycloakMock.token = '';
    keycloakMock.updateToken.mockClear();
    keycloakMock.updateToken.mockImplementation(async () => true);
  });

  it('fetches tournaments/rpl via real backend and updates Redux state', async () => {
    const token = await getAccessTokenFromTestAuth();
    keycloakMock.token = token;

    const store = createIntegrationStore({ leagueData: leagueDataReducer });
    const statuses: string[] = [];
    const unsubscribe = store.subscribe(() => {
      statuses.push(store.getState().leagueData.status);
    });

    expect(store.getState().leagueData.status).toBe('idle');

    const action = await store.dispatch(fetchRplTournaments());
    unsubscribe();

    expect(fetchRplTournaments.fulfilled.match(action)).toBe(true);
    expect(statuses).toContain('loading');
    expect(store.getState().leagueData.status).toBe('succeeded');
    expect(store.getState().leagueData.error).toBeNull();
    expect(store.getState().leagueData.data).not.toBeNull();
    expect(keycloakMock.updateToken).toHaveBeenCalledWith(30);
  });

  it('moves state to failed when keycloak is not authenticated', async () => {
    keycloakMock.authenticated = false;

    const store = createIntegrationStore({ leagueData: leagueDataReducer });
    const action = await store.dispatch(fetchRplTournaments());

    expect(fetchRplTournaments.rejected.match(action)).toBe(true);
    expect(store.getState().leagueData.status).toBe('failed');
    expect(store.getState().leagueData.error).toContain('User is not authenticated');
  });
});
