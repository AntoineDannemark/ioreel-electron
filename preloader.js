require('./node_modules/@capacitor-community/electron/dist/electron-bridge.js');
const { contextBridge, ipcRenderer } = require('electron') 

const path = require('path');
const fs = require('fs');

const generateApi = () => {
    const indexPath = (path.resolve(__dirname, 'src/api/index.json'))
    
    if (!fs.existsSync(indexPath)) return {};

    let index = JSON.parse(fs.readFileSync(indexPath)),
        api = {};

    index.entities.forEach(entity => api[entity] = {})
    
    index.routes.forEach(route => {
        api[route.entity][route.action] = (...args) => ipcRenderer.invoke(`${route.entity}/${route.action}`, ...args);
    })

    return api;
}

contextBridge.exposeInMainWorld(
    'api',
    {
        utils: {
            testDBConnection: options => ipcRenderer.invoke('test', options),        
        },
        ...generateApi()
    }
)
