class Game {
	constructor(name, img, username, els) {
		this.name = name;
		if (!img) return;
		this.img = img;
		this.username = username;
		this.els = els;
		this.time = 0;
		this.isGoing = false;
		this.interval;
	}

	start() {
		this.isGoing = true;
		this.interval = setInterval((() => {
			this.time++;
			this.inject().save();
		}).bind(this), 1000);

		$(this.els.main).css({ display: 'flex' });

		return this;
	}

	stop() {
		this.isGoing = false;
		clearInterval(this.interval);

		$(this.els.main).css({ display: 'none' });

		return this;
	}

	toggle() {
		this.isGoing ? this.stop() : this.start();

		return this;
	}

	inject() {
		if ($(this.els.tar + ' > img').length == 0) {
			let img = new Image();
			img.src = this.img;
			$(this.els.tar).append(img.outerHTML);
		}

		const prefix = time => time < 10 ? '0' + time : time;

		let min = prefix(Math.floor(this.time / 60));
		let sec = prefix(this.time % 60);
		$(this.els.time).html(min + ':' + sec);
		$(this.els.username).html(this.username);
		$(this.els.toggle).html(this.isGoing ? 'Pause' : 'Resume');

		return this;
	}

	save() {
		localStorage[this.name] = JSON.stringify(this);
	}

	load() {
		let data = JSON.parse(localStorage[this.name]);
		for (let item in data) {
			this[item] = data[item];
		}

		this.isGoing ? this.start() : this.stop();

		return this;
	}
}