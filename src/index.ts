import { app, ipcMain } from "electron";
import { createCapacitorElectronApp } from "@capacitor-community/electron";

import api from './api';

const path = require('path');
const fs = require('fs');


// const isServerless = !!+process.env.IS_SLS

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
ipcMain.handle('test', async() => {
    /** 
    If (sls) {
        fetch(.../test)
    } else {
        return api.utils.testDBConnection();
    }
    **/
    return api.utils.testDBConnection();
});     

const generateHandlers = () => {
    const indexPath = path.resolve(__dirname, '../src/api/index.json');
    
    if (!fs.existsSync(indexPath)) return {};
    
    let routes = JSON.parse(fs.readFileSync(indexPath)).routes;

    return routes.forEach(route => {
        return ipcMain.handle(`${route.entity}/${route.action}`, async(_, ...args) => {
            return api[route.entity][route.action](...args)
        })
    })
}

generateHandlers()