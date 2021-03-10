export default (isElectron: boolean) => {
    try {
        let endpoint;

        if (isElectron) {
            const Store = require('electron-store');

            endpoint = new Store().get('endpoint');              
        } else {
            const store = window.localStorage;

            endpoint = store.getItem('endpoint');
        }
        return endpoint;
    } catch(err) {
        throw new Error(err)
    } 
}