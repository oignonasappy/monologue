/**
 * 弾幕パターンを生成するクラス。
 */
class BulletPatternGenerator {

    /**
     * BulletPatternGeneratorクラスのコンストラクタ。
     * @param {Game} game - Gameインスタンスへの参照。
     */
    constructor(game) {
        /**
         * @type {Game} Gameインスタンスへの参照
         */
        this.game = game;
        /**
         * @type {number} 弾の基本速度（基準値）
         */
        this.baseBulletSpeed = 3;
        /**
         * @type {number} 弾の基本半径（基準値）
         */
        this.baseBulletRadius = 5;

        /**
         * @deprecated
         */
        this.currentBulletSpeed = this.baseBulletSpeed;
        /**
         * @deprecated
         */
        this.currentBulletRadius = this.baseBulletRadius; // 弾の半径（基準値）
        /**
         * @deprecated
         */
        this.currentNumBulletsMultiplier = 1; // 弾数の乗数

        /**
         * @type {{any: number}} 各パターン生成後の基本クールダウン時間ms
         */
        this.patternCooldowns = {
            spiral: 3000,
            rain: 1500,
            wave: 2500,
            radial: 2000,
            straight: 1000,
            curve: 3000,
            ring: 2000,
            waveParticle: 5000,
        };

        /**
         * @type {{name: string, func: Function, cooldown: number}} 全てのパターンを定義
         */
        this.patterns = [
            //{ name: 'spiral', func: this.generateSpiralPattern.bind(this), cooldown: this.patternCooldowns.spiral },
            //{ name: 'rain', func: this.generateRainPattern.bind(this), cooldown: this.patternCooldowns.rain },
            //{ name: 'wave', func: this.generateWavePattern.bind(this), cooldown: this.patternCooldowns.wave },
            //{ name: 'radial', func: this.generateRadialPattern.bind(this), cooldown: this.patternCooldowns.radial },
            //{ name: 'straightLine', func: this.generateStraightLinePattern.bind(this), cooldown: this.patternCooldowns.straight },
            //{ name: 'curvingSpiral', func: this.generateCurvingSpiralPattern.bind(this), cooldown: this.patternCooldowns.curve },
            { name: 'ring', func: this.generateRingPattern.bind(this), cooldown: this.patternCooldowns.ring },
            { name: 'waveParticle', func: this.generateWaveParticlePattern.bind(this), cooldown: this.patternCooldowns.waveParticle },
        ];

        /**
         * @type {number} 現在の弾幕生成間隔 (初期値)
         */
        this.currentPatternCooldown = 1000;

        /**
         * @type {number} 現在の難易度レベル
         * updateDifficulty()メソッドにて変更します。
         */
        this.difficultyLevel = 0;

        /**
         * @type {{width: number, height: number, offsetY: number}} 中心から生成されるパターンのランダムスポーンエリア（基準値）
         */
        this.centerSpawnArea = {
            width: 100, // 中心付近のX方向の範囲
            height: 150, // 中心よりやや上のY方向の範囲
            offsetY: -50 // 中心Yから上にオフセット (画面中心より少し上)
        };
    }

    /**
     * 難易度に応じて弾のプロパティを更新します。
     * @param {number} newDifficultyLevel - 新しい難易度レベル。
     */
    updateDifficulty(newDifficultyLevel) {
        this.difficultyLevel = newDifficultyLevel;
        // 難易度が上がるにつれて速度と弾数を増加、クールダウンを短縮
        this.currentBulletSpeed = this.baseBulletSpeed + (this.difficultyLevel * 0.3);

        // 弾数の乗数を増加 (難易度に応じて密度を上げる)
        this.currentNumBulletsMultiplier = 1 + (this.difficultyLevel * 0.15);

        // クールダウン時間を難易度に応じて短縮 (最低500ms)
        for (const key in this.patternCooldowns) {
            this.patternCooldowns[key] = Math.max(500, this.patternCooldowns[key] * (1 - this.difficultyLevel * 0.04));
        }
    }

    /**
     * ランダムな弾幕パターンを生成し、ゲームのbullets配列に追加します。
     * @param {HTMLCanvasElement} canvas - キャンバス要素。
     */
    generateRandomPattern(canvas) {
        const randomIndex = Math.floor(Math.random() * this.patterns.length);
        const selectedPattern = this.patterns[randomIndex];

        console.log(`--- Pattern: ${selectedPattern.name} generated ---`);
        selectedPattern.func(canvas);
        this.currentPatternCooldown = selectedPattern.cooldown;
    }

