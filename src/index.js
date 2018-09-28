import './style.css';
var u = navigator.userAgent;
//判断访问终端
var browser={
    trident: u.indexOf('Trident') > -1, //IE内核
    presto: u.indexOf('Presto') > -1, //opera内核
    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, //是否iPad
    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
    qq: u.match(/\sQQ/i) == " qq" //是否QQ
}
var videowrap = document.querySelector('.video-wrap');
var allvideoitem = document.querySelectorAll('.video-item');
var allVideo = document.querySelectorAll('.video');
var loading = document.querySelector('.loading');
var word = document.querySelectorAll('.word');
var statrvideo = document.querySelector('.startV');
var fouranima = document.querySelector('.cww');
var loadstate = document.querySelector('.l-state');
var lloading = document.querySelector('.l-loading');
var share = document.querySelector('.share');
var slidebottom = document.querySelector('.slide-t-b');
var slidetop = document.querySelector('.slide-t-t');
var lineone = document.querySelector('.lineone');
var hasinitslideb = false;
var hasinitslidet = false;
var curplaying = -1;
var nextplaying = 1;
var lastplaying = 0;
var shouldchange = false;
var nextclick = false;
var preclick = false;
var tempcurplaying = -1;
var moveEndX, moveEndY,startX,startY, X, Y;
var scripttimer = null;
var setScriptEndtimer = null;
var hasinitpage = false;
var hasinittouch = false;
var hasinitplay = false;
var shouldinitplay = false;
var btiflag = false;
var looptime = [7,4,12,3,5,5,20,8,11];
var lastplaying = 0;
var hasshowscript = [false,false,false,false,false,false,false,false,false]
var showscriptend = [false,false,false,false,false,false,false,false,false]

var api = 'https://storage.jd.com/open-chat-m/ddanimation/v20180918/ani'
// var api = './ani';
var loadper = 0;
var showstarttimer = undefined;
var video0timer = undefined;
var loadtimer1 = undefined;
var loadtimer2 = undefined;
var loadtimer = undefined;
var hasshowstart = false;

var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
            };
})();
window.requestAnimFrame = requestAnimFrame;
var canvas = document.getElementById("space");
var c = canvas.getContext("2d");

if (canvas.width != window.innerWidth || canvas.width != window.innerWidth) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeStars();
}
var badd=0;
var numStars = 50;

var centerX, centerY;

var stars = [], star;

var animate = true;
var focalLength = canvas.width;
centerX = canvas.width / 2;
centerY = canvas.height / 2;

// var loadtimer = setInterval(function(){
//     loadper++;
//     loadper = loadper>=100?100:loadper
//     loadstate.textContent = loadper + '%';
//     if(loadper>=79) {
//         clearInterval(loadtimer)
//     }
// },30)

function bti() {
    allVideo[0].play();
    btiflag = true;
    setTimeout(function(){
        allVideo[0].pause();
    },300)
    window.removeEventListener('touchend',bti)
}

window.addEventListener('touchend',bti)

statrvideo.addEventListener('touchend',function(){
    animate = false
    if(!hasinittouch) {
        lloading.style.opacity = 1;
        lloading.textContent = '加载中...';
        initTouch();
        playv();
        hasinittouch = true;
        getVideoZstatu();
        setTimeout(function(){
            initPage();
            initwordHeight();
        },1000)
    }
})


word[0].innerHTML = getScript(0);
word[1].innerHTML = getScript(1);

function setScriptEnd(n,time) {
    clearTimeout(setScriptEndtimer)
    setScriptEndtimer = setTimeout(function(){
        if(n!==3&&allVideo[n].currentTime*1000<=(getScriptDelay(n)+1000)) {
            setScriptEnd(n,800);
        } else {
            showscriptend[n] = true;
            if(n ==8) {
                setTimeout(function(){
                    share.style.display = 'block';
                    setTimeout(function(){
                        share.style.opacity = 1;
                    },20)
                },2500)
            }
        }
    },time?time:(getScriptDelay(n)+1500));
}

