const url = require('url').format({
  protocol: 'file',
  slashes:true,
  pathname: require('path').join(__dirname, 'index.html')
});

const {app, BrowserWindow} = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    resizable: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#000',
      symbolColor: '#fff'
    },
    width: 400,
    height: 800,
    maxWidth: 400,
    maxHeight: 800
  });

  win.loadURL(url);

  win.on('closed', function () {
    win = null;
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', function() {
  app.quit();
})
