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
    { songName: "Phir Aur Kya Chahiye", coverName: "cover1.jpg", artistName: "Arijit Singh" },
    { songName: "5 Taara", coverName: "cover2.jpg", artistName: "Diljit Dosanjh" },
    { songName: "KAZINO - BIBI", coverName: "cover3.jpg", artistName: "BIBI(비비)" },
    { songName: "Tere Vaaste", coverName: "cover4.jpg", artistName: "Varun Jain, Sachin" },
    { songName: "Pachtaoge", coverName: "cover5.jpg", artistName: "Arijit Singh" },
    { songName: "Grenade - Bruno mars", coverName: "cover6.jpg", artistName: "Bruno mars" },
    { songName: "Guzaarish", coverName: "cover7.jpg", artistName: "K.K., Shail Hada" },
    { songName: "Cupid - Twin ver", coverName: "cover8.jpg", artistName: "FIFTY FIFTY - Twin ver." },
    { songName: "Be Intehaan - Atif", coverName: "cover9.jpg", artistName: "Atif Aslam, Sunidhi Chauhan" },
    { songName: "Singh Is Kinng", coverName: "cover10.jpg", artistName: "RDB, SnoopDog" },
    { songName: "Pani da rang", coverName: "cover11.jpg", artistName: "Ayushmann Khurrana" },
    { songName: "Zara Sa - KK", coverName: "cover12.jpg", artistName: "K.K." },
    { songName: "Kahani Suno 2.0", coverName: "cover13.jpg", artistName: "Kaifi Khalil" },
    { songName: "Nashe Si Chadh Gayi", coverName: "cover14.jpg", artistName: "Arijit Singh" }
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
        coverClick=false;
        if (songInd === i && localSong) { //pause it
            // console.log("same song clicked");
            
            if (!audioElem.paused){
                query1.classList.remove('play_small_hover');
                query2.src = "play-solid.svg";
                query2.classList.remove('pause_small_img');
                query2.classList.add('play_small_img');
                playpause.click();}
            else {
                playpause.click();
                query2.src = "pause-solid.svg";
                query2.classList.remove('play_small_img');
                query2.classList.add('pause_small_img');
                query1.classList.add('play_small_hover');  //making it static
                
            }
        }
        else {
            localSong=true;
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
        //styling add
        if(!coverClick){
            if(localSong){
                query2.src = "pause-solid.svg";
                query2.classList.remove('play_small_img');
                query2.classList.add('pause_small_img');
                query1.classList.add('play_small_hover');  //making it static
            }
            else{
                lineQuery[tempInd].classList.add('line_show');  
                pArray[tempInd].classList.add('pSong_select');
            }
        }
    }
    else {   //if playing
        playpause.src = "play-solid.svg";
        audioElem.pause();
        //styling remove
        if(!coverClick){
            if(localSong){
                query1.classList.remove('play_small_hover'); //removing static of previous song
                query2.src = "play-solid.svg";
                query2.classList.remove('pause_small_img');
                query2.classList.add('play_small_img');
            }
            else{
                remLineQ();
            }
        }

    }
    // console.log("play clicked from 'playpause' function with 'click' event");

})

// audioElem.addEventListener("canplay", () => {
//     if(playAllowed==1){
//         audioElem.play();
//         // console.log("play clicked in 'canplay' event");
//     }
// });