allVideo[0].addEventListener('playing',function(){
    curplaying = 0;
    if(!hasshowscript[0]&&!btiflag) {
        showScript(0);
        hasshowscript[0] = true;
        setScriptEnd(0);
        fouranima.style.height = allVideo[0].offsetHeight;
        word[0].style.height = allVideo[0].offsetHeight;
    }
    btiflag = false
})
allVideo[0].addEventListener('canplaythrough',function(){
    clearTimeout(showstarttimer)
    !hasshowstart&&showStart()
})

showStartTimer()

function showStartTimer() {
    showstarttimer = setTimeout(function(){
        try{
            if(allVideo[0].buffered.end(0)>2||allVideo[0].readyState == 4) {
                !hasshowstart&&showStart()
                clearTimeout(showstarttimer)
            } else {
                showStartTimer()
            }
        }catch(e) {
            showStartTimer()
        }

    },800)
}

function getVideoZstatu() {
    video0timer = setTimeout(function(){
        try{
            if(allVideo[0].buffered.end(0)>2||allVideo[0].readyState == 4) {
                clearTimeout(showstarttimer);
                clearTimeout(video0timer)
                document.body.removeChild(loading);
            } else {
                getVideoZstatu();
            }
        }catch(e) {
            getVideoZstatu();
        }
    },200)
}

function showStart() {
    hasshowstart = true
    clearInterval(loadtimer);
    clearInterval(loadtimer1);
    clearTimeout(loadtimer2);
    window.removeEventListener('touchend',bti);
    loadtimer1 = 111111;
    loadper = 100;
    loadstate.textContent = loadper+'%';
    statrvideo.style.display = 'block';
    setTimeout(function(){
        statrvideo.style.opacity = 1;
    },100);
}

// 长时间未加载好视频
loadtimer2 = setTimeout(function(){
    !hasshowstart&&showStart()
},8000)

allVideo[0].addEventListener('ended',function(){
    if(!hasinitslideb) {
        hasinitslideb = true;
        if(curplaying !== 0 ) {
            return
        }
        slidebottom.style.display = 'block';
        setTimeout(function(){
            slidebottom.style.opacity = 1;
        },20);
    }
    if (hasinitpage) {
        changeVideo();
        return
    }
})

function playv() {
    allVideo[2].play();
    allVideo[2].play();
    allVideo[1].play();
    allVideo[1].play();
    document.querySelector('audio').play();
    setTimeout(function(){
        allVideo[2].pause();
        allVideo[1].pause();
        document.querySelector('audio').pause();
    },20)
    allVideo[0].play();
    playAudio()
}
function playAudio(time) {
    setTimeout(function(){
        if(allVideo[0].currentTime < 6) {
            playAudio(1000)
        } else {
            allVideo[0].muted = true;
            allVideo[0].setAttribute('muted','1')
            document.querySelector('audio').play();
        }
    },time?time:6000)
}

function initwordHeight() {
    var height = allVideo[0].offsetHeight;
    for(var i=1;i<9;i++) {
        word[i].style.height = height;
    }
}

function initPage() {
    for (var i = 0; i < 6; i++) {
        if (i == 0) {
            continue
        }
        var div1 = document.createElement('div');
        div1.setAttribute('class', "video-item");
        div1.style.zIndex = 1;
            div1.innerHTML = '<video poster="https://storage.jd.com/open-chat-m/ddanimation/v20180918/static/p'+(4+i)+'.jpg" type="video/mp4" webkit-playsinline="true" playsinline="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" class="video" data-list='+(3+i)+' preload="auto" muted><source src="'+api+'/'+(4+i)+''+(4+i)+'.mp4"  type="video/mp4"></video>' 
            +'<div class="word"></div>';
        div1.querySelector('video').addEventListener('error',function(e){
            div1.querySelector('video').src = e.target.src;
        },true)
        videowrap.appendChild(div1);
        videowrap.appendChild(div1);
    }
    hasinitpage = true;
    allvideoitem = document.querySelectorAll('.video-item');
    allVideo = document.querySelectorAll('.video');
    word = document.querySelectorAll('.word');
    renderScript()
    addVE();
}

