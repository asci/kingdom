(function () {
	dem.storage = dem.storage || {};
	dem.storage.animations = {};
	dem.storage.images = {};

	dem.storage.animations.windmill  = new Image();
	dem.storage.animations.windmill.src = "images/sprites/windmill.png";
	dem.storage.images.tilemap = new Image();
	dem.storage.images.tilemap.src = "images/tiles/tiles.png";

	dem.storage.buildingsInfo = {
		"humanHouse": {
			"max_hp": 500,
			"sight": 5,
			"baseImage": "humanHouse",
			"type": "house",
			"title": "Human house",
			"size_x": 1,
			"size_y": 1,
			"race": "human",
			"populationBonus": 100,
			"price": 1000,
			"resellPrice": 200
		},
		"elvenHouse": {
			"max_hp": 500,
			"sight": 5,
			"baseImage": "elvenHouse",
			"type": "house",
			"title": "Elven house",
			"size_x": 1,
			"size_y": 1,
			"race": "elf",
			"populationBonus": 100,
			"price": 1250,
			"resellPrice": 250
		},
		"windmill": {
			"max_hp": 500,
			"sight": 5,
			"baseImage": "windmill",
			"type": "resource",
			"title": "Windmill",
			"size_x": 1,
			"size_y": 1,
			"race": "human",
			"goldBonus": 100,
			"collectTime": 10,
			"price": 1250,
			"resellPrice": 250
		},
		"barracks": {
			"max_hp": 1000,
			"sight": 3,
			"baseImage": "barracks",
			"type": "military",
			"title": "Fencer barracks",
			"size_x": 2,
			"size_y": 2,
			"race": "human",
			"trainUnit": "fencer",
			"price": 2000,
			"resellPrice": 250
		},
		"altar": {
			"max_hp": 500,
			"sight": 3,
			"baseImage": "altar",
			"type": "house",
			"title": "Fencer altar",
			"size_x": 1,
			"size_y": 1,
			"race": "human",
			"price": 2000,
			"resellPrice": 250
		}
	}
	dem.storage.userBuildings = [
		// {"hp": 500, "map_x": 1, "map_y": 1, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 2, "map_y": 1, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 3, "map_y": 1, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 4, "map_y": 1, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 5, "map_y": 1, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 6, "map_y": 1, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 7, "map_y": 1, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 8, "map_y": 1, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 9, "map_y": 1, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 1, "map_y": 2, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 2, "map_y": 2, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 3, "map_y": 2, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 4, "map_y": 2, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 5, "map_y": 2, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 6, "map_y": 2, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 7, "map_y": 2, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 8, "map_y": 2, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 9, "map_y": 2, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 1, "map_y": 3, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 2, "map_y": 3, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 3, "map_y": 3, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 4, "map_y": 3, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 5, "map_y": 3, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 6, "map_y": 3, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 7, "map_y": 3, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 8, "map_y": 3, "owner": "neutral", "infoName": "windmill"},
		// {"hp": 500, "map_x": 9, "map_y": 3, "owner": "neutral", "infoName": "windmill"}
	]


	dem.storage.charactersInfo = {
		"fencer": {
			"max_hp": 110,
			"move_range": 3,
			"attack_range": 1,
			"attack_power": 10,
			"sight": 5,
			"baseImage": "fencer"
		},
		"grunt": {
			"max_hp": 100,
			"move_range": 3,
			"attack_range": 1,
			"attack_power": 10,
			"sight": 5,
			"baseImage": "grunt"
		},
		"skeleton": {
			"max_hp": 60,
			"move_range": 3,
			"attack_range": 1,
			"attack_power": 10,
			"sight": 5,
			"baseImage": "skeleton"
		}
	};
	dem.storage.userCharacters = [
	// {
	// 	"id": 0,
	// 	"hp": 100,
	// 	"map_x": 1,
	// 	"map_y": 2,
	// 	"infoName": "fencer",
	// 	"owner": "player"
	// }, {
	// 	"id": 1,
	// 	"hp": 90,
	// 	"map_x": 4,
	// 	"map_y": 4,
	// 	"infoName": "grunt",
	// 	"owner": "enemy"
	// }, {
	// 	"id": 2,
	// 	"hp": 60,
	// 	"map_x": 5,
	// 	"map_y": 3,
	// 	"infoName": "skeleton",
	// 	"owner": "enemy"
	// }, {
	// 	"id": 0,
	// 	"hp": 100,
	// 	"map_x": 1,
	// 	"map_y": 3,
	// 	"infoName": "fencer",
	// 	"owner": "player"
	// }, {
	// 	"id": 1,
	// 	"hp": 90,
	// 	"map_x": 3,
	// 	"map_y": 4,
	// 	"infoName": "grunt",
	// 	"owner": "enemy"
	// }, {
	// 	"id": 2,
	// 	"hp": 60,
	// 	"map_x": 6,
	// 	"map_y": 4,
	// 	"infoName": "skeleton",
	// 	"owner": "enemy"
	// }
	];
}());