    /**
     * 指定されたms遅延して、指定された回数だけ、コールバック関数を実行します。
     * @param {Function} callBack コールバック関数
     * @param {number} delayMs 遅延するms
     * @param {number} count 繰り返す回数
     */
    delayRepeatCount(callBack, delayMs, count) {
        let totalMs = 0;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                callBack();
            }, totalMs);
            totalMs += delayMs;
        }
    }

    /**
     * 指定されたms遅延して、指定された配列の要素数だけ、コールバック関数を実行します。
     * コールバック関数には順次要素が渡されて実行されます。
     * @param {Function} callBack コールバック関数
     * @param {number} delayMs 遅延するms
     * @param {Array<any>} values コールバック関数に渡す値の配列。
     */
    delayRepeatValues(callBack, delayMs, values) {
        let totalMs = 0;
        values.forEach(value => {
            setTimeout(() => {
                callBack(value);
            }, totalMs);
            totalMs += delayMs;
        });
    }

    /**
     * スパイラル弾幕パターンを生成します。
     * 弾速、角度、時間差生成を調整し、大袈裟な広がり方をします。
     * @param {HTMLCanvasElement} canvas - キャンバス要素。
     */
    generateSpiralPattern(canvas) {
        // 中心からではなく、ランダムなスポーンエリアから開始（基準座標で計算）
        const spawnX = this.game.baseGameWidth / 2 + (Math.random() - 0.5) * this.centerSpawnArea.width;
        const spawnY = this.game.baseGameHeight / 2 + this.centerSpawnArea.offsetY + (Math.random() - 0.5) * this.centerSpawnArea.height;

        const baseBulletsPerRevolution = 20; // 1回転あたりの基本弾数
        const totalRevolutionsFixed = 2.5; // 固定の総回転数
        const extraRotationPerRevolution = (1 / 3); // 1周あたりの余分な回転量

        // 各弾の角度ステップを計算
        const anglePerBulletBase = (Math.PI * 2) / baseBulletsPerRevolution;
        // 各弾生成時の角度増加量 = 1周あたりの角度 + 1周あたりの弾1つ分の角度の1/3
        const angleStepActual = anglePerBulletBase + (anglePerBulletBase * extraRotationPerRevolution);

        const numBulletsTotal = Math.floor(baseBulletsPerRevolution * totalRevolutionsFixed * this.currentNumBulletsMultiplier); // 総弾数（乗数適用）

        const spiralFactor = 0.3 + (this.difficultyLevel * 0.08); // スパイラルの広がりを大袈裟に、難易度でさらに増加
        const bulletSpawnDelay = 20; // 各弾の生成間隔 (ms)

        // 弾速を生成順によって調整（最初の方は遅く、最後の方は現在の速度）
        const initialSpeedMultiplier = 0.5; // 最初の弾速は現在の半分
        const speedRange = this.currentBulletSpeed * (1 - initialSpeedMultiplier);

        for (let i = 0; i < numBulletsTotal; i++) {
            // 累積角度
            const angle = i * angleStepActual;
            const radiusOffset = i * spiralFactor;

            // 弾速を線形補間
            const currentBulletSpeedAdjusted = (initialSpeedMultiplier * this.currentBulletSpeed) +
                ((i / numBulletsTotal) * speedRange);

            const vx = Math.cos(angle) * (currentBulletSpeedAdjusted + radiusOffset * 0.5);
            const vy = Math.sin(angle) * (currentBulletSpeedAdjusted + radiusOffset * 0.5);

            const bullet = new StraightBullet(spawnX, spawnY, this.currentBulletRadius, vx, vy);
            bullet.creationTime = performance.now() + (i * bulletSpawnDelay);
            this.game.bullets.push(bullet);
        }
    }

    /**
     * 上から降ってくる雨のような弾幕パターンを生成します。
     * @param {HTMLCanvasElement} canvas - キャンバス要素。
     */
    generateRainPattern(canvas) {
        const numBullets = Math.floor((15 + (this.difficultyLevel * 1)) * this.currentNumBulletsMultiplier);
        const startY = -this.currentBulletRadius;
        const speedRangeMin = this.currentBulletSpeed * 0.8;
        const speedRangeMax = this.currentBulletSpeed * 1.2;

        for (let i = 0; i < numBullets; i++) {
            // 基準座標でX座標をランダムに設定
            const startX = Math.random() * this.game.baseGameWidth;
            const vy = Math.random() * (speedRangeMax - speedRangeMin) + speedRangeMin;
            this.game.bullets.push(new StraightBullet(startX, startY, this.currentBulletRadius, 0, vy));
        }
    }

    /**
     * 波打つような弾幕パターンを生成します。
     * @param {HTMLCanvasElement} canvas - キャンバス要素。
     */
    generateWavePattern(canvas) {
        const numBullets = Math.floor(((20 + (this.difficultyLevel * 2)) * this.currentNumBulletsMultiplier) * 0.3);
        const startY = 0;
        const waveAmplitude = 40 + (this.difficultyLevel * 8);
        const waveFrequency = 0.05 + (this.difficultyLevel * 0.002);
        const bulletSpeed = this.currentBulletSpeed;
        // 基準座標での弾の間隔
        const initialXOffset = this.game.baseGameWidth / (numBullets + 1);

        for (let i = 0; i < numBullets; i++) {
            const initialX = initialXOffset * (i + 1); // 基準座標で初期位置を設定
            const initialPhase = (i / numBullets) * Math.PI * 2;
            this.game.bullets.push(new WaveBullet(initialX, startY, this.currentBulletRadius, bulletSpeed, waveAmplitude, waveFrequency, initialPhase));
        }
    }

    /**
     * 画面中心から放射状に広がる弾幕パターンを生成します。
     * 弾が同時に中心から生成されることで、完璧な円形を保証します。
     * @param {HTMLCanvasElement} canvas - キャンバス要素。
     */
    generateRadialPattern(canvas) {
        // 中心からではなく、ランダムなスポーンエリアから開始（基準座標で計算）
        const spawnX = this.game.baseGameWidth / 2 + (Math.random() - 0.5) * this.centerSpawnArea.width;
        const spawnY = this.game.baseGameHeight / 2 + this.centerSpawnArea.offsetY + (Math.random() - 0.5) * this.centerSpawnArea.height;

        const numBullets = Math.floor((12 + (this.difficultyLevel * 1)) * this.currentNumBulletsMultiplier);
        const angleStep = (Math.PI * 2) / numBullets;
        const bulletSpeed = this.currentBulletSpeed;
        const newBullets = [];

        for (let i = 0; i < numBullets; i++) {
            const angle = i * angleStep;
            const vx = Math.cos(angle) * bulletSpeed;
            const vy = Math.sin(angle) * bulletSpeed;
            newBullets.push(new StraightBullet(spawnX, spawnY, this.currentBulletRadius, vx, vy));
        }
        this.game.bullets.push(...newBullets);
    }

    /**
     * 直線に連なる弾幕パターンを生成します。
     * @param {HTMLCanvasElement} canvas - キャンバス要素。
     */
    generateStraightLinePattern(canvas) {
        const numBullets = Math.floor((10 + (this.difficultyLevel * 1)) * this.currentNumBulletsMultiplier);
        const startY = -this.currentBulletRadius;
        const bulletSpeed = this.currentBulletSpeed * 1.2;

        // 弾の配置可能な全体の幅（基準値）
        const patternBaseWidth = (numBullets - 1) * (this.currentBulletRadius * 2 + 10); // 弾の直径 + 最小間隔
        // パターンが基準ゲーム幅内に収まる最大開始X座標
        const maxBaseStartX = this.game.baseGameWidth - patternBaseWidth - this.currentBulletRadius;
        const minBaseStartX = this.currentBulletRadius;

        // ランダムなオフセット範囲を定義
        const randomOffsetRange = 50; // 例: +/- 50pxの範囲でずらす
        const initialRandomOffset = (Math.random() - 0.5) * randomOffsetRange;

        // ランダムな開始X座標を計算（基準座標）
        let baseStartX = (this.game.baseGameWidth / 2) - (patternBaseWidth / 2);
        const actualStartX = Math.max(minBaseStartX, Math.min(maxBaseStartX, baseStartX + initialRandomOffset));

        const spacing = (patternBaseWidth) / (numBullets > 1 ? (numBullets - 1) : 1); // 弾間の均等な間隔（基準値）

        for (let i = 0; i < numBullets; i++) {
            const x = actualStartX + (i * spacing); // 基準座標
            const y = startY; // 基準座標
            this.game.bullets.push(new StraightBullet(x, y, this.currentBulletRadius, 0, bulletSpeed));
        }
    }

    /**
     * カーブしながら広がるスパイラル弾幕パターンを生成します。
     * @param {HTMLCanvasElement} canvas - キャンバス要素。
     */
    generateCurvingSpiralPattern(canvas) {
        // 中心からではなく、ランダムなスポーンエリアから開始（基準座標で計算）
        const spawnX = this.game.baseGameWidth / 2 + (Math.random() - 0.5) * this.centerSpawnArea.width;
        const spawnY = this.game.baseGameHeight / 2 + this.centerSpawnArea.offsetY + (Math.random() - 0.5) * this.centerSpawnArea.height;

        const totalRevolutionsFixed = 2.5; // 固定の総回転数
        const extraRotationPerRevolution = (1 / 3); // 1周あたりの余分な回転量
        const baseBulletsPerRevolution = 15; // 1回転あたりの基本弾数 (curvingSpiralは少し少なめ)
        const numBulletsTotal = Math.floor(baseBulletsPerRevolution * (totalRevolutionsFixed + extraRotationPerRevolution) * this.currentNumBulletsMultiplier); // 総弾数
        const angleStep = (Math.PI * 2) / baseBulletsPerRevolution + ((Math.PI * 2) / baseBulletsPerRevolution / 3); // 1周あたりの角度ステップ + その1/3

        // 弾速を生成順によって調整（最初の方は遅く、最後の方は現在の速度）
        const initialSpeedMultiplier = 0.5;
        const speedRange = this.currentBulletSpeed * (1 - initialSpeedMultiplier);

        // CurvingBulletの揺れる振幅と周波数
        const curveFactor = (0.02 + (this.difficultyLevel * 0.005)) * 4;
        const frequencyFactor = (0.1) * 0.5;

        const bulletSpawnDelay = 20; // 各弾の生成間隔 (ms)

        for (let i = 0; i < numBulletsTotal; i++) {
            const angle = i * angleStep;
            // 弾速を線形補間
            const currentBulletSpeedAdjusted = (initialSpeedMultiplier * this.currentBulletSpeed) +
                ((i / numBulletsTotal) * speedRange);

            const initialVx = Math.cos(angle) * currentBulletSpeedAdjusted;
            const initialVy = Math.sin(angle) * currentBulletSpeedAdjusted;

            const bullet = new CurvingBullet(spawnX, spawnY, this.currentBulletRadius, initialVx, initialVy, curveFactor, frequencyFactor);
            bullet.creationTime = performance.now() + (i * bulletSpawnDelay);
            this.game.bullets.push(bullet);
        }
    }

    /**
     * 複数の速さの異なるリングを生成
     */
    generateRingPattern() {
        const numRing = 6 + Math.floor(this.difficultyLevel * 0.6);

        this.delayRepeatCount(() => {

            // 生成位置(ランダム)
            const spawnX = this.game.baseGameWidth / 2 + (Math.random() - 0.5) * this.game.baseGameWidth * 0.75;
            const spawnY = this.game.baseGameHeight / 5 + (Math.random() - 0.5) * this.game.baseGameHeight * 0.2;

            // リング1あたりの弾数
            const numBullets = Math.floor((15 + this.difficultyLevel * 1.5) * (0.5 + Math.random()));
            // 1弾あたりの角度
            const angleStep = (Math.PI * 2) / numBullets;
            // 角度の初期値
            const angleOffset = Math.random() * Math.PI * 2;
            // リングの弾の速度
            const bulletSpeed = this.baseBulletSpeed * (1 + (Math.random() - 0.5) * 0.6);
            // 1リングの弾配列
            const newBullets = [];

            for (let i = 0; i < numBullets; i++) {
                const angle = i * angleStep + angleOffset;
                const vx = Math.cos(angle) * bulletSpeed;
                const vy = Math.sin(angle) * bulletSpeed;
                newBullets.push(new StraightBullet(spawnX, spawnY, this.currentBulletRadius, vx, vy));
            }

            this.game.bullets.push(...newBullets);

        }, 500 / numRing, numRing);
    }

    /**
     * 幾何的な波を生成
     */
    generateWaveParticlePattern() {
        const numAxis = 3 + Math.floor(this.difficultyLevel * 0.5);

        // 生成位置(固定)
        const spawnX = this.game.baseGameWidth / 2;
        const spawnY = this.game.baseGameHeight / 6;

        const bulletSpeed = this.baseBulletSpeed * 1.2 + this.difficultyLevel * this.baseBulletSpeed * 0.1;

        let angle = (Math.PI * 2) * Math.random();
        let angleStep = (Math.PI * 2) * Math.random();
        const angleIncrement = 0.0025 + Math.random() * 0.001;

        this.delayRepeatCount(() => {

            const newBullets = [];

            for (let i = 0; i < numAxis; i++) {
                const axisAngle = angle + i * Math.PI / numAxis * 2;
                const vx = Math.cos(axisAngle) * bulletSpeed;
                const vy = Math.sin(axisAngle) * bulletSpeed;
                newBullets.push(new StraightBullet(spawnX, spawnY, this.currentBulletRadius, vx, vy));
            }

            this.game.bullets.push(...newBullets);

            angle += angleStep;
            angleStep += angleIncrement;

        }, 50, 60);
    }

}