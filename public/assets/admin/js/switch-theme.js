
function setDarkTheme(timeOut, light, dark) {
    // save DARK theme state to sessionStorage
    localStorage.setItem('theme','dark');
    // switch icon
    fadeTo(timeOut, `set-theme ${light}`, `${dark}`);
    // switch theme
    fadeTo(timeOut, 'set-theme theme-body-light', 'theme-body-dark');
    fadeTo(timeOut, 'set-theme theme-light', 'theme-dark');
    fadeTo(timeOut, 'set-theme theme-side-light', 'theme-side-dark');
}
function setLightTheme(timeOut, light, dark) {
    // save LIGHT theme to sessionStorage
    localStorage.setItem('theme','light');
    // switch icon
    fadeTo(timeOut, `set-theme ${dark}`, `${light}`);
    // switch theme
    fadeTo(timeOut, 'set-theme theme-body-dark', 'theme-body-light');
    fadeTo(timeOut, 'set-theme theme-dark', 'theme-light');
    fadeTo(timeOut, 'set-theme theme-side-dark', 'theme-side-light');
}

// callback function setTheme
function setTheme(event){
    let theme = localStorage.getItem('theme');

    // switch from DARK to LIGHT
    if ( theme === 'dark'){
        setLightTheme(event.data.timeOut, event.data.light, event.data.dark);
    }
    // switch from LIGHT to DARK
    if ( theme === 'light'){
        setDarkTheme(event.data.timeOut, event.data.light, event.data.dark);
    }
};

$(document).ready(function () {
    // event handling when click switch theme button
    let switchTheme = $('#switch-theme');
    switchTheme.on('click',{element: switchTheme.children('i') ,
        timeOut: 300, light: 'fa-cloud-sun', dark: 'fa-cloud-moon'}, setTheme);

});



// currentClasses always look like: "set-theme theme-*"
// newClass is just "theme-*"
fadeTo = function(timeout, currentClasses, newClass) {
    // get all current classes & parse to string
    let classes = currentClasses.split(' ');
    let queryString = classes.map( item => `.${item}`);
    queryString = queryString.join('');

    // fade from currentState to newState
    let $from =  $(`${queryString}`);

    $from.fadeOut(timeout, function () {
        // remove current class & add a new one
        $from.removeClass(`${classes[1]}`).addClass(`${newClass}`);
        $from.fadeIn(timeout);
    });
}

// set by theme state store in localStotage
function initTheme(data){
    // get theme from sessionStorage
    let theme = localStorage.getItem('theme');
    // set theme state default
    if(!theme){

        localStorage.setItem('theme', 'light');
    }else{
        if(theme === 'light'){
            setLightTheme(data.timeOut, data.light, data.dark);
        }else{
            setDarkTheme(data.timeOut, data.light, data.dark);
        }
    }
}

function setThemeByTime(hours, data) {
    // if hours > 18 or < 6 => DARK theme
    if ( hours > 18 || hours < 6){
        setDarkTheme(data.timeOut, data.light, data.dark);
    }else{
        setLightTheme(data.timeOut, data.light, data.dark);
    }
}
