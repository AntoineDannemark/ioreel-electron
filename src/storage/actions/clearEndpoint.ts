export default (isElectron: boolean) => {
    try {
        if (isElectron) {
            const Store = require('electron-store');
    
            const store = new Store();
    
            store.delete('endpoint');
        } else {           
            const store = window.localStorage;

            store.removeItem('endpoint')
        }     
        return true;  
    } catch (err) {
        throw new Error(err)
    }
}