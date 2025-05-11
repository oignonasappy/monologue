(function () {
    // 全てのclass="piano"に対し処理
    const pianos = document.querySelectorAll('.piano');
    pianos.forEach(piano => {

        // 属性
        const first = parseInt(piano.dataset.first) ?? 60;
        const last = parseInt(piano.dataset.last) ?? 72;
        const keyWidth = piano.dataset.keyWidth ?? '20px';
        const keyHeight = piano.dataset.keyHeight ?? '60px';
        const highlight = piano.dataset.highlight === undefined ? undefined : piano.dataset.highlight.split(' ').map(n => parseInt(n));
        const highlightColor = piano.dataset.highlightColor;
        const notename = piano.dataset.notename === "true" ? true : false;
        console.log("piano.js attributes", first, last, keyWidth, keyHeight, highlight, highlightColor, notename);

        // ピアノのCSS
        piano.style.position = 'relative';
        piano.style.height = keyHeight;

        let whiteCount = 0;
        // 鍵盤一つづつの処理
        const keys = []
        for (let midi = first; midi <= last; midi++) {

            // 鍵盤はそれぞれ<div>で構成
            const key = document.createElement('div');
            keys.push(key);
            key.dataset.midi = midi;

            // 鍵盤共通のCSS
            key.style.position = 'absolute';

            if (!isBlackKey(midi)) {
                // 白鍵の処理
                key.className = 'white-key';
                key.style.width = keyWidth;
                key.style.height = keyHeight;
                key.style.left = `calc(${keyWidth} * ${whiteCount})`;
                key.style.backgroundColor = '#FFFFFF';
                key.style.border = '1px solid #202020';
                // 後で key.style.clipPath = 'polygon(0 5%, 5% 0, 95% 0, 100% 90%, 90% 100%, 10% 100%, 0% 90%)';
                key.style.zIndex = 0;
                whiteCount++;
            } else {
                // 黒鍵の処理
                if (whiteCount === 0) whiteCount = 1; // 最初の黒鍵が左側にずれることを防ぐ
                key.className = 'black-key';
                key.style.width = `calc(${keyWidth} * 0.7)`;
                key.style.height = `calc(${keyHeight} * 0.6)`;
                key.style.left = `calc(${keyWidth} * ${whiteCount} - ${keyWidth} * 0.35)`;
                key.style.backgroundColor = '#000000';
                key.style.border = '1px solid #606060';
                key.style.zIndex = 1;
            }

            // ピアノに鍵盤を追加
            piano.appendChild(key);

        }

        piano.style.width = `calc(${keyWidth} * ${whiteCount})`; // 不要?
    });

})();

function isBlackKey(midi) {
    const blackNotes = [1, 3, 6, 8, 10]; // C#, D#, F#, G#, A#
    return blackNotes.includes(midi % 12);
}

function midiToNoteName(midi) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    return noteNames[midi % 12] + octave;
}