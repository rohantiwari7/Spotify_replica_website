// we can directly call HTML by ID, so no need of .getElementById//
// var albumArt = document.getElementById('albumArt');
// var playpause = document.getElementById('playpause');   //button
// var prev = document.getElementById('prev');
// var next = document.getElementById('next');
// var currTime = document.getElementById('currTime');
// var duration = document.getElementById('duration');
// var progressbar = document.getElementById('progressbar');
// var songNamePlayer = document.getElementById('songNamePlayer');
// var autoplay = document.getElementById('autoplay')  //.checked is true or false
/// Initialise Songs
let audioElem = document.createElement('audio');  //audio HTML element (all functions apply to this)
audioElem.type = "audio/mpeg";
let songDir = "songs/";
let coverDir = "assets/img/";

songs = [
    { songName: "5 Taara (with Jatinder Shah)", coverName: "cover1.jpg", artistName: "Diljit Dosanjh" },
    { songName: "Aaj Phir", coverName: "cover2.jpg", artistName: "Arijit Singh and Samira Koppikar" },
    { songName: "Aashiqui 2 - Tum Hi Ho", coverName: "cover3.jpg", artistName: "Arijit Singh" },
    { songName: "Teri Meri", coverName: "cover4.jpg", artistName: "Rahat Fateh Ali Khan and Shreya Ghoshal" },
    { songName: "Call Out My Name", coverName: "cover5.jpg", artistName: "The Weeknd" },
    { songName: "Addicted", coverName: "cover6.jpg", artistName: "Enrique Iglesias" },
    { songName: "Guzaarish Hai Ye Jo Barish", coverName: "cover7.jpg", artistName: "K.K., Shail Hada" },
    { songName: "Life In Technicolor", coverName: "cover8.jpg", artistName: "Coldplay" },
    { songName: "Be Intehaan - Atif", coverName: "cover9.jpg", artistName: "Atif Aslam, Sunidhi Chauhan" },
    { songName: "Singh Is Kinng", coverName: "cover10.jpg", artistName: "RDB, SnoopDog" },
    { songName: "Pani da rang - Vicky Donor", coverName: "cover11.jpg", artistName: "Ayushmann Khurrana" },
    { songName: "Zara Sa - KK", coverName: "cover12.jpg", artistName: "K.K." },
    { songName: "Kahani Suno 2.0", coverName: "cover13.jpg", artistName: "Kaifi Khalil" },
    { songName: "Bolo Har Har - Shivaay", coverName: "cover14.jpg", artistName: "Badshah" }
]

var songInd = 0;
let songName = songs[songInd].songName;
songNamePlayer.innerText = songs[songInd].songName;
albumArt.src = coverDir + songs[songInd].coverName;
// audioElem.src = songDir + songs[songInd].songName + ".mp3";  set from "onloaded" event


query1 = document.querySelector('.play_small');
query2 = document.querySelector('.play_small_img');


// fill DOM with song lists
elements = document.getElementsByClassName('playlist');
elemArray = Array.from(elements);
elemArray.forEach((elem, i) => {
    elem.querySelector('.AA img').src = coverDir + songs[i].coverName;
    elem.querySelector('.pltitle').innerText = songs[i].songName;
    elem.querySelector('.artists').innerText = songs[i].artistName;
})

