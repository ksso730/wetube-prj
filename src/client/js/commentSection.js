const videoContainer=  document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const txtArea = form.querySelector("textarea");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    // 가짜 댓글이기 때문에 새로운 id를 받아와서 넣어줘야 한다.
    // dataset : pug가 js에게 변수나 값을 주고 소통
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    span.className = "txt__comment";
    const date = document.createElement("small"); 
    date.innerText = new Date(Date.now()).toLocaleDateString("ko-kr");
    date.className = "comment__createAt";
    const span2 = document.createElement("span"); 
    span2.innerText = "❌";
    span2.className = "del__comment";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(date);
    newComment.appendChild(span2);
    // 댓글의 맨 위에 추가
    videoComments.prepend(newComment);
}

const handleSubmit = async(e) => {
    // submit이벤트의 기본동작을 막음
    e.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const id = videoContainer.dataset.id;
    if(text===""){
        return;
    }
    const response = await fetch(`/api/videos/${id}/comment`, {
        method: "POST",
        // 1. req.body 와 같음
        // app.use(express.text()) : text를 허용해줘야 한다. (server.js)
        // object를 보내려면 JSON.stringify
        // string->js object로 바꿔주는 middleware를 사용해야한다. 
        // header정보도 필수!!
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({text}),
    });
    textarea.value = "";
    if(response.status===201){
        const {newCommentId} = await response.json();
        addComment(text, newCommentId);
    }
}

if(form){
    form.addEventListener("submit", handleSubmit);
}

    