	dem.Field = (function  () {
		var cellSize, 
			mapSizeX,
			mapSizeY,
			ticks,
			lastPoint = {x:-1, y:-1},
			currentHoveredUnit,
			lastEvent = {x:-1, y:-1},
			drag,
			mouseTick,
			interactiveSprites = [],
			ghostUnit;


		var Field = function () {
			this.game = dem.game;
			cellSize = this.cellSize = 96;
			this.offsetX = 0; 
			this.offsetY = 0;
			this.mapWidth = 49;
			this.mapHeight = 49;
			this.tiles = [];
			this.units = [];
		}
		Field.prototype.drawFullrect =  function (ctx, x, y, w, h, fill, stroke, width, offsetX, offsetY){
			ctx.save();
			ctx.translate((x - offsetX + width), (y - offsetY + width));
			ctx.fillStyle = fill;
			ctx.strokeStyle = stroke;
			ctx.lineWidth = width;
			ctx.fillRect(0, 0, w-width*2, h-width*2);
			ctx.strokeRect(0, 0, w-width*2, h-width*2);
			ctx.restore();
		};	


		// Move to framework
		Field.prototype.getHoveredItem = function  (mx, my) {
			var item, i, offsetX = this.offsetX, offsetY = this.offsetY;
			for (i = interactiveSprites.length - 1; i >=0; i--) {
				item = interactiveSprites[i];
				if (item.hitTest(mx, my, offsetX, offsetY)) {
					return item;
				} 
			}
			return false;
		}

		Field.prototype.addInteractiveElem = function (elem) {
			if (_.isFunction(elem.hitTest)) {
				elem.parent = interactiveSprites;
				interactiveSprites.push(elem); 				
			}
		}

		Field.prototype.generateMap = function (mapWidth, mapHeight) {
			var i, j, landscape, random;
			this.mapHeight = mapHeight;
			this.mapWidth = mapWidth;
			for (i = 0; i < mapWidth; i++) {
				this.tiles[i] = [];
				for (j = 0; j < mapHeight; j++) {
					random = dem.random(90);
					landscape = null;
					if (random < 20) {
						landscape = dem.random(3, 6);
					} else if (j < 4) {
						landscape = dem.random(3);
					}
					this.tiles[i][j] = new dem.FieldTile (i, j, dem.random(4), landscape)
				}
			}
		};

		Field.prototype.generateUnits = function () {
			this.units = [];
			for (var i = 2; i < 10; i++) {
				for (var j = 3; j < 100; j++) {
					if (!this.tiles[i][j].type) {
						var unit = new dem.Windmill(i, j, 'neutral', this);
						this.units.push(unit);
						this.tiles[i][j].unit = unit;						
					}
				}
			}
		};

		Field.prototype.startMoveBuilding = function () {
			ghostUnit = new dem.Windmill(0, 0, "player", this);
			ghostUnit.sprite.alpha = 0.5;
			ghostUnit.sprite.stop();
		};

		Field.prototype.draw = function (ctx, width, height, zoom) {
			var i, j, offsetX = this.offsetX, offsetY = this.offsetY,
				maxRow = Math.min((((width + cellSize + offsetX) / cellSize ) / zoom) >> 0, this.mapWidth - 1),
				maxCol = Math.min((((height + cellSize + offsetY) / cellSize) / zoom) >> 0, this.mapHeight - 1),
				minRow = (offsetX / cellSize) >> 0,
				minCol = (offsetY / cellSize) >> 0;
			var objsCount = 0;
			for (i = minRow; i < maxRow; i++) {
				for (j = minCol; j < maxCol; j++) {
					this.tiles[i][j].draw(ctx, offsetX, offsetY);
				}
			}
			for (i = 0, len = this.units.length; i < len; i++) {
				var unit = this.units[i];
				if ((unit.mapX > (((offsetX) / cellSize) >> 0) - unit.sizeX) &&
					(unit.mapX < maxRow + cellSize)&&
				   ((unit.mapY > (((offsetY) / cellSize) >> 0) - unit.sizeY) &&
				   	(unit.mapY < maxCol + cellSize))) {

					// objsCount++;
					unit.draw(ctx, offsetX, offsetY);
				}
			}
			if (ghostUnit) {
				if (!ghostUnit.isPositionGoodForBuild(this.tiles[ghostUnit.mapX][ghostUnit.mapY])) {
					// objsCount++;
						this.drawFullrect(ctx, ghostUnit.mapX * cellSize, ghostUnit.mapY * cellSize, cellSize, cellSize, "rgba(255,0,0,0.4)", "rgba(255,0,0,0.8)", 4, offsetX, offsetY);					
				}
					// objsCount++;
				ghostUnit.draw(ctx, offsetX, offsetY);
			}
			for (i = 0, len = interactiveSprites.length; i < len; i++) {
				interactiveSprites[i].draw(ctx, offsetX, offsetY);
			}
			// console.log(minCol);
		};

		Field.prototype.move = function (x, y, width, height, zoom) {
			if (this.offsetX + ((lastEvent.x - x) / zoom) < 0) {
				this.offsetX = 0;
			} else if (this.offsetX + (lastEvent.x - x) / zoom > (this.mapWidth * cellSize - (width / zoom) - cellSize)) {
				this.offsetX = (this.mapWidth * cellSize - (width / zoom)) - cellSize;
			} else {
				this.offsetX += (lastEvent.x - x) / zoom;
			};
			if (this.offsetY + ((lastEvent.y - y) / zoom) < 0) {
				this.offsetY = 0;
			} else if (this.offsetY + ((lastEvent.y - y) / zoom) > (this.mapHeight * cellSize - (height / zoom)) - cellSize) {
				this.offsetY = (this.mapHeight * cellSize - (height / zoom)) - cellSize;
			} else {
				this.offsetY += (lastEvent.y - y) / zoom;
			};
		};
	
		Field.prototype.clearPrevPoint = function (mapX, mapY) {
			if ((lastPoint.x == -1) || (lastPoint.y == -1)) {
				lastPoint.x = mapX;
				lastPoint.y = mapY;
				return;
			} 
			if (currentHoveredUnit) {
				currentHoveredUnit.onmouseleave();				
				currentHoveredUnit = null;
			}
			lastPoint.x = mapX;
			lastPoint.y = mapY;
		}

	
		Field.prototype.onmousedown = function (e) {
				if (drag) {
					drag = false;
					mouseTick = Date.now();
					return;
				}
				drag = false;
				
				mouseTick = Date.now();
		}
		Field.prototype.onmouseup = function (e, zoom) {

			if (drag) {
				drag = false;
				mouseTick = Date.now() + 100000000;
				lastEvent = e;
				return;				
			}
			
			drag = false;
			mouseTick = Date.now() + 100000000;
			lastEvent = e;

			var item = this.getHoveredItem(e.x, e.y);
			if (item) {
				item.click();
				return;
			}


			mapX = (((e.x + this.offsetX * zoom) / cellSize) / zoom)>>0;
			mapY = (((e.y + this.offsetY * zoom) / cellSize) / zoom)>>0;

			if (ghostUnit && ghostUnit.isPositionGoodForBuild(this.tiles[mapX][mapY])) {
				ghostUnit.sprite.alpha = 1;
				this.tiles[mapX][mapY].unit = ghostUnit;
				this.units.push(ghostUnit);
				ghostUnit.sprite.start();
				ghostUnit = null;
				return;
			}

			if (this.tiles[mapX][mapY].unit) {
				currentHoveredUnit = this.tiles[mapX][mapY].unit;
				currentHoveredUnit.onclick();
			};			
		}
		Field.prototype.onmousemove = function (e, width, height, zoom) {
			if (this.getHoveredItem (e.x, e.y)) return;

			if (Date.now() - mouseTick > 175) {
				drag = true;
			};
			if (drag == true) {
				this.move(e.x, e.y, width, height, zoom);
				lastEvent = e;
				return;
			};
			lastEvent = e;


			mapX = (((e.x + this.offsetX * zoom) / cellSize) / zoom)>>0;
			mapY = (((e.y + this.offsetY * zoom) / cellSize) / zoom)>>0;

			if ((lastPoint.x != mapX) || (lastPoint.y != mapY)) {
				this.clearPrevPoint(mapX, mapY);
				if (ghostUnit) {
					ghostUnit.mapX = mapX;
					ghostUnit.mapY = mapY;
					return;
				}
				if (this.tiles[mapX][mapY].unit) {
					currentHoveredUnit = this.tiles[mapX][mapY].unit;
					currentHoveredUnit.onmouseenter();
				};
			};		
		}

		return Field;
	}());