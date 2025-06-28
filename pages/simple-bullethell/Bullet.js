/**
 * 弾を管理する基底クラス。
 * @abstract
 */
class Bullet {

    /**
     * Bulletクラスのコンストラクタ。
     * @param {number} x - 弾の初期X座標（基準座標）。
     * @param {number} y - 弾の初期Y座標（基準座標）。
     * @param {number} baseRadius - 弾の見た目の半径（基準値）。
     * @param {string} [color='white'] - 弾の色。
     */
    constructor(x, y, baseRadius, color = 'white') {
        /**
         * @type {number} 弾の基準座標x
         */
        this.x = x;
        /**
         * @type {number} 弾の基準座標y
         */
        this.y = y;
        /**
         * @type {number} 弾の見た目の基準半径
         */
        this.baseRadius = baseRadius;
        /**
         * @type {number} 弾の当たり判定の比率
         */
        this.hitboxRatio = 0.8;
        /**
         * @type {number} 当たり判定
         */
        this.hitboxRadius = this.baseRadius * this.hitboxRatio;

        // スケール適用後のプロパティ
        /**
         * @type {number} scaleFactor適用後の見た目の半径
         */
        this.radius = this.baseRadius * Game.instance.scaleFactor;

        /**
         * @type {string} 弾の色
         */
        this.color = color;
        /**
         * @type {number} 透明度 (0: 透明, 1: 不透明)
         */
        this.alpha = 0;
        /**
         * @type {number} フェードインの時間ms
         */
        this.fadeInDuration = 400;
        /**
         * @type {DOMHighResTimeStamp} 生成された時間
         */
        this.creationTime = performance.now();
        /**
         * @type {number} 無敵時間ms
         */
        this.invincibilityDuration = 400;
        /**
         * @type {number} 画面外と判定する余裕 (基準値 pixel)
         */
        this.offScreenBaseMargin = 100;
    }

    /**
     * スケールファクターの変更に応じて弾のプロパティを更新します。
     * @param {number} newScaleFactor - 新しい拡大縮小率。
     */
    updateScaledProperties(newScaleFactor) {
        this.radius = this.baseRadius * newScaleFactor;
        // 位置はゲームロジック側で更新されるのでここでは触れない
    }

    /**
     * 弾を描画します。
     * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト。
     */
    draw(ctx) {
        ctx.save(); // 現在の描画状態を保存
        ctx.globalAlpha = this.alpha; // 透明度を設定
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // 基準座標にscaleFactorを適用して描画
        ctx.arc(this.x * Game.instance.scaleFactor, this.y * Game.instance.scaleFactor, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore(); // 保存した描画状態に戻す
    }

    /**
     * 弾の状態を更新します（移動とフェードイン）。
     * このメソッドはサブクラスで必ずオーバーライドするべきです。
     * super.update()を呼ぶことでフェードイン処理をします。
     * @abstract
     * @param {number} deltaTime - 前のフレームからの経過時間（ミリ秒）。
     * @param {DOMHighResTimeStamp} currentTime - 現在のタイムスタンプ。
     */
    update(deltaTime, currentTime) {
        // フェードイン処理
        const timeElapsed = currentTime - this.creationTime;
        if (timeElapsed < this.fadeInDuration) {
            this.alpha = timeElapsed / this.fadeInDuration;
        } else {
            this.alpha = 1; // フェードイン完了
        }
        // このメソッドは継承先でオーバーライドされるが、super.update()を呼ぶことでフェードインも処理される
    }

    /**
     * 弾が画面外に出たかどうかを判定します。
     * @param {HTMLCanvasElement} canvas - キャンバス要素。
     * @returns {boolean} 画面外に出た場合はtrue、そうでない場合はfalse。
     */
    isOffScreen(canvas) {
        // isOffScreenの判定は、常に物理的なキャンバスの端と物理的な弾の半径で行う
        const currentOffScreenMargin = this.offScreenBaseMargin * Game.instance.scaleFactor;

        return (
            this.x * Game.instance.scaleFactor + this.radius < -currentOffScreenMargin ||
            this.x * Game.instance.scaleFactor - this.radius > canvas.width + currentOffScreenMargin ||
            this.y * Game.instance.scaleFactor + this.radius < -currentOffScreenMargin ||
            this.y * Game.instance.scaleFactor - this.radius > canvas.height + currentOffScreenMargin
        );
    }

}


/**
 * 直線的に移動する弾のクラス。Bulletを継承します。
 */
class StraightBullet extends Bullet {

    /**
     * StraightBulletクラスのコンストラクタ。
     * @param {number} x - 弾の初期X座標（基準座標）。
     * @param {number} y - 弾の初期Y座標（基準座標）。
     * @param {number} baseRadius - 弾の見た目の半径（基準値）。
     * @param {number} baseVx - X方向の速度（基準値）。
     * @param {number} baseVy - Y方向の速度（基準値）。
     */
    constructor(x, y, baseRadius, baseVx, baseVy) {
        super(x, y, baseRadius, 'white');
        this.baseVx = baseVx; // 基準速度
        this.baseVy = baseVy; // 基準速度
    }

