// piano-play用の再生機能
const pianoAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
// piano-play用の再生中リスト
const pianoActiveNotes = new Map();

(() => {
    // 全てのpianoに対し処理
    const pianos = document.querySelectorAll(`[class*='piano']`);
    pianos.forEach(piano => {
        // 属性
        const first = parseInt(piano.dataset.first) ?? 60;
        const last = parseInt(piano.dataset.last) ?? 72;
        const keyWidth = piano.dataset.keyWidth ?? '20px';
        const keyHeight = piano.dataset.keyHeight ?? '60px';
        const highlight = piano.dataset.highlight === undefined ? undefined
            : piano.dataset.highlight.trim().split(/\s+/).map(n => parseInt(n));
        const highlightColor = piano.dataset.highlightColor ?? '#FFE0E0';
        const notename = piano.dataset.notename === "true" ? true : false;
        const keySignature = piano.dataset.keySignature ?? 'C';
        const customNotename = piano.dataset.customNotename;
        // .piano-playでのみ使用
        const volume = parseFloat(piano.dataset.volume) || 0.25;
        const duration = parseFloat(piano.dataset.duration) || 2;
        const oscType = parseFloat(piano.dataset.oscType) || 'triangle';
        const tuning = parseFloat(piano.dataset.tuning) || 440;
        // custom-notenameのパース
        const customNameMap = new Map();
        if (customNotename != undefined) {
            // カンマ区切り ->
            customNotename.split(',').forEach(pair => {
                // -> スペース区切り
                const [midiNum, name] = pair.trim().split(/\s+/);
                customNameMap.set(parseInt(midiNum), name);
            });
        }

        // timeoutを伴うアニメーションのフラグ
        piano.animationValidFlgs = [];

        // ピアノのCSS
        piano.style.position = 'relative';
        piano.style.height = keyHeight;

        /* 鍵盤一つづつを作成する処理 */
        let whiteCount = 0;
        piano.keys = {};
        for (let midi = first; midi <= last; midi++) {

            // 鍵盤はそれぞれ<div>で構成
            const key = document.createElement('div');
            piano.keys[midi] = key;
            key.dataset.midi = midi;
            piano.animationValidFlgs[midi] = true;

            // 鍵盤共通のCSS
            key.style.position = 'absolute';
            key.style.transition = 'filter 50ms ease-out, background-color 50ms ease-out';

            if (!isBlackKey(midi)) {
                // 白鍵の処理
                key.className = 'white-key';
                key.style.width = keyWidth;
                key.style.height = keyHeight;
                key.style.left = `calc(${keyWidth} * ${whiteCount})`;
                key.style.backgroundColor = '#FFFFFF';
                key.style.border = '1px solid #202020';
                key.style.zIndex = 0;

                // ハイライトされる鍵盤
                if (highlight !== undefined && highlight.includes(midi)) {
                    key.style.backgroundColor = highlightColor;
                }

                whiteCount++;
            } else {
                // 黒鍵の処理
                // 最初の鍵盤が黒鍵だった場合、最初の黒鍵が左側にずれることを防ぐ
                if (whiteCount === 0) whiteCount = 1;
                key.className = 'black-key';
                key.style.width = `calc(${keyWidth} * 0.7)`;
                key.style.height = `calc(${keyHeight} * 0.6)`;
                key.style.left = `calc(${keyWidth} * ${whiteCount} - ${keyWidth} * 0.35)`;
                key.style.backgroundColor = '#000000';
                key.style.border = '2px solid #606060';
                key.style.zIndex = 1;

                // ハイライトされる鍵盤
                if (highlight !== undefined && highlight.includes(midi)) {
                    key.style.backgroundColor = highlightColor;
                    key.style.filter = 'brightness(55%) contrast(300%)';
                }
            }

            // 音名を鍵盤に追加
            const label = document.createElement('div');
            label.className = 'key-label';
            label.style.position = 'absolute';
            label.style.bottom = `calc(${keyHeight} / 30 + 2px)`;
            label.style.width = '100%';
            label.style.fontFamily = 'monospace';
            label.style.textAlign = 'center';
            label.style.fontSize = `calc(${keyWidth} / 2 - 1px)`;
            label.style.pointerEvents = 'none';
            label.style.userSelect = 'none';
            if (notename) {
                if (!isBlackKey(midi)) {
                    // 白鍵の処理
                    label.innerText = midiToNoteName(midi, keySignature);
                    label.style.color = '#404040';
                } else {
                    // 黒鍵の処理
                    label.innerText = midiToNoteName(midi, keySignature, false);
                    label.style.color = '#C0C0C0';
                }
            }
            // カスタムな音名の設定
            if (customNameMap.has(midi)) {
                label.innerText = customNameMap.get(midi);
            }
            key.appendChild(label);

            /* piano-hover */
            if (piano.className === 'piano-hover') {
                // 侵入時
                key.addEventListener('mouseover', () => {
                    key.style.filter = 'invert(20%)';
                });
                // 退出時
                key.addEventListener('mouseleave', () => {
                    key.style.filter = '';
                    // ハイライトのfilterを元に戻す
                    if (isBlackKey(midi) && highlight !== undefined && highlight.includes(midi)) {
                        key.style.filter = 'brightness(55%) contrast(300%)';
                    }
                });
            }

            /* piano-play */
            // マウス入力の状態管理
            let mouseDown = false;
            document.addEventListener('mousedown', (e) => {
                if (e.button === 0) mouseDown = true;
            });
            document.addEventListener('mouseup', (e) => {
                mouseDown = false;
            })

            // AudioContextのアクティブ化
            document.addEventListener('click', () => {
                if (pianoAudioCtx.state === 'suspended') {
                    pianoAudioCtx.resume();
                }
            });

            // メイン
            if (piano.className === 'piano-play') {
                // 侵入時
                key.addEventListener('mouseover', () => {
                    if (mouseDown) {
                        key.style.filter = 'invert(40%)';
                        playNote(midi, volume, duration, oscType, tuning);
                    } else {
                        key.style.filter = 'invert(20%)';
                    }
                });
                // 侵入かつ左クリック時
                key.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    if (e.button !== 0) return;
                    key.style.filter = 'invert(40%)';
                    stopNote(midi);
                    playNote(midi, volume, duration, oscType, tuning);
                })
                // 退出時
                key.addEventListener('mouseleave', () => {
                    key.style.filter = '';
                    // ハイライトのfilterを元に戻す
                    if (isBlackKey(midi) && highlight !== undefined && highlight.includes(midi)) {
                        key.style.filter = 'brightness(55%) contrast(300%)';
                    }
                });
                // 左クリック開放時
                key.addEventListener('mouseup', () => {
                    key.style.filter = 'invert(20%)';
                });
            }


            // ピアノに鍵盤を追加
            piano.appendChild(key);
        }

        // 不要?
        // piano.style.width = `calc(${keyWidth} * ${whiteCount})`;
        // piano.style.backgroundColor = '#202020';

        // スクロール用にコンテナでラップする
        const wrapper = document.createElement('div');
        wrapper.className = 'piano-wrapper';
        wrapper.style.boxSizing = 'border-box';
        wrapper.style.overflowX = 'auto';
        wrapper.style.overflowY = 'hidden';
        wrapper.style.maxWidth = '100%';
        wrapper.style.padding = '4px';
        wrapper.style.borderRadius = '8px';
        // wrapper.style.background = '#E0E0E0';
        piano.parentNode.insertBefore(wrapper, piano);
        wrapper.appendChild(piano);
    });
})();