function getScriptDelay(n) {
    var delay = 0;
    switch (n) {
        case 0:
            delay = 7000;break;
        case 1:
            delay = 3000;break;
        case 2:
            delay = 8000;break;
        case 3:
            delay = 3300;break;
        case 4:
            delay = 2000;break;
        case 5:
            delay = 2500;break;
        case 6:
            delay = 4000;break;
        case 7:
            delay = 4000;break;
        case 8:
            delay = 4000;break;
        default:
            delay = 500;
    }
    return delay
}

function showScript(n,time) {
    var delay = getScriptDelay(n);
    clearTimeout(scripttimer);
    word[n].style.opacity = 0;
    word[n].querySelector('.two').style.opacity = 0;
    scripttimer = setTimeout(function () {
        if(n!==3&&allVideo[n].currentTime*1000<(delay-500)) {
            showScript(n,1000);
        } else {
            showScriptNow(n);
        }
    }, time?time:delay);
}

function showScriptNow(n) {
    word[n].style.opacity = 1;
    setTimeout(function () {
        word[n].querySelector('.two').style.opacity = 1;
        var num = word[n].querySelector('.number');
        if (num) {
            renderNumber(num, 1500);
        }
        if(n === 1 && !hasinitslidet) {
            hasinitslidet = true;
            setTimeout(function(){
                if(curplaying !==1) {
                    return
                }
                slidetop.style.display = 'block';
                setTimeout(function(){
                    slidetop.style.opacity = 1;
                })
            },800)
        }
    }, 800);
}

function renderNumber(dom, ms) {
    var num = dom.textContent - 0 || 0;
    var add = Math.ceil(num / (ms / 50));
    dom.textContent = '';
    function _loop(i) {
        setTimeout(function () {
            dom.textContent = add * i >= num ? num : add * i;
        }, 50 * i);
    };

    for (var i = 0; i < ms / 50 + 1; i++) {
        _loop(i);
    }
}

function renderScript() {
    for (var i = 2; i < 9; i++) {
        word[i].innerHTML = getScript(i);
    }
}

function getScript(index) {
    switch (index) {
        case 0: return '<div class="one"></div><div class="two"><div>初来京东<br>，你迫不及待向一切问好</div><div>Tom是第一个在咚咚上</div><div>给你甩锅的人</div></div>';
        case 1: return '<div class="one"></div><div class="two"><div>在咚咚，虽然已有<span class="number">666</span>个二狗子活跃在大家</div><div>的聊天列表里</div><div>可在京东，你的列表里只有几个人</div></div>';
        case 2: return '<div class="one"></div><div class="two"><div>咚咚带着你认识了<span class="number">8888</span>位JDers</div><div>为你们建立的不仅仅是通信的桥梁</div><div>更多的是甩锅的通道</div></div>';
        case 3: return '<div class="one"></div><div class="two"><div>你的联系人列表开始边长，那里面最常闪</div><div>烁的头像是隔壁小王</div><div>你不在家的日子一定很难忘吧</div></div>';
        case 4: return '<div class="one"></div><div class="two"><div>咚咚也曾带你跨越一次次陌生和胆怯</div><div>陪你完成了<span class="number">555</span>次跨部门沟通</div><div>你的脸皮开始越来越厚了</div></div>';
        case 5: return '<div class="one"></div><div class="two"><div>从需要别人的帮助，到要别人的钱</div><div>在咚咚被@<span class="number">2333</span>次</div><div>每一次@都是一次黑锅</div></div>';
        case 6: return '<div class="one"></div><div class="two"><div>2018年3月5号，这一天你特么跟疯了一样</div><div>工作到了凌晨三点</div><div>第二天请假了一天，值了</div></div>';
        case 7: return '<div class="one"></div><div class="two"><div>陪伴你成长的同时，咚咚也在成长</div><div>从文字表情再到VOIP语音</div><div>在追求高效甩锅的路上咚咚从未停止</div></div>';
        case 8: return '<div class="one"></div><div class="two"><div>亲爱的你啊<br>，在那些朝着梦想渐行渐远的日子里</div><div>咚咚一直都在，也将一直都在</div><div>记录这你在京东的所有黑锅</div></div>';
    }
}
// !browser.ios&&(allVideo[0].playbackRate = 4);

