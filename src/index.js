import BattleState from 'states/BattleState';
import GameOverState from 'states/GameOverState';

class Game extends Phaser.Game {

	constructor() {
		super(720, 1280, Phaser.AUTO, 'content', null);
		this.state.add('BattleState', BattleState, false);
		this.state.add('GameOverState', GameOverState, false);
		this.state.start('BattleState');
	}

}

window.Game = new Game();
