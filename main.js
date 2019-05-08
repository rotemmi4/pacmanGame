var settings= {};
var modalOpen = false;
var ganmeOpern=false;
var audio = new Audio('sound/pacmanSoundtrack.mp3');

function Start(){
    settings = getDefaultSettings();
    document.getElementById('logOut').style.display = 'none';
    initializeModal();
    initializeEventListners();
    initializeGameModal();
}

function userNameExists(value) {
    return (value in usersnames);
}

function validateSignInForm() {
    $.validator.addMethod("validatePasswordRule", function (value, element) {
        return this.optional(element) || validatePassword(value);
    }, "Password must be:\n" +
        "at least 8 digits long\m" +
        "Must have at least one digit");
    $.validator.addMethod("validateUserNameRule", function (value, element) {
        return this.optional(element) || !userNameExists(value);
    }, "UserName alreadey exists");
    $.validator.addMethod("validateOnlyLettersRule", function (value, element) {
        return this.optional(element) || allLetter(value);
    }, "Name cannot contain letters");
    $("#regForm").validate({
        rules: {
            fname: {
                required: true,
                minlength: 1,
                validateOnlyLettersRule:true
            },
            lname: {
                required: true,
                minlength: 1,
                validateOnlyLettersRule:true
            },
            uname: {
                required:true,
                validateUserNameRule : true
            },
            pass: {
                required: true,
                minlength: 8,
                validatePasswordRule: true
            },

            email: {
                required: true,
                email: true
            },
            bday: {
                required : true
            }
        },
        messages: {
            fname: {
                required: 'First Name is required',
                pattern: 'First Name cannot have numbers',
                minlength: 'Length Must Be at least 1'
            },
            lname: {
                required: 'First Name is required',
                pattern: 'First Name cannot have numbers',
                minlength: 'Length Must Be at least 1'
            },
            uname: {
                required: 'Username is required',
                validateUserNameRule : 'UserName already exists'
            },
            pass: {
                required: 'password is required',
                minlength: 'Minimum Length of pass is 8',
                validatePassword: 'Password must be:\nat least 8 digits long\mMust have at least one digit'
            },

            email: {
                required: 'email required',
                email: 'not a valid email'
            },
            bday: {
                required : 'birth date is required'
            }
        }
    });


    var username = $('#uname').val();
   var password = $('#pass').val();
   var fname = $('#fname').val();
   var lname = $('#lname').val();
   var email = $('#email').val();
   var bday = $('#bday').val();
    if ($("#regForm").valid()) {
        var user = {
            username: username,
            pass : password,
            firstName : fname,
            lastName : lname,
            email : email,
            birthdate : bday
        };
        usersnames[username] = user;
        document.getElementById('logOut').style.display = 'block';
        goToDiv('login');
    }
}

function validateLogInForm() {

    $.validator.addMethod("userNameExistsRule", function (value, element) {
        return this.optional(element) || userNameExists(value);
    }, "Name cannot contain letters");
    $("#logInform").validate({
        rules: {
            username_login: {
                required: true,
                userNameExistsRule : true
            },
            pass_login: {
                required: true
            }
        },
        messages: {
            username_login: {
                required: 'username is required',
                userNameExistsRule : 'user name does not exist'
            },
            pass_login: {
                required: 'password required'
            }
        }
    });


    var username = $('#username_login').val();
    var password = $('#pass_login').val();
    if ($("#logInform").valid()) {
        var passwordMatches = (usersnames[username]['pass'] == password);
        if (passwordMatches){

            var details_text = usersnames[username]['firstName'] + " "+usersnames[username]['lastName'];
            var details_div = document.getElementById("user-details");
            details_div.innerText = details_text;
            details_div.style.display = 'block';
            alert('login successful');
            loggedInUser = usersnames[username];
            document.getElementById('logOut').style.display = 'block';
            goToDiv('start_game');
        }
        else
            alert('login unsuccessful');
    }
}

function inRange(value, minRange, maxRange){
    maxRange = maxRange==null?value:maxRange;
    return (value >= minRange && value <= maxRange);
}

