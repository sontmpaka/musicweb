
var $ = document.querySelector.bind(document);
var $$ = document.getElementsByClassName.bind(document);
let playList = $('.play-list');
// var theSong = [
    // {
    //     name: 'Thôi miên',
    //     singer: 'CARA',
    //     path: './assets/mp3/ThoiMien-CARA-6237610.mp3',
    //     img: './assets/img/thoimien.jpg'
    // },
    // {
    //     name: 'Bên trên tầng lầu',
    //     singer: 'Tăng Duy Tân',
    //     path: './assets/mp3/BenTrenTangLau-TangDuyTan-7412012.mp3',
    //     img: './assets/img/bentrentanglau.jpg'
    // },
    // {
    //     name: 'Haru Haru',
    //     singer: 'BIGBANG',
    //     path: './assets/mp3/HaruHaru-BIGBANG-6291516.mp3',
    //     img: './assets/img/haruharu.jpg'
    // },
    // {
    //     name: 'Hết nhạc con về',
    //     singer: 'RZ Mas, DJ DuyB, Not Afraid',
    //     path: './assets/mp3/HetNhacConVe-DuyBNotAfraidRZMas-7006927.mp3',
    //     img: './assets/img/hetnhacconve.jpg'
    // },
    // {
    //     name: 'Lạc',
    //     singer: 'Rhymastic',
    //     path: './assets/mp3/Lac-Rhymastic-2729471.mp3',
    //     img: './assets/img/lac.jpg'
    // },
    // {
    //     name: 'Lạc trôi',
    //     singer: 'Sơn Tùng MTP',
    //     path: './assets/mp3/LacTroiTripleDRemix-SonTungMTP-5164670.mp3',
    //     img: './assets/img/lactroi.jpg'
    // },
    // {
    //     name: 'Một vòng trái đất',
    //     singer: 'Tim if Minh Hằng',
    //     path: './assets/mp3/MotVongTraiDat-TimMinhHang-137875.mp3',
    //     img: './assets/img/motvongtraidat.jpg'
    // },
    // {
    //     name: 'Ngủ một mình',
    //     singer: 'HIEUTHUHAI',
    //     path: './assets/mp3/NguMotMinhtinhRatTinh-HIEUTHUHAINegavKewtiie-8397765.mp3',
    //     img: './assets/img/ngumotminh.jpg'
    // },
    // {
    //     name: 'Rồi ta sẽ ngắm pháo hoa cùng nhau',
    //     singer: 'O.lew',
    //     path: './assets/mp3/RoiTaSeNgamPhaoHoaCungNhau-OlewVietNam-8485329.mp3',
    //     img: './assets/img/roitasengamphaohoacungnhau.jpg'
    // },
    // {
    //     name: 'Waiting for you',
    //     singer: 'MONO',
    //     path: './assets/mp3/WaitingForYou-MONOOnionn-7733882.mp3',
    //     img: './assets/img/waitingforyou.jpg'
    // },

// ]

let nameSong = $('.name-song');
let cdImg = $('.cd img');
let boderAudio = $('.audio');
let audioSong = $('audio');
let currentIndex = 0;
let playSong = $('#play');
let pauseSong = $('#pause');
let songProgress = $('.song-progress');
let nextBtn = $('.next');
let preBtn = $('.back');
let isRandom = false;
let randomBtn = $('.random i')
let isRepeat = false;
let repeatBtn = $('.repeat i');
let listSong = $$('pick-song')
let imgInlist = $$('img')
let currentTime = $('.current-time')
let durationTime = $('.duration-time')
let volumeOn = $('.volume-on')
let volumeOff = $('.volume-off')
let extraBtn = $$('extra')
let deletes = $$('delete')

function start() {

    getTheSong(getFirstSong)
    getTheSong(render)
    getTheSong(handleEvent)

    getTheSong(continues)

}
start();

function getTheSong(callback) {
    fetch("http://localhost:3000/theSong")
        .then((theSong) => theSong.json())
        .then(callback)
}

function deleteTheSong(index){
    fetch(`http://localhost:3000/theSong` + "/" + index,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
          },
    })
    

}
function render(theSong) {

    let a = theSong.map(function (song, index) {

        return `
        <div class="song" >
        <div class= "pick-song">
        <div>
        <img class ="img ${index == currentIndex ? "active" : ""}" src="${song.img}" alt="anh minh hoa">
        </div>
        <div>
        <h4>${song.name}</h4>
        <p class="singer">${song.singer}</p>
        </div>
        </div>        
                <div class="song-footer">
                    <i class="fas fa-ellipsis-h extra"></i>
                    <div class="more none"> 
                    <p class= "delete" style = "color:red">Xóa</p>
                    <p>Chia sẻ <i class="fas fa-share"></i></p>
                    <p class= "close">Đóng</p>
                    </div>
                    </div>
                    </div>
                    `
    })
    playList.innerHTML = a.join('');
    pickSong(theSong);
    extra();
    deleteSong()
    
}

