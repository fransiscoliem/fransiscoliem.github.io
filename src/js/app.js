

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
var request = window.indexedDB.open("database", 1);
var db;
// Create schema
request.onupgradeneeded = event => {
  const db_create = event.target.result;

  const likes_store = db_create.createObjectStore(
    "likes",
    { keyPath: ["restaurant_id"] }
    );  
  console.log('db created : ' + db_create);
};
request.onsuccess = event => {
  db = request.result;
  console.log('db opened : ' + db);
};

function save_database(id, name, cuisine, address){
  console.log(id + name + cuisine + address);
  var reqAdd = db.transaction("likes","readwrite")
  .objectStore("likes")
  .add({ restaurant_id: id, restaurant_name: name, restaurant_cuisine: cuisine, restaurant_address: address });
    // Clean up: close connection
    reqAdd.onsuccess = () => {
      console.log('suc');
    };
    reqAdd.oncomplete = () => {
      alert('com');
    };
    reqAdd.onerror = () => {
      console.log('err');
    };
    reqAdd.onabort = () => {
      console.log('ab');
    };
  }

    // <div class="ui header">Restauran Detail : </div>
    //     <table class="ui very basic table">
    //         <tbody>
    //           <tr>
    //             <td>Cuisine</td>
    //             <td id="detail-cuisine"></td>
    //           </tr>
    //           <tr>
    //             <td>Address</td>
    //             <td id="detail-address"></td>
    //           </tr>
    //           <tr>
    //            <td>Rating</td>
    //             <td id="detail-rating"></td>
    //           </tr>
    //           <tr>
    //            <td>Average Cost</td>
    //             <td id="detail-average"></td>
    //           </tr>
    //            <tr>
    //            <td>Online Delivery</td>
    //             <td id="detail-delivery"></td>
    //           </tr>
    //            <tr>
    //            <td>Table Booking</td>
    //             <td id="detail-booking"></td>
    //           </tr>
    //         </tbody>
    //       </table> 

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