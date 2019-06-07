var deferredPrompt;
var db;
var restaurant_data = [];
var restaurantsArea = document.querySelector('#places-home');
var savedRestaurantsArea = document.querySelector('#places-save');
//restaurantsArea
var touchmoved;


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
    var objectStore = db.createObjectStore("saved_places", { autoIncrement : true });
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
  var request = window.indexedDB.open("SavestaurantDB", 1);
  request.onerror = function(event) {
    console.log(request.errorCode);
  };
  request.onsuccess = function(event) {
    db = event.target.result;
    console.log('database fetched in add.');
    console.log(db);
  };

  var transaction = db.transaction(["saved_places"], "readwrite");

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
  // Do something when all the data is added to the database.
  
  transaction.oncomplete = function(event) {
    console.log("db fetched");
  };

  transaction.onerror = function(event) {
    alert('db fetch error');
  };

}

function get(){

}

function clearCards() {
  while(restaurantsArea.hasChildNodes()) {
    restaurantsArea.removeChild(restaurantsArea.lastChild);
  }
}

function clearCardsSaved() {
  while(savedRestaurantsArea.hasChildNodes()) {
    savedRestaurantsArea.removeChild(savedRestaurantsArea.lastChild);
  }
}

function fillModal(obj){
  var x = obj.attr("idrest");
  window.localStorage.setItem('idRest', x);
  var url_search = "https://developers.zomato.com/api/v2.1/restaurant?res_id="+x;
  fetch(url_search,{
    method:'GET',
    headers:{
      'Content-Type' : 'application/json',
      'user-key' : 'c98ef0400af4c8206ae32b844b5b7cd6'
    }
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    $('#detail-title').html(data['name']);
    $('#detail-title').attr('style', "font-family: 'Libre Franklin', sans-serif;");
    $('#detail-image').attr('src', data['featured_image']);
    $('#detail-address').html(data['location']['address']);
    $('#detail-cuisine').html(data['cuisines']);
    $('#detail-rating').html(data['user_rating']['aggregate_rating'] + '/5.0');
    $('#detail-average').html(data['average_cost_for_two'] + " " + data['currency'] + " (average cost for two people)");
    if(data['has_online_delivery'] == 0){
      $('#detail-delivery').html("Yes");
    }
    else{
      $('#detail-delivery').html("No");
    }
    if(data['has_table_booking'] == 0){
      $('#detail-booking').html("Yes");
    }
    else{
      $('#detail-booking').html("No");
    }
    $('#modal-detail')
    .modal('refresh')
    .modal('show'); 
    // $('#modal-detail').modal('refresh'); 
  });
}

function fillModalSave(obj){
  var x = obj.attr("idrest");
  window.localStorage.setItem('idRest', x);
  var url_search = "https://developers.zomato.com/api/v2.1/restaurant?res_id="+x;
  fetch(url_search,{
    method:'GET',
    headers:{
      'Content-Type' : 'application/json',
      'user-key' : 'c98ef0400af4c8206ae32b844b5b7cd6'
    }
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    $('#detail-title-save').html(data['name']);
    $('#detail-title-save').attr('style', "font-family: 'Libre Franklin', sans-serif;");
    $('#detail-image-save').attr('src', data['featured_image']);
    $('#detail-address-save').html(data['location']['address']);
    $('#detail-cuisine-save').html(data['cuisines']);
    $('#detail-rating-save').html(data['user_rating']['aggregate_rating'] + '/5.0');
    $('#detail-average-save').html(data['average_cost_for_two'] + " " + data['currency'] + " (average cost for two people)");
    if(data['has_online_delivery'] == 0){
      $('#detail-delivery-save').html("Yes");
    }
    else{
      $('#detail-delivery-save').html("No");
    }
    if(data['has_table_booking'] == 0){
      $('#detail-booking-save').html("Yes");
    }
    else{
      $('#detail-booking-save').html("No");
    }
    $('#modal-detail-save')
    .modal('refresh')
    .modal('show'); 
    // $('#modal-detail-save').modal('refresh');  
  });

}

