(function () {


	dem.GroundTileSprite = (function  () {
		var GroundTile = function  (row, col) {
			dem.Sprite.apply(this, [dem.storage.images.tilemap, col * 96, row * 96, 96, 96, 1]);
		}

		_.extend(GroundTile.prototype, dem.Sprite.prototype);
		GroundTile.super = {};
		_.extend(GroundTile.super, dem.Sprite.prototype)

		GroundTile.prototype.draw = function() {
			GroundTile.super.draw.apply(this, arguments);
		};
		return GroundTile;
	}());
	dem.ForestTileSprite = (function  () {
		var ForestTileSprite = function  (row, col) {
			dem.Sprite.apply(this, [dem.storage.images.tilemap, col * 96, row * 96, 96, 96, 1]);
		}

		_.extend(ForestTileSprite.prototype, dem.Sprite.prototype);
		ForestTileSprite.super = {};
		_.extend(ForestTileSprite.super, dem.Sprite.prototype)

		ForestTileSprite.prototype.draw = function() {
			ForestTileSprite.super.draw.apply(this, arguments);
		};
		return ForestTileSprite;
	}());
	dem.MountTileSprite = (function  () {
		var MountTileSprite = function  (row, col) {
			dem.Sprite.apply(this, [dem.storage.images.tilemap, col * 96, row * 96, 96, 96, 1]);
			this.height = 106;
			this.sy -= 10;
		}
		_.extend(MountTileSprite.prototype, dem.Sprite.prototype);
		MountTileSprite.super = {};
		_.extend(MountTileSprite.super, dem.Sprite.prototype)
		MountTileSprite.prototype.draw = function(ctx, offsetX, offsetY) {
			MountTileSprite.super.draw.apply(this, [ctx, offsetX, offsetY + 10]);
		};
		return MountTileSprite;
	}());

		dem.FieldTile = (function  () {

		var landSprites = [
			new dem.GroundTileSprite(1, 0),
			new dem.GroundTileSprite(1, 1),
			new dem.GroundTileSprite(1, 2),
			new dem.GroundTileSprite(1, 3)
		];
		
		var typeSprites = [
			new dem.MountTileSprite(4, 2),
			new dem.MountTileSprite(4, 3),
			new dem.MountTileSprite(4, 4),
			new dem.ForestTileSprite(2, 0),
			new dem.ForestTileSprite(2, 1),
			new dem.ForestTileSprite(2, 2),
			new dem.ForestTileSprite(2, 3)
		];
		var FieldTile = function (mapX, mapY, land, type) {
			this.x = dem.game.field.cellSize * mapX;
			this.y = dem.game.field.cellSize * mapY;
			this.mapX = mapX;
			this.mapY = mapY;
			this.land = landSprites[land];
			this.selected = false;
			this.highlighted = false;
			if (type) {
				this.type = typeSprites[type];
			}
		}
		FieldTile.prototype.draw = function (ctx, offsetX, offsetY) {
			this.land.x = this.x;
			this.land.y = this.y;
			this.land.drawAt(ctx, offsetX, offsetY, this.x, this.y);
			if (this.type) {
				this.type.x = this.x;
				this.type.y = this.y;
				this.type.drawAt(ctx, offsetX, offsetY, this.x, this.y);
			}
			if (this.selected || this.highlighted) {
				dem.game.field.drawFullrect(ctx, this.x, this.y, dem.game.field.cellSize, dem.game.field.cellSize, "rgba(255,255,255,0.4)", "rgba(255,255,255,0.8)", 4, offsetX, offsetY);
			}

		}
		return FieldTile;
	}())

}())
