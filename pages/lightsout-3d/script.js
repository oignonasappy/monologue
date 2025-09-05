/**
 * centroidが触れられるか。
 * GETパラメータから取得
 * @type {boolean}
 */
const isSwitchableCentroid = new URL(window.location.href).searchParams.get('centroid') !== 'false';

/**
 * 初期状態をランダムにするか。
 * GETパラメータから取得
 * @type {boolean}
 */
const isRandomInitialization = new URL(window.location.href).searchParams.get('random') === 'true';

/**
 * パズルのサイズ。今回は**3**に固定
 * @type {number}
 */
const SIZE = 3;

/**
 * 経過した手数
 * @type {number}
 */
let count = 0;

/**
 * クリア状態
 * @type {boolean}
 */
let cleared = false;

/**
 * パズルの点灯状態を表す、3x3x3の三次元配列。初期状態は全て点灯した状態である。
 * 絶対的な配置ではなく、現在の方向によって変化しうる。
 * `[z(正面から見た奥行の深さ)][y(行)][x(列)]`
 * @type {Array<Array<Array<boolean>>>}
 */
let tensor = Array.from(
    { length: SIZE },
    () => Array.from(
        { length: SIZE },
        () => Array(SIZE).fill(true)
    )
);

/**
 * `tensor`の指定されたvoxelおよびその隣接したvoxelを反転します。
 * 破壊的に変更します。
 */
function switchVoxel(voxelZ, voxelY, voxelX) {
    const DIRECTION = [
        [0, 0, 0],
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1]
    ];
    for (const dir of DIRECTION) {
        if (
            tensor[voxelZ + dir[0]] != undefined &&
            tensor[voxelZ + dir[0]][voxelY + dir[1]] != undefined &&
            tensor[voxelZ + dir[0]][voxelY + dir[1]][voxelX + dir[2]] != undefined
        ) {
            tensor[voxelZ + dir[0]][voxelY + dir[1]][voxelX + dir[2]] =
                !tensor[voxelZ + dir[0]][voxelY + dir[1]][voxelX + dir[2]];
        }
    }
}

/**
 * 現在の`tensor`の状態を#puzzleに表示します。
 * 表示する範囲は`z = 0`
 */
function displayTensorToPuzzle() {
    document
        .getElementById('puzzle')
        .querySelectorAll('.puzzle-row').forEach((row, i) => { // querySelectorAllは一般的に遅いが、取得件数は3件のため許容
            row.querySelectorAll('.puzzle-voxel').forEach((voxel, j) => {
                if (tensor[0][i][j]) {
                    // .onに切り替え
                    voxel.classList.remove('off');
                    voxel.classList.add('on');
                } else {
                    // .offに切り替え
                    voxel.classList.remove('on');
                    voxel.classList.add('off');
                }
            });
        });
}

/**
 * 現在の`tensor`の状態を#subviewに表示します。
 */