function search(query){
  query = encodeURIComponent(query.trim())
  var url_search = "https://developers.zomato.com/api/v2.1/search?entity_id=74&entity_type=city&q="+query+"&count=30";
  fetch(url_search,{
    method:'GET',
    headers:{
      'Content-Type' : 'application/json',
      'user-key' : 'c98ef0400af4c8206ae32b844b5b7cd6'
    }
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    clearCards();
    createCards(data['restaurants']);
  });
}

function createCard(dataEach){
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'cardMain';
  cardWrapper.setAttribute("idRest", dataEach['id']);
  var cardTitle = document.createElement('div');
  cardTitle.style.backgroundImage = 'url("'+dataEach['featured_image']+'")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
    // cardTitle.className = 'class1 class2';

    cardWrapper.appendChild(cardTitle);
    var cardTitleTextElement = document.createElement('span');
    cardTitleTextElement.style.color = 'white';
    cardTitleTextElement.className = 'placeName';
    cardTitleTextElement.textContent = dataEach['name'];
    cardTitle.appendChild(cardTitleTextElement);
    var cardSupportingText = document.createElement('div');

    var cardAddr = document.createElement('div');
    var cardPhone = document.createElement('div');
    cardAddr.className = 'cityName';
    cardAddr.textContent = dataEach['location']['address'];
    cardPhone.className = 'phoneName';
    cardPhone.textContent = dataEach['cuisines'];
    var cardWrapRating = document.createElement('div');
    cardWrapRating.className = "ratingWrap";

    var cardRating = document.createElement('div');
    var textRating = document.createElement('span');
    textRating.textContent = " | " + dataEach['user_rating']['aggregate_rating'];
    // var spaceEnter = document.createElement('br');
    cardRating.className = "ui star rating";
    cardRating.setAttribute("data-max-rating", 5);

    // cardRating.setAttribute("data-rating",  Math.floor(dataEach['user_rating']['aggregate_rating'] * 10) / 10);
    cardRating.setAttribute("data-rating",  Math.floor(dataEach['user_rating']['aggregate_rating']));
    // cardSupportingText.textContent = data['location']['city'] + " | " + data['user_rating']['aggregate_rating'] + " stars";
    cardSupportingText.style.textAlign = 'center';
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  cardWrapRating.appendChild(cardRating);
  cardWrapRating.appendChild(textRating);
  cardSupportingText.appendChild(cardAddr);
  cardSupportingText.appendChild(cardPhone);
  cardSupportingText.appendChild(cardWrapRating);
  cardWrapper.appendChild(cardSupportingText);
  savedRestaurantsArea.appendChild(cardWrapper);
}

