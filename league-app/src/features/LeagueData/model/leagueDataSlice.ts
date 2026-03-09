import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { keycloak } from '../../Auth';
import { leagueDataEnv } from './env';
import type { LeagueDataState, LeagueTournamensResult } from './types';

const initialState: LeagueDataState = {
  status: 'idle',
  data: null,
  error: null,
};

interface FetchRplTournamentsPageArgs {
  skip: number;
  size: number;
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
      });
  },
});

export const leagueDataReducer = leagueDataSlice.reducer;
