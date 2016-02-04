class Puzzle {
	constructor(name, img, wh, count, el, tar) {
		this.name = name;
		this.imgs = [];
		if (!img) return;
		this.img = img;
		this.wh = wh;
		this.count = count;
		this.el = el;
		this.tar = tar;
	}

	init(add) {
		return new Promise(res => {
			let img = new Image();
			img.addEventListener('load', () => {
				this.w = img.width;
				this.h = img.height;
				this.img = img;
				if (add)
					this.add();
				res();
			});
			img.src = this.img;
		});
	}

	add() {
		for (let i = 0; i < this.count; i++) {
			for (let z = 0; z < this.count; ++z) {
				let id = i * this.count + z;
				this.imgs.push(new Piece(this.img, this.wh / this.count, {
					id,
					x: this.w / this.count * z,
					y: this.h / this.count * i,
					w: this.w / this.count,
					h: this.h / this.count,
					rotate: [90, 180, 270][random(0, 2)],
					scale: 1
				}, `#${this.name}_${id}`, `#${this.name}_tar${id}`));
			}
		};
	}

	inject(cb = () => {}) {
		$(this.el).html('');
		if (!this.shuffled)
			this.shuffled = shuffle(this.imgs.slice());
		
		for (let item of this.shuffled) {
			$(this.el).append(`<div style='width: ${this.wh / this.count}px; height: ${this.wh / this.count}px;' id='${this.name}_${item.piece.id}' data-id='${item.piece.id}'></div>`);

			cb(item.inject().design().el);
		}

		return this;
	}

	onject(cb = () => {}) {
		$(this.tar).html('');

		for (let item of this.imgs) {
			$(this.tar).append(`<div style='width: ${this.wh / this.count}px; height: ${this.wh / this.count}px;' id='${this.name}_tar${item.piece.id}' data-id='${item.piece.id}'></div>`);

			cb(item.onject().tar);
		}

		return this;
	}

	save() {
		let ob = Object.assign({}, this);
		ob.imgs = ob.imgs.map(item => {
			delete item.img;
			return item;
		});
		ob.shuffled = ob.shuffled.map(item => item.piece.id);
		ob.img = ob.img.src;

		localStorage[this.name] = JSON.stringify(ob);

		return this;
	}

	load() {
		let data = JSON.parse(localStorage[this.name]);
		for (let item in data) {
			if (item == 'imgs') continue;

			this[item] = data[item];
		}

		return this.init().then(() => {
			for (let i = 0; i < this.count; ++i) {
				for (let z = 0; z < this.count; ++z) {
					let id = z + (i * this.count);
					this.imgs.push(new Piece(this.img, this.wh / this.count,
					data.imgs[id].piece, `#${this.name}_${id}`, `#${this.name}_tar${id}`,
					data.imgs[id].state));
				}
			}

			this.shuffled = this.shuffled.map(item => this.imgs[item]);
		});
	}

	get isSolved() {
		return this.imgs.every(item => item.state);
	}

	get scaled() {
		for (let item of this.imgs)
			if (item.piece.scale == 1.1)
				return item;

		return 0;
	}
}