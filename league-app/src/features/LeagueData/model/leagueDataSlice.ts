import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { keycloak } from '../../Auth';
import { leagueDataEnv } from './env';
import type { LeagueDataState, RplTournamentsResponse } from './types';

const initialState: LeagueDataState = {
  status: 'idle',
  data: null,
  error: null,
};

const buildRplTournamentsUrl = (): string => {
  const trimmedBaseUrl = leagueDataEnv.apiUrl.replace(/\/+$/, '');
  return `${trimmedBaseUrl}/tournaments/rpl`;
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

export const fetchRplTournaments = createAsyncThunk<
  RplTournamentsResponse,
  void,
  { rejectValue: string }
>('leagueData/fetchRplTournaments', async (_, { rejectWithValue }) => {
  try {
    const token = await getBearerToken();
    const response = await fetch(buildRplTournamentsUrl(), {
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

    const payload = (await response.json()) as RplTournamentsResponse;
    return payload;
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
      .addCase(fetchRplTournaments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRplTournaments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRplTournaments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch tournaments/rpl.';
      });
  },
});

export const leagueDataReducer = leagueDataSlice.reducer;
