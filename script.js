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
let audioElem = document.createElement('video');  //audio HTML element (all functions apply to this)
audioElem.type = "audio/mpeg";
let songDir = "songs/";
let coverDir = "assets/img/";

songs = [
    { songName: "5 Taara (with Jatinder Shah)", coverName: "cover1.png", artistName: "Diljit Dosanjh" },
    { songName: "Aaj Phir", coverName: "cover2.png", artistName: "Arijit Singh and Samira Koppikar" },
    { songName: "Aashiqui 2 - Tum Hi Ho", coverName: "cover3.png", artistName: "Arijit Singh" },
    { songName: "Teri Meri - Bodyguard", coverName: "cover4.png", artistName: "Rahat Fateh Ali Khan and Shreya Ghoshal" },
    { songName: "Call Out My Name", coverName: "cover5.png", artistName: "The Weeknd" },
    { songName: "Addicted", coverName: "cover6.png", artistName: "Enrique Iglesias" },
    { songName: "Guzaarish - KK", coverName: "cover7.png", artistName: "K.K., Shail Hada" },
    { songName: "Life In Technicolor", coverName: "cover8.png", artistName: "Coldplay" },
    { songName: "Be Intehaan - Race 2", coverName: "cover9.png", artistName: "Atif Aslam, Sunidhi Chauhan" },
    { songName: "Singh Is Kinng (2008)", coverName: "cover10.png", artistName: "RDB, SnoopDog" },
    { songName: "Pani da rang - Vicky Donor", coverName: "cover11.png", artistName: "Ayushmann Khurrana" },
    { songName: "Zara Sa - KK", coverName: "cover12.png", artistName: "K.K." },
    { songName: "Kahani Suno 2.0", coverName: "cover13.png", artistName: "Kaifi Khalil" },
    { songName: "Bolo Har Har - Shivaay", coverName: "cover14.png", artistName: "Badshah" }
]

var songInd = 0;
let songName = songs[songInd].songName;
songNamePlayer.innerText = songs[songInd].songName;
albumArt.src = coverDir + songs[songInd].coverName;
audioElem.src = songDir + songs[songInd].songName + ".mp3";


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


// play pause feature, and changing icon
playpause.addEventListener('click', () => {
    if (audioElem.paused || audioElem.currentTime <= 0) {  //if paused (make it play)
        playpause.src = "pause-solid.svg";
        audioElem.play();
    }
    else {   //if playing
        playpause.src = "play-solid.svg";
        audioElem.pause();
    }

})

// metadata loaded. ready to fill player metadata
audioElem.addEventListener('loadedmetadata', () => {
    if (loggedIn && onlinePlaylist == false) { findQuery(); }
    let m = ~~(audioElem.duration / 60);
    let s = ~~(audioElem.duration % 60);
    let dispM = m < 1 ? '0' : m;
    let dispS = s < 10 ? '0' + s : s;
    duration.textContent = dispM + ':' + dispS;
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
    progressbar.value = 0;
    currTime.textContent = '0:00';
    playpause.src = "play-solid.svg";
    if (autoplay.checked) {
        next.click();
    }
})


// /////////////////////////////////////////////
// prev button click animation using CSS 'buttonPress' class
prev.addEventListener('click', () => {
    // console.log("prev clicked");
    prev.classList.add("buttonPress");
    if (songInd > 0) {
        songInd -= 1;
    }
    else {
        songInd = songs.length - 1;
    }
    songName = songs[songInd].songName;
    songNamePlayer.innerText = songs[songInd].songName;
    albumArt.src = coverDir + songs[songInd].coverName;
    audioElem.src = songDir + songs[songInd].songName + ".mp3";
    playpause.click();

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
    // console.log("next clicked");

    ////Main function
    next.classList.add("buttonPress");
    if (onlinePlaylist == true) {
        if (tempInd < popularSongs.length) {
            // songInd=-1
            songNamePlayer.innerText = popularSongs[tempInd].trackName;
            songName = popularSongs[tempInd].trackName;
            albumArt.src = popularSongs[tempInd].trackAlbumArt;
            audioElem.src = popularSongs[tempInd].trackSrc;
            playpause.click();
            tempInd += 1;
            if (tempInd >= popularSongs.length) {
                setTimeout(() => {   onlinePlaylist = false;   tempInd = 0;   }, 500);
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
        // 
        ele = document.getElementsByClassName('playlist')[songInd]
        query1 = ele.querySelector('.play_small');
        query2 = ele.querySelector('.play_small_img');
        query2.src = "pause-solid.svg";
        query2.classList.remove('play_small_img');
        query2.classList.add('pause_small_img');
        query1.classList.add('play_small_hover');
        // 
        onlinePlaylist = false;
        // 
        songName = songs[songInd].songName;
        songNamePlayer.innerText = songs[songInd].songName;
        albumArt.src = coverDir + songs[songInd].coverName;
        audioElem.src = songDir + songs[songInd].songName + ".mp3";
        playpause.click();
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
    songNamePlayer.innerText = "Unholy - Sam Smith ft. Kim Petras";
    songName = songNamePlayer.innerText;
    albumArt.src = "/assets/img/cover.png";
    audioElem.src = "/songs/coversong/Unholy ft Kim Petras.mp3";
    playpause.click();
})


/////////////////////////////////////////////////////////
let panelOpen = false;

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
        findPopSongs(artistId);
    }

}

albumArt.addEventListener('click', openWindow);

songNamePlayer.addEventListener('click', openWindow);

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
// console.log(pArray)
pArray.forEach((pElem, i) => {
    pElem.addEventListener('click', () => {
        tempInd = i
        onlinePlaylist = true;
        songNamePlayer.innerText = popularSongs[tempInd].trackName
        songName = popularSongs[tempInd].trackName
        albumArt.src = popularSongs[tempInd].trackAlbumArt;
        audioElem.src = popularSongs[tempInd].trackSrc;
        playpause.click();
        query1.classList.remove('play_small_hover');
        query2.src = "play-solid.svg";
        query2.classList.remove('pause_small_img');
        query2.classList.add('play_small_img');
        tempInd += 1;
        setTimeout(() => {   onlinePlaylist = false;   }, 3000);  
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


