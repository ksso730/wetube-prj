let form = document.forms.uploadForm;
const inputVideoName = form.elements.inputName;
const video = form.elements.video;
const inputThumbName = form.elements.inputThumb;
const thumb = form.elements.thumb;
const submitBtn = document.getElementById("submitBtn");

let fileName;
let thumbName;

const settingVideoName = () => {
    fileName = video.value;
    inputVideoName.value = fileName;
}
const settingThumbName = () => {
    thumbName = thumb.value;
    inputThumbName.value = thumbName;
}


const handleUploads =  async(e) => {
    // e.preventDefault();
    console.log("form submit event");
    form = document.forms.uploadForm;

    // const video = form.elements.video;
    const video = document.querySelector('input[type="file"]');
    const title = form.elements.title.value;
    const description = form.elements.description;
    const hashtags = form.elements.hashtags;
    const data = new FormData();
    console.log(video);
    data.append('file', video.files[0]);
    console.log(data.values());
    // data.append('title', title);
    // data.append('description', description);
    // data.append('hashtags',hashtags);
    
    if (!fileName){
        alert("Choose your awsome video!!");
    }
    const response = await fetch(`/videos/upload`, {
        method: "POST",
        headers: {
            "Content-Type": " application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: data
    })
    .then(response => response.json())
    .then(result => {
    console.log('Success:', result);
    })
    .catch(error => {
    console.error('Error:', error);
    });

    
    // console.log(">>> 성공 ????");
    // if(response.status===201){
    //     console.log(">>> 성공");
    //     const {fileUrl, fileName} = await response.json();
    //     setFilePath(fileUrl);

    //     const response = await fetch(`/videos/thumbnails`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({fileUrl, fileName}),
    //     });

    //     if(response.status===201){
    //         const {fileDuration, thumbUrl} = await response.json();
    //         setDuration(fileDuration);
    //         setThumbnailPath(thumbUrl);
    //     }else{
    //         console.log("Failed to create thumbnail");
    //     }

    // }
}


thumb.addEventListener("change", settingThumbName);
video.addEventListener("change", settingVideoName);
// form.addEventListener("submit", handleUploads);