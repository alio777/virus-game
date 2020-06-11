const socket = io();

const startEl = document.querySelector('#start');
const chatWrapperEl = document.querySelector('#chat-wrapper');
const usernameForm = document.querySelector('#username-form');
const messageForm = document.querySelector('#message-form');
const gameBoard = document.querySelector('#gameboard');

const img = document.createElement('img');

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
	document.querySelector("#gameboard").appendChild(img);
	var xy = getRandomPosition(img);
	img.style.top = xy[0] + 'px';
	img.style.left = xy[1] + 'px';
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

const updateOnlineUsers = (users) => {
	document.querySelector('#online-users').innerHTML = users.map(user => `<li class="user">${user}</li>`).join("");
}

	



// get username from form and emit `register-user`-event to server
usernameForm.addEventListener('submit', e => {
	e.preventDefault();

	socket.emit('screen'); 

	waiting = document.querySelector('#wait');

	username = document.querySelector('#username').value;
	socket.emit('register-user', username, (status) => {
		console.log("Server acknowledged the registration :D", status);

		if(status.onlineUsers.length === 2){
			startGame();
			socket.on('screen', function() {
				startGame();
			});

		}else{
			waiting.innerHTML = `<h2>Waiting for another player to connect...</h2>`
		}

		if (status.joinChat) {
			startEl.classList.add('hide');
			chatWrapperEl.classList.remove('hide');

			updateOnlineUsers(status.onlineUsers);
		}
	});
});



socket.on('reconnect', () => {
	if(username){
		socket.emit('register-user', username, () => {
			console.log("Server aknowledge our reconnet!")
		});
	}
});

socket.on('online-users', (users) => {
	updateOnlineUsers(users);
});

gameBoard.addEventListener('click', e => { 

	gameImg = document.querySelector("img")
	console.log(e.target);

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
});




// const addMessageToChat = (msg, ownMsg = false) => {
// 	const msgEl = document.createElement('li');
// 	msgEl.classList.add('list-group-item', 'message');
// 	msgEl.classList.add(ownMsg ? 'list-group-item-primary' : 'list-group-item-secondary');

// 	const username = ownMsg ? 'You' : msg.username;
// 	msgEl.innerHTML = `<span class="user">${username}</span>: ${msg.content}`;

// 	document.querySelector('#messages').appendChild(msgEl);
// }

// messageForm.addEventListener('submit', e => {
// 	e.preventDefault();

// 	const messageEl = document.querySelector('#message');
// 	const msg = {
// 		content: messageEl.value,
// 		username: document.querySelector('#username').value,
// 	}

// 	socket.emit('chatmsg', msg);
// 	addMessageToChat(msg, true);

// 	messageEl.value = '';
// });


// 	socket.on('chatmsg', (msg) => {
// 		addMessageToChat(msg);
// 	});





// socket.on('new-user-connected', (username) => {
// 	addNoticeToChat(`${username} connected to the chat 🥳!`);
// });

// socket.on('user-disconnected', (username) => {
// 	addNoticeToChat(`${username} left the chat 😢...`);
// });