function getCurPlaying() {
    for(var k=0;k<allVideo.length;k++) {
        if(allvideoitem[k].style.opacity == 1) {
            curplaying = k;
        }
    }
}

function addVE() {
    for(var i=1;i<allVideo.length;i++) {
        // if(!browser.ios) {
        //     allVideo[i].playbackRate = 4;
        // }
        allVideo[i].addEventListener('play',function(e){
            getCurPlaying();
            if((lastplaying == 1)&&(curplaying>2)&&!hasshowscript[curplaying]) {
                curplaying = 1;
                lastplaying = curplaying;
                return
            }else if(!hasshowscript[curplaying]) {
                hasshowscript[curplaying] = true;
                setScriptEnd(curplaying);
                showScript(curplaying);
            }
            if(curplaying == 1&&!hasinitplay) {
                hasinitplay = true;
                shouldinitplay = true;
            }
            lastplaying = curplaying
        })
        allVideo[i].addEventListener('ended',function(){
            changeVideo();
        })
    }
}

window.onload = function () {
    // clearInterval(loadtimer);
    // if(loadtimer1 === 111111) {loadstate.textContent = 100+'%';return}
    // loadtimer1 = setInterval(function(){
    //     loadper>50?loadper+=1:loadper+=2
    //     if(loadper>=99) {
    //         loadper = 99;
    //         clearInterval(loadtimer1);
    //     }
    //     loadstate.textContent = loadper+'%'
    // },200)
    setTimeout(function(){
        !hasshowstart&&showStart();
    },2500)
}

function changeVideo() {
    if(shouldchange) {
        var tempc = curplaying;
        var tempn = nextplaying;
        if(nextplaying === 1||nextplaying === 2 || nextplaying === 0||hasinitslideb||hasinitslidet) {
            slidebottom.style.display = 'none';
            slidetop.style.display = 'none';
        }
        if(nextclick) {
            allVideo[nextplaying].currentTime = 0;
            word[curplaying].style.opacity = 0;
            word[curplaying].style.transition = 'opacity 0.5s';
            if(curplaying ===0) {
                lineone.style.display = 'none';
            }
            if(nextplaying == 3) {
                fouranima.style.opacity = 0;
                allVideo[nextplaying].style.opacity = 1;
            }
            setTimeout(function(){
                allvideoitem[tempc].style.opacity = 0;
                allvideoitem[tempc].style.transition = 'opacity 1.5s';
                allvideoitem[tempn].style.transition = 'opacity 0.7s';
                allVideo[tempn].play()
                allvideoitem[tempn].style.opacity = 1;
                allVideo[tempc].pause();
                setTimeout(function(){
                    allVideo[tempc].style.opacity = 1;
                    allvideoitem[tempc].style.top = '-150%';
                    word[tempc].style.opacity = 1;
                },1000)
            },500)
        } else if(preclick) {
            clearTimeout(scripttimer);
            clearTimeout(setScriptEndtimer)
            if(nextplaying === 0){
                lineone.style.display = 'block';
            }
            allVideo[curplaying].pause();
            allvideoitem[curplaying].style.transition = 'top 0.5s';
            allvideoitem[curplaying].style.top = '150%';
            allVideo[nextplaying].currentTime = looptime[nextplaying];
            if(curplaying == 8) {
                share.style.opacity = 0;
                share.style.display = 'block';
            }
            setTimeout(function(){
                allVideo[tempn].play();
                allvideoitem[tempn].style.transition = 'top 0.5s';
                allvideoitem[tempn].style.opacity = 1;
                allvideoitem[tempn].style.top = 0;
                allvideoitem[tempc].style.opacity = 0;
                setTimeout(function(){
                    allvideoitem[tempc].style.top = 0;
                    word[tempc].style.opacity = 0;
                    word[tempc].querySelector('.two').style.opacity = 0;
                    hasshowscript[tempc] = false;
                    showscriptend[tempc] = false;
                    // showscriptdone
                },100)
            },20)
        }
        shouldchange = false
        preclick = false;
        tempcurplaying = -1;
        nextclick = false;
    } else {
        if(curplaying ==3) {
            allVideo[curplaying].style.opacity = 0;
            fouranima.style.opacity = 1;
            return
        } 
        allVideo[curplaying].currentTime = looptime[curplaying];
        setTimeout(function(){
            allVideo[curplaying].play();
        },16)
    }
}




