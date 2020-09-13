const postData = {
  key1: 'value1',
  key2: 'value2',
  deleteKey1: '',
  deleteKey2: '',
  deleteKey3: '',
};
['deleteKey1', 'deleteKey2', 'deleteKey3']
  .forEach(key => delete postData[key]);
console.log(postData)
// { key1: 'value1', key2: 'value2' }