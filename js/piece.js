class Piece {
	constructor(img, wh, piece, el, tar, state = false) {
		this.img = img;
		this.wh = wh;
		this.piece = piece;
		this.el = el;
		this.tar = tar;
		this.state = state;
	}

	image() {
		let canvas = document.createElement('canvas');
		canvas.width = this.wh;
		canvas.height = this.wh;
		canvas.getContext('2d').drawImage(this.img, this.piece.x, this.piece.y, this.piece.w, this.piece.h, 0, 0, this.wh, this.wh);
		let img = new Image();
		img.src = canvas.toDataURL();
		return img;
	}

	inject() {
		if (!this.state)
			$(this.el).html(this.image().outerHTML);

		return this;
	}

	onject() {
		if (this.state)
			$(this.tar).html(this.image().outerHTML);

		return this;
	}

	design() {
		let img = $(this.el).find('img');
		img.attr('style', `transform: rotate(${this.piece.rotate}deg) scale(${this.piece.scale});`);
		this.piece.scale == 1 ? img.removeClass('active') : img.addClass('active');

		return this;
	}

	rotateLeft() {
		this.piece.rotate -= 90;
		return this;
	}

	rotateRight() {
		this.piece.rotate += 90;
		return this;
	}

	big() {
		this.piece.scale = 1.1;
		return this;
	}

	mini() {
		this.piece.scale = 1;
		return this;
	}

	isSolve(id) {
		return this.piece.id == id && (this.piece.rotate % 360) == 0;
	}

	solve() {
		this.state = true;
		this.mini().design();

		return this;
	}
}