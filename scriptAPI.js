const Client_ID = '5ef41c05df4a4a94b29e1b8807f60745';
const Client_secret = 'b6b38b9c06aa4fa38a90ebbface4cdf2';
// const Redirect_uri = 'http://127.0.0.1:5500/index.html';
const Redirect_uri = 'https://rohantiwari7.github.io/Spotify_replica_website/';

const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
// const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
// const DEVICES = "https://api.spotify.com/v1/me/player/devices";
// const PLAY = "https://api.spotify.com/v1/me/player/play";
// const PAUSE = "https://api.spotify.com/v1/me/player/pause";
// const NEXT = "https://api.spotify.com/v1/me/player/next";
// const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
// const PLAYER = "https://api.spotify.com/v1/me/player";
// const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
// const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
// const SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";
const SEARCH = "https://api.spotify.com/v1/search";
const ME= "https://api.spotify.com/v1/me";
const TOPTRACKS="https://api.spotify.com/v1/artists/{id}/top-tracks";


let loggedIn=false;
let showDialog="true";
async function getAuthorise() {
    if (!loggedIn){
        q = AUTHORIZE +'?';
        if (localStorage.length>2){showDialog="false"};
        q += new URLSearchParams({
            client_id: Client_ID,
            response_type: 'code',
            redirect_uri: encodeURI(Redirect_uri),
            show_dialog:  false, // showDialog,
            scope: ""
            // "user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private"
        }).toString();
        // const response =fetch(q,{mode:"no-cors",headers:{"Access-Control-Allow-Origin": "http://localhost:5500"}})  
        window.location.href = q;
    }
};

async function onPageLoad() {
    q = window.location.search;

    if (q.length > 0) {
        urlParams = new URLSearchParams(q);
        let code = urlParams.get('code');
        console.log(code);
        localStorage.setItem('code', code);
        await getToken(code);
    }
    else if(localStorage.length>2){
        let naam=await apiCall(ME);    // initiator of check login
        // console.log(naam.display_name)
        if (loggedIn && naam!=undefined){
            console.log('loggedIn', loggedIn);
            login.innerText=naam.display_name;
            logout.style.visibility="visible";
            console.log("onload function executed");
            // findQuery();
            fillSongs("57WaI46qepN0lMyzsOSEfx")

        }
    }
    audioElem.src = songDir + songs[songInd].songName + ".mp3";
}

async function getToken(code) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(Client_ID + ':' + Client_secret)
        },
        body: "grant_type=authorization_code" +
            "&code=" + code +
            "&redirect_uri=" + encodeURI(Redirect_uri)

    }
    await callTokenApi(TOKEN, options);
}


async function getRefreshToken() {
    let refresh_token=localStorage.getItem('refresh_token');
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(Client_ID + ':' + Client_secret)
        },
        body: "grant_type=refresh_token" +
            "&refresh_token=" + refresh_token

    }
    await callTokenApi(TOKEN, options);
}


async function callTokenApi(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();  // response.status === 200 && 

    if (!data.error) {    
        loggedIn=true;
        console.log(data);
        const access_token = data.access_token;
        const refresh_token = data.refresh_token;
        let expires_in = data.expires_in;
        localStorage.setItem('access_token', access_token);
        if(refresh_token!=undefined){
            localStorage.setItem('refresh_token', refresh_token);
        }
        localStorage.setItem('expires_in', expires_in);
        window.history.pushState("","",Redirect_uri);
        if(loggedIn){
            login.innerText="Logged in";
            let naam=await apiCall(ME);
            login.innerText=naam.display_name;
            logout.style.visibility="visible";
            // await findQuery();
        }
       
    }
    else {
        console.log(data.error);
        console.log("Login Failed");
        // logoutFn()
        loggedIn=false;
        showDialog="true";
        //await getAuthorise();           //Manually login

    }
}

async function apiCall(url){

    options={
    headers:{
        "Authorization": "Bearer " + localStorage.getItem('access_token')
    }}
    const response = await fetch(url, options);
    const data = await response.json();   //response.status===200 &&

    if (!data.error){   
        // console.log(data)
        loggedIn=true;
        return data;
    }
    else if(data.error.status===401) {
        console.log(data.error, 'need to Refresh token');
        loggedIn=false;
        await getRefreshToken();
    }
    else if(data.error.status===400) {
        // alert("Authentication Expired")
        console.error(data.error, 'need to Authenticate again');
        loggedIn=false;
        //await getAuthorise();
        
    }
    
}


