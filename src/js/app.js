
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
    { keyPath: ["restaurant_id"] }
    );  
};

function save_database(id, name, cuisine, address){
  const request = window.indexedDB.open("database", 1);
  
    console.log(id + name + cuisine + address);
  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction(
      ['likes'],
      "readwrite"
      );
    const likesStore = transaction.objectStore("likes");
    
    // Add data
    likesStore.add(
      { restaurant_id: id, restaurant_name: name, restaurant_cuisine: cuisine, restaurant_address: address }
      );
    // Clean up: close connection
    transaction.oncomplete = () => {
      db.close();
    };
  };
  request.onerror = () => {
    alert('fail');
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
  });
});