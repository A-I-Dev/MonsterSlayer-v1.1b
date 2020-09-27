function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

const game = Vue.createApp({
	data() {
		return {
			monsterHealth: 100,
			playerHealth: 100,
			actionsArr: [],
			turnsBeforeCanUseHeal: 2,
			turnsBeforeCanUseSpAttack: 3,
			turns: 0,
			winner: null,
		};
	},
	watch: {
		monsterHealth(value) {
			if (value <= 0 && this.playerHealth <= 0) {
				this.playerHealth = 0;
				this.monsterHealth = 0;
				this.winner = 'draw';
			} else if (value <= 0) {
				this.monsterHealth = 0;
				this.winner = 'player';
			}
		},
		playerHealth(value) {
			if (value <= 0 && this.monsterHealth <= 0) {
				this.playerHealth = 0;
				this.monsterHealth = 0;
				this.winner = 'draw';
			} else if (value <= 0) {
				this.playerHealth = 0;
				this.winner = 'monster';
			}
		},
	},
	computed: {
		monsterHealthPercentage() {
			return { width: this.monsterHealth + '%' };
		},
		playerHealthPercentage() {
			return { width: this.playerHealth + '%' };
		},
		canUseSpAttack() {
			return this.turnsBeforeCanUseSpAttack > 0;
		},
		canUseHeal() {
			return this.turnsBeforeCanUseHeal > 0 && this.playerHealth <= 100;
		},
	},
	methods: {
		startGame() {
			this.monsterHealth = 100;
			this.playerHealth = 100;
			this.actionsArr = [];
			this.turnsBeforeCanUseHeal = 2;
			this.turnsBeforeCanUseSpAttack = 3;
			this.turns = 0;
			this.winner = null;
		},
		playerAttack() {
			const damage = randomNumber(5, 12);
			this.monsterHealth -= damage;
			this.logActions('You', 'attacked', damage);
			this.monsterAttack();
			this.turnsBeforeCanUseHeal--;
			this.turnsBeforeCanUseSpAttack--;
			this.turns++;
		},
		playerSpAttack() {
			const damage = randomNumber(10, 25);
			this.monsterHealth -= damage;
			this.logActions('You', 'attacked with magic', damage);
			this.monsterAttack();
			this.turnsBeforeCanUseSpAttack = 3;
			this.turnsBeforeCanUseHeal--;
			this.turns++;
		},
		playerHeal() {
			const heal = randomNumber(10, 20);
			if (this.playerHealth + heal > 100) {
				this.playerHealth = 100;
			} else {
				this.playerHealth += heal;
			}
			this.logActions('You', 'healed', heal);
			this.monsterAttack();
			this.turnsBeforeCanUseHeal = 2;
			this.turns++;
		},
		monsterAttack() {
			const damage = randomNumber(8, 15);
			this.playerHealth -= damage;
			this.logActions('Monster', 'attacked', damage);
		},
		playerSurrender() {
			this.winner = 'monster';
		},
		logActions(who, what, amount) {
			this.actionsArr.unshift({ who, what, amount });
		},
	},
});

game.mount('#game');