elemArray.forEach((elem, i) => {
    elem.addEventListener('click', () => {
        remLineQ(); //remove any panel click styling
        if (songInd === i) { //pause it
            query1.classList.remove('play_small_hover');
            query2.src = "play-solid.svg";
            query2.classList.remove('pause_small_img');
            query2.classList.add('play_small_img');
            playpause.click();
            if (!audioElem.paused) {
                query2.src = "pause-solid.svg";
                query2.classList.remove('play_small_img');
                query2.classList.add('pause_small_img');
            }
        }
        else {
            // reset old play button
            query1.classList.remove('play_small_hover'); //removing static of previous song
            query2.src = "play-solid.svg";
            query2.classList.remove('pause_small_img');
            query2.classList.add('play_small_img');

            // Main function
            query1 = elem.querySelector('.play_small');
            query2 = elem.querySelector('.play_small_img');
            songInd = i;
            onlinePlaylist = false;

            songName = songs[songInd].songName;
            songNamePlayer.innerText = songs[songInd].songName;
            albumArt.src = coverDir + songs[songInd].coverName;
            audioElem.src = songDir + songs[songInd].songName + ".mp3";
            playpause.click();
            // make icon to static pause
            query2.src = "pause-solid.svg";
            query2.classList.remove('play_small_img');
            query2.classList.add('pause_small_img');
            query1.classList.add('play_small_hover');  //making it static
        }
    })
})

let playAllowed=0
// play pause feature, and changing icon
playpause.addEventListener('click', () => {
    if(playAllowed==0 && songInd==0 && localSong && !cv){
        query2.src = "pause-solid.svg";
        query2.classList.remove('play_small_img');
        query2.classList.add('pause_small_img');
        query1.classList.add('play_small_hover'); 
    }
    
    playAllowed=1;
    if (audioElem.paused || audioElem.currentTime <= 0) {  //if paused (make it play)
        playpause.src = "pause-solid.svg";
        audioElem.play();
        console.log("play clicked from 'playpause' function with 'click' event");
        
    }
    else {   //if playing
        playpause.src = "play-solid.svg";
        audioElem.pause();
        console.log("pause clicked from 'playpause' function with 'click' event");
    }

})

audioElem.addEventListener("canplay", () => {
    if(playAllowed==1){
        audioElem.play();
        console.log("play clicked in 'canplay' event");
    }
});


// metadata loaded. ready to fill player metadata
audioElem.addEventListener('loadedmetadata', () => {
    progressbar.value = 0;
    let m = ~~(audioElem.duration / 60);
    let s = ~~(audioElem.duration % 60);
    let dispM = m < 1 ? '0' : m;
    let dispS = s < 10 ? '0' + s : s;
    duration.textContent = dispM + ':' + dispS;
    if (loggedIn && onlinePlaylist == false) { findQuery(); }
})

//seeking(manually) through progressbar, 
progressbar.addEventListener('input', (e) => {
    val = e.target.value;
    audioElem.currentTime = (val) * audioElem.duration / 100;
    if (audioElem.paused) {
        playpause.click();
    }
})

//updating current time-stamp on player
audioElem.addEventListener('timeupdate', () => {
    progressbar.value = (100 * audioElem.currentTime / audioElem.duration).toFixed(1);
    let m = ~~(audioElem.currentTime / 60);
    let s = ~~(audioElem.currentTime % 60);
    let dispS = s < 10 ? '0' + s : s;
    currTime.textContent = m + ':' + dispS;
})

//AutoPlay  /when current playlist is ended
audioElem.addEventListener('ended', () => {
    cv = false;
    currTime.textContent = '0:00';
    playpause.src = "play-solid.svg";
    progressbar.value = 0;
    if (autoplay.checked) {
        next.click();
    }
})


