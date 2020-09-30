import HtmlService from './HtmlService.js';
import PhotosService from './PhotosService.js';

class App {

  constructor() {
    this.registerServiceWorker();
    this.start();
  }

  start() {
    const photosService = new PhotosService();
    new HtmlService(photosService);
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      const onsuccess = () => console.log('[Service Worker] Registered');
      const onfailure = () => console.log('[Service Worker] Failed');

      navigator.serviceWorker
        .register('serviceWorker.js')
        .then(onsuccess)
        .catch(onfailure);
    }
  }
}

new App();
