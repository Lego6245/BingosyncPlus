const key = "bsp_theme";

const colors = {
    orange: {
        top: '#F98E1E',
        bottom: '#D0800F'
    },
    red: {
        top: '#DA4440',
        bottom: '#CE302C'
    },
    blue: {
        top: '#37A1DE',
        bottom: '#088CBD'
    },
    green: {
        top: '#00B500',
        bottom: '#20A00A'
    },
    purple: {
        top: '#822dbf',
        bottom: '#7120ab'
    },
    navy: {
        top: '#0d48b5',
        bottom: '#022b75'
    },
    teal: {
        top: '#419695',
        bottom: '#2e7372'
    },
    brown: {
        top: '#ab5c23',
        bottom: '#6d3811'
    },
    pink: {
        top: '#ed86aa',
        bottom: '#cc6e8f'
    },
    yellow: {
        top: '#d8d014',
        bottom: '#c1ba0b'
    },
};

const colorNames = Object.keys(colors);

let stringifiedColors = JSON.stringify(colors);
const temporary = JSON.parse(stringifiedColors);
const inUse = JSON.parse(stringifiedColors);

let isSaveActive = false;

const darken = (p, c0, c1, l) => {
    let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    if (!this.pSBCr) this.pSBCr = (d) => {
        let n = d.length, x = {};
        if (n > 9) {
            [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        }
        return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? {
        r: 0,
        g: 0,
        b: 0,
        a: -1
    } : {r: 255, g: 255, b: 255, a: -1}, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}

function isColorCode(value) {
    return /^#?[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value);
}

function updateCSS(color) {
    const card = document.getElementById(`${color}_card`);
    card.setAttribute("style", `background-image: linear-gradient(${temporary[color]["top"]} 60%, ${temporary[color]["bottom"]});`);
}

function updateColors(color, newColor) {
    document.getElementById(`${color}_restore`).style = "display:inline";
    if (!isColorCode(newColor)) {
        console.log("not a color");
        return;
    }
    if (newColor[0] !== '#') {
        newColor = '#' + newColor;
    }
    let darker = darken(-0.33, newColor);
    temporary[color]["top"] = newColor;
    temporary[color]["bottom"] = darker;
    updateCSS(color);
}

function saveColors(color) {
    if (isSaveActive) {
        document.getElementById("save_load").style = "display:none";
        isSaveActive = false;
    }
    inUse[color] = JSON.parse(JSON.stringify(temporary[color]));
    document.getElementById(`${color}_restore`).style = 'display:none';

    localStorage.setItem(key, JSON.stringify(inUse));
}

function resetColors(color) {
    temporary[color] = JSON.parse(JSON.stringify(colors[color]));
    document.getElementById(`${color}_top`).value = colors[color]["top"];
    document.getElementById(`${color}_restore`).style = 'display: inline';
    updateCSS(color);
}

function restoreColors(color) {
    document.getElementById(`${color}_restore`).style = 'display: none';
    temporary[color] = JSON.parse(JSON.stringify(inUse[color]));
    document.getElementById(`${color}_top`).value = inUse[color]["top"];
    updateCSS(color);
}

function loadFile(event) {
    // let fileName = file.target.files[0];
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);


    function onReaderLoad(event) {
        let json;
        try {
            // Try to convert into JSON
            json = JSON.parse(event.target.result);
        } catch (e) {
            alert(e);
        }

        // Check if everything is valid
        for (const colorKey of colorNames) {
            if (json[colorKey]) {
                inUse[colorKey]["top"] = isColorCode(json[colorKey]['top']) ? json[colorKey]['top'] : inUse[colorKey]['top'];
                inUse[colorKey]["bottom"] = isColorCode(json[colorKey]['bottom']) ? json[colorKey]['bottom'] : inUse[colorKey]['bottom'];
                restoreColors(colorKey)
            }
        }
        localStorage.setItem(key, JSON.stringify(inUse));
    }

    reader.readAsText(event);
}

function toggleSaveLoad() {
    if (isSaveActive) {
        document.getElementById("save_load").style = "display:none";
    } else {
        document.getElementById("save").setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(inUse))}`);
        document.getElementById("save_load").style = "display:inline";
    }
    isSaveActive = !isSaveActive;
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem(key)) {
        Object.assign(inUse, JSON.parse(localStorage.getItem(key)));
    }

    for (let color of colorNames) {
        document.getElementById(`${color}_card`).setAttribute("style", `background-image: linear-gradient(${inUse[color]["top"]} 60%, ${inUse[color]["bottom"]});`);

        let top = document.getElementById(`${color}_top`);
        top.addEventListener('input', (e) => updateColors(color, e.target.value));
        top.value = inUse[color]["top"];

        let save = document.getElementById(`${color}_save`);
        let reset = document.getElementById(`${color}_reset`);

        let restore = document.getElementById(`${color}_restore`);
        restore.addEventListener("click", e => restoreColors(color));
        restore.style = "display:none";

        save.addEventListener("click", e => saveColors(color));
        reset.addEventListener("click", e => resetColors(color));
    }

    document.getElementById("save_load_button").addEventListener("click", toggleSaveLoad);

    document.getElementById("load").addEventListener("change", loadFile);
    document.getElementById("save_load").style = "display:none";
});
