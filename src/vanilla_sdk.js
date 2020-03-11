import EF from './sdk.js'

const paramsProvider = Promise.resolve({});
const globalInstance = new EF(paramsProvider);

export default globalInstance;
