import { format } from "morgan";

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
    handleClick(e);
};

const handleSpacebar = (e) => {
    let keyCode = e.which ;
    if( keyCode === 32){
        handleClick(e);
    }
}

const handleClick = (e) => {
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
    playBtnIcon.classList = video.paused? "fas fa-play" : "fas fa-pause";
}

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    }else{
        video.muted = true;
    }
    playBtnIcon.classList = video.paused? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0:volumeValue;
};

const handleVolumeChange = (e) => {
    const {
        target: {value},
    } = e;
    if (video.muted){
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
}

const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(11, 8);

// JS는 video가 로드될 때마다 이벤트 호출
const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeLine.max = Math.floor(video.duration);
};

// JS는 video의 시간이 변할대마다 호출
const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    timeLine.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (e) => {
    const {
        target: {value},
    } = e;
    video.currentTime = value;
};

const handleFullScreen = () => {
    const fullScreen = document.fullscreenElement;
    if(fullScreen){
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    }else{
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
}

const handleEnded = () => {
    const {id} = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
        method: "POST"
    });
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);

// meta data(비디오의 가로세로, 이미지들을 제외한 모든 움직이는 데이터)가 로드될때. 
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeLine.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", handleSpacebar, false);
video.addEventListener("ended", handleEnded);