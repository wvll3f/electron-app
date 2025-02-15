const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const { db, createTable, getAllMacro, insertMacro } = require('./db/db.js')

try {
  require('electron-reloader')(module);
} catch (_) { }

const createMacroWindow = () => {
  const father = BrowserWindow.getFocusedWindow()
  if (father) {
    const macroWindow = new BrowserWindow({
      width: 500,
      height: 350,
      fixed: false,
      resizable: true,
      transparent: true,
      roundedCorners: true,
      autoHideMenuBar: true,
      frame: false,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, '/createview/preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      },
    });
    macroWindow.loadFile(path.join(__dirname, '/createview/create.html'));

    ipcMain.on('close-app-macro', () => {
      try {
        macroWindow.close();
      } catch (error) {
        console.error(error)
      }
    });

    ipcMain.on('send-message', (event, dados) => {
      const { titulo, mensagem } = dados;

      const stmt = db.prepare('INSERT INTO macro (title, message) VALUES (?, ?)');
      stmt.run(titulo, mensagem, (err) => {
        if (err) {
          console.error('Erro ao inserir dados:', err);
        } else {
          ('Dados inseridos com sucesso!');
        }
      });

      stmt.finalize();
    });

  }
};

const selectedMacro = (id) => {

  ('id recebido: ' + id);

  // Prepara a consulta SQL
  const stmt = db.prepare('SELECT * FROM macro WHERE id = ?');

  // Executa a consulta usando um callback para pegar o resultado
  stmt.get(id, (err, item) => {
    if (err) {
      console.error('Erro ao buscar item:', err);
      return;
    }

    ('Item encontrado:', item);

    const selectedWindow = new BrowserWindow({
      width: 600,
      height: 400,
      fixed: false,
      resizable: true,
      transparent: true,
      roundedCorners: true,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, './selectedview/preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      },
    });

    selectedWindow.loadFile(path.join(__dirname, '/selectedview/macro.html'));

    ipcMain.on('close-selected', () => {
      try {
        if (selectedWindow && !selectedWindow.isDestroyed()) {
          selectedWindow.close();
        }
      } catch (error) {
        console.error(error);
      }
    });

    // Envia os dados para o renderer após o carregamento da janela
    selectedWindow.webContents.on('did-finish-load', () => {
      selectedWindow.webContents.send('detalhes-item', item);
    });
  });
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    minHeight: 150,
    minWidth: 400,
    width: 200,
    height: 400,
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
    (appStatus);
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
    (__dirname)
    createMacroWindow()
  })

  ipcMain.on('selected-macro-window', (event, id) => {
    ('id chegando: ' + id)
    selectedMacro(id)
  })

  ipcMain.on('delete-selected-macro', (event, id) => {

    try {
      const stmt = db.prepare('DELETE FROM macro WHERE id = ?');
      const result = stmt.run(id);

      if (result.changes > 0) {
        ('Linha deletada com sucesso!');
      } else {
        ('Nenhuma linha encontrada com esse ID.');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error.message);
    }

  });
}
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
