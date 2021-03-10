import { Endpoint } from '../types';

export default (
    endpoint: Endpoint,
    isElectron: boolean
) => {
    if (!endpoint) throw new Error("No endpoint given");

    try {
        if (isElectron) {
            const Store = require('electron-store');
    
            const store = new Store();
    
            store.set('endpoint', endpoint);
        } else {           
            const store = window.localStorage;

            store.setItem('endpoint', endpoint)
        }     
        return true;  
    } catch (err) {
        throw new Error(err)
    }
}