function displayTensorToSubview() {
    // top
    document
        .getElementById('subview-top')
        .querySelectorAll('.subview-plane-row').forEach((row, i) => {
            row.querySelectorAll('.subview-voxel').forEach((voxel, j) => {
                if (tensor[SIZE - 1 - i][0][j]) {
                    // .onに切り替え
                    voxel.classList.remove('off');
                    voxel.classList.add('on');
                } else {
                    // .offに切り替え
                    voxel.classList.remove('on');
                    voxel.classList.add('off');
                }
            });
        });

    // left
    document
        .getElementById('subview-left')
        .querySelectorAll('.subview-plane-row').forEach((row, i) => {
            row.querySelectorAll('.subview-voxel').forEach((voxel, j) => {
                if (tensor[SIZE - 1 - j][i][0]) {
                    // .onに切り替え
                    voxel.classList.remove('off');
                    voxel.classList.add('on');
                } else {
                    // .offに切り替え
                    voxel.classList.remove('on');
                    voxel.classList.add('off');
                }
            });
        });

    // centroid(3x3x3に依存)
    // 3x3の中心行をとり、3の中心列をとる
    const centroidVoxel = [...[...document.getElementById('subview-centroid').children][1].children][1];
    if (tensor[1][1][1]) {
        centroidVoxel.classList.remove('off');
        centroidVoxel.classList.add('on');
    } else {
        centroidVoxel.classList.remove('on');
        centroidVoxel.classList.add('off');
    }

    // right
    document
        .getElementById('subview-right')
        .querySelectorAll('.subview-plane-row').forEach((row, i) => {
            row.querySelectorAll('.subview-voxel').forEach((voxel, j) => {
                if (tensor[j][i][SIZE - 1]) {
                    // .onに切り替え
                    voxel.classList.remove('off');
                    voxel.classList.add('on');
                } else {
                    // .offに切り替え
                    voxel.classList.remove('on');
                    voxel.classList.add('off');
                }
            });
        });

    // bottom
    document
        .getElementById('subview-bottom')
        .querySelectorAll('.subview-plane-row').forEach((row, i) => {
            row.querySelectorAll('.subview-voxel').forEach((voxel, j) => {
                if (tensor[i][SIZE - 1][j]) {
                    // .onに切り替え
                    voxel.classList.remove('off');
                    voxel.classList.add('on');
                } else {
                    // .offに切り替え
                    voxel.classList.remove('on');
                    voxel.classList.add('off');
                }
            });
        });

    // back
    document
        .getElementById('subview-back')
        .querySelectorAll('.subview-plane-row').forEach((row, i) => {
            row.querySelectorAll('.subview-voxel').forEach((voxel, j) => {
                if (tensor[SIZE - 1][SIZE - 1 - i][j]) {
                    // .onに切り替え
                    voxel.classList.remove('off');
                    voxel.classList.add('on');
                } else {
                    // .offに切り替え
                    voxel.classList.remove('on');
                    voxel.classList.add('off');
                }
            });
        });
}

/**
 * `tensor`の点灯状態をランダムにします。
 * 破壊的に変更します。
 */
function randomizeTensor() {
    //tensor = tensor.map(plane => plane.map(row => row.map(voxel => Math.random() < 0.5)));

    // `SIZE^2*i + SIZE*j + j`の連番を、ランダムに挿入
    const switchList = [];
    for (let i = 0; i < SIZE; i++) { // 三重ループにする必要は必ずしもない
        for (let j = 0; j < SIZE; j++) {
            for (let k = 0; k < SIZE; k++) {
                // 重心が触れられない場合スキップ
                if (
                    !isSwitchableCentroid &&
                    i === 1 && j === 1 && k === 1
                ) {
                    break;
                }

                // ランダムな位置に挿入
                switchList.splice(
                    Math.floor(Math.random() * (switchList.length + 1)),
                    0,
                    (i * SIZE * SIZE) + (j * SIZE) + (k)
                );
            }
        }
    }

    // Fisher–Yates shuffle
    /*
    for (let i = 0; i < switchList.length; i++) {
        const r = Math.floor(Math.random() * switchList.length);
        const temp = switchList[i];
        switchList[i] = switchList[r];
        switchList[r] = temp;
    }
    */

    // 操作する手数 全体の50%~100%を操作
    const switchCount = Math.floor((switchList.length * 0.5) + (Math.random() * switchList.length * 0.5));
    for (let i = 0; i < switchCount; i++) {
        switchVoxel(
            Math.floor(switchList[i] / (SIZE * SIZE)),
            Math.floor((switchList[i] % (SIZE * SIZE)) / SIZE),
            switchList[i] % SIZE
        )
    }
    // 重心が触れられない場合、全てがonの初期状態からはクリアできないため、重心を1度切り替える
    if (!isSwitchableCentroid) {
        switchVoxel(1, 1, 1);
    }
}

/**
 * `tensor`のすべてのvoxelがfalseならtrueを返します。
 * @returns {boolean}
 */
function isClear() {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            for (let k = 0; k < SIZE; k++) {
                if (tensor[i][j][k]) return false;
            }
        }
    }
    return true;
}

/**
 * クリア時の処理を行います。
 */
