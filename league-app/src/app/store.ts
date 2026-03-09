import { configureStore } from '@reduxjs/toolkit';
import { leagueDataReducer } from '../features/LeagueData/model/leagueDataSlice';

export const store = configureStore({
  reducer: {
    leagueData: leagueDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
