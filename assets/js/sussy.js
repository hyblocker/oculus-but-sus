// made by the most retarded person you don't know: Hekky / Hyblocker

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
	{ body: "5E2615", shadow: "71491E", outline: "260E08" }, // brown
	{ body: "15A842", shadow: "50F039", outline: "0A511F" }, // lime
	{ body: "09158E", shadow: "132ED2", outline: "030938" }, // blue
	{ body: "B43E15", shadow: "F07D0D", outline: "381306" }, // orange
	{ body: "8495C0", shadow: "D7E1F1", outline: "242935" }, // light gray
];

function spawnCrewmate() {
	const amogus = document.createElement('div');
	amogus.classList.add('amongus', 'crewmate');

	const crewmateID = Math.floor(Math.random() * 4);
	const palette = crewmatePalettes[Math.floor(Math.random() * crewmatePalettes.length)];

	amogus.innerHTML = crewmateIds[crewmateID]
		.replaceAll('var(--body)', `#${palette.body}`)
		.replaceAll('var(--shadow)', `#${palette.shadow}`)
		.replaceAll('var(--outline)', `#${palette.outline}`);
	
	let rotation = Math.random() * 360.0;
	let posX = Math.random() * document.body.clientWidth;
	let posY = Math.random() * document.body.scrollHeight;
	let scale = Math.random() * 0.6 + 0.8;

	amogus.style.cssText = `transform: scale(${scale}) translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;

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

	const totalCrewmates = document.body.getAttribute('data-max-crewmates') ?? 256;

	// load crewmate svgs into memory
	for (let i = 0; i < 5; i++) {
		await fetchCrewmate(i);
	}

	// create the crewmate container, and add it to the DOM
	const amogusContainer = document.createElement('div');
	amogusContainer.classList.add('amogus', 'crewmate-container');
	document.body.appendChild(amogusContainer);

	// have fun taking pissshots now
	window.toggleAmogus = function() {
		amogusContainer.style.display = amogusContainer.style.display == 'none' ? 'block' : 'none';
	};

	// spawn the sus
	for (let i = 0; i < totalCrewmates; i++) {
		amogusContainer.appendChild(spawnCrewmate());
	}

	// animate
	window.requestAnimationFrame(animate);
});

// Animates a vector by the given angle
function rotate(vec, angle) {
	return {
		x: (Math.cos(degToRad * angle) * vec.x - Math.sin(degToRad * angle) * vec.y),
		y: (Math.sin(degToRad * angle) * vec.x + Math.cos(degToRad * angle) * vec.y)
	}
}

let elapsed = 0;

function animate(timestep) {
	let delta = timestep - elapsed;
	elapsed += delta;

	for (let i = 0; i < crewmates.length; i++) {
		const impostor = crewmates[i];
		impostor.position.x += TIMESTEP * impostor.velocity.x * impostor.speed * delta * 0.01;
		impostor.position.y += TIMESTEP * impostor.velocity.y * impostor.speed * delta * 0.01;

		if (outOfBounds(impostor)) {

			const crewmateID = Math.floor(Math.random() * 4);
			const palette = crewmatePalettes[Math.floor(Math.random() * crewmatePalettes.length)];
			
			// change palette
			impostor.element.innerHTML = crewmateIds[crewmateID]
				.replaceAll('var(--body)', `#${palette.body}`)
				.replaceAll('var(--shadow)', `#${palette.shadow}`)
				.replaceAll('var(--outline)', `#${palette.outline}`);

			impostor.rotation = Math.random() * 360.0;
			impostor.scale = (Math.random() * 0.6 + 0.8);
			impostor.speed = impostor.scale * 10;
			impostor.position.x = Math.sign(2 * Math.random()) * impostor.speed + document.body.clientWidth;
			impostor.position.y = Math.random() * document.body.scrollHeight;
			impostor.velocity = rotate(crewmateDirections[crewmateID], impostor.rotation);
		}

		impostor.element.style.transform = `scale(${impostor.scale}) translate(${impostor.position.x}px, ${impostor.position.y}px) rotate(${impostor.rotation}deg)`;
	}

	window.requestAnimationFrame(animate);
}
function outOfBounds(impostor) {
	return !(
			impostor.position.x > -impostor.scale * 50 &&
			impostor.position.x < document.body.scrollWidth + impostor.scale * 50 &&

			impostor.position.y > 60 -impostor.scale * 50 &&
			impostor.position.y < document.body.scrollHeight + impostor.scale * 50
			);
}

// fetches a crewmate
async function fetchCrewmate(id) {
	await fetch( `/assets/impostors/crewmate${id + 1}.svg`)
    	.then(r => r.text())
    	.then(text => {
    	    crewmateIds[id] = text;
    	})
    	.catch(console.error.bind(console));
}