function clear() {
    // クリア画面を表示
    document.getElementById('clear-dialog').showModal();
}
document.getElementById('test-clear-button').addEventListener('click', clear);

/**
 * 手数を進めます。
 */
function incrementCount() {
    count++;
    document.getElementById('count').textContent = count;

    // 重心禁止モード
    if (!isRandomInitialization && !isSwitchableCentroid) {
        if (count === 100) {
            document.getElementById('message').innerText = `
                苦戦してる？？
                それもそのはず、このモードは理論上クリア不可能だからなのである！
            `;
        }
        if (count === 110) {
            document.getElementById('message').innerText = `
                なぜクリア不可能なのか？
                それは...
                ちょっと説明が長くなる
            `;
        }
        if (count === 120) {
            document.getElementById('message').innerText = `
                だいぶ端折るけど、
                3x3x3のライツアウトをGF(2)上の行列とみなすと、その行列は正則であり
                押すべきブロックの組み合わせはただ1通りに定まる。
                これはどんな初期状態からでも必ず解くことができるということを意味する。
                ただ、それは制約がない場合に限る。
                今回は重心にあたる部分が触れられないという制約がある。
            `;
        }
        if (count === 130) {
            document.getElementById('message').innerText = `
                今回の初期状態は全てがON状態である。そこから全てをOFFにする"唯一の"回答を考える...
                まずこのパズルは完全な対称性を持っているため解法も対称的になる。そこで、ブロックを位置の特性によって4種に分類する。
                {center: 重心(1個), face: 面の中心(6個), edge: 辺の中心(12個), corner: 角(8個)}
                解法では、同じ種類のブロックは同じように扱われるはずのため、同種のブロックを全て押すか/押さないかの2択になる。
                ここで、各種類のブロックを押すか/押さないかを
                x[center], x[face], x[edge], x[corner](押す=1, 押さない=0)として方程式を立てる。
                ブロックがOFF(0)になるためには、初期状態の1と、自身と自身に隣接するブロックからの切り替え（押された回数）の合計が1になればよい。(GF(2)において、1+1=0である。つまりXOR)
                
                centerがOFFになるには ->
                初期状態: 1
                切り替え回数: x[center](自分自身) + 6 * x[face](隣接する6つの面の中心)
                方程式(mod 2):
                1 + x[center] + 6x[face] ≡ 0
                ⟹ 1 + x[center] ≡ 0
                ⟹ x[center] = 1

                faceがOFFになるには ->
                初期状態: 1
                切り替え回数: x[face](自分) + 4 * x[edge](隣) + 1 * x[center](隣)
                方程式(mod 2):
                    1 + x[face] + 4x[edge] + x[center] ≡ 0
                    ⟹ 1 + x[face] + x[center] ≡ 0
                    ⟹ 1 + x[face] + 1 ≡ 0 (x[center] = 1は示されているので、代入)
                    ⟹ x[face] = 0

                edgeがOFFになるには ->
                初期状態: 1
                切り替え回数: x[edge] + 2 * x[corner] + 2 * x[face]
                方程式(mod 2):
                1 + x[edge] + 2x[corner] + 2x[face] ≡ 0
                ⟹ 1 + x[edge] ≡ 0
                ⟹ x[edge] = 1

                cornerがOFFになるには ->
                初期状態: 1
                切り替え回数: x[corner] + 3 * x[edge]
                方程式(mod 2):
                1 + x[corner] + 3x[edge] ≡ 0
                ⟹ 1 + x[corner] + x[edge] ≡ 0
                ⟹ 1 + x[corner] + 1 ≡ 0 (x[edge] = 1を代入)
                ⟹ x[corner] = 0

                この連立方程式を解いた結果、唯一の解法は
                center(重心) : 押す (x[center]=1),
                face(面の中心) : 押さない (x[face]=0),
                edge(辺の中心) : 押す (x[edge]=1),
                corner(角) : 押さない (x[corner]=0)
                ちなみにこれはノーマルモードの回答のことも言っているね。
            `;
        }
        if (count === 140) {
            document.getElementById('message').innerText = `
                さて、先ほどの結果を踏まえて...
                今回の制約は重心のブロックが触れられないというものだった。
                しかし、今回の初期状態の唯一の解法では、edge(辺の中心)とcenter(重心)を押す操作が必要であった。
                すなわち、このモードはクリアが論理的に不可能なのである。
            `;
        }
        if (count === 150) {
            document.getElementById('message').innerText = `
                (偉そうに書いたけど、全部全部Gemini2.5Pro先生が考えてくれた！私にはこれ考えるのはムリよ！！理系の3年ぐらいに学ぶ代数学なんてしるか！！！)
                あなたが先ほどクリアしたであろう「重心禁止ランダムモード」は、見かけ上全てがランダムに見えるけど
                全てのブロックがONの状態から、ランダムな操作 + 必ず1回重心ブロックを切り替えた状態へ調整してあるから、クリア可能になっている
            `;
        }
        if (count === 160) {
            document.getElementById('message').innerText = `
                ーー以上、これにて終了。言葉はもう不要です
            `;
        }
    }
}

