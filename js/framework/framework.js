//asci@yandex.ru
//base framework for kingdom game
(function () {
	window.dem = {};
	window.app = {};

	if(!window.requestAnimationFrame) {
		window.requestAnimationFrame = (function () {
			return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function (callback, element) {
				window.setTimeout(callback, 1000 / 60);
			};
		})();
	}
	dem.random = function () {
		if (!arguments.length) {
			return Math.random();
		} else if (arguments.length == 1) {
			return Math.floor(Math.random() * arguments[0]);
		} else {
			return Math.floor((Math.random() * (arguments[1] - arguments[0])) + arguments[0]);			
		}
	};
	dem.mixIn = function (obj, mod) {
		for(var prop in mod) {
			obj[prop] = mod[prop]
		};
	}
	dem.graphics = {};
	dem.graphics.Rect = (function () {
		var Rect = function (x, y, width, height, fillColor, strokeColor, strokeWidth) {
			this.x = x;
			this.y = y;
			this.canv = document.createElement("canvas");
			this.canv.width = width;
			this.canv.height = height;
			this.ctx = this.canv.getContext('2d');
			this.ctx.fillStyle = fillColor;
			this.ctx.strokeStyle = strokeColor;
			this.ctx.lineWidth = strokeWidth;
			this.ctx.fillRect(0, 0, width, width);
			this.ctx.strokeRect(0, 0, width, width);
		};
		Rect.prototype.hitTest = function () {
			return false;
		};
		Rect.prototype.draw = function (ctx, offsetX, offsetY) {
			ctx.save();
			ctx.translate(this.x - offsetX, this.y - offsetY);
			ctx.drawImage(this.canv, 0, 0)
			ctx.restore();
		};
		return Rect;
	}());

	dem.Sprite = (function () {
		var Sprite = function (image, sx, sy, width, height, alpha) {
				this.image = image;
				this.width = width;
				this.height = height;
				this.sx = sx;
				this.sy = sy;
				this.alpha = alpha || 1.0;
			};
		Sprite.prototype.draw = function (ctx, offsetX, offsetY) {
			ctx.globalAlpha = this.alpha;
			ctx.save();
			ctx.translate(this.x - offsetX, this.y - offsetY);
			ctx.drawImage(this.image, this.sx, this.sy, this.width, this.height, 0, 0, this.width, this.height)
			ctx.restore();
			ctx.globalAlpha = 1.0;
		};
		// Для экономии памяти. Например, при отрисовке тайлов
		Sprite.prototype.drawAt = function (ctx, offsetX, offsetY, x, y) {
			ctx.globalAlpha = this.alpha;
			ctx.save();
			ctx.translate(x - offsetX, y - offsetY);
			ctx.drawImage(this.image, this.sx, this.sy, this.width, this.height, 0, 0, this.width, this.height)
			ctx.restore();
			ctx.globalAlpha = 1.0;
		};
		return Sprite;
	}());
	
	dem.InteractiveSprite = (function () {
		var createMask = function (mask, image, width, height) {
				mask.image = image;
				mask.canv = document.createElement("canvas");
				mask.canv.width = image.width;
				mask.canv.height = image.height;
				mask.ctx = mask.canv.getContext('2d');
				mask.ctx.drawImage(image, 0, 0, width, height);
			}
		window.timetocheck = 0;

		var InteractiveSprite = function (image, width, height, mask) {
				if(!mask) throw new Error('Mask must be exist!');
				createMask(mask, image, width, height);
				this.image = image;
				this.mask = mask;
				this.hovered = false;
				this.alpha = 1.0;
				this.width = this.image.width;
				this.height = this.image.height;
			};

		InteractiveSprite.prototype.onmouseover = function () {
			this.hovered = true;
		};
		InteractiveSprite.prototype.onmouseout = function () {
			this.hovered = false;
		};
		InteractiveSprite.prototype.onmousedown = function () {
			this.mousedowned = true;
		};
		InteractiveSprite.prototype.hitTest = function (mx, my, offsetX, offsetY) {
			var clr, start = Date.now(), zoom = dem.game.zoom;
			if (!(this.x - offsetX < mx / zoom) || !(this.y - offsetY < my / zoom) || !(this.x - offsetX + this.image.width > mx / zoom) || !(this.y - offsetY + this.image.width > my / zoom)) {
				if(this.hovered) this.onmouseout(zoom, offsetX, offsetY);
				return false;
			}
			clr = this.mask.ctx.getImageData((mx / zoom + offsetX - this.x), (my / zoom + offsetY - this.y), 1, 1).data;				
			if(clr[3] > 250) {
				this.onmouseover(zoom, offsetX, offsetY);
				return true;
			} else {
				if(this.hovered) this.onmouseout(zoom, offsetX, offsetY);
				return false;
			}
		}

		InteractiveSprite.prototype.draw = function (ctx, offsetX, offsetY) {
			if (this.x - offsetX < -this.width || this.y - offsetY < -this.height) return;
			ctx.globalAlpha = this.alpha;
			ctx.save();
			ctx.translate(this.x - offsetX, this.y - offsetY);
			ctx.drawImage(this.image, 0, 0, this.width, this.width);
			ctx.restore();
			ctx.globalAlpha = 1.0;
		}

		return InteractiveSprite;
	}())

	dem.AnimatedSprite = (function () {
		var animations = [];

		var animLoop = function () {
				for(var i = animations.length - 1; i >= 0; i--) {
					animations[i]();
				};
			}

		var AnimatedSprite = function (image, width, height, framesCount) {
				dem.Sprite.apply(this, [image, 0, 0, width, height, 1]);
				this.framesCount = framesCount;
				this.i = Math.round(Math.random() * framesCount - 1);
				var self = this;
				this.animFunc = function () {
					self.animate();
				};
				this.x = 0;
				this.y = 0;
			}

		_.extend(AnimatedSprite.prototype, dem.Sprite.prototype);
		AnimatedSprite.super = {};
		_.extend(AnimatedSprite.super, dem.Sprite.prototype)

		AnimatedSprite.prototype.stop = function () {
			animations.splice(animations.indexOf(this.animFunc), 1);
		};
		AnimatedSprite.prototype.start = function () {
			animations.push(this.animFunc);
		};
		AnimatedSprite.prototype.animate = function () {
			if(this.i < this.framesCount - 1) {
				this.i += 1;
			} else {
				this.i = 0;
			}
			this.sx = this.width * this.i;
		};
		var interval = setInterval(animLoop, 50);
		return AnimatedSprite;
	}())
	dem.Timer = (function () {
		var Timer = function (interval, count, onInterval, onFinish) {
				var self = this;
				this.count = 0;
				this.interval = interval;
				this.max_count = count;
				this.onInterval = onInterval;
				this.onFinish = onFinish;
				this.count_timer = setInterval(function () {
					if(self.count < self.max_count) {
						self.count++;
						self.onInterval(self);
					} else {
						self.onFinish();
						clearInterval(self.count_timer);
					}
				}, this.interval);
			}
		return Timer;
	});
}())