function isWholeNumber(number){
    return number==Math.floor(number);
}
function validateConfigForm() {
    $.validator.addMethod("wholeNumber", function (value, element) {
        return this.optional(element) || isWholeNumber(value);
    }, "Must Be A Whole Number");
    $.validator.addMethod("validAmountOfBalls", function (value, element) {
        return this.optional(element) || inRange(value, 50, 90);
    }, "Balls Must Be between 50 and 90");
    $.validator.addMethod("validTimeRange", function (value, element) {
        return this.optional(element) || inRange(value,60, null);
    }, "Time Must Be At Least 60 seconds");
    $.validator.addMethod("validGhostRange", function (value, element) {
        return this.optional(element) || inRange(value,1, 3);
    }, "Must be between 1 and 3 ghosts");
    $.validator.addMethod("defined", function (value, element) {
        return this.optional(element) || (value!=null && !(typeof value === 'undefined'));
    }, "Must Be Defined");
    $("#configForm").validate({
        rules: {
            upBtn:{
                required:true,
                defined:true
            },
            downBtn:{
                required:true,
                defined:true
            },
            leftBtn:{
                required:true,
                defined:true
            },
            rightBtn:{
                required:true,
                defined:true
            },
            amountOfBalls: {
                required : true,
                wholeNumber:true,
                validAmountOfBalls:true
            },

            time: {
                required : true,
                wholeNumber:true,
                validTimeRange:true
            },
            amountOfGhosts: {
                required : true,
                wholeNumber:true,
                validGhostRange:true
            },
        },
        messages: {
            upBtn:{
                required:'required field',
                defined:'define key'
            },
            downBtn:{
                required:'required field',
                defined:'define key'
            },
            leftBtn:{
                required:'required field',
                defined:'define key'
            },
            rightBtn:{
                required:'required field',
                defined:'define key'
            },
            amountOfBalls: {
                required : 'required field',
                wholeNumber:'Must Be A Whole Number',
                validAmountOfBalls:'should be between one and three balls'
            },

            time: {
                required : 'required field',
                wholeNumber:'Must Be A Whole Number',
                validTimeRange:'should be at least 60 sec'
            },
            amountOfGhosts: {
                required : 'required field',
                wholeNumber:'Must Be A Whole Number',
                validGhostRange:'should be between one and three ghosts'
            }
        }
    });


    var timeRecieved = $('#time').val();
    var amountOfGhostsRecieved = $('#amountOfGhosts').val();
    var amountOfBalssReceived = $('#amountOfBalls').val();
    var fivePointColor = $('#fivePoints').val();
    var fifteenPointColor = $('#fifteenPoints').val();
    var twentyFivePointColor = $('#twentyFivePoints').val();
    var ghostSpeed = $('#ghostSpeed').val();
    ghostSpeed = parseInt(ghostSpeed);
    amountOfGhostsRecieved = amountOfGhostsRecieved.toString();
    amountOfGhostsRecieved = parseInt(amountOfGhostsRecieved);

    //console.log("type: "+typeof amountOfGhostsRecieved);
    if ($("#configForm").valid()) {
        console.log('validated');
        settings['time'] = timeRecieved;
        settings['amountOfGhosts'] = amountOfGhostsRecieved;
        settings['amountOfBalls'] = amountOfBalssReceived;
        settings['colors']['fivePoint']=fivePointColor;
        settings['colors']['fifteenPoint'] = fifteenPointColor;
        settings['colors']['twentyFivePoint'] = twentyFivePointColor;
        settings['ghostSpeed'] = ghostSpeed;
        setSettings(settings);
        //setControls(settings['controls']);
        setColors(settings['colors']);
        goToDiv('play_game');
    }
}
function logOut() {
    var loggedIn = raiseAlertIfNotLoggedIn();
    loggedInUser = null;
    if (loggedIn) {
        document.getElementById('logOut').style.display = 'none';
        goToDiv('welcome');
    }
}
function raiseAlertIfNotLoggedIn() {
    var loggedIn = (loggedInUser != null);
    if (!loggedIn){
        alert("You Must Be Logged In To Continue!");
    }
    return loggedIn;
}

