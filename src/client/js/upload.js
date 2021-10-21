// import ffmpeg from "ffmpeg";

const form = document.forms.uploadForm;
const inputName = form.elements.inputName;
const videoFile = form.elements.video;
const submitBtn = document.getElementById("submitBtn");

let fileName;

const settingVideoName = () => {
    fileName = videoFile.value;
    inputName.value = fileName;
}

const exportImg = () => {
    // const imgDir = 'uploads/images';
    // new ffmpeg( fileName, (err, video) => {
    //     if(!err){
    //         console.log(video.metadata);


    //     }
    // });

}

const handleClickSubmit = () => {
    if (!videoFile.value){
        alert("Choose your awsome video!!");
    }
}

videoFile.addEventListener("change", settingVideoName);
submitBtn.addEventListener("click", handleClickSubmit);
// videoFile.addEventListener("change", exportImg);