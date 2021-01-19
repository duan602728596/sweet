import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// mock
const res = [
  { id: '0', name: '关羽' },
  { id: '1', name: '刘备' },
  { id: '2', name: '夏侯惇' }
];

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
}

export const requestList = createAsyncThunk('list/requestList', async function() {
  await sleep(1000);

  return res;
});

const initialState = globalThis?.__INITIAL_STATE__;
const { actions, reducer } = createSlice({
  name: 'list',
  initialState: initialState?.list ?? {
    dataList: []
  },
  reducers: {},
  extraReducers: {
    [requestList.fulfilled](state, action) {
      state.dataList = action.payload;
    }
  }
});

export default { list: reducer };