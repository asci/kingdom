dem.MapUnit = (function () {
	var mapWidth, mapHeight;
	var MapUnit = function (sprite, mapX, mapY, sizeX, sizeY, cellSize, field) {
			this.mapX = mapX;
			this.mapY = mapY;
			this.sizeX = sizeX;
			this.sizeY = sizeY;
			this.sprite = sprite;
			this.cellSize = cellSize;
			this.selected = false;
			this.hovered = false;
			this.field = field;
			mapWidth = field.tiles.length;
			mapHeight = field.tiles[0].length;
			this.sprite.x = mapX * cellSize;
			this.sprite.y = mapY * cellSize;
		}
	MapUnit.prototype.draw = function (ctx, offsetX, offsetY) {
		this.sprite.drawAt(ctx, offsetX, offsetY, this.mapX * this.cellSize, this.mapY * this.cellSize)
	};
	MapUnit.prototype.checkMapLimits = function  (x, y) {
		return (((x >= 0) && (x < mapWidth)) && ((y >= 0) && (y < mapHeight)));
	}
	return MapUnit;
}());

dem.Building = (function () {
	var Building = function (sprite, mapX, mapY, sizeX, sizeY, cellSize, owner, type, field) {
			dem.MapUnit.apply(this, [sprite, mapX, mapY, sizeX, sizeY, cellSize, field]);
			this.owner = owner;
			this.type = type;
		}

	_.extend(Building.prototype, dem.MapUnit.prototype);
	Building.super = {};
	_.extend(Building.super, dem.MapUnit.prototype)

	Building.prototype.showPosition = function () {
		console.log("Building showPosition");
	}
	return Building;
}())

dem.Windmill = (function () {

	var Windmill = function (mapX, mapY, owner, field) {
			var windmill = new dem.AnimatedSprite(dem.storage.animations.windmill, 96, 96, 18);
			windmill.start();
			dem.Building.apply(this, [windmill, mapX, mapY, 1, 1, 96, owner, 'resource', field]);
			this.highlightedTiles = [];
			this.tooltip = {};
			this.tooltip = new dem.graphics.Rect(
				this.mapX * this.cellSize, 
				this.mapY * this.cellSize + 60,
				100,
				50,
				"rgba(177, 139, 128, 0.8)",
				"rgba(237, 45, 35, 0.8)",
				1
			);
		}

	_.extend(Windmill.prototype, dem.Building.prototype);
	Windmill.super = {};
	_.extend(Windmill.super, dem.Building.prototype)

	Windmill.prototype.showPosition = function () {
		console.log("Windmill showPosition");
	}

	Windmill.prototype.onclick = function () {
		this.selected = !this.selected;
		for (var i = 0; i < 5; i++) {
			this.field.addInteractiveElem(new dem.Gold(this.mapX * this.cellSize, this.mapY * this.cellSize)); 
			this.field.addInteractiveElem(new dem.Book(this.mapX * this.cellSize, this.mapY * this.cellSize)); 
		}	
	}
	Windmill.prototype.onmouseenter = function () {
		this.hovered = true;
		var tiles = this.field.tiles;
		for(var x = -2; x < 3; x++) {
			for(var y = -2; y < 3; y++) {
				if((this.mapX + x >= 0 && this.mapX + x < tiles.length) && (this.mapY + y >= 0 && this.mapY + y < tiles[0].length)) {
					if(!tiles[this.mapX + x][this.mapY + y].type) {
						tiles[this.mapX + x][this.mapY + y].highlighted = "rgba(255, 255, 128, 0.5)";
						this.highlightedTiles.push(tiles[this.mapX + x][this.mapY + y]);
					}
				}
			}
		}
		this.field.tiles[this.mapX][this.mapY].selected = true;
		this.field.addInteractiveElem(this.tooltip);
	}
	Windmill.prototype.onmouseleave = function () {
		this.hovered = false;
		this.field.tiles[this.mapX][this.mapY].selected = false;
		for (var i = 0; i < this.highlightedTiles.length; i++) {
			this.highlightedTiles[i].highlighted = false;
		};
		this.highlightedTiles = [];
		this.tooltip.parent.splice(this.tooltip.parent.indexOf(this.tooltip), 1);
	}
	Windmill.prototype.isPositionGoodForBuild = function (tile) {
		if (tile.unit || tile.type) {
			return false;
		}
		return true;
	}
	return Windmill;
}())


dem.Character = (function () {
	var sprites = {
		idle: 1,
		movingLeft: 2,
		movingRight: 3,
		movingUp: 4,
		movingDown: 5,
		attackLeft: 6,
		attackRight: 7,
		attackUp: 8,
		attackDown: 9,
		damaged: 10,
		death: 11
	}
	var Character = function (sprites, mapX, mapY, sizeX, sizeY, cellSize, owner, type, field) {
			dem.MapUnit.apply(this, [sprites.idle, mapX, mapY, 1, 1, cellSize, field]);
			this.owner = owner;
			this.type = type;
			this.moviableCells = [];
			this.currentPath = [];
			this.currentStep = null;
			this.moveRange = 5;
		}

	_.extend(Character.prototype, dem.MapUnit.prototype);
	Character.super = {};
	_.extend(Character.super, dem.MapUnit.prototype)

	Character.prototype.showPosition = function () {
		console.log("Character showPosition");
	}
	Character.prototype.clearMoviableCells = function () {
		for (var i = 0; i < this.moviableCells.length; i++) {
			this.moviableCells[i].highlighted = false;
		};
	}
	Character.prototype.drawMoviableCells = function () {
		//TODO вычислять хеш массива клеток хождения. если изменений не было, то рисуем старые клетки
		//Отмечаем в поле тайлы, на которые может походить персонаж
		for (var i = 0; i < this.moviableCells.length; i++) {
			this.moviableCells[i].highlighted = "rgba(255, 255, 255, 0.5)";
		};
	}
	Character.prototype.calculateMoviableCells = function () {
		var i, j, moveRange = this.moveRange, 
		mapWidth = this.field.tiles.length,
		mapHeight = this.field.tiles[0].length,
		targetMapY, targetMapX, tempPath;

		for(i = -moveRange; i <= moveRange; i++) {
			for(j = 0; j <= (moveRange * 2) - Math.abs(i * 2); j++) {
				targetMapY = currentMapY + j - (moveRange - Math.abs(i));
				targetMapX = currentMapX + i;
				if (this.checkMapLimits(targetMapX, targetMapY)) {
					tempPath = new a_star([currentMapX, currentMapY], [targetMapX, targetMapY], mapWidth, mapHeight, walkable);
					tempPath.shift(1);
					if((tempPath.length <= moveRange) && (tempPath.length > 0) && (walkable[targetMapX][targetMapY] != 1)) {
						this.moviableCells.push(this.field.tiles[targetMapX][targetMapY]);
					};
				};
			};
		};
	};
	return Character;
}())