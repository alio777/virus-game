/**
 * Socket Controller
 */

const debug = require('debug')('covidGame:socket_controller');

let io = null;
const users = {}; 
let games = 0  // spel börjar med 0 rundor


// Get nicknames of online users
function getPlayersOnline() {
	return Object.values(users);
}
// Get random position
function randomPosition (range) {
	return Math.floor(Math.random() * range)
};

function checkPlayersOnline() {
    if (Object.keys(users).length === 2) {
        io.emit('create-game-page');
    } else {
        return;
    }
}

function handlePlayerRegistration(nickname, callback) {
	users[this.id] = nickname;
	callback({
		joinGame: true,
		nicknameInUse: false,
		onlinePlayers: getPlayersOnline(),
	});
	checkPlayersOnline();
	this.broadcast.emit('players-online', getPlayersOnline());
}

function handlePlayerClick(data) {
	games ++;
	const datainfo = {
		nickname: data.name,
		score: data.score,
		reaction: data.reaction,
		games: games,
	}
	const clickVirusPosition = {
		width: randomPosition(300),
		height: randomPosition(500)
	}
		io.emit('new-round', clickVirusPosition, datainfo);
}

module.exports = function(socket) {
	io = this;
	debug(`Client ${socket.id} connected!`);

	socket.on('player-click', handlePlayerClick);
	socket.on('register-player', handlePlayerRegistration);
	socket.on('create-game-page', checkPlayersOnline);
}