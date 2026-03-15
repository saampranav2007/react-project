import { combineReducers } from '@reduxjs/toolkit';
// You will import your feature slices here later (e.g., authSlice, loanSlice)

const rootReducer = combineReducers({
  // placeholder reducer so the store doesn't crash on setup
  app: (state = {}) => state, 
});

export default rootReducer;