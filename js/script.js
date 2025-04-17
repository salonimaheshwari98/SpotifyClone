
let songs;
let currFolder;
function formatSeconds(seconds) {
    // Ensure the input is a non-negative number
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// // Example usage:
// console.log(formatSeconds(72));   // Output: "01:12"
// console.log(formatSeconds(3661)); // Output: "61:01"
// console.log(formatSeconds(59));   // Output: "00:59"
// console.log(formatSeconds(120));  // Output: "02:00"


// // Example usage:
// console.log(formatSeconds(72));  // Output: "01:12"
// console.log(formatSeconds(3661)); // Output: "61:01"




async function getSongs(folder) {//get songs abh folder ka naam lega ki kish folder seh humey songs dhundne hain and get song will load a specific folder only

    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]) //split is used here taaki /songs k pehle wale string hi aayebs li k form mein
        }
    }

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""//yeh isliye kiya taaki hum songsul ko blank kardey aur fir joh card peh click kiya wahi khulega
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        
        <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").replaceAll("_", " ")}</div>

                                
                               
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>

                       
                        </li>`;//replaceall yaha peh har jagah seh 20% likhe hue 
        //ko space mein convert karne k liye use hora hain

    }
    //Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", elements => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())


        })

    })
    return songs
}
const playMusic = (track, pause = false) => {
    let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currFolder}/` + track//made so that ek baar peh ek hi gaana play ho

    if (!pause) {
        currentsong.play()
        play.src ="img/pause.svg"//gaana jbh play hora hain toh pause wala svg hona chaiye
    }
    



    document.querySelector(".songinfo").innerHTML = decodeURI(track)//decode isliye use kiya taaki already set song k liye pura uri na likh k aaye
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}
let currentsong = new Audio();//we are making this so that ek baar play karne peh ek hi gaana play ho and this is global var
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {

            let folder = e.href.split("/").slice(-1)[0]
            // get the meta data of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="24" height="24">
                                <!-- Green circular background -->
                                <circle cx="14" cy="14" r="14" fill="green" />

                                <!-- Black SVG icon with padding -->
                                <path
                                    d="M18.8906 13.846C18.5371 15.189 16.8667 16.138 13.5257 18.0361C10.296 19.8709 8.6812 20.7884 7.37983 20.4196C6.8418 20.2671 6.35159 19.9776 5.95624 19.5787C5 18.6139 5 16.7426 5 13C5 9.2574 5 7.3861 5.95624 6.42132C6.35159 6.02245 6.8418 5.73288 7.37983 5.58042C8.6812 5.21165 10.296 6.12907 13.5257 7.96393C16.8667 9.86197 18.5371 10.811 18.8906 12.154C19.0365 12.7084 19.0365 13.2916 18.8906 13.846Z"
                                    fill="black" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>

                            <!--ctrl+shift+r seh hard reload hota hain-->


                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }

    }
    //load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e)
        e.addEventListener("click", async item => {
            console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
          playMusic(songs[0])

        })
    })

}
async function main() {

    //get the list of all the songs
    songs = await getSongs("songs/cs")
    playMusic(songs[0], true)
    console.log(songs)
    //songlist k andar seh ul nikal k hum songul mein rakhrahe hain
    //show all the songs in playlist

    //display all the albums on the page
    displayAlbums()

    //attach event listner to next and previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"//done to change the play and pause buttons while the songs are played and paused
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"//done to change the play and pause buttons while the songs are played and paused
        }
    })
    //listen for timeupdate event
    currentsong.addEventListener("timeupdate", () => {//time update function is here used to update the current time of the song
        //this will give u the current time and duration
        document.querySelector(".songtime").innerHTML = `${formatSeconds(currentsong.currentTime)}/${formatSeconds(currentsong.duration)
            }`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
        //to move the seek bar as the song moves and plus percent isliye kiya taaki utni percent css lagey
    })
    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";//this is done so as jaha hum 
        //click karey seek bar peh humara circle waha peh pahuch jaye
        currentsong.currentTime = ((currentsong.duration) * percent) / 100//this is done inorder to update the 
        //duration of the seek baar utna jitna ki seek bar aagey gaya hain and jaha seh seek baar start karahe wahi seh gaana bhi play hoga
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })//this is done taaki jaise hi koi bhi hamburger mein click karey toh library wala part khul k aaye

    //add an event listener for close button

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })//this is done taaki jaise hi close peh click karey toh library wala part bandh hojaye

    //add an event listener to previous and next
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])//slice mein hum parameter -1 daalrahe hain taaki hum piche ka mp3 lepaye
        console.log(songs, index)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })//yaha peh humne index ko liya pehle toh current song k index ko liya and then uske index mein -1 kar k usko play karwaya



    next.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])//slice mein hum parameter -1 daalrahe hain taaki hum piche ka mp3 lepaye
        console.log(songs, index)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //add an event to volume
    //     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    //         console.log("setting volume to",e.target.value)
    //         currentsong.volume=parseInt(e.target.value)/100
    //     })

    // })//yaha peh humne current song k index ko +1 kar k usko play karwaya
    const rangeElement = document.querySelector(".range");
    if (rangeElement) {
        const inputElement = rangeElement.getElementsByTagName("input")[0];
        if (inputElement) {
            inputElement.addEventListener("change", (e) => {
                const volumeValue = parseInt(e.target.value) / 100;
                if (currentsong && typeof currentsong.volume !== 'undefined') {
                    console.log("Setting volume to", volumeValue);
                    currentsong.volume = volumeValue;
                } else {
                    console.error("currentsong is not defined or does not support volume.");
                }
            });
        } else {
            console.error("No input element found within .range.");
        }
    } else {
        console.error("No element with class .range found.");
    }



    //add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target)//img ko lekar aye hain mute wala
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")//=isliye lagaya bcoz strings are immutable
            currentsong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

    //>sign in img is to represent the immediate img
}
main()


