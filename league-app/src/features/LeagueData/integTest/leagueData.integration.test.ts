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
  fetchRplTournamentsPage: typeof import('../model/leagueDataSlice').fetchRplTournamentsPage;
  leagueDataReducer: typeof import('../model/leagueDataSlice').leagueDataReducer;
};

let fetchRplTournamentsPage: LeagueDataSliceModule['fetchRplTournamentsPage'];
let leagueDataReducer: LeagueDataSliceModule['leagueDataReducer'];

describe('LeagueData backend integration', () => {
  beforeAll(async () => {
    const module = (await import('../model/leagueDataSlice')) as LeagueDataSliceModule;
    fetchRplTournamentsPage = module.fetchRplTournamentsPage;
    leagueDataReducer = module.leagueDataReducer;
  });

  beforeEach(() => {
    keycloakMock.authenticated = true;
    keycloakMock.token = '';
    keycloakMock.updateToken.mockClear();
    keycloakMock.updateToken.mockImplementation(async () => true);
  });

  it('fetches tournaments/rpl page via real backend and updates Redux state', async () => {
    const token = await getAccessTokenFromTestAuth();
    keycloakMock.token = token;

    const store = createIntegrationStore({ leagueData: leagueDataReducer });
    const statuses: string[] = [];
    const unsubscribe = store.subscribe(() => {
      statuses.push(store.getState().leagueData.status);
    });

    expect(store.getState().leagueData.status).toBe('idle');

    const action = await store.dispatch(fetchRplTournamentsPage({ skip: 0, size: 10 }));
    unsubscribe();

    expect(fetchRplTournamentsPage.fulfilled.match(action)).toBe(true);
    expect(statuses).toContain('loading');
    expect(store.getState().leagueData.status).toBe('succeeded');
    expect(store.getState().leagueData.error).toBeNull();
    expect(store.getState().leagueData.data).not.toBeNull();
    expect(store.getState().leagueData.data?.items).toBeInstanceOf(Array);
    expect(typeof store.getState().leagueData.data?.total).toBe('number');
    expect(keycloakMock.updateToken).toHaveBeenCalledWith(30);
  });

  it('moves state to failed when keycloak is not authenticated', async () => {
    keycloakMock.authenticated = false;

    const store = createIntegrationStore({ leagueData: leagueDataReducer });
    const action = await store.dispatch(fetchRplTournamentsPage({ skip: 0, size: 10 }));

    expect(fetchRplTournamentsPage.rejected.match(action)).toBe(true);
    expect(store.getState().leagueData.status).toBe('failed');
    expect(store.getState().leagueData.error).toContain('User is not authenticated');
  });
});
