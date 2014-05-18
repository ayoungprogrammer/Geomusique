var map;

//Read JSON file
function readData(data){
  var musicIcon = new google.maps.MarkerImage(
    'img/musicmarker.png',
    null,null,null,
    new google.maps.Size(30, 40)
  );
  // console.log(data);
  for(key in data){
    var lat = data[key].location.latitude;
    var long = data[key].location.longitude;
    var songId = data[key].song_id;

    var coords = new google.maps.LatLng(lat, long);

    var songMarker = new google.maps.Marker({
      position: coords,
      map: map,
      icon: musicIcon,
      optimized: false
    });
    songMarker.setMap(map); //add marker to map
  }
}

function showMusic(){
  //Read JSON File
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "js/data.json", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      //readData(xhr.responseText);
      readData(JSON.parse(xhr.responseText));
    }
  }
  xhr.send();
}

//Called if geolocation is supported
function success(position) {
  console.log("inside success");
  //Save the Current User Location
  coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //Draw Data on Map
  var mapOptions = {
    center: coords,
    zoom: 8
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
      console.log(map);
  // // construct an HTTP request
  // var xhr = new XMLHttpRequest();
  // xhr.open("POST", api/save-song, true);
  // xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  //
  // // send the collected data as JSON
  // xhr.send(JSON.stringify(coords));

  showMusic();

} //End of success

//Resize Map Canvas element to full screen
function resizeElementHeight(element) {
    var height = 0;
    var body = window.document.body;
    if (window.innerHeight) {height = window.innerHeight;}
    else if (body.parentElement.clientHeight) {height = body.parentElement.clientHeight;}
    else if (body && body.clientHeight) {height = body.clientHeight;}
    element.style.height = ((height - element.offsetTop) + "px");
}

//Check if geolocation is supported by browser
//If yes, call success function
function getLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
    console.log("Location Supported");
  }
  else { alert("Location not supported");}
}

//call when song starts or when user asks to tag a song
getLocation();
