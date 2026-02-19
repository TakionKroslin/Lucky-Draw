const { app, BrowserWindow, session } = require('electron');

function setupAvatarRequestHeaders() {
  // Some avatar CDNs reject requests without browser-like headers in Electron.
  const ses = session.defaultSession;
  const avatarHostPattern = /^https:\/\/(pic1\.imgdb\.cn|api\.dicebear\.com)\//i;
  ses.webRequest.onBeforeSendHeaders((details, callback) => {
    if (avatarHostPattern.test(details.url)) {
      details.requestHeaders['User-Agent'] =
        details.requestHeaders['User-Agent'] ||
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Electron/${process.versions.electron} Safari/537.36`;
      details.requestHeaders['Referer'] = details.requestHeaders['Referer'] || 'https://pic1.imgdb.cn/';
    }
    callback({ requestHeaders: details.requestHeaders });
  });
}

function createWindow() {
  // Keep a fixed classic window config for classroom machines.
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    autoHideMenuBar: true,
    backgroundColor: '#f0f7f2',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  setupAvatarRequestHeaders();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
