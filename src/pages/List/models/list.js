import { makeAutoObservable, runInAction } from 'mobx';

function requestMock(time) {
  const mockData = [
    { id: '0', name: '关羽' },
    { id: '1', name: '刘备' },
    { id: '2', name: '夏侯惇' }
  ];

  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve(mockData);
    }, time);
  });
}

class List {
  dataList = [];

  constructor() {
    makeAutoObservable(this);
  }

  async requestList() {
    const res = await requestMock(1000);

    runInAction(() => {
      this.dataList = res;
    });
  }
}

const listStore = new List();

export default listStore;