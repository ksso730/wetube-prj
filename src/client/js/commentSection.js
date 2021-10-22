import { async } from "regenerator-runtime";

const videoContainer=  document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComments = document.getElementById("videoComments");
const delBtnList = videoComments.querySelectorAll("li > span:last-child");

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
    span2.dataset.id = id;
    span2.addEventListener("click", handleDeleteComment);
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(date);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
}


const delComment = (id) => {
    const list = videoComments.querySelectorAll("li");
    let comm;
    for(let i =0; i<list.length; i++){
        comm = list[i];
        if (id === comm.dataset.id){
            console.log(comm);
            // videoComments.remove(comm);
            comm.remove();
        }
    }
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

const handleDeleteComment = async(e) => {
    const id = e.target.dataset.id;
    console.log(id);
    const response = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if(response.status===201){
        const {delCommentId} = await response.json();
        delComment(delCommentId);
    }
}

// 삭제 컨트롤러 만들기
// 동일하게 fetch로 만들어서 url을 comment id 를 파라미터로 삭제할 수 있도록 한다.
// 보안체크는 html에서 본인작성이 아니면 숨기고, 백엔드에서도 삭제할때 로그인 유저와 다르면 삭제할 수없도록.

if(form){
    form.addEventListener("submit", handleSubmit);
}

delBtnList.forEach(item => {
    item.addEventListener("click", handleDeleteComment);
})

    