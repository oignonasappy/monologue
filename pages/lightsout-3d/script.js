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
    tensor = tensor.map(plane => plane.map(row => row.map(voxel => Math.random() < 0.5)));
    // TODO: クリア可能な状態のランダムにする
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
    // TODO:
}

/**
 * 手数を進めます。
 */
function incrementCount() {
    count++;
    document.getElementById('count').textContent = count;
}

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

// TODO: 以下可読性うんちぶりぶり！書き直せ！！
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
    tensor = tensor = tensor[0].map((row, i) => tensor.map(plane => plane[i])) // y軸を基準として転置
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

/**
 * `tensor`の指定されたvoxelおよびその隣接したvoxelを反転します。
 * 破壊的に変更します。
 */
function invertVoxel(voxelZ, voxelY, voxelX) {
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

/*
 * #puzzle(前面)のパネルをクリックしたときの処理。
 * クリックしたvoxelとその隣接したvoxelを反転させる。
 */
document
    .getElementById('puzzle')
    .querySelectorAll('.puzzle-row').forEach((row, i) => {
        row.querySelectorAll('.puzzle-voxel').forEach((voxel, j) => {
            voxel.addEventListener('click', () => {
                incrementCount();
                invertVoxel(0, i, j);
                displayTensorToPuzzle();
                displayTensorToSubview();
                if (isClear()) clear();
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
            incrementCount();
            invertVoxel(1, 1, 1);
            displayTensorToPuzzle();
            displayTensorToSubview();
            if (isClear()) clear();
        });
}


(() => {
    if (isRandomInitialization) {
        randomizeTensor();
    }
    if (!isSwitchableCentroid) {
        document.getElementById('subview-centroid-unavailable').style.display = 'block';
    }

    displayTensorToPuzzle();
    displayTensorToSubview();
})();