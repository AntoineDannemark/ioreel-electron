require('./node_modules/@capacitor-community/electron/dist/electron-bridge.js');

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    'api',
    {
      initDB: platform => ipcRenderer.invoke('init-db', platform),
      createTenant: tenant => ipcRenderer.invoke('create-tenant', tenant),
      fetchTenants: () => ipcRenderer.invoke('fetch-tenants'),
      updateTenant: (id, data) => ipcRenderer.invoke('update-tenant', {id, ...data}),
      removeTenant: id => ipcRenderer.invoke('remove-tenant', id),
    }
  )