// /////////////////////////////////////////////
// prev button click animation using CSS 'buttonPress' class
prev.addEventListener('click', () => {
    query1.classList.remove('play_small_hover');
    query2.src = "play-solid.svg";
    query2.classList.remove('pause_small_img');
    query2.classList.add('play_small_img');
    remLineQ();
    // console.log("prev clicked");
    prev.classList.add("buttonPress");

    if (onlinePlaylist == true) {
        if (tempInd >0 ) {
            tempInd -= 1;
            songNamePlayer.innerText = popularSongs[tempInd].trackName;
            songName = popularSongs[tempInd].trackName;
            albumArt.src = popularSongs[tempInd].trackAlbumArt;
            audioElem.src = popularSongs[tempInd].trackSrc;
            lineQuery[tempInd].classList.add('line_show');
            pArray[tempInd].classList.add('pSong_select');

            // playpause.click();
            playpause.src = "pause-solid.svg";
            if (tempInd <= 0) {
                setTimeout(() => {   onlinePlaylist = false;   tempInd = 0;   }, 150);
            }
        }
        else {
            onlinePlaylist = false;
            tempInd = 0;
        }
    }
    else {

        if (songInd > 0) {
            songInd -= 1;
        }
        else {
            songInd = songs.length - 1;
        }
        playAllowed=1
        // styling
        ele = document.getElementsByClassName('playlist')[songInd]
        query1 = ele.querySelector('.play_small');
        query2 = ele.querySelector('.play_small_img');
        query2.src = "pause-solid.svg";
        query2.classList.remove('play_small_img');
        query2.classList.add('pause_small_img');
        query1.classList.add('play_small_hover');
        //end styling 
        onlinePlaylist = false;

        songName = songs[songInd].songName;
        songNamePlayer.innerText = songs[songInd].songName;
        albumArt.src = coverDir + songs[songInd].coverName;
        audioElem.src = songDir + songs[songInd].songName + ".mp3";
        // playpause.click(); // handeled by canplay event
        playpause.src = "pause-solid.svg";
    }
})

prev.addEventListener('animationend', () => {
    // console.log("prev animated");
    prev.classList.remove("buttonPress");

})

//next button click animation
next.addEventListener('click', () => {
    //remove pause button from cover
    query1.classList.remove('play_small_hover');
    query2.src = "play-solid.svg";
    query2.classList.remove('pause_small_img');
    query2.classList.add('play_small_img');
    remLineQ();
    // console.log("next clicked");
    playAllowed=1

    ////Main function
    next.classList.add("buttonPress");
    if (onlinePlaylist == true) {
        if (tempInd < popularSongs.length) {
            songNamePlayer.innerText = popularSongs[tempInd].trackName;
            songName = popularSongs[tempInd].trackName;
            albumArt.src = popularSongs[tempInd].trackAlbumArt;
            audioElem.src = popularSongs[tempInd].trackSrc;
            lineQuery[tempInd].classList.add('line_show');
            pArray[tempInd].classList.add('pSong_select');

            tempInd += 1;

            // playpause.click();
            playpause.src = "pause-solid.svg";
            if (tempInd >= popularSongs.length) {
                setTimeout(() => {   onlinePlaylist = false;   tempInd = 0;   }, 150);
            }
        }
        else {
            onlinePlaylist = false;
            tempInd = 0;
        }
    }
    else {
        // serially

        songInd += 1;
        if (songInd >= songs.length) {
            songInd = 0;
        }
        // shuffle
        // let len=songs.length;
        // songInd= Math.floor(Math.random() * len);
        // styling
        ele = document.getElementsByClassName('playlist')[songInd]
        query1 = ele.querySelector('.play_small');
        query2 = ele.querySelector('.play_small_img');
        query2.src = "pause-solid.svg";
        query2.classList.remove('play_small_img');
        query2.classList.add('pause_small_img');
        query1.classList.add('play_small_hover');
        //end styling 
        onlinePlaylist = false;
        // 
        songName = songs[songInd].songName;
        songNamePlayer.innerText = songs[songInd].songName;
        albumArt.src = coverDir + songs[songInd].coverName;
        audioElem.src = songDir + songs[songInd].songName + ".mp3";
        playpause.src = "pause-solid.svg";
        // playpause.click();
    }
})

next.addEventListener('animationend', () => {
    // console.log("next animated");
    next.classList.remove("buttonPress");

})

///////////////////////////////////////
////////////////////////////////////////
// Songs and Albums event listeners

// /////////////////////////////////////
let cv = false;
let cover = document.getElementsByClassName('cover')[0];