function setBackgroundImage(element, imageURL) {
    element.style.background = "url(\'"+imageURL+"\')";
    element.style.backgroundSize='cover';
}
function goToDiv(divName) {
    document.getElementById("user-details").style.display = loggedInUser==null?'none':'block';
    if (divName == 'login'){
        //initialize visitibilities
        document.getElementById("div-logInForm").style.display='block';
        document.getElementById("welcome").style.display='none';
        document.getElementById("div-regForm").style.display='none';
        document.getElementById("game").style.display='none';
        setBackgroundImage(document.getElementsByTagName('body')[0],'pics/pacman-seamless-generated-pattern-miroslav-nemecek.jpg');
        var gameCanvas = document.getElementById('gamecanvas');
        if (gameCanvas != null)
            gameCanvas.style.display='none';
    }
    else if (divName == 'signup'){
        document.getElementById("welcome").style.display='none';
        document.getElementById("div-logInForm").style.display='none';
        document.getElementById("game").style.display='none';
        document.getElementById("div-regForm").style.display='block';
        document.getElementById("div_configForm").style.display='none';
        setBackgroundImage(document.getElementsByTagName('body')[0],'pics/pacman-seamless-generated-pattern-miroslav-nemecek.jpg');
        var gameCanvas = document.getElementById('gamecanvas');
        if (gameCanvas != null)
            gameCanvas.style.display='none';
    }
    else if (divName=='welcome'){
        document.getElementById("welcome").style.display='block';
        document.getElementById("div-logInForm").style.display='none';
        document.getElementById("game").style.display='none';
        document.getElementById("div-regForm").style.display='none';
        document.getElementById("div_configForm").style.display='none';
        setBackgroundImage(document.getElementsByTagName('body')[0],'pics/pacman_eating.gif');
        var gameCanvas = document.getElementById('gamecanvas');
        if (gameCanvas != null)
            gameCanvas.style.display='none';
    }
    else if (divName=='start_game'){
        //if not logged in raise alert
        var loggedIn = raiseAlertIfNotLoggedIn();
        if (loggedIn){
            document.getElementById("welcome").style.display='none';
            document.getElementById("div-logInForm").style.display='none';
            document.getElementById("game").style.display='none';
            document.getElementById("div-regForm").style.display='none';
            document.getElementById("div_configForm").style.display='block';
            setBackgroundImage(document.getElementsByTagName('body')[0],'pics/pacman-seamless-generated-pattern-miroslav-nemecek.jpg');
            var gameCanvas = document.getElementById('gamecanvas');
            if (gameCanvas != null)
                gameCanvas.style.display='none';
        }
    }
    else if (divName=='play_game'){
        document.getElementById("welcome").style.display='none';
        document.getElementById("div-logInForm").style.display='none';
        //document.getElementById("game").style.display='block';
        document.getElementById("div-regForm").style.display='none';
        document.getElementById("div_configForm").style.display='none';
        ganmeOpern = true;
        document.getElementById('game').style.display = "block";

        setup();
        audio.currentTime=0;
        audio.loop = true;
        audio.play();

        //StartGame();
    }

}
function validatePassword(password) {

    var passwordIsValid = password.length>=8;
    if(passwordIsValid){
        var hasLetter = false;
        var hasDigit = false;
        for (let i = 0; i < password.length && (!hasLetter || !hasDigit); i++) {
            var charAti = password.charAt(i);
            if (!isNaN(charAti))
                hasDigit = true;
            if(allLetter(charAti))
                hasLetter = true;
        }
        if (hasLetter && hasDigit)
            passwordIsValid = true;
        else
            passwordIsValid = false;
    }
    return passwordIsValid

}

function allLetter(inputtxt)
{
    var letters = /^[A-Za-z]+$/;
    return letters.test(inputtxt);

}


//initialize divs
var divs = {
    game : "",
    regFormDev : 'signInCss.css'
};

function initializeEventListners(){
    document.querySelector('#upBtn').addEventListener('keyup', function (e) {
        if(e.keyCode == 9){
            return;
        }
        settings['controls']['upkey'] = e.keyCode;
        document.getElementById("upBtn").value = e.keyCode;
    });
    document.querySelector('#downBtn').addEventListener('keyup', function (e) {
        if(e.keyCode == 9){
            return;
        }
        settings['controls']['downkey'] = e.keyCode;
        document.getElementById("downBtn").value = e.keyCode;
    });
    document.querySelector('#leftBtn').addEventListener('keyup', function (e) {
        if(e.keyCode == 9){
            return;
        }
        settings['controls']['leftkey'] = e.keyCode;
        document.getElementById("leftBtn").value = e.keyCode;
    });

    document.querySelector('#rightBtn').addEventListener('keyup', function (e) {
        if(e.keyCode == 9){
            return;
        }
        settings['controls']['rightkey'] = e.keyCode;
        document.getElementById("rightBtn").value = e.keyCode;
    });
}

