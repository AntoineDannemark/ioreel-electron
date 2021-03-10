import setEndpoint from './actions/setEndpoint';
import getEndpoint from './actions/getEndpoint';

let storageApi = {
    setEndpoint,
    getEndpoint,
}

export type StorageApi = typeof storageApi;
export default storageApi;