function initPlay() {
    for(var j=3;j<allVideo.length;j++) {
        allVideo[j].play();
    }
    setTimeout(function(){
        for(var j=3;j<allVideo.length;j++) {
            allVideo[j].pause();
        }
    },20)
    allVideo[curplaying].play()
}

function initTouch() {
    window.addEventListener("touchend", function (e) {
        e.preventDefault();
        var touch = getTouch();
        if (!touch || curplaying == -1) return
        if (touch == 1) {
            if (curplaying == 0) return
            if (nextclick) {
                tempcurplaying = -1;
            }
            if (tempcurplaying == -1) {
                tempcurplaying = curplaying;
                nextplaying = (tempcurplaying - 1) >= 0 ? (tempcurplaying - 1) : 0;
            }
            preclick = true;
            nextclick = false;
            shouldchange = true;
            changeVideo();
            return
        } else if (touch == 2) {
            if(curplaying ==8) return;
            if (preclick) {
                tempcurplaying = -1;
            }
            if (tempcurplaying == -1) {
                tempcurplaying = curplaying;
                nextplaying = (tempcurplaying + 1) > 8 ? 8 : (tempcurplaying + 1);
                nextclick = true;
                preclick = false;
                shouldchange = true;
            }
            if (showscriptend[curplaying]) {
                changeVideo();
            }
        } else {

        }
    }, false);
    window.addEventListener("touchstart", function (e) {
        e.preventDefault();
        if (!hasinittouch) {
            playv()
        }
        if (shouldinitplay && browser.ios) {
            initPlay();
            shouldinitplay = false;
        }
        startX = e.changedTouches[0].pageX,
        startY = e.changedTouches[0].pageY;
    }, false);
    window.addEventListener("touchmove", function (e) {
        e.preventDefault();
        moveEndX = e.changedTouches[0].pageX,
            moveEndY = e.changedTouches[0].pageY,
            X = moveEndX - startX,
            Y = moveEndY - startY;
    }, false);
}
function getTouch() {
    if (Math.abs(X) > Math.abs(Y) && X > 0) {
        // 　　　　　　alert("left 2 right");
    }
    else if (Math.abs(X) > Math.abs(Y) && X < 0) {
        // 　　　　　　alert("right 2 left");
    }
    else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
        // 　　　　　　alert("top 2 bottom");
        return 1
    }
    else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
        // 　　　　　　alert("bottom 2 top");
        return 2
    }
    else {
        // 　　　　　　alert("just touch");
    }
    return null
}


initializeStars(numStars);

function executeFrame() {
    if (animate) {
        requestAnimFrame(executeFrame);
        moveStars();
        drawStars();
    }
}

function initializeStars(num) {
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    for (var i = 0; i < num; i++) {
        star = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height ,
            z: Math.random() * canvas.width*5,
            o: '0.' + Math.floor(Math.random() * 99) + 1
        };
        stars.push(star);
    }
}

function moveStars() {
    for (var i = 0; i < stars.length; i++) {
        star = stars[i];
        star.z = star.z - 1-badd;
        if (star.z <= 0) {
            stars.splice(i, 1);
            star.z = 1;
            initializeStars(1);
        }
    }
}

function drawStars() {
    var pixelX, pixelY, pixelRadius;
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = '#000';
    c.fill();
    c.save()
    for (var i = 0; i < stars.length; i++) {
        star = stars[i];
        pixelX = (star.x - centerX) * (focalLength / star.z);
        pixelX += centerX;
        pixelY = (star.y - centerY) * (focalLength / star.z);
        pixelY += centerY;
        pixelRadius = 1 * (focalLength / star.z);
        c.beginPath();
        c.strokeStyle="rgba(255,255,255,0.5)";
        c.fillStyle="rgba(255,255,255,0.5)";
        c.arc(pixelX, pixelY, pixelRadius/1, 0, 2 * Math.PI, true);
        c.stroke();
        c.fill()
    }
    c.restore()
}

executeFrame();