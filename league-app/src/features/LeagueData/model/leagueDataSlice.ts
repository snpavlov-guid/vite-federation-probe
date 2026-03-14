import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { keycloak } from '../../Auth';
import { leagueDataEnv } from './env';
import type { LeagueDataState, LeagueTournamensResult, StandingItem, StandingsGroupBlock } from './types';

const initialState: LeagueDataState = {
  status: 'idle',
  data: null,
  error: null,
  standingsStatus: 'idle',
  standingsData: [],
  standingsError: null,
};

interface FetchRplTournamentsPageArgs {
  skip: number;
  size: number;
}

interface FetchStandingsArgs {
  leagueId: number;
  stageId: number;
  tournamentId: number;
  tgroup?: string | null;
  groups?: string[] | null;
  prevStageId?: number | null;
  prevPlays?: string | null;
}

const DEFAULT_STAGE_NAME = 'Регулярный сезон';

const buildRplTournamentsUrl = ({ skip, size }: FetchRplTournamentsPageArgs): string => {
  const trimmedBaseUrl = leagueDataEnv.apiUrl.replace(/\/+$/, '');
  const queryParams = new URLSearchParams({
    order: 'desc',
    skip: String(skip),
    size: String(size),
  });
  return `${trimmedBaseUrl}/tournaments/rpl?${queryParams.toString()}`;
};

const buildStandingsUrl = ({
  leagueId,
  stageId,
  tournamentId,
  tgroup,
  prevStageId,
  prevPlays,
}: FetchStandingsArgs): string => {
  const trimmedBaseUrl = leagueDataEnv.apiUrl.replace(/\/+$/, '');
  const queryParams = new URLSearchParams({
    leagueId: String(leagueId),
    stageId: String(stageId),
    tournamentId: String(tournamentId),
  });

  if (typeof tgroup === 'string' && tgroup.trim().length > 0) {
    queryParams.set('tgroup', tgroup.trim());
  }

  if (typeof prevStageId === 'number') {
    queryParams.set('prevstageid', String(prevStageId));
  }

  if (typeof prevPlays === 'string' && prevPlays.trim().length > 0) {
    queryParams.set('prevplays', prevPlays.trim());
  }

  return `${trimmedBaseUrl}/standings?${queryParams.toString()}`;
};

const getBearerToken = async (): Promise<string> => {
  if (!keycloak.authenticated) {
    throw new Error('User is not authenticated in Keycloak.');
  }

  await keycloak.updateToken(30);

  if (!keycloak.token?.trim()) {
    throw new Error('Keycloak token is missing.');
  }

  return keycloak.token;
};

const normalizeRplTournamentsResult = (payload: LeagueTournamensResult): LeagueTournamensResult => ({
  ...payload,
  items: payload.items.map((tournament) => ({
    ...tournament,
    stages: tournament.stages.map((stage) => {
      const normalizedName =
        typeof stage.name === 'string' && stage.name.trim().length > 0
          ? stage.name
          : DEFAULT_STAGE_NAME;

      return {
        ...stage,
        name: normalizedName,
      };
    }),
  })),
});

const withPlace = (items: unknown[]): StandingItem[] =>
  items.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error('Unexpected standings item format.');
    }

    return {
      ...(item as Omit<StandingItem, 'place'>),
      place: index + 1,
    };
  });

const normalizeStandingsResult = (payload: unknown): StandingItem[] => {
  if (Array.isArray(payload)) {
    return withPlace(payload);
  }

  if (payload && typeof payload === 'object') {
    const wrapped = payload as Record<string, unknown>;

    if (Array.isArray(wrapped.data)) {
      return withPlace(wrapped.data);
    }

    if (Array.isArray(wrapped.items)) {
      return withPlace(wrapped.items);
    }

    if (Array.isArray(wrapped.standings)) {
      return withPlace(wrapped.standings);
    }
  }

  throw new Error('Unexpected standings response format.');
};

export const fetchRplTournamentsPage = createAsyncThunk<
  LeagueTournamensResult,
  FetchRplTournamentsPageArgs,
  { rejectValue: string }
>('leagueData/fetchRplTournamentsPage', async (args, { rejectWithValue }) => {
  try {
    const token = await getBearerToken();
    const response = await fetch(buildRplTournamentsUrl(args), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to fetch tournaments/rpl (${response.status}): ${errorBody || response.statusText}`,
      );
    }

    const payload = (await response.json()) as LeagueTournamensResult;
    return normalizeRplTournamentsResult(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error while fetching league data.';
    return rejectWithValue(message);
  }
});

export const fetchStandings = createAsyncThunk<
  StandingsGroupBlock[],
  FetchStandingsArgs,
  { rejectValue: string }
>('leagueData/fetchStandings', async (args, { rejectWithValue }) => {
  try {
    const token = await getBearerToken();

    const fetchGroupStandings = async (requestArgs: FetchStandingsArgs): Promise<StandingItem[]> => {
      const response = await fetch(buildStandingsUrl(requestArgs), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch standings (${response.status}): ${errorBody || response.statusText}`);
      }

      const payload = (await response.json()) as unknown;
      return normalizeStandingsResult(payload);
    };

    const rawGroups = Array.isArray(args.groups) ? args.groups : [];
    const groups = rawGroups
      .filter((group): group is string => typeof group === 'string' && group.trim().length > 0)
      .map((group) => group.trim());

    if (groups.length > 0) {
      return Promise.all(
        groups.map(async (group) => ({
          group,
          items: await fetchGroupStandings({ ...args, tgroup: group }),
        })),
      );
    }

    const normalizedSingleGroup =
      typeof args.tgroup === 'string' && args.tgroup.trim().length > 0 ? args.tgroup.trim() : null;

    return [
      {
        group: normalizedSingleGroup,
        items: await fetchGroupStandings({ ...args, tgroup: normalizedSingleGroup }),
      },
    ];
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while fetching standings.';
    return rejectWithValue(message);
  }
});

const leagueDataSlice = createSlice({
  name: 'leagueData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRplTournamentsPage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRplTournamentsPage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRplTournamentsPage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch tournaments/rpl.';
      })
      .addCase(fetchStandings.pending, (state) => {
        state.standingsStatus = 'loading';
        state.standingsError = null;
      })
      .addCase(fetchStandings.fulfilled, (state, action) => {
        state.standingsStatus = 'succeeded';
        state.standingsData = action.payload;
      })
      .addCase(fetchStandings.rejected, (state, action) => {
        state.standingsStatus = 'failed';
        state.standingsError = action.payload ?? 'Failed to fetch standings.';
      });
  },
});

export const leagueDataReducer = leagueDataSlice.reducer;
