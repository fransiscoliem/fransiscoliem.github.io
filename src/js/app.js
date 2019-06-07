

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
        // save_database(rest_id, rest_name, rest_cuisine, rest_address);
        save_database();
        console.log('save finished');
      });
    });