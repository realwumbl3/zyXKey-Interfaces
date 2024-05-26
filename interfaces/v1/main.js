import { zyX, zyxcss } from "https://zyx.wumbl3.xyz";

zyxcss.path("./main.css");

class main {
	constructor() {
		(async () => {
			zyX(this).zyx({
				documentFragment: await zyX("./main.html").fetchtml(),
				template: "main",
				appendTo: document.body,
			});
			this.show_timeout = 777;
			this.circles = {};
			this.build_circles();
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
		zyX(this).clearDelay("show-timeout");
		this.overlay.classList.add("showing");
		if (!stay) zyX(this).delay(, this.show_timeout"show-timeout", (_) => this.overlay.classList.remove("showing"));
	};

	reset_circle = () => {
		for (let circle_directions of Object.values(this.circles)) {
			for (let circle_quarter of Object.values(circle_directions)) {
				if (circle_quarter.classList.contains("outer")) {
					zyX(circle_quarter).delay("reset", 333, (_) => circle_quarter.classList.remove("active"));
				} else {
					circle_quarter.classList.remove("active");
				}
			}
		}
	};
}

main.prototype.onTick = function (data) {
	this.show_overlay(true);
	for (let [key, val] of Object.entries(data)) {
		const circle_quarter = this.circles[key];
		if (val < 1) continue;
		circle_quarter[val - 1].classList.add("active");
	}
};

main.prototype.onModifierPress = function (data) {
	this.show_overlay(true);
};

main.prototype.onModifierRelease = function (data) {
	this.show_overlay();
	this.reset_circle();
};

main.prototype.onExec = function (data) {
	this.show_overlay();
	this.reset_circle();
};

main.prototype.build_circles = function () {
	for (let [ia, side] of Object.entries(["up", "right", "down", "left"])) {
		this.circles[side] = {};
		for (let i = 0; i < 4; i++) {
			const new_circle = zyX("img").element({
				cls: "move-ring-qrtr-circle",
				id: `qrtr-circle-${side}-${i}`,
				attr: {
					src: "./assets/quarter-circle.png",
				},
				style: {
					transform: `rotate(${90 * ia}deg)scale(${0.5 + i * 0.2})`,
				},
				appendTo: this.ring,
			});

			if (i >= 3) {
				new_circle.classList.add("outer");
				new_circle.src = "./assets/quarter-circle-outer.png";
			}

			this.circles[side][i] = new_circle;
		}
	}
};

const main_app_instance = new main();

export { main_app_instance };