//settings functions
function getDefaultSettings() {
    var defaultControls = getDefaultControls();
    var defaultColors = {
        fivePoint:null,
        fifteenPoint : null,
        twentyFivePoint:null
    };
    var defaultSettings = {
        controls : defaultControls,
        amountOfBalls : -1,
        time : -1,
        amountOfGhosts : -1,
        ghostSpeed : -1,
        colors : defaultColors
    };
    return defaultSettings;
}

function getRandomColors(){
    var c1 = getRandomColor();
    var c2 = getRandomColor();
    var c3 = getRandomColor();
    var colors = {
        fivePoint:c1,
        fifteenPoint : c2,
        twentyFivePoint:c3
    };
    return colors;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getValueInRange(min, max){
    var random =Math.floor(Math.random() * (+max - +min)) + +min;
    return random;
}

function getRandomValueInSelect(id){
    var select = document.getElementById(id);
    var max = select.options.length;
    var chosenIndex = getValueInRange(0,max);
    var option = select.options[chosenIndex];
    return option;
}
function getRandomSettings(){
    var defaultControls = getDefaultControls();
    var randomColors = getRandomColors();
    var randomAmountOfBalls = getValueInRange(50,60);
    var randomAmountOfGhosts = getValueInRange(1,4);
    var randomTime = getValueInRange(60, 180);
    var ghostSpeed = getRandomValueInSelect("ghostSpeed").value;


    var randomSettings = {
        controls : defaultControls,
        amountOfBalls : randomAmountOfBalls,
        time : randomTime,
        amountOfGhosts : randomAmountOfGhosts,
        ghostSpeed :ghostSpeed,
        colors : randomColors
    };
    return randomSettings;
}

function setRandomSettingsValues(){
    var random_settings = getRandomSettings();
    displaySettingsInConfigForm(random_settings);
}

function displaySettingsInConfigForm(settings){
    document.getElementById("upBtn").value = settings['controls']['upkey'];
    document.getElementById("downBtn").value = settings['controls']['downkey'];
    document.getElementById("leftBtn").value = settings['controls']['leftkey'];
    document.getElementById("rightBtn").value = settings['controls']['rightkey'];
    document.getElementById("fivePoints").value = settings['colors']['fivePoint'];
    document.getElementById("fifteenPoints").value = settings['colors']['fifteenPoint'];
    document.getElementById("twentyFivePoints").value = settings['colors']['twentyFivePoint'];
    document.getElementById("amountOfBalls").value = settings['amountOfBalls'];
    document.getElementById("time").value = settings['time'];
    document.getElementById("amountOfGhosts").value = settings['amountOfGhosts'];
    document.getElementById("ghostSpeed").value = settings['ghostSpeed'];

}


//initialize users
var dateNow = Date.now();
var userA = {
    username: 'a',
    pass : 'a',
    firstName : 'no first name recieved - special case',
    lastName : 'no last name recieved - special case',
    email : 'noemail@special.case',
    birthdate : dateNow
};


function getDefaultControls() {
    return{
        upkey : 38,
        downkey: 40,
        leftkey: 37,
        rightkey: 39
    };
}


var usersnames = {a: userA};
var loggedInUser = null;

Start();


function initializeGameModal() {


    // Get the modal
    var modal = document.getElementById('game');


    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close-game")[0];


    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        ganmeOpern = false;

        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            ganmeOpern = false;
            modal.style.display = "none";
            audio.pause();
            goToDiv('welcome');
        }
    };

    //add event listener for esc x keys to close modal if open
    $(document).keyup(function(e) {
        if(!(ganmeOpern)) {
            return;
        }
        if (e.keyCode == 27) {
            ganmeOpern = false;
            modal.style.display = "none";
            audio.pause();
            goToDiv('welcome');
        }
    });

}
function initializeModal() {
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        modalOpen = true;
        modal.style.display = "block";
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modalOpen = false;
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modalOpen = false;
            modal.style.display = "none";
        }
    };

    //add event listener for esc x keys to close modal if open
    $(document).keyup(function(e) {
        if(!(modalOpen)) {
            return;
        }
        if (e.keyCode == 27 || e.keyCode == 88) {
            modalOpen = false;
            modal.style.display = "none"
        }
    });


}



