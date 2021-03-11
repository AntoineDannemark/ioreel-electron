import { app, ipcMain } from "electron";
import { createCapacitorElectronApp } from "@capacitor-community/electron";
import log from 'electron-log';

const path = require('path');
const fs = require('fs');

const storageApi = require('./storage').default;

let api;

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
ipcMain.handle('storage/getEndpoint', (_, isElectron) => {
    const res = storageApi.getEndpoint(isElectron);

    if (res && !api) {
        api = require('./api').default;
        generateIPCHandlers();
    }

    return res;
});

ipcMain.handle('storage/setEndpoint', (_, {endpoint, isElectron}) => {
    const res = storageApi.setEndpoint(endpoint, isElectron);
    
    if (res && !api) {
        api = require('./api').default;
        generateIPCHandlers();
    }

    return res;
});

ipcMain.handle('storage/clearEndpoint', (_, isElectron) => {
    const res = storageApi.clearEndpoint(isElectron);

    api = undefined;

    const indexPath = path.resolve(__dirname, '../src/api/index.json');
    
    type IRoute = {
        entity: string;
        action: string;
    }

    let routes: IRoute[] = JSON.parse(fs.readFileSync(indexPath)).routes;

    routes.forEach(route => {
        ipcMain.removeHandler(`${route.entity}/${route.action}`)
        log.info(`removed handler for ${route.entity}/${route.action}`)
    });

    return res;
});


const generateIPCHandlers = () => {
    if (!api) return null;
    
    const indexPath = path.resolve(__dirname, '../src/api/index.json');
    
    if (!fs.existsSync(indexPath)) return {};
    
    type IRoute = {
        entity: string;
        action: string;
    }

    let routes: IRoute[] = JSON.parse(fs.readFileSync(indexPath)).routes;

    return routes.forEach(route => {   
        log.info(`${route.entity}/${route.action}`);
        return ipcMain.handle(`${route.entity}/${route.action}`, async(_, ...args) => {
            return api[route.entity][route.action](...args)
        })
    })
}
