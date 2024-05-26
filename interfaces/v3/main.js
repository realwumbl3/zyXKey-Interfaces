import zyX, { html, css, zyXTransform } from "https://zyx.wumbl3.xyz/v:1.5/";

css`@import url(main.css);`

const FIRST_ROW = ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"];
const SECOND_ROW = ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"];
const THIRD_ROW = ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"];
const FOURTH_ROW = ["L-Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "R-Shift"];
const FIFTH_ROW = ["L-Ctrl", "Win", "L-Alt", "Space", "R-Alt", "Fn", "Menu", "R-Ctrl"];

const keyboardMap = [FIRST_ROW, SECOND_ROW, THIRD_ROW, FOURTH_ROW, FIFTH_ROW];

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

		${keyboardMap.map((row) =>
			html`<div class="KeyboardRow"> ${row.map((key) =>
				html`<div class="KeyboardKey ${getClassName(key)}">
				<div class="keyCap">
					<div class="KeyName">${key}</div>
				</div>
			</div>`

			)}</div>`

		)}</div>`
			.bind(this);
	}
}

css`
	.KeyboardContainer {
		aspect-ratio: 15/5;
		height: 28vh;
		position: absolute;
		top: -100%;
		display: grid;
		grid-template-rows: repeat(5, 1fr);
		transform: rotateX(2deg);
	}

	.KeyboardRow {
		display: flex;
		position: relative;
		flex-wrap: nowrap;
		justify-content: space-around;
	}

	.KeyboardKey {
		display: grid;
		place-items: stretch;
		aspect-ratio: 1;
	}

	.KeyboardKey.R-Ctrl,
	.KeyboardKey.L-Ctrl,
	.KeyboardKey.R-Alt,
	.KeyboardKey.L-Alt,
	.KeyboardKey.Win,
	.KeyboardKey.Menu,
	.KeyboardKey.Fn {
		aspect-ratio: 1.3;
	}

	.KeyboardKey.Space,
	.KeyboardKey.Backspace,
	.KeyboardKey.Enter,
	.KeyboardKey.R-Shift,
	.KeyboardKey.L-Shift,
	.KeyboardKey.Tab,
	.KeyboardKey.Caps,
	.KeyboardKey.Backslash {
		flex-grow: 1;
		flex-shrink: 1;
		aspect-ratio: unset;
	}

	.KeyboardKey .keyCap {
		font-size: 1.5em;
		display: grid;
		position: relative;
		padding: 0.4em;
		margin: 0.2em;
		border-radius: 1em;
		border-bottom-left-radius: 0.5em;
		box-shadow: inset 0 0 0.4em #ff00e58f, 0 0 1em 0.5em #00000061;
		background: #000000e0;
		color: white;
		font-family: "Exo 2";
		grid-template: 1fr 1fr / 1fr 1fr;
		grid-template-areas:
			". ."
			"keyName .";
	}
	
	.KeyboardKey .keyCap .KeyName {
		grid-area: keyName;
		position: absolute;
		font-size: 0.6em;
		align-self: end;
		justify-self: start;
		color: #ffffff78;
	}
`;

class main {
	constructor() {
		// this.overlayKeyboard = new overlayKeyboard();

		html`
			<div this="overlay" class="overlay-container">
				<div class="overlay-bg"></div>
				<div this="section_container" class="overlay-sections-container">
					<div class="overlay-badge"></div>
					<div this="section_center" class="overlay-sections-center"></div>
				</div>
				${this.overlayKeyboard}
			</div>
		`
			.bind(this)
			.appendTo(document.body);

		this.OFFSET_ANIM = new offset_animation(this.section_center);

		zyXTransform(this.section_center);
		this.section_center.set({ translate3D: "0px, 0px, 0px" });

		this.show_timeout = 400;
		this.showing = false;

		this.directions = [
			"up",
			// "rightup",
			"right",
			// "rightdown",
			"down",
			// "leftdown",
			"left",
			// "leftup",
		];

		this.sections = this.directions.length;

		this.section_degrees = 360 / this.sections;

		this.sections = {};

		this.build_sections(this.directions);

		window.seleniumJsExecute = (..._) => this.seleniumJsExecute(..._);
		electron.send("minMax", { restore: true });
	}

	seleniumJsExecute = (action, data) => {
		console.log("seleniumJsExecute", action, data);
		if (action in this) {
			this[action](data);
		}
	};

	show_overlay = (stay) => {
		this.overlay.classList.add("showing");
		if (!stay) zyX(this).delay("show-timeout", this.show_timeout, (_) => this.overlay.classList.remove("showing"));
	};

	hide_overlay = () => {
		zyX(this).clearDelay("show-timeout");
		this.overlay.classList.remove("showing");
	};

	reset_circle = () => {
		for (let section of Object.values(this.sections)) {
			for (let arrow of Object.values(section.arrows)) {
				arrow.classList.remove("active");
			}
		}
	};

	update_status = () => {
		if (!this.showing) return false;
	};
}

class offset_animation {
	constructor(target) {
		this.target = target;
		this.multipler = 0.3;
		this.POS_MAP = [
			[0, -100], //up
			// [100, -100], //rightup
			[100, 0], //right
			// [100, 100], //rightdown
			[0, 100], //down
			// [-100, 100], //leftdown
			[-100, 0], //left
			// [-100, -100], //leftup
		];
		this.animating = false;
		this.relative_pos = [50, 50];
	}

	tick = (which) => {
		const section = this.POS_MAP[which];
		this.target.set({
			translate3D: `${section[0] * this.multipler}px, ${section[1] * this.multipler}px, 0px`,
		});
		zyX(this).delay("tick-offset-animation", 80, (_) => {
			this.target.set({ translate3D: "0px, 0px, 0px" });
		});
	};

	// frame = () => {

	// }
}

main.prototype.onTick = function (data) {
	for (let [key, val] of Object.entries(data.ticks)) {
		if (val < 1) continue;
		const circle_quarter = this.sections[key];
		if (val < 4) {
			const arrow = circle_quarter.arrows[val - 1];
			arrow.classList.add("active");
		}
		if (val >= 4) {
			this.OFFSET_ANIM.tick(data.which);
			circle_quarter.direction_arrow.classList.add("active");
			zyX(circle_quarter).delay("direction-timeout", 200, (_) => {
				circle_quarter.direction_arrow.classList.remove("active");
			});
		}
	}
};

main.prototype.onModifierPress = function (data) {
	this.show_overlay(true);
	zyX(this).clearDelay("electron-hide");
	window.electron.send("minMax", { restore: true });
};

main.prototype.onModifierRelease = function (data) {
	this.hide_overlay();
	this.reset_circle();
	zyX(this).delay("electron-hide", 400, (_) => {
		window.electron.send("minMax", { minimize: true });
	});
};

main.prototype.onExec = function (data) {
	this.reset_circle();
};

main.prototype.build_sections = function () {
	for (let [ia, side] of Object.entries(this.directions)) {
		html`
			<div this="section" class="overlay-section">
				<div class="section-content">
					<div this="label container" class="label-container">
						<div this="label label" class="label-label">...</div>
					</div>
					<div this="direction_arrow" class="dir_arrow"></div>
					<div this="arrowsctn" class="arrows">
						<div this="arrows 2" class="arrow"></div>
						<div this="arrows 1" class="arrow"></div>
						<div this="arrows 0" class="arrow"></div>
					</div>
				</div>
			</div>
		`
			.appendTo(this.section_center)
			.touch(({ proxy } = {}) => {
				proxy.section.style.transform = `rotate(${this.section_degrees * ia}deg)`;
				this.sections[side] = proxy;
			});
	}
};

const zyxKey = new main();

window.zyxKey = zyxKey;

export { zyxKey };

css`
	.overlay-container {
		height: 33vh;
		aspect-ratio: 4.2/3;
		bottom: 0;
		opacity: 0;
		transition: opacity 20ms ease, transform 50ms ease-in;
		display: grid;
		place-items: center;
		position: absolute;
		transform: scale(0.4) translateY(100%);
		perspective: 240px;
	}

	.overlay-container.showing {
		transform: scale(1) translateY(0%);
		opacity: 1;
	}

	.overlay-bg {
		position: absolute;
		width: 140%;
		bottom: 0;
		height: 190%;
		background-image: url("assets/BG.png");
		background-size: 100% 100%;
		filter: invert(1);
	}

	.overlay-sections-container {
		height: 100%;
		bottom: 30%;
		aspect-ratio: 1;
		position: relative;
		place-items: center;
		display: grid;
		transform-style: preserve-3d;
	}

	.overlay-container:not(.showing) .overlay-sections-container {
		transition: transform 300ms ease;
		transition-delay: 50ms;
		transform: translate3d(0, 100%, 0) scale(0.8) rotate3d(1, 0, 0, 0deg);
	}

	.overlay-container.showing .overlay-sections-container {
		transition: transform 200ms ease;
		transform: translate3d(0, 0%, 0) scale(1) rotate3d(1, 0, 0, 18deg);
		transition-delay: 50ms;
	}

	.overlay-sections-center {
		height: 50%;
		width: 100%;
		place-items: center;
		top: 0;
		display: grid;
		position: absolute;
		transition: transform 80ms ease;
		transform-style: preserve-3d;
	}

	.overlay-section {
		height: 100%;
		aspect-ratio: 4/7;
		position: absolute;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		transform-origin: 50% 100%;
		transform-style: preserve-3d;
	}

	.section-content {
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		justify-items: center;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 0 10% min-content;
		transform-origin: 50% 0%;
		/* transform: rotateX(335deg); */
	}

	.label-container {
		height: 0;
		width: 100%;
		opacity: 0.3;
		position: relative;
	}

	.label-label {
		position: absolute;
		font-family: "Exo 2", sans-serif;
		color: white;
		text-align: center;
		font-size: 1.4em;
		bottom: 0.5em;
		width: 100%;
		text-shadow: 0 0 4px black;
	}

	.overlay-section:nth-child(4) .label,
	.overlay-section:nth-child(5) .label,
	.overlay-section:nth-child(6) .label {
		transform: rotate(180deg);
	}

	.dir_arrow {
		background-image: url("./assets/inactive-direction.png");
		width: 100%;
		aspect-ratio: 3/1;
		background-size: 100% 100%;
		opacity: 0.3;
	}

	.dir_arrow.active {
		background-image: url("./assets/active-direction.png");
		opacity: 1;
	}

	.arrows {
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: min-content;
		justify-items: center;
		width: 64%;
		aspect-ratio: 1/0.6;
		position: relative;
	}

	.arrow {
		opacity: 0.8;
		background-size: 100% 100%;
		position: absolute;
		inset: 0;
	}

	.arrow.active {
		opacity: 1;
	}

	.arrow:nth-child(1) {
		background-image: url("./assets/inactive-a.png");
	}

	.arrow:nth-child(2) {
		background-image: url("./assets/inactive-b.png");
	}

	.arrow:nth-child(3) {
		background-image: url("./assets/inactive-c.png");
	}

	.arrow.active:nth-child(1) {
		background-image: url("./assets/active-a.png");
	}

	.arrow.active:nth-child(2) {
		background-image: url("./assets/active-b.png");
	}

	.arrow.active:nth-child(3) {
		background-image: url("./assets/active-c.png");
	}
`;
