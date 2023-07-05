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

async function onPageLoad() {
    if(localStorage.getItem('access_token')){
        loggedIn=true;
    }
    else {
        await getToken();
    }              //  
    console.log("onload function executed");
    await fillSongs("57WaI46qepN0lMyzsOSEfx");
    await fillSongs("37i9dQZF1DWXtlo6ENS92N");
    await fillSongs("37i9dQZF1DWZNJXX2UeBij");
    console.log('extended playlist fetched of length ',fetchedSongs.length);
    await refreshFillSongs();
    extendedPlaylist.classList.remove("hide");

    // audioElem.src = songDir + songs[songInd].songName + ".mp3";
}

async function getToken() {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(Client_ID + ':' + Client_secret)
        },
        body: "grant_type=client_credentials"
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
        let expires_in = data.expires_in;
        localStorage.setItem('access_token', access_token);
        // if(loggedIn){
        //     // login.innerText="Logged in";
        //     await fillSongs("57WaI46qepN0lMyzsOSEfx");
        //     refreshFillSongs refreshFillSongs();
        //     extendedPlaylist.classList.remove("hide");
        // }
       
    }
    else {
        console.log(data.error);
        console.log("Login Failed");
        // logoutFn()
        loggedIn=false;
        showDialog="true";
    }
}

