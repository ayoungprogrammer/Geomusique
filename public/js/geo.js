var map, tourRoute = [],
    directionsService = new google.maps.DirectionsService();
// var tourRoute =[];

var currentSong, songTracker;

//Animate Song
google.maps.Marker.prototype.animateTo = function(newPosition, options) {
  defaultOptions = {
    duration: 120000,
    easing: 'linear',
    complete: null
  }
  options = options || {};

  // complete missing options
  for (key in defaultOptions) {
    options[key] = options[key] || defaultOptions[key];
  }

  // throw exception if easing function doesn't exist
  if (options.easing != 'linear') {
    if (typeof jQuery == 'undefined' || !jQuery.easing[options.easing]) {
      throw '"' + options.easing + '" easing function doesn\'t exist. Include jQuery and/or the jQuery easing plugin and use the right function name.';
      return;
    }
  }

  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  // save current position. prefixed to avoid name collisions. separate for lat/lng to avoid calling lat()/lng() in every frame
  this.AT_startPosition_lat = this.getPosition().lat();
  this.AT_startPosition_lng = this.getPosition().lng();
  var newPosition_lat = newPosition.lat();
  var newPosition_lng = newPosition.lng();

  // crossing the 180�� meridian and going the long way around the earth?
  if (Math.abs(newPosition_lng - this.AT_startPosition_lng) > 180) {
    if (newPosition_lng > this.AT_startPosition_lng) {
      newPosition_lng -= 360;
    } else {
      newPosition_lng += 360;
    }
  }

  var animateStep = function(marker, startTime) {
    var ellapsedTime = (new Date()).getTime() - startTime;
    var durationRatio = ellapsedTime / options.duration; // 0 - 1
    var easingDurationRatio = durationRatio;

    // use jQuery easing if it's not linear
    if (options.easing !== 'linear') {
      easingDurationRatio = jQuery.easing[options.easing](durationRatio, ellapsedTime, 0, 1, options.duration);
    }

    if (durationRatio < 1) {
      var deltaPosition = new google.maps.LatLng( marker.AT_startPosition_lat + (newPosition_lat - marker.AT_startPosition_lat)*easingDurationRatio,
                                                  marker.AT_startPosition_lng + (newPosition_lng - marker.AT_startPosition_lng)*easingDurationRatio);
      marker.setPosition(deltaPosition);

      // use requestAnimationFrame if it exists on this browser. If not, use setTimeout with ~60 fps
      if (window.requestAnimationFrame) {
        marker.AT_animationHandler = window.requestAnimationFrame(function() {animateStep(marker, startTime)});
      } else {
        marker.AT_animationHandler = setTimeout(function() {animateStep(marker, startTime)}, 17);
      }

    } else {

      marker.setPosition(newPosition);

      if (typeof options.complete === 'function') {
        options.complete();
      }

    }
  }

  // stop possibly running animation
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(this.AT_animationHandler);
  } else {
    clearTimeout(this.AT_animationHandler);
  }

  animateStep(this, (new Date()).getTime());
}

