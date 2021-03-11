import setEndpoint from './actions/setEndpoint';
import getEndpoint from './actions/getEndpoint';
import clearEndpoint from './actions/clearEndpoint';

let storageApi = {
    setEndpoint,
    getEndpoint,
    clearEndpoint
}

export type StorageApi = typeof storageApi;
export default storageApi;