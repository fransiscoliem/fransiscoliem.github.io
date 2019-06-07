var deferredPrompt;
var db;
var restaurant_data = [];

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

document.getElementById("search-text").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("search-button").click();
  }
});

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}else{
  var request = window.indexedDB.open("SavestaurantDB", 1);
  request.onerror = function(event) {
    console.log(request.errorCode);
  };
  request.onsuccess = function(event) {
    db = event.target.result;
    console.log('database fetched.');
    console.log(db);
  };
  request.onupgradeneeded = function(event) { 
    // Save the IDBDatabase interface 
    db = event.target.result;

    const restaurantData = [
    { restaurant_id: 1, restaurant_name: "Res1", restaurant_cuisine: "cui1", restaurant_address: "add1" },
    { restaurant_id: 2, restaurant_name: "Res2", restaurant_cuisine: "cui2", restaurant_address: "add2" },
    ];
    // Create an objectStore for this database
    var objectStore = db.createObjectStore("saved_places", { keyPath: "restaurant_id" });
    objectStore.transaction.oncomplete = function(event) {
    // Store values in the newly created objectStore.
    // var savedObjectStore = db.transaction("saved_places", "readwrite").objectStore("saved_places");
    // restaurantData.forEach(function(rest) {
    //   savedObjectStore.add(rest);
    // });
    console.log('db created and added');
    console.log(db);
  };
};
}

function add(rest_id, rest_name, rest_cuisine, rest_address){
  var transaction = db.transaction(["saved_places"], "readwrite");
  // Do something when all the data is added to the database.
  transaction.oncomplete = function(event) {
    alert("db fetched");
  };

  transaction.onerror = function(event) {
    alert('db fetch error');
  };

  var objectStore = transaction.objectStore("saved_places");
  var add_data = {
    restaurant_id:rest_id,
    restaurant_name:rest_name,
    restaurant_cuisine:rest_cuisine,
    restaurant_address:rest_address,
  };
  var request = objectStore.add(add_data);
  request.onsuccess = function(event) {
    console.log('data added with key : ' + event.target.result);
  };
}

function get(){
  var objectStore = db.transaction("saved_places").objectStore("saved_places");
  objectStore.openCursor().onsuccess = function(event){
    var cursor = event.target.result;
    if(cursor){
      console.log(cursor.key + ":" + cursor.value.restaurant_name);
      cursor.continue();
    }
    else{
      console.log('done all data.');
    }
  }
}

$(function(){
  $('.ui.modal').modal({
    onPositive : function(){
      return false; 
    }
  });
  $('#save-button').click(function(){
    var rest_id = window.localStorage.getItem('idRest');
    var rest_name = $('#detail-title').html();
    var rest_cuisine = $('#detail-cuisine').html();
    var rest_address = $('#detail-address').html();
    add(rest_id, rest_name, rest_cuisine, rest_address);
    console.log('save finished');
    get();
    });
  $('#search-button').click(function(){
    var search_query = $('#search-text').val();
    search(search_query);
    console.log('searched');
  })
});