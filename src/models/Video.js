import mongoose, { mongo } from "mongoose";

const videoSchema = new mongoose.Schema({
    // maxlength/minlength 는 html document에서도 제공하고 있어서, input옵션에 더해준다면 그이상 혹은 그 이하의 글자수를 미리 검사한다.
    title: {type: String, required: true, trim: true, maxlength: 80 },
    description: {type: String, required: true, trim: true, minlength: 20},
    createdAt: {type: Date, required: true, default: Date.now }, 
    // default: Data.now()를 사용하지 않는 이유는 함수를 바로 실행하고 싶지 않아서이다.
    hashtags: [{type: String, trim: true }],
    meta: {
        views: {type: Number, default: 0, required: true},
        rating: {type: Number, default: 0, required: true},
    },
});

// save 이전의 middleaware
videoSchema.static('formatHashtags', function (hashtags){
    return hashtags.split(",").map((word)=> (word.startsWith("#")? word:`#${word}`))
});


const Video = mongoose.model("Video", videoSchema);
export default Video;

