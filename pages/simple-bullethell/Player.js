/**
 * プレイヤーを管理するクラス。
 */
class Player {

    /**
     * Playerクラスのコンストラクタ。
     * @param {number} x - プレイヤーの初期X座標（基準座標）。
     * @param {number} y - プレイヤーの初期Y座標（基準座標）。
     * @param {number} baseRadius - プレイヤーの見た目の半径（基準値）。
     * @param {string} color - プレイヤーの色。
     * @param {number} baseSpeed - プレイヤーの移動速度（基準値）。
     * @param {HTMLCanvasElement} canvas - キャンバス要素。
     * @param {number} initialScaleFactor - 初期拡大縮小率。
     */
    constructor(x, y, baseRadius, color, baseSpeed, canvas, initialScaleFactor) {
        /**
         * @type {number} プレイヤーの基準座標x
         */
        this.x = x;
        /**
         * @type {number} プレイヤーの基準座標y
         */
        this.y = y;
        /**
         * @type {number} 見た目の基準半径
         */
        this.baseRadius = baseRadius;
        /**
         * @type {number} 移動速度の基準値
         */
        this.baseSpeed = baseSpeed;
        /**
         * @type {number} 見た目に対しての当たり判定の比率
         */
        this.hitboxRatio = 0.6;
        /**
         * @type {number} 当たり判定
         */
        this.hitboxRadius = this.baseRadius * this.hitboxRatio;

        // スケール適用後のプロパティ
        /**
         * @type {number} scaleFactor適用後の見た目の半径
         */
        this.radius = this.baseRadius * initialScaleFactor;
        /**
         * @type {number} scaleFactor適用後の移動速度
         */
        this.speed = this.baseSpeed * initialScaleFactor;

        /**
         * @type {string} プレイヤーの色
         */
        this.color = color;
        /**
         * @type {HTMLCanvasElement} キャンバス要素
         */
        this.canvas = canvas;
    }

    /**
     * スケールファクターの変更に応じてプレイヤーのプロパティを更新します。
     * @param {number} newScaleFactor - 新しい拡大縮小率。
     */
    updateScaledProperties(newScaleFactor) {
        this.radius = this.baseRadius * newScaleFactor;
        this.speed = this.baseSpeed * newScaleFactor;
    }

    /**
     * プレイヤーを描画します。
     * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト。
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // 基準座標にscaleFactorを適用して描画
        ctx.arc(this.x * this.canvas.width / Game.instance.baseGameWidth,
            this.y * this.canvas.height / Game.instance.baseGameHeight,
            this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * プレイヤーの状態を更新します（移動）。
     * @param {Object.<string, boolean>} keys - 現在押されているキーの状態。
     * @param {Object.<string, boolean>} touchMovements - タッチ操作による移動方向。
     * @param {number} deltaTime - 前のフレームからの経過時間ms。
     */
    update(keys, touchMovements, deltaTime) {
        let moveX = 0;
        let moveY = 0;

        // 基準速度を元に計算
        let currentBaseSpeed = this.baseSpeed; // this.baseSpeedはpixel/sec単位
        if (keys['Shift']) {
            currentBaseSpeed /= 2;
        }
        // 速度をピクセル/秒からピクセル/ミリ秒に変換
        const speedPerMs = currentBaseSpeed / 1000;

        let dx = 0;
        let dy = 0;

        if (touchMovements.active) {
            // タッチ操作がアクティブな場合
            const targetX = touchMovements.touchTargetX;
            const targetY = touchMovements.touchTargetY;

            const diffX = targetX - this.x;
            const diffY = targetY - this.y;
            const distanceToTarget = Math.sqrt(diffX * diffX + diffY * diffY);

            const decelerationThreshold = this.baseRadius * 2; // 減速を開始する距離

            let effectiveSpeedPerMs;
            if (distanceToTarget <= decelerationThreshold) {
                // 目標に近づくにつれて速度を線形に減速
                effectiveSpeedPerMs = speedPerMs * (distanceToTarget / decelerationThreshold);
            } else {
                // 目標から離れている場合は最大速度
                effectiveSpeedPerMs = speedPerMs;
            }

            // 移動量を計算
            if (distanceToTarget > 0) { // ゼロ除算を避ける
                dx = (diffX / distanceToTarget) * effectiveSpeedPerMs * deltaTime;
                dy = (diffY / distanceToTarget) * effectiveSpeedPerMs * deltaTime;
            }

            // 目標地点を通り過ぎないように補正
            if (Math.abs(diffX) < Math.abs(dx)) dx = diffX;
            if (Math.abs(diffY) < Math.abs(dy)) dy = diffY;

        } else {
            // キーボード操作の場合
            if (keys['ArrowLeft']) {
                moveX -= 1;
            }
            if (keys['ArrowRight']) {
                moveX += 1;
            }
            if (keys['ArrowUp']) {
                moveY -= 1;
            }
            if (keys['ArrowDown']) {
                moveY += 1;
            }

            if (moveX !== 0 && moveY !== 0) {
                // 斜め移動の速度補正
                const diagonalSpeedPerMs = speedPerMs / Math.sqrt(2);
                dx = moveX * diagonalSpeedPerMs * deltaTime;
                dy = moveY * diagonalSpeedPerMs * deltaTime;
            } else {
                dx = moveX * speedPerMs * deltaTime;
                dy = moveY * speedPerMs * deltaTime;
            }
        }

        this.x += dx;
        this.y += dy;

        // プレイヤーが基準ゲーム範囲外に出ないように制限 (基準半径を使用)
        if (this.x - this.baseRadius < 0) {
            this.x = this.baseRadius;
        }
        if (this.x + this.baseRadius > Game.instance.baseGameWidth) {
            this.x = Game.instance.baseGameWidth - this.baseRadius;
        }
        if (this.y - this.baseRadius < 0) {
            this.y = this.baseRadius;
        }
        if (this.y + this.baseRadius > Game.instance.baseGameHeight) {
            this.y = Game.instance.baseGameHeight - this.baseRadius;
        }
    }

}