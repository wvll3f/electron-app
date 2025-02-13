const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { db, createTable, getAllMacro, insertMacro } = require('./db/db.js')

try {
  require('electron-reloader')(module);
} catch (_) { }

let macroWindow;
const createMacroWindow = () => {
  const father = BrowserWindow.getFocusedWindow()
  if (father) {
    const macroWindow = new BrowserWindow({
      maxWidth: 500,
      maxHeight: 250,
      fixed: false,
      resizable: true,
      transparent: true,
      roundedCorners: true,
      autoHideMenuBar: true,
      frame:false,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });
    macroWindow.loadFile(path.join(__dirname, 'create.html'));
  }

  ipcMain.on('close-app', () => {
    mainWindow.close();
  });
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    minHeight: 150,
    minWidth: 400,
    width: 200,
    height: 160,
    maxWidth: 800,
    maxHeight: 600,
    fixed: false,
    resizable: true,
    transparent: true,
    roundedCorners: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  ipcMain.on('close-app', () => {
    mainWindow.close();
  });

  ipcMain.on('minimize-app', () => {
    mainWindow.minimize();
  });

  ipcMain.on('fixed-app', (event, appStatus) => {
    console.log(appStatus);
    if (typeof appStatus === 'boolean') {
      mainWindow.setAlwaysOnTop(appStatus);
    } else {
      console.error('Expected a boolean value for appStatus');
    }
  });

  ipcMain.handle('add-macro', async (event, macro) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO macro (title, message) VALUES (?, ?)',
        [macro.title, macro.message],
        function (err) {
          if (err) {
            reject(err.message);
          } else {
            db.get('SELECT * FROM macro WHERE id = ?', [this.lastID], (err, row) => {
              if (err) {
                reject(err.message);
              } else {
                resolve(row);
              }
            });
          }
        }
      );
    });
  });

  ipcMain.handle('get-macros', async () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM macro', [], (err, rows) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.on('new-macro-window', () => {
    createMacroWindow()
  })
};

app.whenReady().then(async () => {
  createWindow();
  createTable()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