function ifEnter(event){
    if (event.key=='Enter'){
        // console.log("search after enter key")
        loginFindQuery();
    }
}
function loginFindQuery(){
    if(loggedIn){findQuery();}
    else{
        errMsg.innerText="We need to connect to Spotify Servers for Search feature";
        errMsg.style.display="flex";
        errMsg.style.height="65px";
        errMsg.style.width="250px";
        setTimeout(()=>{errMsg.style.display="none";errMsg.style.width="120px"},2000);
    }

}

let popularSongs=[];
let artistName=undefined;
let artistId=undefined;
// let songName=undefined
let localSong=true; 

async function findQuery(){
    
    query=searchBox.value;

    console.log(searchBox.value);
    console.log("query fired");
    
    if (query==""){   //general query for current playing song
        query=songName;
        localSong=true;
    }
    else{   //search feature used
        localSong=false;
        // setTimeout(() => {  openWindow();  }, 100);
    }
    let q=SEARCH+'?q='+query+"&type=track,artist&market=IN&limit=5";
    // console.log(query);

    data=await apiCall(q);

    if(data==undefined){
        return
    }
    if(!data.error && loggedIn){   
        if(data.tracks.items.length!=0 ){
            songName=data.tracks.items[0].name;
            artistName=data.tracks.items[0].artists[0].name;
            artistId=data.tracks.items[0].artists[0].id;
            console.log('songName=', songName,'  artistName=', artistName,'  artistId=',artistId);
            // console.log(data)
            if (!localSong && data.tracks.items[0].preview_url!=null){   //handeling "searchBox" query
                query1.classList.remove('play_small_hover');
                query2.src = "play-solid.svg";
                query2.classList.remove('pause_small_img');
                query2.classList.add('play_small_img');
                remLineQ();
                // songInd=-1;
                onlinePlaylist=true;
                audioElem.src=data.tracks.items[0].preview_url;
                playpause.click();
                albumArt.src=data.tracks.items[0].album.images[2].url;
                songNamePlayer.innerText=songName;
                searchBox.value="";
                setTimeout(()=>{onlinePlaylist = false; let len=songs.length; songInd= Math.floor(Math.random() * len);},1000);
            }
            // if (panelOpen==true ){
            if (loggedIn){
                if(foundArtistId==undefined || foundArtistId!=artistId){
                    findPopSongs(artistId);
                }
            }
            // }
        }
        else{
            searchBox.value="";
            if(!localSong) {
                errMsg.innerText="Song not found";
                errMsg.style.display="flex";
                errMsg.style.height="35px";
                setTimeout(()=>{errMsg.style.display="none"},2000);
            }
        }
    }
}

function logoutFn(){
    localStorage.clear();
    logout.style.visibility="hidden";
    login.innerText="Login";
    loggedIn=false;
    window.location.reload();
}

// ////////////////////////////////////   panel work
let trackArtistImage=undefined;

async function findPopSongs(artistId){
    
    let q=`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=in`;
    
    data=await apiCall(q);
    if(data==undefined ){
        return;
    }
    if (!data.error){  
        if(data.tracks.length!=0){
            foundArtistId=artistId;
            popularSongs=[];
            // console.log(data.tracks)
            for(i=0;i<data.tracks.length;i++){
                if (data.tracks[i].preview_url || data.tracks[i].preview_url!=null){
                temp={
                    trackSrc: data.tracks[i].preview_url,
                    trackName: data.tracks[i].name,
                    trackId: data.tracks[i].id,
                    trackAlbumArt: data.tracks[i].album.images[1].url,
                    trackAlbum: data.tracks[i].album.name,
                    trackDuration: data.tracks[i].duration_ms
                    }
                popularSongs.push(temp);
                }
            }
            
            console.log(popularSongs);
            trackArtistImage=await artistImage(artistId);
            // console.log('trackArtistImage= ',trackArtistImage);
            artistArtPanel.src=trackArtistImage;
            artistPanel.innerText=artistName;
            refreshPanel();
            console.log('panel refreshed')

        }
    }
}
async function fillSongs(playlistId){
    
    let q=`https://api.spotify.com/v1/playlists/${playlistId}?market=in`;
    
    data=await apiCall(q);
    if(data==undefined ){
        return;
    }
    if (!data.error){  
        if(data.tracks.length!=0){
            foundArtistId=artistId;
            console.log(data.tracks)
        }
    }
}

//////////////////////////////////////////
let t=undefined;

async function artistImage(artistId){
    
    let q=`https://api.spotify.com/v1/artists/${artistId}`;
    
    data=await apiCall(q);
    // console.log(data);
    if(data.images[0].url){
        t=data.images[0].url;
    }
    else{t=null;}
    return t;
}