function handleEvent(theSong) {

    //xử lý CD quay
    let cdAnimate = cdImg.animate([
        { transform: 'rotate(360deg)' }
    ], {
        duration: 11000,
        iterations: Infinity
    })
    cdAnimate.pause()

    //Xử lý CD croll
    let heightCd = cdImg.offsetHeight;
    let widthCd = cdImg.offsetWidth;

    playList.onscroll = function () {
        let currentcdHeight = playList.scrollTop;
        let newHeightcd = heightCd - currentcdHeight;
        let currentcdWidth = playList.scrollTop;
        let newWidthcd = widthCd - currentcdWidth;
        cdImg.style.opacity = newHeightcd / heightCd;
console.log(newHeightcd)
        if (newHeightcd <= 75) {
            cdImg.style.height = 0;
            cdImg.style.width = 0;
        } else {
            cdImg.style.height = newHeightcd + 'px';
            cdImg.style.width = newWidthcd + 'px';
        }
    }

    // Xử lý nút play và pause
    playSong.onclick = function (e) {
        audioSong.play();
        e.target.classList.add('none');
        pauseSong.classList.remove('none');
        cdAnimate.play()

    }
    pauseSong.onclick = function (e) {
        audioSong.pause();
        e.target.classList.add('none');
        playSong.classList.remove('none');
        cdAnimate.pause()
    }

    // Xử lý hiển thị thời gian

    audioSong.ontimeupdate = function (e) {

        let currentMinutes = Math.floor(audioSong.currentTime / 60);
        let currentSeconds = Math.floor(audioSong.currentTime - currentMinutes * 60)
        if (currentMinutes < 10) {
            currentMinutes = `0${currentMinutes}`
        }
        if (currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`
        }
        currentTime.innerText = `${currentMinutes}:${currentSeconds}`;

        if (audioSong.duration) {
            songProgress.value = (e.target.currentTime / audioSong.duration) * 100;
        }

    }

    audioSong.onloadedmetadata = function () {

        let durationMinutes = Math.floor(audioSong.duration / 60)
        let durationSeconds = Math.floor(audioSong.duration - durationMinutes * 60)
        if (durationMinutes < 10) {
            durationMinutes = `0${durationMinutes}`
        }
        if (durationSeconds < 10) {
            durationSeconds = `0${durationSeconds}`
        }
        durationTime.innerText = `${durationMinutes}:${durationSeconds}`;
    }
    // Xử lý tua

    songProgress.oninput = function (e) {
        let seekTime = (e.target.value * audioSong.duration) / 100;
        audioSong.currentTime = seekTime;
    }
    // Xử lý next và prev 
    nextBtn.onclick = function () {

        if (isRandom) {
            randomSong(theSong)
        } else {
            nextSong(theSong)
        }
        render(theSong)

        audioSong.play()

    }
    preBtn.onclick = function () {
        if (isRandom) {
            randomSong(theSong)
        } else {
            prevSong(theSong)
        }
        render(theSong)
        // console.log(audioSong)
        audioSong.play()
    }

    // Xử lý nút Random
    randomBtn.onclick = function () {
        isRandom = !isRandom;
        randomBtn.classList.toggle("red", isRandom)
        console.log(isRandom)
    }

    // Xử lý nút repeat
    repeatBtn.onclick = function () {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle("red", isRepeat)
        if (isRepeat === true) {
            repeatSong()
        } else { continues() }
    }

    // Xử lý loa
    volumeOn.onclick = function () {
        volumeOff.classList.remove('none')
        volumeOn.classList.add('none')
        audioSong.muted = true;
    }
    volumeOff.onclick = function () {
        volumeOff.classList.add('none')
        volumeOn.classList.remove('none')
        audioSong.muted = false;
    }
    // Xử lý nút thêm chức năng

}

function pickSong(theSong) {

    for (let i = 0; i < listSong.length; i++) {
        listSong[i].onclick = function () {
            if (!imgInlist[i].classList.contains("active")) {
                currentIndex = i;
                getSong(theSong);
                pauseSong.classList.remove('none');
                playSong.classList.add('none');
                audioSong.play();
            }
        }
    }
}
function getFirstSong(theSong) {
    cdImg.src = theSong[0].img
    nameSong.innerText = theSong[0].name;
    audioSong.src = theSong[0].path;
    // durationTime.innerText = audioSong.duration;
}

function getSong(theSong) {
    cdImg.src = theSong[currentIndex].img
    nameSong.innerText = theSong[currentIndex].name;
    audioSong.src = theSong[currentIndex].path
    render(theSong)
    // imgInlist[currentIndex].classList.add("active")

}

function nextSong(theSong) {
    currentIndex++
    if (currentIndex >= theSong.length) { currentIndex = 0 }
    getSong(theSong)
}

function prevSong(theSong) {
    currentIndex--
    if (currentIndex < 0) { currentIndex = theSong.length - 1 }
    getSong(theSong)
}

function randomSong(theSong) {
    let newIndex
    do {
        newIndex = Math.floor(Math.random() * theSong.length)
    } while (newIndex === currentIndex)
    currentIndex = newIndex;
    getSong(theSong)
}

function repeatSong() {
    audioSong.onended = function () {
        audioSong.load()
        audioSong.play()
    }
}

function continues(theSong) {
    audioSong.onended = function () {
        if (isRandom) {
            randomSong(theSong)
        } else {
            nextSong(theSong)
        }
        audioSong.play()
    }
}
function extra() {
    let extraBtns = Array.from(extraBtn);
    extraBtns.forEach(function (btn) {
        btn.onclick = function () {
            const morePanel = this.parentElement.querySelector(".more");
            const close = this.parentElement.querySelector(".close")
            morePanel.classList.remove("none");
            close.onclick = function () {
                morePanel.classList.add("none")
            }
        }
    })
}
function deleteSong() {
   let deleteBtns = Array.from(deletes);
   deleteBtns.forEach(function(deleteBtn,index){
    deleteBtn.onclick = function(){
        deleteTheSong(index);
        //    console.log(deleteTheSong(index))
    }
   })
}



