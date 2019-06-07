

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
 //prefixes of implementation that we want to test
         window.indexedDB = window.indexedDB || window.mozIndexedDB || 
         window.webkitIndexedDB || window.msIndexedDB;
         
         //prefixes of window.IDB objects
         window.IDBTransaction = window.IDBTransaction || 
         window.webkitIDBTransaction || window.msIDBTransaction;
         window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
         window.msIDBKeyRange
         
         if (!window.indexedDB) {
          window.alert("Your browser doesn't support a stable version of IndexedDB.")
        }

        const employeeData = [];
        var db;
        var request = window.indexedDB.open("database", 1);

        request.onerror = function(event) {
          console.log("error: ");
        };

        request.onsuccess = function(event) {
          db = request.result;
          console.log("success: "+ db);
        };

        request.onupgradeneeded = function(event) {
          var db = event.target.result;
          var objectStore = db.createObjectStore("likes", {keyPath: "id", autoIncrement: true});

         //  for (var i in employeeData) {
         //   objectStore.add(employeeData[i]);
         // }
       }

          function readAll() {
            var objectStore = db.transaction("employee").objectStore("employee");
            
            objectStore.openCursor().onsuccess = function(event) {
             var cursor = event.target.result;

             if (cursor) {
              alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
              cursor.continue();
            } else {
              alert("No more entries!");
            }
          };
        }

        function save_database(id, name, cuisine, address) {
         var request = db.transaction(["likes"], "readwrite")
          .objectStore("likes")
          .add({ restaurant_id: id, restaurant_name: name, restaurant_cuisine: cuisine, restaurant_address: address });

          request.onsuccess = function(event) {
           alert(name+" has been added to your database.");
         };

         request.onerror = function(event) {
           alert("Unable to add data\r\nKenny is aready exist in your database! ");
         }
       }

    $(function(){
      $('.ui.modal').modal({
        onDeny : function(){
          return false;
        },
        onPositive : function(){
          return false; 
        }
      });
      $('#save-button').click(function(){
        var rest_id = window.localStorage.getItem('idRest');
        var rest_name = $('#detail-title').html();
        var rest_cuisine = $('#detail-cuisine').html();
        var rest_address = $('#detail-address').html();
        save_database(rest_id, rest_name, rest_cuisine, rest_address);
        console.log('save finished');
      });
    });