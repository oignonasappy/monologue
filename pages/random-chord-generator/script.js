function generate() {

    const MAX_MIDI = 96;

    const out = document.querySelector('#out');
    out.textContent = "ここに出力...";
    out.classList.remove('error');

    const rootMin = parseInt(document.querySelector('#root-min').value);
    const rootMax = parseInt(document.querySelector('#root-max').value);
    const countMin = parseInt(document.querySelector('#count-min').value);
    const countMax = parseInt(document.querySelector('#count-max').value);
    const intervalMin = parseInt(document.querySelector('#interval-min').value);
    const intervalMax = parseInt(document.querySelector('#interval-max').value);

    try {

        if (rootMin > rootMax) {
            throw new Error("rootMinがrootMaxより大きいのはおかしい");
        }
        if (countMin > countMax) {
            throw new Error("countMinがcountMaxより大きいのはおかしい");
        }
        if (intervalMin > intervalMax) {
            throw new Error("intervalMinがintervalMaxより大きいのはおかしい");
        }

        const chord = new Array();
        const root = rootMin + Math.round(Math.random() * (rootMax - rootMin));
        const count = countMin + Math.round(Math.random() * (countMax - countMin));
        chord[0] = root;
        for (let i = 1; i < count; i++) {
            const midi = chord[i - 1] + intervalMin + Math.round(Math.random() * (intervalMax - intervalMin));
            if (midi > MAX_MIDI) break;
            chord[i] = midi;
        }

        sequencer(
            (value) => {
                playKeys('piano-chord', [value]);
            },
            new Array(chord.length - 1).fill(0.08, 0, chord.length - 1),
            chord,
            240
        );

        let text = "";
        chord.forEach(midi => {
            text += midiToNoteName(midi) + " ";
        });
        out.textContent = text;

    } catch (error) {
        out.classList.add('error');
        out.textContent = error;
    }
}

function edoGenerate() {

    const MAX_MIDI = 96;

    const out = document.querySelector('#edo-out');
    out.textContent = "ここに出力...";
    out.classList.remove('error');

    const rootMin = parseFloat(document.querySelector('#edo-root-min').value);
    const rootMax = parseFloat(document.querySelector('#edo-root-max').value);
    const countMin = parseInt(document.querySelector('#edo-count-min').value);
    const countMax = parseInt(document.querySelector('#edo-count-max').value);
    const intervalMin = parseFloat(document.querySelector('#edo-interval-min').value);
    const intervalMax = parseFloat(document.querySelector('#edo-interval-max').value);
    const temperament = parseInt(document.querySelector('#edo-temperament').value);

    try {

        if (rootMin > rootMax) {
            throw new Error("rootMinがrootMaxより大きいのはおかしい");
        }
        if (countMin > countMax) {
            throw new Error("countMinがcountMaxより大きいのはおかしい");
        }
        if (intervalMin > intervalMax) {
            throw new Error("intervalMinがintervalMaxより大きいのはおかしい");
        }

        const chord = new Array();
        const root = rootMin + Math.round(Math.random() * (rootMax - rootMin) * temperament / 12) * 12 / temperament;
        const count = countMin + Math.round(Math.random() * (countMax - countMin));
        chord[0] = root;
        for (let i = 1; i < count; i++) {
            const midi = chord[i - 1] + Math.round(intervalMin * temperament / 12) * 12 / temperament + Math.round(Math.random() * (intervalMax - intervalMin) * temperament / 12) * 12 / temperament;
            if (midi > MAX_MIDI) break;
            chord[i] = midi;
        }

        sequencer(
            (value) => {
                playKeys('edo-piano-chord', [value]);
            },
            new Array(chord.length - 1).fill(0.08, 0, chord.length - 1),
            chord,
            240
        );

        let text = "";
        chord.forEach(midi => {
            text += Math.round(midi * 100) / 100 + " ";
        });
        out.textContent = text;

    } catch (error) {
        out.classList.add('error');
        out.textContent = error;
    }
}