/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');
/**
 * @type {HTMLCanvasElement}
 */
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

        this.updateCanvasWidth();

        this.selectFractal();
    },
    selectFractal() {
        if (this.animateFractal !== this.currentAnimatingFractal) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.updateCanvasWidth();

            this.currentAnimatingFractal = this.animateFractal;
        }

        switch (this.currentAnimatingFractal) {
            case "sierpinski":
                graphic.drawSierpinski(canvas.width / 2, 20, 20, canvas.height - 20, canvas.width - 20, canvas.height - 20, 6);
                break;
            case "koch":
                graphic.drawKochCurve(20, canvas.height / 4, canvas.width - 20, canvas.height / 4, 7);
                break;
            case "cantor":
                graphic.drawCantorSet(20, canvas.width - 20, 20, 8);
                break;
            default:
                break;
        }
    },
    updateCanvasWidth() {
        if (blockStretchWidth.getBoundingClientRect().width !== canvas.width) {
            canvas.width = blockStretchWidth.getBoundingClientRect().width;
            canvas.height = blockStretchWidth.getBoundingClientRect().width * (2 / 3);
        }
    }
};

const graphic = {
    drawKochCurve(x1, y1, x2, y2, depth) {
        if (depth === 0) {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.stroke();
            return;
        }

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        const xA = x1 + dx / 3;
        const yA = y1 + dy / 3;

        const xC = x2 - dx / 3;
        const yC = y2 - dy / 3;

        const xB = xA + dist / 3 * Math.cos(angle + Math.PI / 3);
        const yB = yA + dist / 3 * Math.sin(angle + Math.PI / 3);

        this.drawKochCurve(x1, y1, xA, yA, depth - 1);
        this.drawKochCurve(xA, yA, xB, yB, depth - 1);
        this.drawKochCurve(xB, yB, xC, yC, depth - 1);
        this.drawKochCurve(xC, yC, x2, y2, depth - 1);
    },
    drawSierpinski(x1, y1, x2, y2, x3, y3, depth) {
        if (depth === 0) {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();
            ctx.stroke();
            return;
        }

        const mid12x = (x1 + x2) / 2;
        const mid12y = (y1 + y2) / 2;
        const mid23x = (x2 + x3) / 2;
        const mid23y = (y2 + y3) / 2;
        const mid31x = (x3 + x1) / 2;
        const mid31y = (y3 + y1) / 2;

        this.drawSierpinski(x1, y1, mid12x, mid12y, mid31x, mid31y, depth - 1);
        this.drawSierpinski(mid12x, mid12y, x2, y2, mid23x, mid23y, depth - 1);
        this.drawSierpinski(mid31x, mid31y, mid23x, mid23y, x3, y3, depth - 1);
    },
    drawCantorSet(x1, x2, y, depth) {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.closePath();
        ctx.stroke();
        if (depth === 0) {
            return;
        }

        const len = (x2 - x1) / 2.5;
        this.drawCantorSet(x1, x1 + len, y + 20, depth - 1);
        this.drawCantorSet(x2 - len, x2, y + 20, depth - 1);
    },
};

(() => {

    fractal.forEach(radio => radio.addEventListener("change", e => {
        animater.animateFractal = radio.value;
        
        // TODO:
        animater.selectFractal();
    }));

    //animater.update();
})();

