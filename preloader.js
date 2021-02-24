require('./node_modules/@capacitor-community/electron/dist/electron-bridge.js');

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    'api',
    {        
        utils: {
            testDBConnection: options => ipcRenderer.invoke('test', options),        
        },
        person: {
            create: (options, person) => ipcRenderer.invoke('person/create', {options, person}),
            fetchAll: () => ipcRenderer.invoke('person/fetchAll'),
            addPhone: (id, phone) => ipcRenderer.invoke('person/addPhone', { id, phone }),
        },
        phone: {
            create: phone => ipcRenderer.invoke('phone/create', phone),
        },
        // createTenant: tenant => ipcRenderer.invoke('create-tenant', tenant),
        // fetchTenants: () => ipcRenderer.invoke('fetch-tenants'),
        // updateTenant: (id, data) => ipcRenderer.invoke('update-tenant', { id, ...data }),
        // removeTenant: id => ipcRenderer.invoke('remove-tenant', id),
        // person: {
        //     findByName: (firstname, lastname) => ipcRenderer.invoke('person/find-by-name', { firstname, lastname }),
        //     addPhone: (id, phone) => ipcRenderer.invoke('person/add-phone', { id, phone }),
        //     addAddress: (id, address) => ipcRenderer.invoke('person/add-address', { id, address }),
        // },
    }
)
