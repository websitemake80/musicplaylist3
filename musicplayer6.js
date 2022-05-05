//let's select all required tags or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");




let musicIndex = 2;

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //calling load music function once window loaded 
    playingNow();
})

//load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}`;
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    

    mainAudio.play();
    
}
//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();

}
//next music function
function nextMusic(){
 //here we'll just increment of index by 1
 musicIndex++;
 //if musicIndex is greater than array length then musicIndex will be array length so the first song will play
 musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
 loadMusic(musicIndex);
 playMusic();

}

//prev  music function
function prevMusic(){
    //here we'll just decrement of index by 1
    musicIndex--;
    //if musicIndex is less than 1 then musicIndex will be 1 so the first song will play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
   
   }


//play or music button event
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    
});


//next music btn event
nextBtn.addEventListener("click", ()=>{
      nextMusic(); //calling next music function

});

//prev music btn event
prevBtn.addEventListener("click", ()=>{
    prevMusic(); //calling next music function

});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
   const currentTime = e.target.currentTime;
  const duration = e.target.duration;
 let progressWidth = (currentTime / duration) * 100;
 progressBar.style.width = `${progressWidth}%`;

 let musicCurrentTime = wrapper.querySelector(".current"),
 musicDuration = wrapper.querySelector(".duration");
 mainAudio.addEventListener("loadeddata", ()=>{
      
     

   //update song total duration
   let audioDuration = mainAudio.duration;
   let totalMin = Math.floor(audioDuration / 60);
   let totalSec = Math.floor(audioDuration % 60);
if(totalSec < 10){ //adding 0 if sec is less than 10
    totalSec = `0${totalSec}`;
}

   musicDuration.innerText = `${totalMin}:${totalSec}`;
});

   //update playing song current time
 
 let currentMin = Math.floor(currentTime / 60);
 let currentSec = Math.floor(currentTime % 60);
if(currentSec < 10){
    currentSec = `0${currentSec}`;

}
musicCurrentTime.innerText = `${currentMin}:${currentSec}`;

 

});

//let's update playing song current time accroding to the progress bar width 
progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});
 
//let's work on repeat, shuffle song according to the icon

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
        //first we get the innerText of the icon then we'll change accordingly
        let getText = repeatBtn.innerText;

        switch(getText){
            case "repeat":
                repeatBtn.innerText = "repeat_one";
                repeatBtn.setAttribute("title", "Song looped");
                break;
            case "repeat_one":
                    repeatBtn.innerText = "shuffle";
                    repeatBtn.setAttribute("title", "Playback shuffle");
                break;
            case "shuffle":
                    repeatBtn.innerText = "repeat";
                    repeatBtn.setAttribute("title", "Playlist looped");
                break;
               
        }

});

mainAudio.addEventListener("ended", ()=>{

    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
                mainAudio.currentTime = 0;
                loadMusic(musicIndex);
                playMusic();
            break;
        case "shuffle":
            //generating random index between the max range of array length
                let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
                do{
                    randIndex = Math.floor((Math.random() * allMusic.length) + 1);
                }while(musicIndex == randIndex);
                musicIndex = randIndex;
                loadMusic(musicIndex);
                playMusic();
                break;
           
    }

});

showMoreBtn.addEventListener("click", () =>{
    musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click", () =>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//let's create li according to  the array length
for (let i = 0; i < allMusic.length; i++) {
     let liTag = ` <li li-index="${i + 1}">
         <div class="row">
         <span>${allMusic[i].name}</span>
         <p>${allMusic[i].artist}</p>
         </div>
         <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}"></audio>
          <span id="${allMusic[i].src}"  class="audio-duration"></span>
          </li> `;
          ulTag.insertAdjacentHTML("beforeend", liTag);  

          let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
          let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

          
          //liAudioTag.addEventListener("loadeddata", ()=>{
            //let audioDuration = liAudioTag.duration;
            //let totalMin = Math.floor(audioDuration / 60);
            //let totalSec = Math.floor(audioDuration % 60);
        // if(totalSec < 10){ //adding 0 if sec is less than 10
            // totalSec = `0${totalSec}`;
         //}
         
         //liAudioDuration.innerText = `${totalMin}:${totalSec}`;

        //  });

}

const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        //let's remove playing class
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            audioTag.innerText = " ";
        }
        
        if (allLiTags[j].getAttribute("li-index") == musicIndex ){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        } 
    
        //adding onclick attribute in all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
        
    }
    

}

//let's play song on li click
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();

}