    /**
     * 弾の状態を更新します（移動）。
     * @override
     * @param {number} deltaTime - 前のフレームからの経過時間（ミリ秒）。
     * @param {DOMHighResTimeStamp} currentTime - 現在のタイムスタンプ。
     */
    update(deltaTime, currentTime) {
        super.update(deltaTime, currentTime); // 親クラスのupdateを呼び出す
        this.x += this.baseVx; // 基準座標で更新
        this.y += this.baseVy; // 基準座標で更新
    }

}


/**
 * カーブしながら移動する弾のクラス。Bulletを継承します。
 */
class CurvingBullet extends Bullet {

    /**
     * CurvingBulletクラスのコンストラクタ。
     * @param {number} x - 弾の初期X座標（基準座標）。
     * @param {number} y - 弾の初期Y座標（基準座標）。
     * @param {number} baseRadius - 弾の見た目の半径（基準値）。
     * @param {number} initialBaseVx - 初期X方向の速度（基準値）。
     * @param {number} initialBaseVy - 初期Y方向の速度（基準値）。
     * @param {number} [baseCurveFactor=0.05] - カーブの強さ（基準値）。
     * @param {number} [baseFrequencyFactor=0.05] - カーブの周波数（基準値）。
     */
    constructor(x, y, baseRadius, initialBaseVx, initialBaseVy, baseCurveFactor = 0.05, baseFrequencyFactor = 0.05) {
        super(x, y, baseRadius, 'white');
        // 速度ベクトルを正規化し、基準の速度の大きさを保存
        const speedMagnitude = Math.sqrt(initialBaseVx * initialBaseVx + initialBaseVy * initialBaseVy);
        this.vx = initialBaseVx; // 基準速度
        this.vy = initialBaseVy; // 基準速度
        this.baseSpeedMagnitude = speedMagnitude; // 基準速度の大きさ

        this.baseCurveFactor = baseCurveFactor;
        this.baseFrequencyFactor = baseFrequencyFactor;
        this.age = 0;
    }

    /**
     * 弾の状態を更新します（移動とカーブ）。
     * @param {number} deltaTime - 前のフレームからの経過時間（ミリ秒）。
     * @param {DOMHighResTimeStamp} currentTime - 現在のタイムスタンプ。
     */
    update(deltaTime, currentTime) {
        super.update(deltaTime, currentTime); // 親クラスのupdateを呼び出す
        this.age++;

        // 現在の進行方向ベクトル (vx, vy)
        const currentSpeedMagnitude = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (currentSpeedMagnitude === 0) return; // 速度が0の場合は処理しない

        const dirX = this.vx / currentSpeedMagnitude;
        const dirY = this.vy / currentSpeedMagnitude;

        // 進行方向に対する垂直ベクトル (-dirY, dirX)
        const perpX = -dirY;
        const perpY = dirX;

        // 振動成分を計算
        const oscillationMagnitude = Math.sin(this.age * this.baseFrequencyFactor) * this.baseCurveFactor;

        // 振動成分を垂直ベクトルに適用し、速度に追加（基準座標での移動量を計算）
        // ここでの`vx`, `vy`は既に基準座標での速度なので、直接加算
        this.x += this.vx + (perpX * oscillationMagnitude);
        this.y += this.vy + (perpY * oscillationMagnitude);

        // 弾の速度ベクトルを元の基準速度の大きさに保つために正規化して再適用
        const newSpeedMagnitude = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (newSpeedMagnitude > 0) {
            this.vx = (this.vx / newSpeedMagnitude) * this.baseSpeedMagnitude;
            this.vy = (this.vy / newSpeedMagnitude) * this.baseSpeedMagnitude;
        }
    }

}


/**
 * 波打つように移動する弾のクラス。Bulletを継承します。
 */
class WaveBullet extends Bullet {

    /**
     * WaveBulletクラスのコンストラクタ。
     * @param {number} x - 弾の初期X座標（基準座標）。
     * @param {number} y - 弾の初期Y座標（基準座標）。
     * @param {number} baseRadius - 弾の見た目の半径（基準値）。
     * @param {number} baseVy - Y方向の速度（基準値）。
     * @param {number} baseWaveAmplitude - 波の振幅（基準値）。
     * @param {number} baseWaveFrequency - 波の周波数（基準値）。
     * @param {number} initialPhase - 波の初期位相。
     */
    constructor(x, y, baseRadius, baseVy, baseWaveAmplitude, baseWaveFrequency, initialPhase) {
        super(x, y, baseRadius, 'white');
        // 多めに余裕をとる
        this.offScreenBaseMargin = 200;

        this.initialX = x; // 初期X座標を保存 (基準座標)
        this.baseVy = baseVy; // 基準速度
        this.baseWaveAmplitude = baseWaveAmplitude; // 基準振幅
        this.baseWaveFrequency = baseWaveFrequency; // 基準周波数
        this.initialPhase = initialPhase; // 初期位相
        this.age = 0;
    }

    /**
     * 弾の状態を更新します（移動と波打ち）。
     * @param {number} deltaTime - 前のフレームからの経過時間（ミリ秒）。
     * @param {DOMHighResTimeStamp} currentTime - 現在のタイムスタンプ。
     */
    update(deltaTime, currentTime) {
        super.update(deltaTime, currentTime); // 親クラスのupdateを呼び出す
        this.age++;
        // 初期X座標から波打つようにX座標を更新 (基準座標で計算)
        this.x = this.initialX + Math.sin(this.age * this.baseWaveFrequency + this.initialPhase) * this.baseWaveAmplitude;
        this.y += this.baseVy; // 基準速度でY座標を更新
    }

}