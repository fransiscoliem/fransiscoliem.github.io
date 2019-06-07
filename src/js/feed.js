var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#places-home');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

// shareImageButton.addEventListener('click', openCreatePostModal);

// closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise
function onSaveButtonClicked(event) {
  console.log('clicked');
  if ('caches' in window) {
    caches.open('user-requested')
    .then(function(cache) {
      cache.add('https://httpbin.org/get');
      cache.add('/src/images/sf-boat.jpg');
    });
  }
}

function clearCards() {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

// <div class="header" id="detail-title">

//     </div>
//     <div class="image content">
//       <div class="ui medium image">
//         <img src="" id="detail-image">
//       </div>
//       <div class="description">
//         <div class="ui header" id="detail-cuisine"></div>
//         <p id="detail-address"></p>
//         <p id="detail-rating"></p>
//         <p id="detail-average"></p>
//       </div>
//     </div>
//     <div class="actions">
//       <div class="ui black deny button">
//         Close
//       </div>

function fillModal(event){
  var x = this.getAttribute("idRest");
  alert(x);
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

    
  });

  $('.ui.modal').modal('show');

  event.preventDefault();
  return false;
}

function createCards(data){
  var count = 0;
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
  sharedMomentsArea.appendChild(cardWrapper);

  if(count++ >= 15){
    $(".rating").rating('disable', {
      maxRating: 5
    });

    var x = document.getElementsByClassName("cardMain");
    console.log(x.length);
    for(var i=0; i<x.length;i++){
      x[i].addEventListener('touchend', fillModal);
      x[i].addEventListener('mouseup', fillModal, false);
    }
    return;
  }

});
}


var url = 'https://developers.zomato.com/api/v2.1/search?entity_id=74&entity_type=city';
var networkDataReceived = false;

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
