//Navigation

var count = 0; //Count to check if Navigation is open already. 0=closed, 1=open.

function toggleBar(x) {
    x.classList.toggle("change");
    var menu = document.getElementById("navList"); //Get the Navigation Buttons ID

    if (count === 0) { //Checks if they're open
        menu.classList.remove("none"); //none is default when page loads.
        menu.classList.add("animate__animated"); //Add fade in animation
        menu.classList.add("animate__fadeIn");
        menu.classList.add("animate__faster");
        count = 1; //The navigation is now open.

        
        setTimeout(function () { //A 500ms delay to remove the animate classes that were added.
            menu.classList.remove("animate__animated");
            menu.classList.remove("animate__fadeIn");
            menu.classList.remove("animate__faster");
        }, 500);
    } else if (count === 1) { //If they are open, then the navigation buttons must close.
        menu.classList.add("animate__animated"); //add fade out animation classes.
        menu.classList.add("animate__fadeOut");
        menu.classList.add("animate__faster");
        
        count = 0; //They're now gone so count is back to 0
        
        setTimeout(function () { //Add the none class and remove the animation classes after a delay to ensure smoothness.
            menu.classList.add("none");
            menu.classList.remove("animate__animated");
            menu.classList.remove("animate__fadeOut");
            menu.classList.remove("animate__faster");
        }, 500);
    }
    
    console.log(count); //For debugging
}