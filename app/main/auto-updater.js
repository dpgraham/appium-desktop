import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

function connectAutoUpdater (win) {

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = "info";

  log('Looking for updates');
  autoUpdater.checkForUpdates();

  autoUpdater.on('checking-for-update', () => {
    log('Checking for an update!');
    win.webContents.send('checking-for-update');
  });

  autoUpdater.on('update-not-available', () => {
    log('Update is not available');
    win.webContents.send('update-not-available');
  });

  autoUpdater.on('update-available', () => {
    log('Update is available');
    win.webContents.send('update-available');
  });

  autoUpdater.on('update-downloaded', () => {
    log('Update downloaded');
    win.webContents.send('update-downloaded');
  });

  autoUpdater.on('error', () => {
    log('Update error');
    win.webContents.send('update-error');
  });
}

export { connectAutoUpdater };