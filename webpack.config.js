const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_JS = "./src/client/js/"

module.exports = {
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css"
    })],
    // 우리가 처리하고싶은 파일 main.js
    entry: {
        main: BASE_JS + "main.js",
        videoPlayer: BASE_JS + "videoPlayer.js",
        recorder : BASE_JS + "recorder.js",
        commentSection: BASE_JS + "commentSection.js"
    },
    // npm run assets 를 백엔드와 같이 계속 실행시켜둔다. css 바뀔때마다 재시작할 필요없음
    watch: true,
    // development || production
    mode: "development",
    output: {
        // 처리한 comopressed javacript 파일들이 저장될 위치 ~/assets/js
        // name에 각 entry 위치를 별개로 넣어줄수있음
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        // 파일명 등을 변경 할때 원래것은 삭제하고 바꿔줌
        clean: true,
    },
    // rules: loader를 사용해서 css 파일들을 변경한다.
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", {targets: "defaults"}]],
                    }
                }
            },
            {
                test: /\.scss$/,
                // mini css extract: css파일을 별도로 만들어줌
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] // 뒤에서부터 인식한다.
            }
        ]
    }
};