(() => {
    /*
     * subviewのplaneあたりのサイズを変更します。
     * :root内の`--subview-plane-size`を書き換えます。
     */
    document.getElementById('subview-size').addEventListener('change', () => {
        document.documentElement
            .style.setProperty(
                '--subview-plane-size',
                `${document.getElementById('subview-size').value}px`
            );
    });

    /*
     * #puzzle(前面)のパネルをクリックしたときの処理。
     * クリックしたvoxelとその隣接したvoxelを反転させる。
     */
    document
        .getElementById('puzzle')
        .querySelectorAll('.puzzle-row').forEach((row, i) => {
            row.querySelectorAll('.puzzle-voxel').forEach((voxel, j) => {
                voxel.addEventListener('click', () => {
                    if (cleared) return; // クリア時に無効化
                    incrementCount();
                    switchVoxel(0, i, j);
                    displayTensorToPuzzle();
                    displayTensorToSubview();
                    if (isClear()) clear(); // クリアチェック
                });
            });
        });

    /*
     * subviewのcentroidをクリックした際にその位置のvoxelを切り替えます。
     * isSwitchableCentroidがtrueの時のみ有効
     */
    if (isSwitchableCentroid) {
        document
            .getElementById('subview-centroid')
            .addEventListener('click', () => {
                if (cleared) return; // クリア時に無効化
                incrementCount();
                switchVoxel(1, 1, 1);
                displayTensorToPuzzle();
                displayTensorToSubview();
                if (isClear()) clear();  // クリアチェック
            });
    }

    // TODO: 以下可読性うんちぶりぶり！書き直せ！！
    /* #puzzleの矢印による面の移動 */
    /*
     * `tensor`の上面を正面にします。
     * 破壊的に変更します。
     */
    document.getElementById('button-top').addEventListener('click', () => {
        tensor = tensor[0].map((row, i) => tensor.map(plane => plane[i])) // y軸を基準として転置
            .map(plane => plane.reverse()); // y軸で反転

        displayTensorToPuzzle();
        displayTensorToSubview();
    });

    /*
     * `tensor`の右面を正面にします。
     * 破壊的に変更します。
     */
    document.getElementById('button-right').addEventListener('click', () => {
        tensor = tensor[0][0].map((col, i) => tensor.map((row, j) => tensor.map(plane => plane[j][i]))) // x軸を基準として転置
            .reverse(); // x軸で反転

        displayTensorToPuzzle();
        displayTensorToSubview();
    });

    /*
     * `tensor`の下面を正面にします。
     * 破壊的に変更します。
     */
    document.getElementById('button-bottom').addEventListener('click', () => {
        tensor = tensor[0].map((row, i) => tensor.map(plane => plane[i])) // y軸を基準として転置
            .reverse(); // z軸で反転

        displayTensorToPuzzle();
        displayTensorToSubview();
    });

    /*
     * `tensor`の左面を正面にします。
     * 破壊的に変更します。
     */
    document.getElementById('button-left').addEventListener('click', () => {
        tensor = tensor[0][0].map((col, i) => tensor.map((row, j) => tensor.map(plane => plane[j][i]))) // x軸を基準として転置
            .map(plane => plane.map(row => row.reverse())); // z, y軸で反転

        displayTensorToPuzzle();
        displayTensorToSubview();
    });

    /* subviewからの面移動 */
    /*
     * subviewの上面を正面にします。
     * 'tensor'を破壊的に変更します。
     */
    document.getElementById('subview-top').addEventListener('click', () => {
        tensor = tensor[0].map((row, i) => tensor.map(plane => plane[i])) // y軸を基準として転置
            .map(plane => plane.reverse()); // y軸で反転

        displayTensorToPuzzle();
        displayTensorToSubview();
    });

    /*
     * subviewの左面を正面にします。
     * 'tensor'を破壊的に変更します。
     */
    document.getElementById('subview-left').addEventListener('click', () => {
        tensor = tensor[0][0].map((col, i) => tensor.map((row, j) => tensor.map(plane => plane[j][i]))) // x軸を基準として転置
            .map(plane => plane.map(row => row.reverse())); // z, y軸で反転

        displayTensorToPuzzle();
        displayTensorToSubview();
    });

    /*
     * subviewの右面を正面にします。
     * 'tensor'を破壊的に変更します。
     */
    document.getElementById('subview-right').addEventListener('click', () => {
        tensor = tensor[0][0].map((col, i) => tensor.map((row, j) => tensor.map(plane => plane[j][i]))) // x軸を基準として転置
            .reverse(); // x軸で反転

        displayTensorToPuzzle();
        displayTensorToSubview();
    });

    /*
     * subviewの下面を正面にします。
     * 'tensor'を破壊的に変更します。
     */
    document.getElementById('subview-bottom').addEventListener('click', () => {
        tensor = tensor[0].map((row, i) => tensor.map(plane => plane[i])) // y軸を基準として転置
            .reverse(); // z軸で反転

        displayTensorToPuzzle();
        displayTensorToSubview();
    });

    /*
     * subviewの裏面を正面にします。
     * 'tensor'を破壊的に変更します。
     */
    document.getElementById('subview-back').addEventListener('click', () => {
        tensor = tensor.map(plane => plane.reverse()).reverse(); // y軸で反転した後、z軸で反転

        displayTensorToPuzzle();
        displayTensorToSubview();
    });
})();

