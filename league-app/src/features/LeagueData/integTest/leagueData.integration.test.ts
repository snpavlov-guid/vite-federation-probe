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
  fetchStandings: typeof import('../model/leagueDataSlice').fetchStandings;
  leagueDataReducer: typeof import('../model/leagueDataSlice').leagueDataReducer;
};

let fetchRplTournamentsPage: LeagueDataSliceModule['fetchRplTournamentsPage'];
let fetchStandings: LeagueDataSliceModule['fetchStandings'];
let leagueDataReducer: LeagueDataSliceModule['leagueDataReducer'];

describe('LeagueData backend integration', () => {
  beforeAll(async () => {
    const module = (await import('../model/leagueDataSlice')) as LeagueDataSliceModule;
    fetchRplTournamentsPage = module.fetchRplTournamentsPage;
    fetchStandings = module.fetchStandings;
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

  it('fetches standings via real backend and updates Redux state', async () => {
    const token = await getAccessTokenFromTestAuth();
    keycloakMock.token = token;

    const store = createIntegrationStore({ leagueData: leagueDataReducer });
    const statuses: string[] = [];
    const unsubscribe = store.subscribe(() => {
      statuses.push(store.getState().leagueData.standingsStatus);
    });

    expect(store.getState().leagueData.standingsStatus).toBe('idle');

    const action = await store.dispatch(
      fetchStandings({
        leagueId: 1,
        stageId: 69,
        tournamentId: 44,
        prevStageId: 1,
        prevPlays: 'ALLPLAYS',
      }),
    );
    unsubscribe();

    expect(fetchStandings.fulfilled.match(action)).toBe(true);
    expect(statuses).toContain('loading');
    expect(store.getState().leagueData.standingsStatus).toBe('succeeded');
    expect(store.getState().leagueData.standingsError).toBeNull();
    expect(store.getState().leagueData.standingsData).toBeInstanceOf(Array);
    expect(store.getState().leagueData.standingsData[0]?.items).toBeInstanceOf(Array);

    if ((store.getState().leagueData.standingsData[0]?.items.length ?? 0) > 0) {
      const firstItem = store.getState().leagueData.standingsData[0].items[0];
      expect(typeof firstItem.place).toBe('number');
      expect(firstItem.place).toBe(1);
      expect(typeof firstItem.teamId).toBe('number');
      expect(typeof firstItem.teamName).toBe('string');
      expect(typeof firstItem.points).toBe('number');
    }

    expect(keycloakMock.updateToken).toHaveBeenCalledWith(30);
  });

  it.each([
    { leagueId: 1, tournamentId: 12, stageId: 22, groups: ['A', 'B'] as const },
    { leagueId: 1, tournamentId: 32, stageId: 45, groups: ['A', 'B'] as const },
  ])(
    'fetches grouped standings with pair requests (leagueId=$leagueId, tournamentId=$tournamentId, stageId=$stageId)',
    async ({ leagueId, tournamentId, stageId, groups }) => {
      const token = await getAccessTokenFromTestAuth();
      keycloakMock.token = token;

      const store = createIntegrationStore({ leagueData: leagueDataReducer });
      const action = await store.dispatch(
        fetchStandings({
          leagueId,
          tournamentId,
          stageId,
          groups: [...groups],
        }),
      );

      expect(fetchStandings.fulfilled.match(action)).toBe(true);
      expect(store.getState().leagueData.standingsStatus).toBe('succeeded');
      expect(store.getState().leagueData.standingsData).toHaveLength(2);
      expect(
        store.getState().leagueData.standingsData.map((item: { group: string | null }) => item.group),
      ).toEqual(['A', 'B']);
      expect(store.getState().leagueData.standingsData[0]?.items).toBeInstanceOf(Array);
      expect(store.getState().leagueData.standingsData[1]?.items).toBeInstanceOf(Array);
    },
  );

  it('moves standings state to failed when keycloak is not authenticated', async () => {
    keycloakMock.authenticated = false;

    const store = createIntegrationStore({ leagueData: leagueDataReducer });
    const action = await store.dispatch(fetchStandings({ leagueId: 1, stageId: 69, tournamentId: 44 }));

    expect(fetchStandings.rejected.match(action)).toBe(true);
    expect(store.getState().leagueData.standingsStatus).toBe('failed');
    expect(store.getState().leagueData.standingsError).toContain('User is not authenticated');
  });
});
