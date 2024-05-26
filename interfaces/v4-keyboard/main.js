import zyX, { html, css, zyXTransform } from "https://zyx.wumbl3.xyz/v:1.5/";

css`@import url(main.css);`


const FUNC_ROW = ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];
const FIRST_ROW = ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Bksp"];
const SECOND_ROW = ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"];
const THIRD_ROW = ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"];
const FOURTH_ROW = ["L-Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "R-Shift"];
const FIFTH_ROW = ["L-Ctrl", "Win", "L-Alt", "Space", "R-Alt", "Fn", "Menu", "R-Ctrl"];

const KeyCodeTable = {
	"KeyA": "A",
	"KeyB": "B",
	"KeyC": "C",
	"KeyD": "D",
	"KeyE": "E",
	"KeyF": "F",
	"KeyG": "G",
	"KeyH": "H",
	"KeyI": "I",
	"KeyJ": "J",
	"KeyK": "K",
	"KeyL": "L",
	"KeyM": "M",
	"KeyN": "N",
	"KeyO": "O",
	"KeyP": "P",
	"KeyQ": "Q",
	"KeyR": "R",
	"KeyS": "S",
	"KeyT": "T",
	"KeyU": "U",
	"KeyV": "V",
	"KeyW": "W",
	"KeyX": "X",
	"KeyY": "Y",
	"KeyZ": "Z",
	"Digit1": "1",
	"Digit2": "2",
	"Digit3": "3",
	"Digit4": "4",
	"Digit5": "5",
	"Digit6": "6",
	"Digit7": "7",
	"Digit8": "8",
	"Digit9": "9",
	"Digit0": "0",
	"Minus": "-",
	"Equal": "=",
	"BracketLeft": "[",
	"BracketRight": "]",
	"Semicolon": ";",
	"Quote": "'",
	"Backslash": "\\",
	"Comma": ",",
	"Period": ".",
	"Slash": "/",
	"Backspace": "Bksp",
	"Tab": "Tab",
	"CapsLock": "Caps",
	"Enter": "Enter",
	"ShiftLeft": "L-Shift",
	"ShiftRight": "R-Shift",
	"ControlLeft": "L-Ctrl",
	"ControlRight": "R-Ctrl",
	"AltLeft": "L-Alt",
	"AltRight": "R-Alt",
	"Space": "Space",
	"MetaLeft": "Win",
	"ContextMenu": "Menu",
	"ArrowLeft": "Left",
	"ArrowRight": "Right",
	"ArrowUp": "Up",
	"ArrowDown": "Down",
	"Escape": "Esc",
	"Backquote": "`",
	"F1": "F1",
	"F2": "F2",
	"F3": "F3",
	"F4": "F4",
	"F5": "F5",
	"F6": "F6",
	"F7": "F7",
	"F8": "F8",
	"F9": "F9",
	"F10": "F10",
	"F11": "F11",
	"F12": "F12",
}

const keyboardMap = [FUNC_ROW, FIRST_ROW, SECOND_ROW, THIRD_ROW, FOURTH_ROW, FIFTH_ROW];

const ALIASES = {
	"\\": "Backslash",
};

function getClassName(key) {
	if (key in ALIASES) return ALIASES[key];
	return key;
}

class overlayKeyboard {
	constructor() {
		// prettier-ignore
		html`<div class="KeyboardContainer">
		${keyboardMap.map((row) => html`<div class="KeyboardRow"> ${row.map(Key)}</div>`
		)}</div>`
			.bind(this)
	}
}

function addSlashes(str) {
	return str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function Key(key) {
	const className = getClassName(key)
	return html`<div this=key class="KeyboardKey ${className}" key="${className}">
				<div this=shadow class="ShadowSelf">
					<div class="KeyName">${key}</div>
				</div>
				<div this=cap class="KeyCap">
					<div class="KeyName">${key}</div>
				</div>
			</div>`
		.pass(({ key, cap, shadow }) => {
			key.highlight = () => {
				key.classList.add("active");
				key.classList.add("justPressed");
				zyX(key).delay("justpressed", 100, () => {
					key.classList.remove("justPressed");
				});
				zyX(key).delay("active", 800, () => {
					key.classList.remove("active");
				});
			}
			key.addEventListener("mousedown", key.highlight);
		})
}

document.body.addEventListener("keydown", (e) => {
	console.log(e.code);
	const key = KeyCodeTable[e.code];
	if (!key) return;
	const keyElement = document.querySelector(`.KeyboardKey[key="${key}"]`);
	if (!keyElement) return;
	e.preventDefault();
	e.stopPropagation();
	keyElement.highlight();
});

class App {
	constructor() {
		this.overlayKeyboard = new overlayKeyboard();
		html`
			${this.overlayKeyboard}
		`
			.bind(this)
			.appendTo(document.body);
	}

}

window.app = new App();