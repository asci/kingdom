(function  () {
	dem.FieldDrop = (function  () {
		var dem = window.dem;

		var FieldDrop = function (x, y, image, mask) {
			dem.InteractiveSprite.apply(this, [image, 96, 96, mask]);
			this.x = x;
			this.y = y;
			var me = this;
			TweenLite.to(me, .7, {x: this.x + Math.round((Math.random() * 150) - 75)});
			TweenLite.to(me, .5, {y:this.y + Math.round((Math.random() * 50)), ease: Bounce.easeOut, onUpdate: function () {
				me.x = me.x >> 0;
				me.y = me.y >> 0;
			}});
			this.timer = setTimeout(function () {
				me.onmouseover();
			}, 1500);
		}
		_.extend(FieldDrop.prototype, dem.InteractiveSprite.prototype);
		FieldDrop.super = {};
		_.extend(FieldDrop.super, dem.InteractiveSprite.prototype);

		FieldDrop.prototype.onmouseover = function() {
			clearTimeout(this.timer);
			var me = this;
			TweenLite.to(me, 1, {x: (700 / dem.game.zoom + dem.game.field.offsetX), y: (0 / dem.game.zoom + dem.game.field.offsetY), alpha: 0.0, onComplete: function () {
				me.parent.splice(me.parent.indexOf(me), 1);
			}, onUpdate: function () {
				me.x = me.x >> 0;
				me.y = me.y >> 0;
			}});
		};
		return FieldDrop;
	}());

	dem.Gold = (function  () {
		var mask = {},
		gold = new Image();
		gold.src = "images/sprites/gold.png";

		var Gold = function (x, y) {
			dem.FieldDrop.apply(this, [x, y, gold, mask]);
		}
		_.extend(Gold.prototype, dem.FieldDrop.prototype);
		Gold.super = {};
		_.extend(Gold.super, dem.FieldDrop.prototype);

		Gold.prototype.onmouseover = function() {
			console.log('Gold added');
			Gold.super.onmouseover.apply(this, []);
		};

		return Gold;
	}());

	dem.Book = (function  () {
		var mask = {},
		book = new Image();
		book.src = "images/sprites/book.png";

		var Book = function (x, y) {
			dem.FieldDrop.apply(this, [x, y, book, mask]);
		}
		_.extend(Book.prototype, dem.FieldDrop.prototype);
		Book.super = {};
		_.extend(Book.super, dem.FieldDrop.prototype);

		Book.prototype.onmouseover = function() {
			console.log('Exp added');
			Book.super.onmouseover.apply(this, []);
		};
		return Book;
	}());

}());
