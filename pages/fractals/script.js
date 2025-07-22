/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
/**
 * @type {HTMLInputElement}
 */
const fractal = document.getElementsByName('fractal');
/**
 * @type {HTMLDivElement}
 */
const blockStretchWidth = document.getElementById('block-stretch-width');

const animater = {
    animateFractal: "",
    currentAnimatingFractal: "",

    lastFrameTime: 0,
    frameRate: 60,
    animationFrameId: 0,
    /**
     * 
     * @param {DOMHighResTimeStamp} currentTime requestAnimationFrameから第一引数に渡される現在のタイムスタンプ
     */
    update(currentTime = 0) {
        this.animationFrameId = requestAnimationFrame(this.update.bind(this));
        if ((currentTime - this.lastFrameTime) < (1000 / this.frameRate)) {
            return;
        }

        // リサイズ
        if (blockStretchWidth.getBoundingClientRect().width !== canvas.width) {
            canvas.width = blockStretchWidth.getBoundingClientRect().width;
            canvas.height = blockStretchWidth.getBoundingClientRect().width * (2 / 3);
        }

        this.selectFractal();
    },
    selectFractal() {
        if (this.animateFractal !== this.currentAnimatingFractal) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        //switch (key) {
        //    case value:

        //        break;

        //    default:
        //        break;
        //}
    }
};
drawer.drawSierpinski();

const drawer = {
    drawSierpinski(x1, y1, x2, y2, x3, y3, depth) {
        if (depth === 0) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();
            ctx.stroke(); // または fill()
            return;
        }

        // 各辺の中点を計算
        const mid12x = (x1 + x2) / 2;
        const mid12y = (y1 + y2) / 2;
        const mid23x = (x2 + x3) / 2;
        const mid23y = (y2 + y3) / 2;
        const mid31x = (x3 + x1) / 2;
        const mid31y = (y3 + y1) / 2;

        // 3つの外側の小さな三角形に対して再帰呼び出し
        drawSierpinski(x1, y1, mid12x, mid12y, mid31x, mid31y, depth - 1);
        drawSierpinski(mid12x, mid12y, x2, y2, mid23x, mid23y, depth - 1);
        drawSierpinski(mid31x, mid31y, mid23x, mid23y, x3, y3, depth - 1);
    }
};

(() => {


    fractal.forEach(radio => radio.addEventListener(e => {
        animater.animateFractal = radio.value;
    }));

    animater.update();
})();