function isBlackKey(midi) {
    const blackNotes = [1, 3, 6, 8, 10]; // C#, D#, F#, G#, A#
    return blackNotes.includes(midi % 12);
}

/**
 * @description
 * midi番号と調性(省略可)を引数にとり、音名に臨時記号とオクターブを付加した文字列を返す。
 * 臨時記号は調性に則って付加する。調性に当てはまらない黒鍵の音は#を付加する。
 * ここでは、調号が6個つく嬰ヘ長調は変ト長調とする。
 * @example 引数の例:
 * midiToNoteName(60, 'C maj') // C4
 * midiToNoteName(66, 'Cb LYD') // Gb4
 * @example 調性の記述例:
 * リディアン : 'lyd'
 * メジャー | イオニアン : 'maj' | 'lon'
 * ミクソリディアン : 'mix'
 * ドリアン : 'dor'
 * マイナー | エオリアン : 'min' | 'aeo'
 * フリジアン : 'phr'
 * ロクリアン : 'loc'
 * @param {number} midi midiノート番号(0以上)
 * @param {string} [keySignature] 音名、スケールをスペース区切りで渡す。音名のシャープは'#'で表し、フラットはb'で表す。省略された場合や、フォーマットが間違っている場合は、'C'に置き換える。スケールは教会旋法の主要な7モードから選択し、頭3文字を渡す。省略された場合や、フォーマットが間違っている場合は'maj'に置き換える。
 * @param {boolean} [hasOctave] オクターブを表記するか。デフォルトはtrue
 * @returns {string} 音名。黒鍵の場合スケールに則った臨時記号を付ける。もしくは#を付ける。
 */