var coords;
$(function(){
  $("#search").submit(function(e) {
    e.preventDefault();
    R.ready(function() {
      console.log($("input[name=query]").val());
      $("#player-buttons").show();
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
                currentSong = searchResults[0];
                console.log(currentSong);
                songId = currentSong.songId;


                R.player.play({source:searchResults[0].key});
                console.log(coords);
                var obj = {'song_id':currentSong.key,
                    'location':{'latitude':coords.k,
                      'longitude':coords.A},
                      'song_name':currentSong.name,
                      'song_artist':currentSong.albumArtist
                      };
                makeMarker(obj);
                $.post('api/save-song',obj,function(data){
                  console.log('saved');
                });
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

var musicIcon = new google.maps.MarkerImage(
	    'img/musicmarker.png',
	    null,null,null,
	    new google.maps.Size(30, 40)
	  );


$(".player-element").click(function(e){
	R.player.togglePause();
});


function showAuthenticated() {
    $('.authenticated-view').show();
    $('.username').text(R.currentUser.get('firstName') + ' ' + R.currentUser.get('lastName'));
  }

  // ----------
  function showUnauthenticated() {
    $('.unauthenticated-view').show();
  }

  // ----------
  function showError(message) {
    $('#error-message').text(message);
  }
  R.ready(function() {
  $('.sign-in').click(function() {
    R.authenticate(function(nowAuthenticated) {
      if (nowAuthenticated) {
        $('.unauthenticated-view').hide();
        var obj = {username:R.currentUser.get('key')};
        $.post('login',obj,function(data){
            window.location.href = '/';
        });
        showAuthenticated();
      }
    });
  });
  if (R.authenticated()) {
	  $.getJSON('check-auth',function(resp){
		  console.log("AUTHCHECK: "+resp);
		 if(resp!="authed"){
			 var obj = {username:R.currentUser.get('key')};
			 $.post('login',obj,function(data){
				 window.location.href = '/';
		     });
		 }
	  });
      showAuthenticated();
    } else {
      showUnauthenticated();
    }
  });
function playTour(){

$(function(){
  $("#search").submit(function(e) {
    e.preventDefault();
    R.ready(function() {
    	console.log($("input[name=query]").val());
    	$("#player-buttons").show();
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
            	  currentSong = searchResults[0];
            	  console.log(currentSong);
            	  songId = currentSong.songId;

            	  $("#player-buttons").css("visibility","visible");
            	  R.player.play({source:searchResults[0].key});
            	  console.log(coords);
            	  var obj = {'song_id':currentSong.key,
            			  'location':{'latitude':coords.k,
            				  'longitude':coords.A},
            				  'song_name':currentSong.name,
            				  'song_artist':currentSong.albumArtist
            				  };
            	  makeMarker(obj);
            	  $.post('api/save-song',obj,function(data){
            		  console.log('saved');
            	  });              
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

}


function makeMarker(obj){
  // console.log(obj);
	var lat = obj.location.latitude;
    var long = obj.location.longitude;
    var songId = obj.song_id;
    var songName = obj.song_name;
    var songArtist = obj.song_artist;

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
      customInfo: [songId,infowindow],
      optimized: false
    });
    songMarker.setMap(map); //add marker to map
    //Add Function for marker
    google.maps.event.addListener(songMarker, 'click', function() {
        // alert(this.customInfo);
        var songId = this.customInfo[0];
        R.ready(function() {
          $("#player-buttons").css("visibility","visible");
          R.player.play({source: songId}); // Alice In Chains - The Devil Put Dinosaurs Here
          console.log(songId);
          songTracker.animateTo(tourRoute[1]);
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

function readData(data){
  $.getJSON("api/get-songs",function(dat){
	  var dats = data;

	  console.log("Data: "+dat);
	  if(dat!="no user"){
		  dats = dat;
	  }else {
		  google.maps.event.addListenerOnce( map, 'idle', function() {
		      drawLines();
		    });
	  }
	  
	  for(key in dats){
      console.log(dats[key]);
		  makeMarker(dats[key]);
	  }
  });
 }

// function saveTour(){
//   // console.log("Save");
// }
//
function drawLines(){
  console.log("Tour Route in tourRoute= ",tourRoute);
  //Intialize the Direction Service
  var service = new google.maps.DirectionsService();

  //Intialize the Path Array
  var path = new google.maps.MVCArray();

  var tourPathPoly = new google.maps.Polyline({
    geodesic: true,
    path:tourRoute,
    strokeColor: '#0969a2',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  // for (var i = 0; i < tourRoute.length; i++) {
  //   if ((i + 1) < tourRoute.length) {
  //       var src = tourRoute[i];
  //       var des = tourRoute[i + 1];
  //       path.push(src);
  //       tourPathPoly.setPath(path);
  //       service.route({
  //           origin: src,
  //           destination: des,
  //           travelMode: google.maps.DirectionsTravelMode.DRIVING
  //       }, function (result, status) {
  //           if (status == google.maps.DirectionsStatus.OK) {
  //               for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
  //                   path.push(result.routes[0].overview_path[i]);
  //               }
  //           }
  //       });
  //   }
  // }

  tourPathPoly.setMap(map);
  console.log("tourPathPoly.getPath ",tourPathPoly.getPath());

  //Add Marker at the beginning of trip
  var trackerIcon = new google.maps.MarkerImage(
        'img/tracker.png',
        null,null,null,
        new google.maps.Size(25, 25)
      );
  var point = tourRoute[0];
  console.log("Point is ", point);
  songTracker = new google.maps.Marker({
    position: point,
    map: map,
    customInfo:songAtCurrentTour,
    icon: trackerIcon,
    optimized: false
  });
  songTracker.setMap(map);

  // var infowindow = new google.maps.InfoWindow({
  //     content: contentString
  //   });
}

function getTour(tour){
  for(key in tour){
    var lat = tour[key].location.latitude;
    var long = tour[key].location.longitude;
    tourRoute.push(new google.maps.LatLng(lat,long));
    songAtCurrentTour = tour[key].song_id;
  }
}

function showTour(){
  var xhr1 = new XMLHttpRequest();
  xhr1.open("GET", "js/tour.json", true);
  xhr1.onreadystatechange = function() {
    if (xhr1.readyState == 4) {
      getTour(JSON.parse(xhr1.responseText));
    }
  }
  xhr1.send();
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
    zoom: 12
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
      console.log(map);
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
showTour();
