/**
 * @enum {string} ゲーム画面の定義の列挙
 */
const GameState = {
    START: 'start',
    PLAY: 'play'
}

/**
 * ゲーム全体のロジック・状態を管理するクラス。
 */
class Game {

    /**
     * Gameクラスのコンストラクタ。
     * @param {HTMLCanvasElement} canvas ゲームの描写先キャンバス
     * @param {CanvasRenderingContext2D} ctx キャンバスのの2D描写コンテキスト
     */
    constructor(canvas, ctx) {
        /**
         * @type {HTMLCanvasElement} ゲームの描写先キャンバス
         */
        this.canvas = canvas;
        /**
         * @type {CanvasRenderingContext2D} キャンバスの2D描写コンテキスト
         */
        this.ctx = ctx;

        /**
         * @type {number} ゲーム内の基準となる幅
         */
        this.baseGameWidth = 400;
        /**
         * @type {number} ゲーム内の基準となる高さ
         */
        this.baseGameHeight = 600;
        /**
         * @type {number} キャンバスの拡大率。
         * これを使用するのは描写系統とキャンバス側から見た座標を得るときのみ
         */
        this.scaleFactor = 1;

        /**
         * @type {Player} プレイヤーのインスタンス
         */
        this.player = null;
        /**
         * @type {Array<Bullet>} ゲーム上の全ての弾幕
         */
        this.bullets = [];
        /**
         * @type {number} ゲーム開始から避けた(画面外に行った)弾幕の総数
         */
        this.score = 0;
        /**
         * @type {number} LocalStorageに保存されているハイスコア
         */
        this.highScore = this.loadHighScore();
        /**
         * @type {number} LocalStorageに保存されている累計スコア
         */
        this.totalScore = this.loadTotalScore();
        /**
         * @type {string} 現在のゲーム画面
         */
        this.state = GameState.START;
        /**
         * @type {number} 最後に弾幕パターンが開始してからの経過時間ms
         */
        this.lastBulletSpawnTime = 0;
        /**
         * @type {number} 60FPSの1フレームあたりのms
         */
        this.frameRate = 1000 / 60;
        /**
         * @type {{any: boolean}} 現在押されているキーを管理するオブジェクト
         */
        this.keys = {};

        /**
         * @type {number} 現在の難易度レベル (1~maxDIfficultyLevel)
         */
        this.difficultyLevel = 1;
        /**
         * @type {number} 難易度の上昇間隔ms
         */
        this.difficultyIncreaseInterval = 15000;
        /**
         * @type {number} 最後に難易度が上昇してからの経過時間ms
         */
        this.lastDifficultyIncreaseTime = 0;
        /**
         * @type {number} 最大難易度レベル
         */
        this.maxDifficultyLevel = 10;

        /**
         * @type {BulletPatternGenerator} 弾幕パターン生成機
         */
        this.bulletPatternGenerator = new BulletPatternGenerator(this);
        /**
         * @type {boolean} モバイル環境でタッチ操作が利用可能か
         */
        this.isTouchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        /**
         * @type {{any: boolean}} タッチ移動状態
         */
        this.touchMovements = { up: false, down: false, left: false, right: false };
        /**
         * @type {number} 最後のフレームのタイムスタンプ
         */
        this.lastFrameTime = 0;
        /**
         * @type {number} requestAnimationFrameから渡されるID
         */
        this.animationFrameId = null;

        // キャンバスのサイズを初期設定
        this.resizeCanvas();
        // 画面リサイズ時にキャンバスのサイズを再設定
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        // イベントリスナーの初期設定
        this.setupEventListeners();
        // ゲームループの開始
        this.gameLoop();
    }

    /**
     * キャンバスのサイズをウィンドウサイズに合わせて調整します。
     * 縦横比3:2を維持し、ウィンドウの少ない方の幅100%に合わせます。
     * また、ゲーム内容の拡大縮小率 (scaleFactor) を計算します。
     */
    resizeCanvas() {
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight;

        let newWidth = Math.min(maxWidth, maxHeight * (2 / 3));
        let newHeight = newWidth * (3 / 2);

        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * (2 / 3);
        }

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        // scaleFactorを計算
        this.scaleFactor = this.canvas.width / this.baseGameWidth;

