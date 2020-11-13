function manualEntry() {
    document.getElementById("locationGetArea").style.display = "none";
    document.getElementById("entrypoint").style.display = "flex";
    console.log("hello");
}

function checkPostcode() {
    var postcode = document.getElementById('name');
    console.log(postcode.value);
    console.log(postCodeCheck(postcode.value));
    
    if (postCodeCheck(postcode.value) != false) {
        var formattedPostCode = postCodeCheck(postcode.value);
        postCodeLocate(formattedPostCode);
        document.getElementById('errorMsg').style.display = "none";
    } else {
        document.getElementById('errorMsg').style.display = "flex";
    }
}

function hideEntryPoint() {
    document.getElementById("entrypoint").style.display = "none";
}

function postCodeCheck (toCheck) {

  // Permitted letters depend upon their position in the postcode.
  var alpha1 = "[abcdefghijklmnoprstuwyz]";                       // Character 1
  var alpha2 = "[abcdefghklmnopqrstuvwxy]";                       // Character 2
  var alpha3 = "[abcdefghjkpmnrstuvwxy]";                         // Character 3
  var alpha4 = "[abehmnprvwxy]";                                  // Character 4
  var alpha5 = "[abdefghjlnpqrstuwxyz]";                          // Character 5
  var BFPOa5 = "[abdefghjlnpqrst]";                               // BFPO alpha5
  var BFPOa6 = "[abdefghjlnpqrstuwzyz]";                          // BFPO alpha6
  
  // Array holds the regular expressions for the valid postcodes
  var pcexp = new Array ();
  
  // BFPO postcodes
  pcexp.push (new RegExp ("^(bf1)(\\s*)([0-6]{1}" + BFPOa5 + "{1}" + BFPOa6 + "{1})$","i"));

  // Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
  pcexp.push (new RegExp ("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1,2})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
  
  // Expression for postcodes: ANA NAA
  pcexp.push (new RegExp ("^(" + alpha1 + "{1}[0-9]{1}" + alpha3 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));

  // Expression for postcodes: AANA  NAA
  pcexp.push (new RegExp ("^(" + alpha1 + "{1}" + alpha2 + "{1}" + "?[0-9]{1}" + alpha4 +"{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
  
  // Exception for the special postcode GIR 0AA
  pcexp.push (/^(GIR)(\s*)(0AA)$/i);
  
  // Standard BFPO numbers
  pcexp.push (/^(bfpo)(\s*)([0-9]{1,4})$/i);
  
  // c/o BFPO numbers
  pcexp.push (/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i);
  
  // Overseas Territories
  pcexp.push (/^([A-Z]{4})(\s*)(1ZZ)$/i);  
  
  // Anguilla
  pcexp.push (/^(ai-2640)$/i);

  // Load up the string to check
  var postCode = toCheck;

  // Assume we're not going to find a valid postcode
  var valid = false;
  
  // Check the string against the types of post codes
  for ( var i=0; i<pcexp.length; i++) {
  
    if (pcexp[i].test(postCode)) {
    
      // The post code is valid - split the post code into component parts
      pcexp[i].exec(postCode);
      
      // Copy it back into the original string, converting it to uppercase and inserting a space 
      // between the inward and outward codes
      postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();
      
      // If it is a BFPO c/o type postcode, tidy up the "c/o" part
      postCode = postCode.replace (/C\/O\s*/,"c/o ");
      
      // If it is the Anguilla overseas territory postcode, we need to treat it specially
      if (toCheck.toUpperCase() == 'AI-2640') {postCode = 'AI-2640'};
      
      // Load new postcode back into the form element
      valid = true;
      
      // Remember that we have found that the code is valid and break from loop
      break;
    }
  }
  
  // Return with either the reformatted valid postcode or the original invalid postcode
  if (valid) {return postCode} else return false;
}
//Finding Location

var latitude;
var longitude;

async function postCodeLocate(postcode) {
    console.log(`locating postcode ` + postcode + `...`);
    postcode = postcode.split(" ").join("+");
    
    //postLatLng = fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + postcode + "&key=AIzaSyA73ProGB5nVAg5fyGocNScUUfGwo82GiE");
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + postcode + '&sensor=false&components=country:UK&key=AIzaSyA73ProGB5nVAg5fyGocNScUUfGwo82GiE';

    var latRequest = new XMLHttpRequest();
    
    latRequest.open("GET", url);
    latRequest.onload = function() {
        var latlng = JSON.parse(latRequest.responseText);
        if (latlng.results[0].geometry.location.lat) {
            latitude = latlng.results[0].geometry.location.lat;
            longitude = latlng.results[0].geometry.location.lng;
            codeAddress(latitude, longitude);
            getTimes(latitude, longitude);
            hideLocation();
            hideEntryPoint();
        } else {
            console.log("Error.");
        }
    };
    latRequest.send();
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(savePosition, showError);
    } else { 
        document.getElementById("locationHolder").innerHTML = "Geolocation is not supported by this browser.";
        document.getElementById("locationHolderArea").style.display = "flex";
    }
}

function savePosition(position) {
    latitude = position.coords.latitude
    longitude = position.coords.longitude
    // document.getElementById("locationHolder").innerHTML = "Latitude: " + latitude + "<br>Longitude: " + longitude;
    console.log(latitude)
    console.log(longitude)
    codeAddress(latitude, longitude);
    getTimes(latitude, longitude);
    
    hideLocation();
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
        document.getElementById("locationHolder").innerHTML = "User denied the request for Geolocation."
        break;
    case error.POSITION_UNAVAILABLE:
        document.getElementById("locationHolder").innerHTML = "Location information is unavailable."
        break;
    case error.TIMEOUT:
        document.getElementById("locationHolder").innerHTML = "The request to get user location timed out."
        break;
    case error.UNKNOWN_ERROR:
        document.getElementById("locationHolder").innerHTML = "An unknown error occurred."
        break;
  }
}

function hideLocation() {
    document.getElementById("locationGetArea").style.display = "none";
    document.getElementById("locationHolderArea").style.display = "flex";
    document.getElementById("timeContainer").style.display = "grid";
}

//Turn the location into a city:

var geocoder; //A global geocoder object
var address;

function initialise() {
    geocoder = new google.maps.Geocoder();
}

var geocoder;

function codeAddress(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
            console.log(results);
            if(results[1]) {
                //formatted address
                address = results[6].formatted_address;
                //alert("address = " + address);
                console.log(address);
                updateLocationArea(address);
            } else {
                alert("No results found");
             }
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });
}

function updateLocationArea(address) {
    document.getElementById("locationHolder").innerHTML = address;
}

//Use Salah Times API to get times:

var url; 

function getTimes(lat, long) {
    var timestamp = Math.floor(Date.now() / 1000);
    url = "https://api.aladhan.com/v1/timings/" + timestamp + "?latitude=" + lat + "&longitude=" + long + "&method=2&tune=0,1,0,5,33,3,0,0";
    // Tune order Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight
    console.log(url);
    
    var timeRequest = new XMLHttpRequest();
    timeRequest.open("GET", url);
    timeRequest.onload = function() {
        var times = JSON.parse(timeRequest.responseText);
        console.log(times.data.timings);
        timePopulate(times.data.timings);
    };
    timeRequest.send();
}

function timePopulate(timings) {
    document.getElementById("fajr").innerHTML = timings.Fajr;
    document.getElementById("zuhr").innerHTML = timings.Dhuhr;
    document.getElementById("asr").innerHTML = timings.Asr;
    document.getElementById("maghrib").innerHTML = timings.Maghrib;
    document.getElementById("isha").innerHTML = timings.Isha;
}