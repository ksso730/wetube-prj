// import ffmpeg from "fluent-ffmpeg";

const form = document.forms.uploadForm;
const inputName = form.elements.inputName;
const videoFile = form.elements.video;
const title = form.elements.title;
const description = form.elements.description;
const hashtags = form.elements.hashtags;
const submitBtn = document.getElementById("submitBtn");

let fileName;

const settingVideoName = () => {
    fileName = videoFile.value;
    inputName.value = fileName;
}

const handleUploads =  async(e) => {
    if (!fileName){
        alert("Choose your awsome video!!");
    }
    // e.preventDefault();
    const response = await fetch(`/videos/upload`, {
        method: "POST",
        headers: {
            // "Content-Type": "application/json; multipart/form-data;"
        },
        body: JSON.stringify({title, description, hashtags}),
    });

    
    console.log(">>> 성공 ????");
    if(response.status===201){
        console.log(">>> 성공");
        const {fileUrl, fileName} = await response.json();
        setFilePath(fileUrl);

        const response = await fetch(`/videos/thumbnails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fileUrl, fileName}),
        });

        if(response.status===201){
            const {fileDuration, thumbUrl} = await response.json();
            setDuration(fileDuration);
            setThumbnailPath(thumbUrl);
        }else{
            console.log("Failed to create thumbnail");
        }

    }
}


videoFile.addEventListener("change", settingVideoName);
submitBtn.addEventListener("click", handleUploads);