// metadata loaded. ready to fill player metadata
audioElem.addEventListener('loadedmetadata', () => {
    progressbar.value = 0;
    let m = ~~(audioElem.duration / 60);
    let s = ~~(audioElem.duration % 60);
    let dispM = m < 1 ? '0' : m;
    let dispS = s < 10 ? '0' + s : s;
    duration.textContent = dispM + ':' + dispS;
    if (loggedIn && localSong && songName) { findQuery(); }
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
    coverClick=false;
    // console.log("prev clicked");
    prev.classList.add("buttonPress");

    if (onlinePlaylist == true) {
        tempInd -= 1;
        if (tempInd >=0 ) {
            songNamePlayer.innerText = popularSongs[tempInd].trackName.slice(0,30);
            songName = popularSongs[tempInd].trackName;
            albumArt.src = popularSongs[tempInd].trackAlbumArt;
            audioElem.src = popularSongs[tempInd].trackSrc;
            lineQuery[tempInd].classList.add('line_show');
            pArray[tempInd].classList.add('pSong_select');

            playpause.click();
            playpause.src = "pause-solid.svg";
            
        }
        else {
            onlinePlaylist = false;
            localSong=true;
            tempInd = 0;
            prev.click();
        }
    }
    else {

        songInd -= 1;
        if (songInd < 0) {
            songInd = songs.length - 1;
        }
        
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
        localSong=true;

        songName = songs[songInd].songName;
        songNamePlayer.innerText = songs[songInd].songName;
        albumArt.src = coverDir + songs[songInd].coverName;
        audioElem.src = songDir + songs[songInd].songName + ".mp3";
        playpause.click(); // handeled by canplay event
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
    coverClick=false;
    // console.log("next clicked");

    ////Main function
    next.classList.add("buttonPress");
    if (onlinePlaylist == true) {
        tempInd += 1;
        if (tempInd < popularSongs.length) {
            songNamePlayer.innerText = popularSongs[tempInd].trackName.slice(0,30);
            songName = popularSongs[tempInd].trackName;
            albumArt.src = popularSongs[tempInd].trackAlbumArt;
            audioElem.src = popularSongs[tempInd].trackSrc;
            lineQuery[tempInd].classList.add('line_show');
            pArray[tempInd].classList.add('pSong_select');

            localSong=false;
            playpause.click();
            playpause.src = "pause-solid.svg";
        
        }
        else {
            onlinePlaylist = false;
            localSong=true;
            tempInd = 0;
            setTimeout(() => { next.click();  }, 10);
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
        ele = document.getElementsByClassName('playlist')[songInd];
        query1 = ele.querySelector('.play_small');
        query2 = ele.querySelector('.play_small_img');
        query2.src = "pause-solid.svg";
        query2.classList.remove('play_small_img');
        query2.classList.add('pause_small_img');
        query1.classList.add('play_small_hover');
        //end styling 
        onlinePlaylist = false;
        localSong = true;
        // 
        songName = songs[songInd].songName;
        songNamePlayer.innerText = songs[songInd].songName;
        albumArt.src = coverDir + songs[songInd].coverName;
        audioElem.src = songDir + songs[songInd].songName + ".mp3";
        playpause.src = "pause-solid.svg";
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
let cover = document.getElementsByClassName('cover')[0];
let coverClick=false;

cover.addEventListener('click', () => {
    onlinePlaylist = false;
    localSong=true;
    coverClick=true;
    // styling
    remLineQ();
    query1.classList.remove('play_small_hover');
    query2.src = "play-solid.svg";
    query2.classList.remove('pause_small_img');
    query2.classList.add('play_small_img');
    // 

    songNamePlayer.innerText = "Sunflower - Post-Malone";
    songName = songNamePlayer.innerText;
    albumArt.src = "assets/img/cover.jpg";
    audioElem.src = "songs/coversong/Sunflower - Post-Malone.mp3";
    playpause.click();
    
})


/////////////////////////////////////////////////////////
let panelOpen = false;
function tryopenWindow() {
    if(panelOpen){
        closeWindow();
    }
    else{
        openWindow();
    }
}


let tempArray=[];


function openWindow() {
    if(panelOpen){
        return
    }
    if (!loggedIn) {
        errMsg.innerText = "Please Login for Song Info";
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
        if(tempArray.length<6){
            errMsg.innerText = `Songs of ${artistName} not currently available`;
            errMsg.style.display = "flex";
            errMsg.style.height = "60px";
            errMsg.style.width="200px";
            setTimeout(() => { errMsg.style.display = "none" }, 3000);
        }
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
    if(searched){
        searched=false;
        if(tempName){
            if(tempName===songName){
                console.log("find query because of closing panel")
                findQuery();
            }
            else if (!isArtist){
                console.log("findquery for 'playing-searched song' after panle close")
                findQuery();
            }
        }
    }
}

panelClose.addEventListener('click', closeWindow);
l.addEventListener('click', closeWindow);
r.addEventListener('click', closeWindow);

// ////////////////////////////////////////////////////////////
// panel js
let panelquery = document.getElementsByClassName('pSong');

pArray = Array.from(panelquery);

let lineQuery=Array.from(document.getElementsByClassName('line'));
// console.log(lineQuery)

pArray.forEach((pElem, i) => {
    pElem.addEventListener('click', () => { 
        remLineQ();
        coverClick=false
        tempInd = i
        localSong=false;
        songName = popularSongs[tempInd].trackName;
        songNamePlayer.innerText = songName.slice(0,30);
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
    })
})

const popSongLabel=document.getElementsByClassName('popSongLabel')[0]
function refreshPanel(songs) {
    remLineQ();
    popSongLabel.style.display='flex';
    pArray.forEach((pElem, i) => {
        // console.log(pElem.querySelector('img'))
        if(i<songs.length){
            pElem.querySelector('img').src = songs[i].trackAlbumArt;
            pElem.querySelector('.pSdark').innerText = songs[i].trackName;
            pElem.querySelector('.pSlight').innerText = "0:29";
        }
        else{
            pElem.querySelector('img').src = "";
            pElem.querySelector('.pSdark').innerText = "";
            pElem.querySelector('.pSlight').innerText = "";
        }
    })
    onlinePlaylist=false;
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


// first row playlist
p1.addEventListener('click',()=>{
    songInd=-1;
    onlinePlaylist=false;
    localSong=true;
    next.click();
})

// second row playlist
p2.addEventListener('click',()=>{
    songInd=-1;
    onlinePlaylist=false;
    localSong=true;
    songInd=6;
    next.click();
})

/////////////////////////////////// 
// Play popular songs list
let onlinePlaylist=false;
let tempInd=0;

playBtn_Panel.addEventListener('click',()=>{
    
    tempInd=0;
    onlinePlaylist=true;
    localSong=false;
    coverClick=false;
    
    songName = popularSongs[tempInd].trackName;
    songNamePlayer.innerText = songName.slice(0,30);
    albumArt.src = popularSongs[tempInd].trackAlbumArt;
    audioElem.src = popularSongs[tempInd].trackSrc;
    playpause.click();
    
    // styling remove
    remLineQ();
    query1.classList.remove('play_small_hover');
    query2.src = "play-solid.svg";
    query2.classList.remove('pause_small_img');
    query2.classList.add('play_small_img');
    console.log('playlist added to playing list');
    
    //styling add
    lineQuery[tempInd].classList.add('line_show');  
    pArray[tempInd].classList.add('pSong_select');
})


// /////////////////////////////
//  Extended playlist 
elementsF=Array.from(document.getElementsByClassName('playlistF'))


async function refreshFillSongs(){
    elementsF.forEach((elemF,i)=>{
        elemF.querySelector('.AA img').src = fetchedSongs[i].trackAlbumArt;
        elemF.querySelector('.pltitle').innerText = fetchedSongs[i].trackName.slice(0,27);
        elemF.querySelector('.artists').innerText = fetchedSongs[i].trackArtist.slice(0,30);
    })
}

elementsF.forEach((elem,i)=>{
    elem.addEventListener('click',()=>{
        remLineQ(); //remove any panel click styling
        coverClick=false;
        localSong=true;
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

        songName = fetchedSongs[i].trackName;
        songNamePlayer.innerText = songName.slice(0,30);
        albumArt.src = fetchedSongs[i].trackAlbumArt;
        audioElem.src = fetchedSongs[i].trackSrc;
        playpause.click();
        // make icon to static pause
        query2.src = "pause-solid.svg";
        query2.classList.remove('play_small_img');
        query2.classList.add('pause_small_img');
        query1.classList.add('play_small_hover');  //making it static
        }
    )
})