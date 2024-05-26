import { zyX, zyxcss } from "https://zyx.wumbl3.xyz";

zyxcss.path("main.css");

class main {
	constructor() {
		(async () => {
			zyX(this).zyx({
				documentFragment: await zyX("./main.html").fetchtml(),
				template: "main",
				appendTo: document.body,
			});
			this.show_timeout = 400;
			this.showing = false;
			this.sections = 8;

			this.section_degrees = 360 / this.sections;

			this.sections = {};

			this.build_sections();

			window.seleniumJsExecute = (..._) => this.seleniumJsExecute(..._);
		})();
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

main.prototype.onTick = function (data) {
	for (let [key, val] of Object.entries(data)) {
		if (val < 1) continue;
		const circle_quarter = this.sections[key];
		const arrow = circle_quarter.arrows[val - 1];
		arrow.classList.add("active");
		if (val >= 4) {
			circle_quarter.direction_arrow.classList.add("active");
			zyX(circle_quarter).delay(
				"direction-timeout",
				400,
				(_) => {
					circle_quarter.direction_arrow.classList.remove("active");
				}
			);
		}
	}
};

main.prototype.onModifierPress = function (data) {
	this.show_overlay(true);
	window.electron.send("minMax", { restore: true });
};

main.prototype.onModifierRelease = function (data) {
	this.hide_overlay();
	this.reset_circle();
	window.electron.send("minMax", { minimize: true });
};

main.prototype.onExec = function (data) {
	this.reset_circle();
};

const sectionMarkup = `
    <div this="section" class="overlay-section">

        <div class="section-content">
            <div this="label container" class="label-container">
                <div this="label label" class="label-label">...</div>
            </div>
            <div this="direction_arrow" class="dir_arrow"></div>
            <div this="arrowsctn" class="arrows">
                <div this="arrows 3" class="arrow"></div>
                <div this="arrows 2" class="arrow"></div>
                <div this="arrows 1" class="arrow"></div>
                <div this="arrows 0" class="arrow"></div>
            </div>
        </div>

    </div>
    `;

main.prototype.build_sections = function () {
	for (let [ia, side] of Object.entries(["up", "rightup", "right", "rightdown", "down", "leftdown", "left", "leftup"])) {
		const new_circle = zyX().zyx({
			markup: sectionMarkup,
			appendTo: this.section_center,
		});
		new_circle.section.style.transform = `rotate(${this.section_degrees * ia}deg)`;
		this.sections[side] = new_circle;
	}
};

const main_app_instance = new main();

window.main_app_instance = main_app_instance;

export { main_app_instance };
