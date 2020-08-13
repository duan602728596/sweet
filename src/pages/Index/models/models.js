import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'index',
  initialState: {
    likeLen: 0
  },
  reducers: {
    setLikeLen(state, action) {
      state.likeLen = action.payload;

      return state;
    }
  }
});

export const { setLikeLen } = counterSlice.actions;
export default { index: counterSlice.reducer };