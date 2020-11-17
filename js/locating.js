function loadingShow() {
    document.getElementsByClassName("loading")[0].style.display = "flex";
}

function loadingHide() {
    document.getElementById("loadingArea").style.display = "none";
}

function manualEntry() {
    document.getElementById("locationGetArea").style.display = "none";
    document.getElementById("entrypoint").style.display = "flex";
    document.getElementById("locationHolderArea").style.display = "none";
}

function checkPostcode() {
    var postcode = document.getElementById('name'); //What the user has typed into the textbox
    
    if (postCodeCheck(postcode.value) != false) {  //Check if postocode is valid
        var formattedPostCode = postCodeCheck(postcode.value); //Gets formatted postcode to be used by maps api
        
        loadingShow();
        postCodeLocate(formattedPostCode);  //Locates postcode using maps api
        
        document.getElementById("errorMsg").style.display = "none"; //Makes error message disappear underneath the textbox if visible
    } else {
        document.getElementById("errorMsg").style.display = "flex"; //Informs user that the postcode is invalid
    }
}

//Hides textbox for inputting postcode
function hideEntryPoint() {
    document.getElementById("entrypoint").style.display = "none"; 
}

//Validates postcode. Idk how this works.
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

function postCodeLocate(postcode) {
    postcode = postcode.split(" ").join("");
    
    var url = `https://api.postcodes.io/postcodes/${postcode}`;
    
    var postCodeData = new XMLHttpRequest;
    postCodeData.open("GET", url);
    postCodeData.onload = () => {
        var PCResponse = JSON.parse(postCodeData.responseText);
        
        if (PCResponse.status == 200){
            updateLocationArea(PCResponse.result.admin_district);
            getTimes(PCResponse.result.latitude, PCResponse.result.longitude);
            hideLocation();
            hideEntryPoint(); 
            
        } else {
            console.log("Error while getting the postcode location.");
        }
    }
    postCodeData.send();
}

function getLocation() {
    loadingShow();
    document.getElementById("locationGetArea").style.display = "none";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(savePosition, showError);
    } else { 
        document.getElementById("locationHolder").innerHTML = "Geolocation is not supported by this browser.";
        document.getElementById("locationHolderArea").style.display = "flex";
        document.getElementById("locationGetArea").style.display = "grid";
    }
}

function savePosition(position) {
    var latitude = position.coords.latitude
    var longitude = position.coords.longitude
        
    codeAddress(latitude, longitude);
    getTimes(latitude, longitude);
    
    hideLocation();
}

function showError(error) {
    loadingHide();
    document.getElementById("locationHolderArea").style.display = "flex";
    document.getElementById("locationGetArea").style.display = "flex";
    
    var locationHolder = document.getElementById("locationHolder");
    switch(error.code) {
        case error.PERMISSION_DENIED:
        locationHolder.innerHTML = "Please enable location services or allow this page to use your location.";
        break;
    case error.POSITION_UNAVAILABLE:
        locationHolder.innerHTML = "Location information is unavailable.";
        break;
    case error.TIMEOUT:
        locationHolder.innerHTML = "The request to get the location timed out.";
        break;
    case error.UNKNOWN_ERROR:
        locationHolder.innerHTML = "An unknown error occurred.";
        break;
  }
}

function hideLocation() {
    document.getElementById("locationGetArea").style.display = "none";
    document.getElementById("locationHolderArea").style.display = "flex";
    document.getElementById("timeContainer").style.display = "grid";
}

//Turn the location into a city:

function codeAddress(lat, lng) {
    var url = `https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}`;
    
    var addressResponse = new XMLHttpRequest;
    
    addressResponse.open("GET", url);
    addressResponse.onload = () => {
        var responseJSON = JSON.parse(addressResponse.responseText);
        
        if (responseJSON.status === 200) {
            updateLocationArea(responseJSON.result[0].admin_district);
        } else {
            console.log("Error while finding the city.");
        }
    }
    
    addressResponse.send();
}

function updateLocationArea(address) {
    document.getElementById("locationHolder").innerHTML = address;
}

//Use Salah Times API to get times:

function getTimes(lat, long) {
    var timestamp = Math.floor(Date.now() / 1000);
    var url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${long}&method=2&tune=0,1,0,5,33,3,0,0`;
    // Tune order Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight
    
    var timeRequest = new XMLHttpRequest();
    timeRequest.open("GET", url);
    timeRequest.onload = () => {
        var times = JSON.parse(timeRequest.responseText);
        timePopulate(times.data.timings);
    };
    timeRequest.send();
    loadingHide();
}

function timePopulate(timings) {
    document.getElementById("fajr").innerHTML = timings.Fajr;
    document.getElementById("zuhr").innerHTML = timings.Dhuhr;
    document.getElementById("asr").innerHTML = timings.Asr;
    document.getElementById("maghrib").innerHTML = timings.Maghrib;
    document.getElementById("isha").innerHTML = timings.Isha;
}