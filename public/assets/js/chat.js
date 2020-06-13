const socket = io();

const startEl = document.querySelector('#start');
const chatWrapperEl = document.querySelector('#chat-wrapper');
const usernameForm = document.querySelector('#username-form');
const messageForm = document.querySelector('#message-form');
const gameBoard = document.querySelector('#gameboard');

const img = document.createElement('img');

function remover (mssg) {
	gameBoard.addEventListener('click', e => { 

		console.log(e.target);

		if(e.target !== mssg) {
			console.log("Click on a VIRUS!")
		}else {
			e.target.remove();
			clickedTime=Date.now();
			reactionTime=(clickedTime-createdTime)/1000;
			const endTime = roundToOne(reactionTime);
			document.getElementById("printReactionTime").innerHTML="Your Reaction Time is: " + endTime + "seconds";
			console.log(reactionTime);			

			setTimeout(function() {
				addvirus();
				createdTime=Date.now();
			}, Math.floor(Math.random(5000)*1000));
		}
	});
}

function getRandomPosition(element) {
	var x = document.querySelector("#gameboard").offsetHeight-element.clientHeight;
	var y = document.querySelector("#gameboard").offsetWidth-element.clientWidth;
	var randomX = Math.floor(Math.random()*x);
	var randomY = Math.floor(Math.random()*y);
	return [randomX,randomY];
}
function addvirus(){ 
	var img = document.createElement('img');
	img.setAttribute("style", "position:absolute;");
	img.setAttribute("src", "../assets/images/virus.png");
	img.setAttribute("id", "bilden");
	document.querySelector("#gameboard").appendChild(img);
	var xy = getRandomPosition(img);
	img.style.top = xy[0] + 'px';
	img.style.left = xy[1] + 'px';
	remover(img);
};
function roundToOne(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
var clickedTime; var createdTime; var reactionTime; 

function startGame (){
	//document.querySelector('#wait').innerHTML = '';
	gameImg = document.querySelector("img")
	setTimeout(function() {
		addvirus();
		createdTime=Date.now();
	}, Math.floor(Math.random(5000)*1000));			
};

let username = null;

const addMessageToChat = (msg, ownMsg = false) => {
	const msgEl = document.createElement('img');
	startGame(msgEl);

	msgEl.classList.add(ownMsg ? 'list-group-item-primary' : 'list-group-item-secondary');

	const username = ownMsg ? 'You' : msg.username;
	msgEl.innerHTML = msg.content;

	document.querySelector('#gameboard').appendChild(msgEl);
}

const updateOnlineUsers = (users) => {
	document.querySelector('#online-users').innerHTML = users.map(user => `<li class="user">${user}</li>`).join("");
}

// get username from form and emit `register-user`-event to server
usernameForm.addEventListener('submit', e => {
	e.preventDefault();

	username = document.querySelector('#username').value;
	socket.emit('register-user', username, (status) => {
		console.log("Server acknowledged the registration :D", status);

		if (status.joinChat) {
			startEl.classList.add('hide');
			chatWrapperEl.classList.remove('hide');

			updateOnlineUsers(status.onlineUsers);
		}
	});

});

messageForm.addEventListener('submit', e => {
	e.preventDefault();

	const messageEl = document.querySelector('#gameboard');
	console.log("detta är gameboard", messageEl);
	const msg = {
		content: messageEl.value,
	}

	socket.emit('chatmsg', msg);
	startGame(msg, true);



	messageEl.value = '';
});

socket.on('reconnect', () => {
	if (username) {
		socket.emit('register-user', username, () => {
			console.log("The server acknowledged our reconnect.");
		});
	}
});

socket.on('online-users', (users) => {
	updateOnlineUsers(users);
});

// socket.on('new-user-connected', (username) => {
// 	addNoticeToChat(`${username} connected to the chat 🥳!`);
// });

// socket.on('user-disconnected', (username) => {
// 	addNoticeToChat(`${username} left the chat 😢...`);
// });

socket.on('chatmsg', (msg) => {
	addMessageToChat(msg);
});
