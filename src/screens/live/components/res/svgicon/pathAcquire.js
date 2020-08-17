let str = `<svg t="1584111721421" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1082" width="75" height="75"><path d="M512 105.3c-220.7 0-399.7 179-399.7 399.7s179 399.7 399.7 399.7 399.7-179 399.7-399.7-179-399.7-399.7-399.7z m241.6 270.8h-0.5v175.4h-99.8v-90.1l-46.6 49.7c13.7 27.1 21.4 57.6 21.4 90 0 110.4-89.5 200-199.9 200s-199.9-89.5-199.9-200 89.5-200 199.9-200c36.1 0 70.1 9.6 99.3 26.4l48.3-51.4h-97.5v-99.7h275.3v99.7z" fill="#0091FF" p-id="1083"></path><path d="M428 501.5c-55.1 0-99.7 44.8-99.7 100s44.6 100 99.7 100 99.7-44.8 99.7-100-44.7-100-99.7-100z" fill="#0091FF" p-id="1084"></path></svg>`;

function getPath() {
    let prefix = '<path d="',
        plen = 9,
        suffix = '" p-id="',
        slen = 8;
    let strlen = str.length;
    let width_i = str.indexOf("width");
    str = str.substr(width_i, strlen - width_i - 1);
    console.log("修剪后的str 为 : ",str);
    let out = [];
    let round =1;
    while (true) {
        let strlen = str.length;
        let p = str.indexOf(prefix);
        if (p < 0) break; //遍历结束
        let s = str.indexOf(suffix);
        let sub = str.substr(p + plen, s - p - slen - 1); //目标子串
        console.log("第"+round+"轮中获取到的路径数据: ",sub);
        out.push(sub);
        str = str.substr(s+8, strlen - s);
        console.log("第"+round+"轮结束后截取的剩余字符串为: ",str);
    }
    console.log(out);
}

getPath();
