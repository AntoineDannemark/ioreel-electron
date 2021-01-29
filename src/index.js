import { app, ipcMain } from "electron";
import { createCapacitorElectronApp } from "@capacitor-community/electron";

const {initDB, createTenant, fetchTenants, updateTenant, removeTenant} = require('./db').api

// Enable contextIsolation for security, the API will be exposed through the preloader script
// See https://www.electronjs.org/docs/tutorial/context-isolation
const capacitorAppOptions = {
    mainWindow: {
        windowOptions: {
            webPreferences: {
                contextIsolation: true,
            }
        }
    }
}

// The MainWindow object can be accessed via myCapacitorApp.getMainWindow()
const myCapacitorApp = createCapacitorElectronApp(capacitorAppOptions);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on("ready", () => {
    myCapacitorApp.init();
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) myCapacitorApp.init();
});

// Define any IPC or other custom functionality below here
ipcMain.handle("init-db", async function(event, arg) {
    return initDB(arg);
});     

ipcMain.handle('create-tenant', async(event, tenant) => {
    return createTenant(tenant);
});

ipcMain.handle('fetch-tenants', async() => {
    return fetchTenants();
})

ipcMain.handle('update-tenant', async(event, {id, ...rest}) =>{
    return updateTenant(id, rest)
})

ipcMain.handle('remove-tenant', async(event, id) => {
    return removeTenant(id);
})