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
const crewmateIds = [];
const crewmatePalettes = [
	{ body: "0a4d2e", shadow: "11802d", outline: "052519" }, // green
	{ body: "a8044c", shadow: "ff1010", outline: "230110" }, // red
	{ body: "1E1F26", shadow: "3F474E", outline: "000000" }, // gray
	{ body: "3B177C", shadow: "6B2FBB", outline: "1C003F" }, // purple
	{ body: "C38822", shadow: "FFEB5A", outline: "432800" }, // yellow
	{ body: "AC2BAE", shadow: "EE54BB", outline: "691A6B" }, // pink
	{ body: "5E2615", shadow: "71491E", outline: "38160C" }, // brown
	{ body: "15A842", shadow: "50F039", outline: "0A511F" }, // lime
	{ body: "09158E", shadow: "132ED2", outline: "030938" }, // blue
	{ body: "B43E15", shadow: "F07D0D", outline: "381306" }, // orange
	{ body: "8495C0", shadow: "D7E1F1", outline: "242935" }, // light gray
];

function spawnCrewmate() {
	const amogus = document.createElement('div');
	amogus.classList.add('amongus', 'crewmate');

	const crewmateID = Math.floor(Math.random() * 4);

	// const amogusImg = document.createElement('img');
	// amogusImg.src = `/assets/impostors/crewmate${crewmateID + 1}.svg`;
	// amogus.appendChild(amogusImg);
	amogus.innerHTML = crewmateIds[crewmateID];
	const amgousImg = amogus.children[0];

	let rotation = Math.random() * 360.0;
	let posX = Math.random() * document.body.clientWidth;
	let posY = Math.random() * document.body.scrollHeight;
	let scale = Math.random() * 0.6 + 0.8;

	// amogus.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;
	const palette = crewmatePalettes[Math.floor(Math.random() * crewmatePalettes.length)];
	amogus.style.cssText = `--body: #${palette.body}; --shadow: #${palette.shadow}; --outline: #${palette.outline}; transform: scale(${scale}) translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;

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

document.addEventListener("DOMContentLoaded", async function(e) {

	for (let i = 0; i < 5; i++) {
		await fetchCrewmate(i);
	}

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
			//const amogusImg = impostor.element.children[0];
			//amogusImg.src = `/assets/impostors/crewmate${crewmateID + 1}.svg`;
			impostor.element.innerHTML = crewmateIds[crewmateID];

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

async function fetchCrewmate(id) {
	await fetch( `/assets/impostors/crewmate${id + 1}.svg`)
    	.then(r => r.text())
    	.then(text => {
    	    crewmateIds[id] = text;
    	})
    	.catch(console.error.bind(console));
}