cover.addEventListener('click', () => {
    cv = true
    onlinePlaylist = false;
    // styling
    remLineQ();
    query1.classList.remove('play_small_hover');
    query2.src = "play-solid.svg";
    query2.classList.remove('pause_small_img');
    query2.classList.add('play_small_img');
    // 

    songNamePlayer.innerText = "Unholy - Sam Smith ft. Kim Petras";
    songName = songNamePlayer.innerText;
    albumArt.src = "assets/img/cover.png";
    audioElem.src = "songs/coversong/Unholy ft Kim Petras.mp3";
    playpause.click();
    setTimeout(()=>{cv=false; songInd= 9;},800);

})


/////////////////////////////////////////////////////////
let panelOpen = false;
let foundArtistId = undefined;
function tryopenWindow() {
    if(panelOpen){
        closeWindow();
    }
    else{
        openWindow();
    }
}

function openWindow() {
    if(panelOpen){
        return
    }
    if (!loggedIn) {
        errMsg.innerText = "Please Login for Song Info"
        errMsg.style.display = "flex";
        errMsg.style.height = "60px";
        setTimeout(() => { errMsg.style.display = "none" }, 3000);
    }
    else {
        panel.style.display = "flex";
        // panel.style.opacity=0.95;
        setTimeout(() => {   panel.classList.add('panel_open');  }, 10); 
        // navi.classList.add('blur');
        main.classList.add('blur');
        console.log('panel is opened');
        panelOpen = true;
        // if(foundArtistId==undefined || foundArtistId!=artistId){
        //     findPopSongs(artistId);
        // }
    }

}

albumArt.addEventListener('click', tryopenWindow);

songNamePlayer.addEventListener('click', tryopenWindow);

////////Close panel

function closeWindow() {
    panel.classList.remove('panel_open');
    main.classList.remove('blur');
    setTimeout(() => {   panel.style.display = "none";  }, 350);
    // navi.classList.remove('blur');
    console.log('panel is closed');
    panelOpen = false;
}

panelClose.addEventListener('click', closeWindow);
l.addEventListener('click', closeWindow);
r.addEventListener('click', closeWindow);

// ////////////////////////////////////////////////////////////
// panel js
let panelquery = document.getElementsByClassName('pSong');
pArray = Array.from(panelquery);
let lineQuery=Array.from(document.getElementsByClassName('line'))
// console.log(lineQuery)
pArray.forEach((pElem, i) => {
    pElem.addEventListener('click', () => { //onlineplaylist trick to avoid findQuery on loaded metadata event  first true, then false after some sec
        remLineQ();
        tempInd = i
        onlinePlaylist = true;
        songNamePlayer.innerText = popularSongs[tempInd].trackName
        songName = popularSongs[tempInd].trackName
        albumArt.src = popularSongs[tempInd].trackAlbumArt;
        audioElem.src = popularSongs[tempInd].trackSrc;
        playpause.click();
        /////styling
        query1.classList.remove('play_small_hover');
        query2.src = "play-solid.svg";
        query2.classList.remove('pause_small_img');
        query2.classList.add('play_small_img');
        lineQuery[tempInd].classList.add('line_show');  
        pArray[tempInd].classList.add('pSong_select');
        ////end styling
        setTimeout(() => {   onlinePlaylist = false;   }, 400);  
    })
})
function refreshPanel() {
    pArray.forEach((pElem, i) => {
        // console.log(pElem.querySelector('img'))
        if(i<popularSongs.length){
            pElem.querySelector('img').src = popularSongs[i].trackAlbumArt;
            pElem.querySelector('.pSdark').innerText = popularSongs[i].trackName;
            pElem.querySelector('.pSlight').innerText = "0:29";

        }
    })

}

function remLineQ(){
    for (let x=0;x<popularSongs.length;x++){
        lineQuery[x].classList.remove('line_show');
        pArray[x].classList.remove('pSong_select');
    }
}

// window.addEventListener("popstate", function(event) {
//     // Do something when the back button is clicked
//     closeWindow();
//   });


// document.addEventListener("backbutton", closeWindow())

p1.addEventListener('click',()=>{
    songInd=-1;
    next.click();
})
p2.addEventListener('click',()=>{
    songInd=6;
    next.click();
})