(() => {
    if (isRandomInitialization) {
        randomizeTensor();
    }
    if (!isSwitchableCentroid) {
        document.getElementById('subview-centroid-unavailable').style.display = 'block';
    }

    displayTensorToPuzzle();
    displayTensorToSubview();

    if (isRandomInitialization) {
        document.getElementById('dialog-button-centroid-random').style.display = 'block';
        document.getElementById('dialog-clear-mode').textContent = 'ランダムモード クリア';
        document.getElementById('dialog-special-message').textContent = '重心禁止ランダムモードが追加されました';
    } else {
        document.getElementById('dialog-button-centroid-random').style.display = 'none';
    }
    
    if (isRandomInitialization && !isSwitchableCentroid) {
        document.getElementById('dialog-button-centroid').style.display = 'block';
        document.getElementById('dialog-clear-mode').textContent = '重心禁止ランダムモード クリア';
        document.getElementById('dialog-special-message').textContent = '重心禁止モードが追加されました';
    } else {
        document.getElementById('dialog-button-centroid').style.display = 'none';
    }
    
    if (!isRandomInitialization && !isSwitchableCentroid) {
        document.getElementById('dialog-clear-mode').textContent = '重心禁止モード クリア？';
        document.getElementById('dialog-special-message').innerText = `
            このメッセージが表示されるのはおかしい。
            正常にパズルをクリアしてこのメッセージを見ることができたなら、
            このモードがクリア不可能だという仮説は間違いだったということになる。
            それ以外の方法でこのメッセージを見たならば、
            私のミスか、君の好奇心の結果だ。
        `;
    }
})();