// cnavas的宽度
var CANVAS_WIDTH = 900;
// canvas的高度
var CANVAS_HEIGHT = 400;
// 圆半径
var RADIUS = 17;
var MARGIN_TOP = 50;
var MARGIN_LEFT = 20;
// 倒计时结束时间
var endTime = new Date();
endTime.setTime(endTime.getTime() + 216 * 1000);
// 当前时间
var curShowTimeSeconds = 0;
// 小球容器
var balls = [];
var timer = null;
// 小球颜色
const colors = ["#006699", "#006699", "#006699", "#006699", "#006699", "#006699", "#006699", "#006699", "#006699", "#006699"];

window.onload = function () {
    CANVAS_WIDTH = document.body.clientWidth;
    CANVAS_HEIGHT = document.body.clientHeight;

    MARGIN_LEFT = Math.round(CANVAS_WIDTH / 10);
    MARGIN_TOP = Math.round(CANVAS_HEIGHT / 5);
    RADIUS = Math.round(CANVAS_WIDTH * 0.8 / 108) - 1;

    var canvas = document.getElementById("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;


    curShowTimeSeconds = getCurrentShowTimeSeconds();

    timer = setInterval("CountDown()", 50);
};

//定时器函数
function CountDown() {
    var context = canvas.getContext("2d");
    if (curShowTimeSeconds != 0) {
        render(context);
        update();
    } else {
        clearInterval(timer);
        window.location.href = "../fairwork/fairwork.html";
    }
}
// 获取当前剩余时间
function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round(ret / 1000);
    return ret > 0 ? ret : 0;
}

// 更新倒计时时间和小球
function update() {
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = nextShowTimeSeconds % 60;

    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = curShowTimeSeconds % 60;

    if (nextSeconds !== curSeconds) {
        if (parseInt(curHours / 10) !== parseInt(nextHours / 10)) {
            addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10));
        }
        if (parseInt(curHours % 10) !== parseInt(nextHours % 10)) {
            addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10));
        }

        if (parseInt(curMinutes / 10) !== parseInt(nextMinutes / 10)) {
            addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
        }
        if (parseInt(curMinutes % 10) !== parseInt(nextMinutes % 10)) {
            addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
        }

        if (parseInt(curSeconds / 10) !== parseInt(nextSeconds / 10)) {
            addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
        }
        if (parseInt(curSeconds % 10) !== parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds % 10));
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();
}

// 更新小球状态
function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if (balls[i].y >= CANVAS_HEIGHT - RADIUS) {
            balls[i].y = CANVAS_HEIGHT - RADIUS;
            balls[i].vy = - balls[i].vy * 0.75;
        }
    }

    var cnt = 0;
    for (var j = 0; j < balls.length; j++) {
        if (balls[j].x + RADIUS > 0 && balls[j].x - RADIUS < CANVAS_WIDTH) {
            balls[cnt++] = balls[j];
        }
    }
    while (balls.length > Math.min(300, cnt)) {
        balls.pop();
    }
}

// 添加小球
function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                var aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                };
                balls.push(aBall);
            }
        }
    }
}

// 绘画小球
function render(cxt) {
    cxt.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
    var seconds = curShowTimeSeconds % 60;

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt);
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt);
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt);
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt);

    for (var i = 0; i < balls.length; i++) {
        cxt.fillStyle = balls[i].color;
        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
        cxt.closePath();
        cxt.fill();
    }
}

// 画数字
function renderDigit(x, y, num, cxt) {
    cxt.fillStyle = "rgb(0, 102, 153)";

    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                cxt.beginPath();
                cxt.arc(x + 2 * j * (RADIUS + 1) + (RADIUS + 1), y + 2 * i * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                cxt.closePath();

                cxt.fill();
            }
        }
    }
}