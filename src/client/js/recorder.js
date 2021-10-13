// 최대 5초 동안 기록하십시오.
// 웹 사이트에서 들을 수 있도록 사용자에게 녹음 미리 보기 표시(오디오 플레이어 만들기)
// 녹화가 완료되면 녹화를 시작하고 녹화를 다운로드하기 위한 버튼을 만듭니다.
const startBtn  = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handleStop = () => {
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleStart);
}
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
}

const init = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  video.srcObject = stream;
  video.play();
}

init();

startBtn.addEventListener("click", handleStart);