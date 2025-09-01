/**
 * パズルのサイズ。今回は**3**に固定
 */
const SIZE = 3;
/**
 * パズルの点灯状態を表す、3x3x3の三次元配列。初期状態は全て点灯した状態である。
 * 絶対的な配置ではなく、現在の方向によって変化しうる。
 * `[z(正面から見た奥行の深さ)][y(行)][x(列)]`
 * @type {Array<Array<Array<boolean>>>}
 */
let tensor = new Array(SIZE).fill(new Array(SIZE).fill(new Array(SIZE).fill(true)));
randomizeTensor();
console.log(tensor);
displayTensorToPuzzle();
displayTensorToSubview();

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
 * グローバル変数`tensor`の点灯状態をランダムにします。
 * 破壊的に変更します。
 */
function randomizeTensor() {
    tensor = tensor.map(plane => plane.map(row => row.map(voxel => Math.random() < 0.5)));
}

document.getElementById('subview-size').addEventListener('change', () => {
    console.log("size changed");

    /* subviewのサイズ変更 */
});

document.getElementById('button-top').addEventListener('click', () => {
    console.log("top");
})

document.getElementById('button-right').addEventListener('click', () => {
    console.log("right");
})

document.getElementById('button-bottom').addEventListener('click', () => {
    console.log("bottom");
})

document.getElementById('button-left').addEventListener('click', () => {
    console.log("left");
})