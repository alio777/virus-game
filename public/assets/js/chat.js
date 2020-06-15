const socket = io();

const startEl = document.querySelector('#start');
const chatWrapperEl = document.querySelector('#chat-wrapper');
const usernameForm = document.querySelector('#username-form');
const messageForm = document.querySelector('#message-form');
const gameBoard = document.querySelector('#gameboard');

const img = document.createElement('img');

var clickedTime; 
var createdTime; 
var reactionTime; 

let username = null;


	// gameBoard.addEventListener('click', e => { 

	// 	console.log(e.target);

	// 	if(e.target !== img) {
	// 		console.log("Click on a VIRUS!")
	// 	}else {
	// 		e.target.remove();
	// 		clickedTime=Date.now();
	// 		reactionTime=(clickedTime-createdTime)/1000;
	// 		const endTime = roundToOne(reactionTime);
	// 		document.getElementById("printReactionTime").innerHTML="Your Reaction Time is: " + endTime + "seconds";
	// 		console.log(reactionTime);			

	// 		setTimeout(function() {
	// 			addvirus();
	// 			createdTime=Date.now();
	// 		}, Math.floor(Math.random(5000)*1000));
	// 	}
	// });


function getRandomPosition(element) {
	var randomX = Math.floor(Math.random()*400 + 50);
	var randomY = Math.floor(Math.random()*480);
	return [randomX,randomY];
}
// function addvirus(){ 
	
// 	var img = document.createElement('img');
// 	img.setAttribute("style", "position:absolute;");
// 	img.setAttribute("src", "../assets/images/virus.png");
// 	img.setAttribute("id", "bilden");
// 	document.querySelector("#gameboard").appendChild(img);
// 	var xy = getRandomPosition(img);
// 	img.style.top = xy[0] + 'px';
// 	img.style.left = xy[1] + 'px';
// 	remover(img);
	
// };
function roundToOne(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

// function startGame (){
// 	//document.querySelector('#wait').innerHTML = '';
// 	gameImg = document.querySelector("img")
// 	setTimeout(function() {
// 		addvirus();
// 		createdTime=Date.now();
// 	}, Math.floor(Math.random(5000)*1000));			
// };

const updateOnlineUsers = (users) => {
	document.querySelector('#online-users').innerHTML = users.map(user => `<li class="user">${user}</li>`).join("");
}
const updateMessage = (message) => {
	document.querySelector('#gameBoard').innerHTML = `<div class="message">${message}</div>`;
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

// const arr = [10, 200, 300, 45, 577, 6, 7, 8, 9 ,10];

const addMessageToChat = (msg, ranPos) => {
	var img = document.createElement('img');
	img.setAttribute("style", "position:absolute;");
	img.setAttribute("src", "../assets/images/virus.png");
	img.setAttribute("id", "bilden");
	document.querySelector("#gameboard").appendChild(img);
	//var xy = getRandomPosition(img);
	img.style.top = ranPos[0] + 'px';
	img.style.left = ranPos[1] + 'px';
	
	img.innerHTML = msg.content;

	document.querySelector('#gameboard').appendChild(img);
}

messageForm.addEventListener('click', e => {

	const messageEl = document.querySelector('#gameboard');
	const position = getRandomPosition(messageEl);
	
	
	

	socket.emit('chatmsg', messageEl, position);
	addMessageToChat(messageEl, position);	
	gameBoard.addEventListener('click', e => { 
		gameImg = document.querySelector("img")

		if(e.target !== gameImg) {
			console.log("Click on a VIRUS!")
		}else {
			e.target.remove();
			clickedTime=Date.now();
			reactionTime=(clickedTime-createdTime)/1000;
			const endTime = roundToOne(reactionTime);
			document.getElementById("printReactionTime").innerHTML="Your Reaction Time is: " + endTime + "seconds";
			console.log(reactionTime);			

			setTimeout(function() {
				addMessageToChat(messageEl, position);
				createdTime=Date.now();
			}, Math.floor(Math.random(5000)*1000));
		}
	});

});



socket.on('online-users', (users) => {
	updateOnlineUsers(users);
});

socket.on('chatmsg', (msg, ranPos) => {

	addMessageToChat(msg, ranPos);
	gameBoard.addEventListener('click', e => { 
		gameImg = document.querySelector("img")

		if(e.target !== gameImg) {
			console.log("Click on a VIRUS!")
		}else {
			e.target.remove();
			clickedTime=Date.now();
			reactionTime=(clickedTime-createdTime)/1000;
			const endTime = roundToOne(reactionTime);
			document.getElementById("printReactionTime").innerHTML="Your Reaction Time is: " + endTime + "seconds";
			console.log(reactionTime);			

			setTimeout(function() {
				addMessageToChat(msg, ranPos);
				createdTime=Date.now();
			}, Math.floor(Math.random(5000)*1000));
		}
	});
	
	console.log("CLIENT NR 2");
});

