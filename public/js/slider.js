let imgSlider = document.querySelectorAll(".div-element-slider");
let chevronRight = document.getElementById("chevronRight");
let chevronLeft = document.getElementById("chevronLeft");

let margin = -200;
let data = [];
for (let x = 0; x < imgSlider.length; x++) {
    margin = margin + 100;
    data[x] = margin;
    imgSlider[x].style.marginLeft = margin + "%";
    console.log(imgSlider.length)
}

let intervalId;
chevronRight.addEventListener("click", function () {

    for (let x = 0; x < imgSlider.length; x++) {
        data[x] = data[x] - 100;
    }
    ir(data);
    clearInterval(intervalId);
    interval()
})
chevronLeft.addEventListener("click", function () {

    for (let x = 0; x < imgSlider.length; x++) {
        data[x] = data[x] + 100;
    }
    console.log(data)
    volver(data);
    clearInterval(intervalId);
    interval()
})
function ir(data) {
    for (let x = 0; x < data.length; x++) {

        if (data[x] == (imgSlider.length - 1) * -100) {
            data[x] = 100;
            imgSlider[x].style.transition = "margin 0s";
            console.log(data[x])
            imgSlider[x].style.marginLeft = 100 + "%";
        } else {
            imgSlider[x].style.transition = "margin 0.5s";
            imgSlider[x].style.marginLeft = data[x] + "%";

        }
        if (data[x] == 0) {
            imgSlider[x].style.zIndex = 99
        } else {
            imgSlider[x].style.zIndex = "";
        }
    }
}
function volver(data) {
    for (let x = 0; x < data.length; x++) {
        if (data[x] == (imgSlider.length - 1) * 100) {
            console.log(data)
            data[x] = -100;
            imgSlider[x].style.transition = "margin 0s";
            console.log(data[x])
            imgSlider[x].style.marginLeft = -100 + "%";
        } else {
            imgSlider[x].style.transition = "margin 0.5s";
            imgSlider[x].style.marginLeft = data[x] + "%";
        }
        if (data[x] == 0) {
            imgSlider[x].style.zIndex = 99
        } else {
            imgSlider[x].style.zIndex = "";
        }
    }
}
function interval() {
    intervalId = setInterval(() => {
        for (let x = 0; x < imgSlider.length; x++) {
            data[x] = data[x] - 100;
            console.log(data)
        }
        ir(data);
    }, 5000);
}
interval();