function midiToNoteName(midi, keySignature = 'C maj', hasOctave = true) {
    // メジャースケールの場合の調号の数(# := +, b := -)
    // フラットbが大文字Bになっていることに注意
    const KEY_SIG_MAJ = {
        'C': 0, 'B#': 0,
        'C#': -5, 'DB': -5,
        'D': 2,
        'D#': -3, 'EB': -3,
        'E': 4, 'FB': 4,
        'F': -1, 'E#': -1,
        'F#': -6, 'GB': -6,
        'G': 1,
        'G#': -4, 'AB': -4,
        'A': 3,
        'A#': -2, 'BB': -2,
        'B': 5, 'CB': 5
    };
    // モード毎の調号の変動数(フラット方向に増えた数)
    const MODES_FLATNUM = {
        'LYD': -1,
        'MAJ': 0, 'ION': 0,
        'MIX': 1,
        'DOR': 2,
        'MIN': 3, 'AEO': 3,
        'PHR': 4,
        'LOC': 5
    };
    // 調号のフラットの数に対応して#をbにしたリスト
    // 既定の#から変動
    const TONALITY_LIST_FLAT = [
        ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
        ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'],
        ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'],
        ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'],
        ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'],
        ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
        ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'Cb'],
    ];

    // keySignature入力チェック
    if (keySignature == 0) {
        keySignature = 'C maj';
    }
    // スペースで区切る
    keySignature = keySignature.trim().split(/\s+/);
    // keySignature入力チェック(音名)
    if (keySignature[0] != undefined) {
        keySignature[0] = keySignature[0].toUpperCase();
    } else {
        keySignature[0] = 'C';
    }
    if (!Object.prototype.hasOwnProperty.call(KEY_SIG_MAJ, keySignature[0])) {
        keySignature[0] = 'C';
    }

    // keySignature入力チェック(調性)
    if (keySignature[1] != undefined) {
        keySignature[1] = keySignature[1].toUpperCase();
    } else {
        keySignature[1] = 'MAJ';
    }
    if (!Object.prototype.hasOwnProperty.call(MODES_FLATNUM, keySignature[1])) {
        keySignature[1] = 'MAJ';
    }

    // bを付加する数・位置を決める
    let tonality = -KEY_SIG_MAJ[keySignature[0]];
    tonality += MODES_FLATNUM[keySignature[1]];
    if (tonality <= -6) tonality += 12;
    if (tonality < 0 || 6 < tonality) tonality = 0;

    // オクターブを計算し返す
    if (hasOctave) {
        const octave = Math.floor(midi / 12) - 1;
        return TONALITY_LIST_FLAT[tonality][midi % 12] + octave;
    }
    return TONALITY_LIST_FLAT[tonality][midi % 12];
}

function playNote(midi, volume = 0.25, duration = 2, oscType = "triangle", tuning = 440) {
    // 同じ番号の既存の音を止める
    stopNote(midi);

    // volumeを対数スケールにする
    volume = Math.pow(10, (-40 + (0 - -40) * volume) / 20);

    // 基本設定
    const freq = tuning * Math.pow(2, (midi - 69) / 12);
    const osc = pianoAudioCtx.createOscillator();
    const gain = pianoAudioCtx.createGain();

    // 正弦波
    osc.type = oscType;
    osc.frequency.setValueAtTime(freq, pianoAudioCtx.currentTime);

    // 音量を0に近い値から
    gain.gain.setValueAtTime(0.0001, pianoAudioCtx.currentTime);
    // 滑らかに目標音量volumeへ
    gain.gain.exponentialRampToValueAtTime(volume, pianoAudioCtx.currentTime + 0.02);
    // 音量を時間durationをかけて減少させる
    gain.gain.exponentialRampToValueAtTime(0.0001, pianoAudioCtx.currentTime + duration);

    // 基本設定 開始、終了
    osc.connect(gain).connect(pianoAudioCtx.destination);
    osc.start();
    osc.stop(pianoAudioCtx.currentTime + duration);

    // 強制停止時の処理の為にgainを渡す
    osc.gainNode = gain;

    // 再生中リストへ追加
    pianoActiveNotes.set(midi, osc);
}

function stopNote(midi) {
    const osc = pianoActiveNotes.get(midi);
    if (osc) {
        try {
            // 強制停止時のノイズ処理(滑らかに位相を0にする)
            const now = pianoAudioCtx.currentTime;
            const gainNode = osc.gainNode;
            if (gainNode) {
                gainNode.gain.cancelScheduledValues(now);
                gainNode.gain.setValueAtTime(gainNode.gain.value, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            }
            osc.stop(now + 0.04);
        } catch (e) { }
        // 再生中リストから削除
        pianoActiveNotes.delete(midi);
    }
}

/**
 * 
 * @param {string} id piano id
 * @param {number} volume 
 * @param {number} duration 
 * @param {string} oscType OscillatorNode.type
 * @returns 
 */
function playHighlighted(id, volume = 0.25, duration = 2, oscType = "triangle", tuning = 440) {
    const piano = document.getElementById(id);
    if (piano == undefined) {
        console.error("id not found");
        return;
    }
    if (piano.dataset.highlight == undefined) {
        console.error("data-highlight has no valid value");
        return;
    }
    piano.dataset.highlight.trim().split(/\s+/).map(n => parseInt(n)).forEach(midi => {
        stopNote(midi);
        playNote(midi, volume, duration, oscType, tuning);

        if (piano.animationValidFlgs[midi]) {
            piano.animationValidFlgs[midi] = false;
            const beforeTransition = piano.keys[midi].style.transition;
            const beforefilter = piano.keys[midi].style.filter;
            piano.keys[midi].style.transition = '';
            piano.keys[midi].style.filter = beforefilter + ' sepia(100%)';
            setTimeout(() => {
                piano.keys[midi].style.transition = beforeTransition;
                piano.keys[midi].style.filter = beforefilter;
                piano.animationValidFlgs[midi] = true;
            }, 150);
        }
    });
}