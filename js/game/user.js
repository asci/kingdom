(function  () {
	var User = function (name, sex) {
		var self = this;
		//General
		this.name = name;
		this.sex = sex;
		this.friends = [];
		//System
		this.max_energy = 100;
		this.energy_bonus = 0;
		this.energy_timer_count = 0;
		this.energy_timer = new dem.Timer(1000, 10, function (timer) {
			self.update_energy_timer(timer);
		},  function () {
			self.update_energy();
		});
		this.update_energy_timer = function (timer) {
			this.energy_timer_count = timer.count;
		};
		this.update_energy = function () {
			//TODO Запрос к серверу
			this.energy++;
			if (this.energy < this.max_energy) {
				this.energy_timer = new dem.Timer(1000, 10, function (timer) {
					self.update_energy_timer(timer);
				},  function () {
					self.update_energy();
				});
			}
		};
		this.consume_energy = function (x, y) {
		  if (this.energy > 0) {
		  	this.energy--;
		  	if (this.energy == this.max_energy - 1) {
				this.energy_timer = new dem.Timer(1000, 10, function (timer) {
					self.update_energy_timer(timer);
				},  function () {
					self.update_energy();
				});
		  	}  
		  	return true;
		  } else {
		  	$("#buyEnery").show();
		  	modal = true;
		  	return false;
		  }
		};
		//Resources:
		this.gold = 1000;
		this.energy = 100;
		this.mandrake_root = 1;
		this.bay_leaf = 1;
		this.medal = 1;
		this.exp = 0;
		//Populations
		this.elf_population = 0;
		this.human_population = 100;
		this.dwarf_population = 0;
	}
	dem.user = new User('asci', 'male');
})