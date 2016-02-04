const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle(arr) {
	let cur = arr.length, rand;

	while(cur !== 0) {
		rand =  random(0, cur - 1);
		cur--;
		[arr[cur], arr[rand]] = [arr[rand], arr[cur]];
	}

	return arr;
}

function readFile(file) {
	return new Promise((res, rej) => {
		console.log(file.type.split('/')[1]);
		if (file.type.split('/')[1] != 'jpeg')
			rej();
		let reader = new FileReader();
		reader.addEventListener('load', () => {
			res(reader.result);
		});
		reader.readAsDataURL(file);
	}).catch(report);
}

let acel;
function onPiece() {
	let piece = b.imgs[$(acel).data('id')];
	if (this == acel) {
		piece.mini().design();
		acel = null;
		b.save();
	} else if (acel) {
		piece.mini().design();
		acel = this;
		b.imgs[$(acel).data('id')].big().design();
		b.save();
	} else {
		acel = this;
		b.imgs[$(acel).data('id')].big().design();
		b.save();
	}
}

function drop(e, g) {
	let go = $(g.draggable[0]),
		eo = $(e.target),
		piece = b.imgs[go.parent().data('id')];
	if (piece.isSolve(eo.data('id'))) {
		piece.solve();
		b.save();
		eo.html(g.draggable[0].outerHTML);
		go.remove();

		if (b.isSolved) {
			localStorage.clear();
			$('#modal-end').addClass('active');
		}
	}
}

$('#drop')[0].addEventListener('drop', e => {
	e.preventDefault();
	e.stopPropagation();

	readFile(e.dataTransfer.files[0]).then(file => {
	    $('#primg').attr('src', file);
	}, () => { $('#modal-file-error').addClass('active'); });
});

$('#drop').on('drag', e => {
	e.preventDefault();
	e.stopPropagation();
});

$('#drop').on('dragover', e => {
	e.preventDefault();
	e.stopPropagation();
});

$('.close-modal').click(e => {
	let el = e.target;
	while (!el.classList.contains('modal'))
		el = el.parentNode;
	$(el).removeClass('active');
});

var a, b;
if (localStorage['p1']) {
	b = new Puzzle('p1');
	b.load().then(() => {
		b.inject(el => {
			$(el).click(onPiece);
			$(el + ' img').draggable({
				helper: 'clone',
				appendTo: 'body'
			});
		}).onject(el => {
			$(el).droppable({
				drop: drop
			});
		});

		let hem = b.scaled;
			if (hem)
				acel = $(hem.el)[0];
	});

	a = new Game('first');
	a.load().inject();
} else {
	$('#modal-start').addClass('active');
}

$('#start').click(() => {
	let username = $('#name').val(),
		img = $('#primg').attr('src')
	if (username.length !== 0 && img.length !== 0) {
		b = new Puzzle('p1', img, 500, +$('#diff').val() + 2, '#pieces', '#target-pieces');
		b.init(true).then(() => {
			b.inject(el => {
				$(el).click(onPiece);
				$(el + ' img').draggable({
					helper: 'clone',
					appendTo: 'body'
				});
			}).onject(el => {
				$(el).droppable({
					drop: drop
				});
			}).save();
		});

		a = new Game('first', img, username, {
			main: '.main',
			tar: '#targets',
			time: '#time-dis',
			username: '#name-dis',
			toggle: '#toggle'
		});

		a.start().inject().save();
		$('#modal-start').removeClass('active');
	} else {
		$('#modal-input').addClass('active');
	}
});

$('#toggle').click(() => {
	a.toggle().inject().save();
});

window.addEventListener('keypress', e => {
	if (acel) {
		if (e.key == 'ArrowRight') {
			b.imgs[$(acel).data('id')].rotateRight().design();
			b.save();
		} else if (e.key == 'ArrowLeft') {
			b.imgs[$(acel).data('id')].rotateLeft().design();
			b.save();
		}
	}
})

function report(e) {
	console.log(e);
}