        // プレイヤーが既に存在する場合はプレイヤーのスケールプロパティを更新
        if (this.player) {
            this.player.updateScaledProperties(this.scaleFactor); // 
        }
        // 弾のスケールプロパティも更新 (既存の弾の描画に影響)
        this.bullets.forEach(bullet => bullet.updateScaledProperties(this.scaleFactor));
    }

    /**
     * ゲームを初期状態にリセットします。
     */
    init() {
        this.player = new Player(
            (this.baseGameWidth / 2), // 基準座標
            (this.baseGameHeight - 50), // 基準座標
            8, // 基準半径
            'red',
            5, // 基準速度
            this.canvas,
            this.scaleFactor // 初期スケールファクターを渡す
        );
        this.bullets = [];
        this.score = 0;
        this.state = GameState.PLAY;
        this.lastBulletSpawnTime = 0;
        this.difficultyLevel = 1; // 難易度をリセット
        this.lastDifficultyIncreaseTime = performance.now(); // 難易度上昇タイマーをリセット
        this.bulletPatternGenerator.updateDifficulty(this.difficultyLevel); // 難易度を初期化
        this.isGeneratingMessage = false;
        this.showGeminiMessageOverlay = false;
    }

    /**
     * キーボードとクリック/タッチイベントリスナーを設定します。
     */
    setupEventListeners() {
        // 任意のキー押下時
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            // Enter時ゲームスタート
            if (this.state === GameState.START && e.key === 'Enter') {
                this.init();
            }
        });
        // 任意のキーを離した時
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // クリック時
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            // クリック座標をscaleFactorで調整し、基準座標に変換
            const clickX = (e.clientX - rect.left) / this.scaleFactor;
            const clickY = (e.clientY - rect.top) / this.scaleFactor;

            if (this.state === GameState.START) {
                this.init();
            }
        });

        if (this.isTouchEnabled) {
            this.setupTouchControls();
        }
    }

    /**
     * モバイルタッチコントロールを設定します。
     */
    setupTouchControls() {
        const touchArea = this.canvas;

        touchArea.addEventListener('touchstart', (e) => {
            if (this.state === GameState.PLAY) {
                e.preventDefault();
                this.handleTouch(e.touches, true);
            }
        });
        touchArea.addEventListener('touchmove', (e) => {
            if (this.state === GameState.PLAY) {
                e.preventDefault();
                this.handleTouch(e.touches, false);
            }
        });
        touchArea.addEventListener('touchend', () => {
            if (this.state === GameState.PLAY) {
                this.resetTouchControls();
            }
        });
        touchArea.addEventListener('touchcancel', () => {
            if (this.state === GameState.PLAY) {
                this.resetTouchControls();
            }
        });
    }

    /**
     * タッチイベントを処理し、プレイヤーの移動方向を決定します。
     * @param {TouchList} touches - 発生したタッチイベントのリスト。
     */
    handleTouch(touches) {
        if (touches.length === 0) return;

        let touchX = 0;
        let touchY = 0;
        for (let i = 0; i < touches.length; i++) {
            touchX += touches[i].clientX;
            touchY += touches[i].clientY;
        }
        touchX /= touches.length;
        touchY /= touches.length;

        const rect = this.canvas.getBoundingClientRect();
        // タッチ座標もスケールファクターで調整して、基準座標に変換
        const canvasX = (touchX - rect.left) / this.scaleFactor;
        const canvasY = (touchY - rect.top) / this.scaleFactor;

        // プレイヤーの内部座標 (基準座標) と比較
        const dx = canvasX - this.player.x;
        const dy = canvasY - this.player.y;

        this.resetTouchControls();

        // 半径は基準半径で比較
        if (dy < -this.player.baseRadius * 2) {
            this.touchMovements.up = true;
        } else if (dy > this.player.baseRadius * 2) {
            this.touchMovements.down = true;
        }

        if (dx < -this.player.baseRadius * 2) {
            this.touchMovements.left = true;
        } else if (dx > this.player.baseRadius * 2) {
            this.touchMovements.right = true;
        }
    }

    /**
     * タッチコントロールの移動状態をリセットします。
     */
    resetTouchControls() {
        this.touchMovements.up = false;
        this.touchMovements.down = false;
        this.touchMovements.left = false;
        this.touchMovements.right = false;
    }

    /**
     * メインゲームループを開始します。
     * @param {DOMHighResTimeStamp} [currentTime=0] - 現在のタイムスタンプ（requestAnimationFrameから渡される）。
     */
    gameLoop(currentTime = 0) {
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        const deltaTime = currentTime - this.lastFrameTime;

        // 設定したフレームレートになるまでAnimationFrameをループ。ループ許容誤差-5
        if (deltaTime < this.frameRate - 5) {
            return;
        }
        this.lastFrameTime = currentTime;

        this.update(deltaTime, currentTime);
        this.draw();
    }

    /**
     * ゲームの状態を更新します。
     * @param {number} deltaTime - 前のフレームからの経過時間（ミリ秒）。
     * @param {DOMHighResTimeStamp} currentTime - 現在のタイムスタンプ。
     */
    update(deltaTime, currentTime) {
        if (this.state === GameState.PLAY) {
            this.player.update(this.keys, this.touchMovements);

            // 難易度上昇のチェック
            if (currentTime - this.lastDifficultyIncreaseTime >= this.difficultyIncreaseInterval) {
                this.increaseDifficulty();
                this.lastDifficultyIncreaseTime = currentTime;
            }

            // 弾の生成
            this.lastBulletSpawnTime += deltaTime;

            if (this.lastBulletSpawnTime >= this.bulletPatternGenerator.currentPatternCooldown) {
                this.bulletPatternGenerator.generateRandomPattern(this.canvas);
                this.lastBulletSpawnTime = 0; // リセット
            }

            // 弾の更新と削除
            this.bullets = this.bullets.filter(bullet => {
                bullet.update(deltaTime, currentTime);
                if (bullet.isOffScreen(this.canvas)) { // isOffScreenは物理キャンバスサイズを直接参照するためscaleFactor不要
                    this.score++;
                    return false;
                }
                return true;
            });

            // 衝突判定
            this.checkCollision(currentTime); // currentTimeを渡す
        }
    }

    /**
     * ゲームの難易度を上昇させます。
     */
    increaseDifficulty() {
        if (this.difficultyLevel < this.maxDifficultyLevel) {
            this.difficultyLevel++;
            console.log(`Difficulty increased to: ${this.difficultyLevel}`);
            // BulletPatternGeneratorに新しい難易度を伝える
            this.bulletPatternGenerator.updateDifficulty(this.difficultyLevel);
        }
    }

    /**
     * ゲームの要素を描画します。
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // キャンバスをクリア

        if (this.state === GameState.START) {
            this.drawStartScreen();
        } else if (this.state === GameState.PLAY) {
            // プレイヤーの描写
            this.player.draw(this.ctx);
            // すべての弾幕の描写
            this.bullets.forEach(bullet => bullet.draw(this.ctx));
            this.drawScore();
            this.drawDifficulty();
        }
    }

    /**
     * 現在のスコアを描画します。
     */
    drawScore() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${20 * this.scaleFactor}px 'Moralerspace Radon'`; // フォントサイズもスケール
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`よけた弾幕: ${this.score}`, 10 * this.scaleFactor, 30 * this.scaleFactor); // 位置もスケール
    }

    /**
     * 現在の難易度レベルを描写します。
     */
    drawDifficulty() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${20 * this.scaleFactor}px 'Moralerspace Radon'`; // フォントサイズもスケール
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Level: ${this.difficultyLevel}`, (this.baseGameWidth - 10) * this.scaleFactor, 30 * this.scaleFactor); // 位置もスケール
    }

    /**
     * ゲーム開始画面を描画します。
     */
    drawStartScreen() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${28 * this.scaleFactor}px 'Moralerspace Radon'`; // フォントサイズもスケール
        this.ctx.textAlign = 'center';
        this.ctx.fillText('シンプル弾幕シューティング', (this.baseGameWidth / 2) * this.scaleFactor, (this.baseGameHeight / 3) * this.scaleFactor); // 位置もスケール

        this.ctx.font = `${20 * this.scaleFactor}px 'Moralerspace Radon'`;
        this.ctx.fillText('Enter または クリック : 開始', (this.baseGameWidth / 2) * this.scaleFactor, (this.baseGameHeight / 2) * this.scaleFactor);

        this.ctx.font = `${25 * this.scaleFactor}px 'Moralerspace Radon'`;
        this.ctx.fillText(`今回のスコア: ${this.score}`, (this.baseGameWidth / 2) * this.scaleFactor, (this.baseGameHeight * 2 / 3) * this.scaleFactor);

        this.ctx.font = `${25 * this.scaleFactor}px 'Moralerspace Radon'`;
        this.ctx.fillText(`ハイスコア: ${this.highScore}`, (this.baseGameWidth / 2) * this.scaleFactor, (this.baseGameHeight * 9 / 12) * this.scaleFactor);

        this.ctx.font = `${15 * this.scaleFactor}px 'Moralerspace Radon'`;
        this.ctx.fillText(`累計スコア: ${this.totalScore}`, (this.baseGameWidth / 2) * this.scaleFactor, (this.baseGameHeight * 10 / 12) * this.scaleFactor);
    }

    /**
     * 角の丸い長方形を描画するヘルパー関数。
     * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト。
     * @param {number} x - 左上のX座標。
     * @param {number} y - 左上のY座標。
     * @param {number} width - 幅。
     * @param {number} height - 高さ。
     * @param {number} radius - 角の半径。
     * @param {number} scale - 拡大縮小率。
     */
    drawRoundedRect(ctx, x, y, width, height, radius, scale) {
        ctx.beginPath();
        ctx.moveTo(x * scale + radius * scale, y * scale);
        ctx.lineTo(x * scale + width * scale - radius * scale, y * scale);
        ctx.quadraticCurveTo(x * scale + width * scale, y * scale, x * scale + width * scale, y * scale + radius * scale);
        ctx.lineTo(x * scale + width * scale, y * scale + height * scale - radius * scale);
        ctx.quadraticCurveTo(x * scale + width * scale, y * scale + height * scale, x * scale + width * scale - radius * scale, y * scale + height * scale);
        ctx.lineTo(x * scale + radius * scale, y * scale + height * scale);
        ctx.quadraticCurveTo(x * scale, y * scale + height * scale, x * scale, y * scale + height * scale - radius * scale);
        ctx.lineTo(x * scale, y * scale + radius * scale);
        ctx.quadraticCurveTo(x * scale, y * scale, x * scale + radius * scale, y * scale);
        ctx.closePath();
    }

    /**
     * プレイヤーと弾の衝突をチェックします。
     * @param {DOMHighResTimeStamp} currentTime - 現在のタイムスタンプ。
     */
    checkCollision(currentTime) {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];

            // 透明の間は当たり判定なし
            if (currentTime - bullet.creationTime < bullet.invincibilityDuration) {
                continue;
            }

            // 衝突判定は基準座標で行う
            const distance = Math.sqrt(
                (this.player.x - bullet.x) ** 2 +
                (this.player.y - bullet.y) ** 2
            );

            // 距離がプレイヤーのhitboxRadiusと弾のhitboxRadiusの合計より小さい場合、衝突
            if (distance < this.player.hitboxRadius + bullet.hitboxRadius) {
                console.warn("ピチューンしました");
                
                this.gameOver();
                return;
            }
        }
    }

    /**
     * ゲームオーバー処理を実行します。
     */
    gameOver() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore(this.highScore);
        }
        this.totalScore += this.score;
        this.saveTotalScore(this.score);

        this.state = GameState.START;
    }

    /**
     * 現在のハイスコアをローカルストレージに保存します。
     * @param {number} score - 保存するスコア。
     */
    saveHighScore(score) {
        try {
            localStorage.setItem('bulletHellHighScore', score);
        } catch (e) {
            console.error('Failed to save high score to localStorage:', e);
        }
    }

    /**
     * ローカルストレージからハイスコアを読み込みます。
     * @returns {number} 読み込まれたハイスコア、または0。
     */
    loadHighScore() {
        try {
            return parseInt(localStorage.getItem('bulletHellHighScore') || '0', 10);
        } catch (e) {
            console.error('Failed to load high score from localStorage:', e);
            return 0;
        }
    }

    /**
     * 累計スコアをローカルストレージに保存します。
     * @param {number} score - 追加するスコア。
     */
    saveTotalScore(score) {
        try {
            localStorage.setItem('bulletHellTotalScore', score + this.loadTotalScore());
        } catch (e) {
            console.error('Failed to save total score to localStorage:', e);
        }
    }

    /**
     * ローカルストレージからハイスコアを読み込みます。
     * @returns {number} 読み込まれたハイスコア、または0。
     */
    loadTotalScore() {
        try {
            return parseInt(localStorage.getItem('bulletHellTotalScore') || '0', 10);
        } catch (e) {
            console.error('Failed to load total score from localStorage:', e);
            return 0;
        }
    }

}


document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    // ゲームを開始
    const game = new Game(canvas, ctx);
    Game.instance = game; // グローバルアクセスできるようにインスタンスを保存

});