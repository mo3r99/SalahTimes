//Navigation

var open = false; //Count to check if Navigation is open already.

function toggleBar(x) {
    x.classList.toggle("change");
    var menu = document.getElementById("navList"); //Get the Navigation Buttons ID

    if (open === false) { //Checks if they're open
        menu.classList.remove("none"); //none is default when page loads.
        menu.classList.add("animate__animated"); //Add fade in animation
        menu.classList.add("animate__fadeIn");
        menu.classList.add("animate__faster");
        open = true; //The navigation is now open.

        
        setTimeout(() => { //A 500ms delay to remove the animate classes that were added.
            menu.classList.remove("animate__animated");
            menu.classList.remove("animate__fadeIn");
            menu.classList.remove("animate__faster");
        }, 500);
    } else if (open === true) { //If they are open, then the navigation buttons must close.
        menu.classList.add("animate__animated"); //add fade out animation classes.
        menu.classList.add("animate__fadeOut");
        menu.classList.add("animate__faster");
        
        open = false; //They're now gone so count is back to 0
        
        setTimeout(() => { //Add the none class and remove the animation classes after a delay to ensure smoothness.
            menu.classList.add("none");
            menu.classList.remove("animate__animated");
            menu.classList.remove("animate__fadeOut");
            menu.classList.remove("animate__faster");
        }, 500);
    }
    
    //console.log(open); //For debugging
}

function showDropdown() {
    document.getElementById("dropdown").style.display = "block";
}