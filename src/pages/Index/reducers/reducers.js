import { createSlice } from '@reduxjs/toolkit';

const { actions, reducer } = createSlice({
  name: 'index',
  initialState: {
    likeLen: 0
  },
  reducers: {
    setLikeLen(state, action) {
      state.likeLen = action.payload;
    }
  }
});

export const { setLikeLen } = actions;
export default { index: reducer };