function createCards(data){
  var count = 0;
  var length = data.length;
  data.forEach(function(rest){
    dataEach = rest['restaurant'];
    var cardWrapper = document.createElement('div');
    cardWrapper.className = 'cardMain';
    cardWrapper.setAttribute("idRest", dataEach['id']);
    var cardTitle = document.createElement('div');
    cardTitle.style.backgroundImage = 'url("'+dataEach['featured_image']+'")';
    cardTitle.style.backgroundSize = 'cover';
    cardTitle.style.height = '180px';
    // cardTitle.className = 'class1 class2';

    cardWrapper.appendChild(cardTitle);
    var cardTitleTextElement = document.createElement('span');
    cardTitleTextElement.style.color = 'white';
    cardTitleTextElement.className = 'placeName';
    cardTitleTextElement.textContent = dataEach['name'];
    cardTitle.appendChild(cardTitleTextElement);
    var cardSupportingText = document.createElement('div');

    var cardAddr = document.createElement('div');
    var cardPhone = document.createElement('div');
    cardAddr.className = 'cityName';
    cardAddr.textContent = dataEach['location']['address'];
    cardPhone.className = 'phoneName';
    cardPhone.textContent = dataEach['cuisines'];
    var cardWrapRating = document.createElement('div');
    cardWrapRating.className = "ratingWrap";

    var cardRating = document.createElement('div');
    var textRating = document.createElement('span');
    textRating.textContent = " | " + dataEach['user_rating']['aggregate_rating'];
    // var spaceEnter = document.createElement('br');
    cardRating.className = "ui star rating";
    cardRating.setAttribute("data-max-rating", 5);

    // cardRating.setAttribute("data-rating",  Math.floor(dataEach['user_rating']['aggregate_rating'] * 10) / 10);
    cardRating.setAttribute("data-rating",  Math.floor(dataEach['user_rating']['aggregate_rating']));
    // cardSupportingText.textContent = data['location']['city'] + " | " + data['user_rating']['aggregate_rating'] + " stars";
    cardSupportingText.style.textAlign = 'center';
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  cardWrapRating.appendChild(cardRating);
  cardWrapRating.appendChild(textRating);
  cardSupportingText.appendChild(cardAddr);
  cardSupportingText.appendChild(cardPhone);
  cardSupportingText.appendChild(cardWrapRating);
  cardWrapper.appendChild(cardSupportingText);
  restaurantsArea.appendChild(cardWrapper);

  if(++count >= length){
    console.log('stopped');
    $(".rating").rating('disable');

    $('.cardMain').on('touchend', function(e){
      var obj_pressed = $(this);
      if(touchmoved != true){
        fillModal(obj_pressed);
      }
    }).on('touchmove', function(e){
      touchmoved = true;
    }).on('touchstart', function(){
      touchmoved = false;
    });

    // var x = document.getElementsByClassName("cardMain");
    // console.log(x.length);
    // for(var i=0; i<x.length;i++){
    //   x[i].addEventListener('touchend', fillModal);
    //   x[i].addEventListener('mouseup', fillModal, false);
    // }
  }

});
}

function fetch_saved(){
  var request = window.indexedDB.open("SavestaurantDB", 1);
  request.onerror = function(event) {
    console.log(request.errorCode);
  };
  request.onsuccess = function(event) {
    db = event.target.result;
    console.log('database fetched in get.');
    console.log(db);

    var saved_arr = [];
    var objectStore = db.transaction("saved_places").objectStore("saved_places");
    objectStore.openCursor().onsuccess = function(event){
      var cursor = event.target.result;
      if(cursor){
        saved_arr.push(cursor.value);
        cursor.continue();
      }
      else{
        console.log('done all data.');
        console.log(saved_arr);
        clearCardsSaved();
        saved_arr.forEach(function(val){
          console.log(val);
          var url_rest = "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + val['restaurant_id'];
          fetch(url_rest,{
            method:'GET',
            headers:{
              'Content-Type' : 'application/json',
              'user-key' : 'c98ef0400af4c8206ae32b844b5b7cd6'
            }
          })
          .then(function(res) {
            return res.json();
          })
          .then(function(data) {
            createCard(data);
            $(".rating").rating('disable');

            $('.cardMain').on('touchend', function(e){
              var obj_pressed = $(this);
              if(touchmoved != true){
                fillModalSave(obj_pressed);
              }
            }).on('touchmove', function(e){
              touchmoved = true;
            }).on('touchstart', function(){
              touchmoved = false;
            });
          });
        });
      }
    }
  }; 
}

var url = 'https://developers.zomato.com/api/v2.1/search?entity_id=74&entity_type=city&count=30';
var networkDataReceived = false;


function fetch_all(){
  fetch(url,{
    method:'GET',
    headers:{
      'Content-Type' : 'application/json',
      'user-key' : 'c98ef0400af4c8206ae32b844b5b7cd6'
    }
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    clearCards();
    createCards(data['restaurants']);
  });


  if ('caches' in window) {
    caches.match(url)
    .then(function(response) {
      if (response) {
        return response.json();
      }
    })
    .then(function(data) {
      console.log('From cache', data);
      if (!networkDataReceived) {
        clearCards();
        createCards(data['restaurants']);
      }
    });
  }
}