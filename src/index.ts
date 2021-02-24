import { app, ipcMain } from "electron";
// import log from "electron-log"; 
import { createCapacitorElectronApp } from "@capacitor-community/electron";
import api from './api';

const isServerless = !!+process.env.IS_SLS

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
// ipcMain.on('log', (event, {type, message}) => { 
//     console.log(message)
//     switch (type) { 
//         default: 
//         case "info": 
//             log.info(message); 
//             break; 
//         case "warn": 
//             log.warn(message); 
//             break; 
//         case "error": 
//             log.error(message); 
//             break; 
//     } 
// })

// ipcMain.handle('create-tenant', async(event, tenant) => {
//     return api.createTenant(tenant);
// });

// ipcMain.handle('fetch-tenants', async() => {
//     return api.fetchTenants();
// })

// ipcMain.handle('update-tenant', async(event, {id, ...rest}) => {
//     return api.updateTenant(id, rest)
// })

// ipcMain.handle('remove-tenant', async(event, id) => {
//     return api.removeTenant(id);
// })

// ipcMain.handle('person/find-by-name', async(event, { firstname, lastname }) => {
//     return api.person.findByName(firstname, lastname)
// })

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

ipcMain.handle('env', async() => isServerless);

ipcMain.handle('person/fetchAll', async() => {
    return api.person.fetchAll();
})

ipcMain.handle('person/create', async(_,  person) => {
    return api.person.create(person);
})

ipcMain.handle('person/addPhone', async(event, {id, phone}) => {
    return api.person.addPhone(id, phone);
})

ipcMain.handle('phone/create', async(_, phone) => {
    return api.phone.create(phone)
})

// ipcMain.handle('person/add-address', async(event, {id, address}) => {
//     return api.person.addAddress(id, address);
// })