async function apiCall(url){

    options={
    headers:{
        "Authorization": "Bearer " + localStorage.getItem('access_token')
    }}
    const response = await fetch(url, options);
    // console.log(response.status); // Will show you the status
    if (response.status!==200) {
        console.log(response.status)
        await getToken();
        return await apiCall(url);  //after login error resolution, continur with the request fired
    }
    const data = await response.json();   //response.status===200 &&

    if (!data.error){   
        // console.log(data)
        loggedIn=true;
        return data;
    }
    else if(data.error.status===401) {
        console.log(data.error, 'need to Refresh token');
        loggedIn=false;
        await getToken();
    }
    else if(data.error.status===400) {
        // alert("Authentication Expired")
        console.log(data.error, 'need to Authenticate again');
        loggedIn=false;        
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
let isArtist=undefined;
let searched=false;

async function findQuery(){
    
    query=searchBox.value;

    console.log(query);
    console.log("findQuery called");
    searchBox.value="";

    if (query==""){   //general query for current playing song
        query=songName;
        searched=false;
    }
    else{   //search feature used
        searched=true;
        tempName=songName;
    }
    let q=SEARCH+'?q='+query+"&type=track,artist&market=IN&limit=10";
    // console.log(query);

    data=await apiCall(q);

    if(data==undefined){
        return
    }
    if(!data.error && loggedIn){   
        if(data.tracks.items.length!=0 ){
            // console.log(data)
            // 
            if(!searched){   //query is songname, by design
                artistName=data.tracks.items[0].artists[0].name;  //artist among artists in this list
                artistId=data.tracks.items[0].artists[0].id;   //this too needs checking
                console.log('songName=', songName,'  artistName=', artistName,'  artistId=',artistId);
                findPopSongs(artistId);
            }
            else{   // Searchbox  query
                sN=data.tracks.items[0].name;
                aN=data.artists.items[0].name;
                console.log(`query=${query}, 1st artistName=${aN}, 1st songname=${sN}`)
                if (isTrue(aN,query)) { 
                    console.log('is Artist');
                    isArtist=true; 
                } 
                else { 
                    if (isTrue(sN,query)) { 
                        console.log('is Song'); 
                        isArtist=false;  
                    }  
                }
                openWindow();
                if(isArtist){
                    artistName=data.artists.items[0].name;
                    artistId=data.artists.items[0].id; 
                    findPopSongs(artistId);
                }
                else{  // Query is a song
                    refreshSongQuery(data,query)
                }

            }
        }
        else{   // response has no tracks
            errMsg.innerText="Song not found";
            errMsg.style.display="flex";
            errMsg.style.height="35px";
            setTimeout(()=>{errMsg.style.display="none"},2000);
        }
    }
}

// ////////////////////////////////////   panel work
let trackArtistImage=undefined;

async function findPopSongs(artistId){
    
    let q=`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=IN`;
    
    data=await apiCall(q);
    if(data==undefined ){
        return;
    }
    // console.log(data)
    if (!data.error){  
        if(data.tracks.length>6){
            tempArray=[];
            // console.log(data.tracks)
            for(i=0;i<data.tracks.length;i++){
                if (data.tracks[i].preview_url || data.tracks[i].preview_url!=null){
                    temp={
                        trackSrc: data.tracks[i].preview_url,
                        trackName: data.tracks[i].name,
                        trackId: data.tracks[i].id,
                        trackAlbumArt: data.tracks[i].album.images[1].url,
                        popularity: data.tracks[i].popularity
                        }
                    tempArray.push(temp);
                    if (tempArray.length===10){
                        break
                    }
                }
            }
            
            console.log(`popular songs by ${artistName} `,tempArray);
            if (tempArray.length>=6){
                artistArtPanel.src="";
                popularSongs=JSON.parse(JSON.stringify(tempArray));
                refreshPanel(popularSongs);
                artistPanel.innerText=artistName;
                trackArtistImage=await artistImage(artistId);
                // console.log('trackArtistImage= ',trackArtistImage);
                artistArtPanel.src=trackArtistImage;
            }
            else{
                if(panelOpen){
                    // closeWindow();
                    errMsg.innerText = `Songs of ${artistName} not currently available`;
                    errMsg.style.display = "flex";
                    errMsg.style.height = "60px";
                    errMsg.style.width="200px";
                    setTimeout(() => { errMsg.style.display = "none" }, 3000);
                }
            }
            console.log('panel refreshed')

        }
    }
}


fetchedSongs=[];

async function fillSongs(playlistId){
    
    let q=`https://api.spotify.com/v1/playlists/${playlistId}?market=in`;
    
    data=await apiCall(q);
    if(data==undefined ){
        return;
    }
    if (!data.error){  
        if(data.tracks.length!=0){
            // console.log(data.tracks)
            let count=0;
            for(i=0;i<data.tracks.items.length;i++){
                if (data.tracks.items[i].track.preview_url || data.tracks.items[i].track.preview_url!=null){
                    temp={
                        trackName: data.tracks.items[i].track.name,
                        trackArtist:data.tracks.items[i].track.artists[0].name,
                        trackSrc: data.tracks.items[i].track.preview_url,
                        trackAlbumArt: data.tracks.items[i].track.album.images[1].url
                    }
                    fetchedSongs.push(temp);
                    count+=1
                }
                if (count>=7){
                    break
                }
            }
            // console.log(fetchedSongs)
        }
    }
}

async function fillPlaylist(playlistId){
    
    let q=`https://api.spotify.com/v1/playlists/${playlistId}?market=in`;
    
    data=await apiCall(q);
    if(data==undefined ){
        return;
    }
    if (!data.error){  
        if(data.tracks.length!=0){
            // console.log(data)
            let count=0;
            tempArray=[];
            for(i=0;i<data.tracks.items.length;i++){
                if (data.tracks.items[i].track.preview_url || data.tracks.items[i].track.preview_url!=null){
                    temp={
                        trackName: data.tracks.items[i].track.name,
                        trackArtist:data.tracks.items[i].track.artists[0].name,
                        trackSrc: data.tracks.items[i].track.preview_url,
                        trackAlbumArt: data.tracks.items[i].track.album.images[1].url
                    }
                    tempArray.push(temp);
                    count+=1
                }
                if (count>=10){
                    // popularSongs=[];
                    popularSongs=JSON.parse(JSON.stringify(tempArray))
                    break
                }
            }
            // console.log(playlist)
            artistArtPanel.src=data.images[0].url;
            artistPanel.innerText=data.name;
            refreshPanel(popularSongs);
        }
    }
}
//////////////////////////////////////////
let t=undefined;

async function artistImage(artistId){
    
    let q=`https://api.spotify.com/v1/artists/${artistId}`;
    
    data=await apiCall(q);
    // console.log(data);
    if(data.images.length>1){
        t=data.images[1].url;
    }
    else{t="";}
    return t;
}

// let s = 'Arijit Singh';
// let ss = 'Aniruddh';
const d = {'a':'A', 'b':'B','c':'C','d':'D','e':'E','f':'F','g':'G','h':'H','i':'I','j':'J','k':'K','l':'L','m':'M','n':'N','o':'O','p':'P','q':'Q','r':'R','s':'S','t':'T','u':'U','v':'V','w':'W','x':'X','y':'Y','z':'Z'};

function isTrue(s,query) {
    let ls = s.length;
    let lquery = query.length;
    const A = new Array(lquery + 1).fill(0).map(() => new Array(ls + 1).fill(0));
    
    for (let r = 1; r <= lquery; r++) {
        for (let c = 1; c <= ls; c++) {
            if (query[r - 1] === s[c - 1] || (query[r - 1] in d && d[query[r - 1]] === s[c - 1])) {
                A[r][c] = 1 + A[r - 1][c - 1];
            } else {
                A[r][c] = Math.max(A[r][c - 1], A[r - 1][c]);
            }
        }
    }
    
    // console.log(A);
    xx = A[lquery][ls] / lquery;
    console.log(`${s} matching with ${query} ratio is ${xx}`)
    if (xx >= 0.88) {
        return true;
    } else {
        return false;
    }
}


async function refreshSongQuery(data,query){
    console.log('song query refresh started')
    if(data.tracks.items.length>5){
        console.log(data)
        tempArray=[]
        for(i=0;i<data.tracks.items.length;i++){
            if (data.tracks.items[i].preview_url || data.tracks.items[i].preview_url!=null){
                temp={
                    trackSrc: data.tracks.items[i].preview_url,
                    trackName: data.tracks.items[i].name,
                    trackId: data.tracks.items[i].id,
                    trackAlbumArt: data.tracks.items[i].album.images[1].url,
                    popularity: data.tracks.items[i].popularity
                    }
                tempArray.push(temp);
                if (tempArray.length===10){
                    break
                }
            }
        }
        
        console.log(tempArray);
        if (tempArray.length>6){
            popularSongs=JSON.parse(JSON.stringify(tempArray))
            trackArtistImage=popularSongs[0].trackAlbumArt;
            // console.log('trackArtistImage= ',trackArtistImage);
            artistArtPanel.src=trackArtistImage;
            artistPanel.innerText=`'${query}' results`;
            refreshPanel(popularSongs);
            popSongLabel.style.display='none';
        }
        else{
            if(panelOpen){
                // closeWindow();
                errMsg.innerText = `Song '${query}' not currently available`;
                errMsg.style.display = "flex";
                errMsg.style.height = "60px";
                errMsg.style.width="200px";
                setTimeout(() => { errMsg.style.display = "none" }, 3000);
            }
        }
        console.log('song query panel refreshed')

    }
}

