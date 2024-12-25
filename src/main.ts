import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { getCurrentWindow } from '@tauri-apps/api/window';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

window.addEventListener('DOMContentLoaded', () => {

  const appWindow = getCurrentWindow();

  if (appWindow ) {
    // Add events to the custom title bar buttons
    document.getElementById('titlebar-minimize')?.addEventListener('click', () => {
      appWindow.minimize(); 
    });

    document.getElementById('titlebar-maximize')?.addEventListener('click', () => {
      appWindow.toggleMaximize(); 
    });

    document.getElementById('titlebar-close')?.addEventListener('click', () => {
      appWindow.close(); 
    });
  } else {
    console.error('Tauri is not available!');
  }
});
