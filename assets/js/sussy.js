const WIDTH_MIN = 40;
const WIDTH_MAX = 80;

const crewmateDirections = [
	{ x: 51,	y: 43 },
	{ x: 412,	y: 22 },
	{ x: 54,	y: 15 },
	{ x: 0,		y: 1  },
	{ x: 83,	y: 19 },
];
const degToRad = 0.01745329;
const TIMESTEP = 1.0 / 30.0;
const crewmates = [];

function spawnCrewmate() {
	const amogus = document.createElement('div');
	amogus.classList.add('amongus', 'crewmate');

	const crewmateID = Math.floor(Math.random() * 4);

	const amogusImg = document.createElement('img');
	amogusImg.src = `/assets/impostors/crewmate${crewmateID + 1}.svg`;
	amogus.appendChild(amogusImg);

	let rotation = Math.random() * 360.0;
	let posX = Math.random() * document.body.clientWidth;
	let posY = Math.random() * document.body.scrollHeight;
	let scale = Math.random() * 0.6 + 0.8;

	amogus.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;

	crewmates.push({
		element: amogus,
		position: {
			x: posX,
			y: posY,
		},
		velocity: rotate(crewmateDirections[crewmateID], rotation),
		scale: scale,
		speed: scale * 10,
		rotation: rotation,
	});

	return amogus;
}

// normalize all vectors
crewmateDirections.forEach(dir => {
	const len = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
	dir.x /= len;
	dir.y /= len;
});

document.addEventListener("DOMContentLoaded", function(e) {
	const amogusContainer = document.createElement('div');
	amogusContainer.classList.add('amogus', 'crewmate-container');

	document.body.appendChild(amogusContainer);

	// spawn the sus
	for (let i = 0; i < 256; i++) {
		amogusContainer.appendChild(spawnCrewmate());
	}

	// animate
	setInterval(animate, 30);
});

function rotate(vec, angle) {
	return {
		x: (Math.cos(degToRad * angle) * vec.x - Math.sin(degToRad * angle) * vec.y),
		y: (Math.sin(degToRad * angle) * vec.x + Math.cos(degToRad * angle) * vec.y)
	}
}

function animate() {
	crewmates.forEach(impostor => {
		impostor.position.x += TIMESTEP * impostor.velocity.x * impostor.speed;
		impostor.position.y += TIMESTEP * impostor.velocity.y * impostor.speed;

		// TODO: Wrap + respawn as different crewmate
		if (outOfBounds(impostor)) {

			const crewmateID = Math.floor(Math.random() * 4);
			const amogusImg = impostor.element.children[0];
			amogusImg.src = `/assets/impostors/crewmate${crewmateID + 1}.svg`;

			impostor.rotation = Math.random() * 360.0;
			impostor.scale = (Math.random() * 0.6 + 0.8);
			impostor.speed = impostor.scale * 10;
			impostor.position.x = Math.sign(2 * Math.random()) * impostor.speed + document.body.clientWidth;
			impostor.position.y = Math.random() * document.body.scrollHeight;
			impostor.velocity = rotate(crewmateDirections[crewmateID], impostor.rotation);
		}

		impostor.element.style.transform = `scale(${impostor.scale}) translate(${impostor.position.x}px, ${impostor.position.y}px) rotate(${impostor.rotation}deg)`;
	});
}
function outOfBounds(impostor) {
	return !(
			impostor.position.x > -impostor.scale * 50 &&
			impostor.position.x < document.body.scrollWidth + impostor.scale * 50 &&

			impostor.position.y > 60 -impostor.scale * 50 &&
			impostor.position.y < document.body.scrollHeight + impostor.scale * 50
			);
}