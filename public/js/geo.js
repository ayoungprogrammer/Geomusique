var map;
//Read JSON file

var currentSong;



$(function(){
  $("#search").submit(function(e) {
    e.preventDefault();
    R.ready(function() {
    	console.log($("input[name=query]").val());
    	R.request({
            method: "search",
            content: {
              query: $("input[name=query]").val(),
              types: "Track"
            },
            success: function(response) {
              searchResults = response.result.results;
              if(searchResults.length==0){
            	  alert('no songs');
              }else {
            	  R.player.play({source:searchResults[0].key});

              }
            },
            error: function(response) {
            	console.log(response.message);
              $(".error").text(response.message);
            }
          });
    });
  });
});

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
    var songName = data[key].song_name;
    var songArtist = data[key].song_artist;

    var contentString = '<div id="content">'+
        '<h1 id="firstHeading" class="firstHeading">'+ songName +'</h1>'+
        '<div id="bodyContent">'+
        '<p>'+ songArtist +'</p>'+
        '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    var coords = new google.maps.LatLng(lat, long);

    var songMarker = new google.maps.Marker({
      position: coords,
      map: map,
      icon: musicIcon,
      customInfo: [songId, infowindow],
      optimized: false
    });

    songMarker.setMap(map); //add marker to map
    //Add Function for marker
    google.maps.event.addListener(songMarker, 'click', function() {
        // alert(this.customInfo);
        var songId = this.customInfo[0];
        R.ready(function() {
          R.player.play({source: songId}); // Alice In Chains - The Devil Put Dinosaurs Here
          console.log(songId);
        });
    });
    google.maps.event.addListener(songMarker, 'mouseover', function() {
      var info = this.customInfo[1];
      console.log(info);
      info.open(map, this);
    });
    google.maps.event.addListener(songMarker, 'mouseout', function() {
      var info = this.customInfo[1];
      info.close(map, this);
    });
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
  var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //Draw Data on Map
  var mapOptions = {
    center: coords,
    zoom: 12
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
