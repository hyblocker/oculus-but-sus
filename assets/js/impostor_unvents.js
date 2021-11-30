// HMD appear out of thin fucking air animation controller

const buffer = {};

document.addEventListener("DOMContentLoaded", function(e) {
	const hmdRootContainer = document.getElementById("hmd").children[0];

	buffer.headsetTitle = hmdRootContainer.children[0];
	buffer.hmdContainer = hmdRootContainer.children[1];
	buffer.reviewContainer = hmdRootContainer.children[2];
	buffer.separator = hmdRootContainer.children[3];

	window.requestAnimationFrame(animateBase);
});

let elapsed = 0;

function animateBase(timestep) {
	let delta = timestep - elapsed;
	elapsed += delta;

	// 2 second delay
	if (elapsed < 400) {
		window.requestAnimationFrame(animateBase);
		return;
	}
	
	// animate title in
	buffer.headsetTitle.children[0].style.opacity = 1;
	buffer.headsetTitle.children[0].style.transform = 'translateY(0px)';
	
	// gradient
	buffer.hmdContainer.children[0].children[0].style.height = '100%';
	
	// animate hmd in
	const hmdItem = buffer.hmdContainer.children[1].children[0].children[0];
	hmdItem.style.transform = 'translateY(-26.0647px)';
	hmdItem.children[0].style.opacity = '1';
	hmdItem.children[0].style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
	hmdItem.children[1].children[0].style.opacity = '1';

	animateController(buffer.hmdContainer.children[2].children[0].children[0]);
	animateController(buffer.hmdContainer.children[3].children[0].children[0]);
	
	// animate reviews
	buffer.reviewContainer.children[0].style.opacity = 1;
	buffer.reviewContainer.children[0].style.transform = 'translateY(0px)';
}

function animateController(controllerElement) {
	controllerElement.style.animationDelay = '600ms';
	controllerElement.style.transform = 'translateY(-34.62px)';
	controllerElement.children[0].style.animationDelay = '600ms';
	controllerElement.children[0].style.opacity = '1';
	controllerElement.children[0].style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
}