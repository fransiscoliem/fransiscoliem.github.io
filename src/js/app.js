
var deferredPrompt;

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

const request = window.indexedDB.open("database", 1);
// Create schema
request.onupgradeneeded = event => {
    const db = event.target.result;
    
    const likes_store = db.createObjectStore(
        "likes",
        { keyPath: ["restaurant_id", "row"] }
    );
    fileStore.createIndex("LikesIndex", "row");    
};

$(function(){
  $('.ui.modal').modal();
});