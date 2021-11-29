// this basically reimplements core essential js like navigation stuff

//// SECTION //// Mobile navigation

function bindMobileNav() {
	const mobileNavItems = document.querySelectorAll(".f0chgbrf.iiw0y37i.fa3ckr93");
	const transition = `transition-duration: 250ms;`;
	const svgSelector = `.rno47zv5.j659ius4.dqtn49gi > path`;
	const arrowExpanded = `M145 116.681L133.607 128 95.999 90.638 58.393 128 47 116.681 96 68l49 48.681z`;
	const arrowCollapsed = `M47 79.319L58.393 68 96 105.362 133.607 68 145 79.319 96 128 47 79.319z`;

	for (let i = 0; i < mobileNavItems.length; i++) {
		const button = mobileNavItems[i].parentNode.querySelectorAll('[role="button"]')[0];

		button.onclick = function(e) {
			if (mobileNavItems[i].style.height == "0px") {
				// open
				mobileNavItems[i].style.cssText = `${transition} height: ${mobileNavItems[i].scrollHeight}px`;
				mobileNavItems[i].classList.remove('rdb73pn4', 'brpy5eb1');
				button.querySelectorAll(svgSelector)[0].setAttribute('d', arrowExpanded);
			} else {
				// collapse
				mobileNavItems[i].style.cssText = `${transition} height: 0px`;
				mobileNavItems[i].classList.add('rdb73pn4', 'brpy5eb1');
				button.querySelectorAll(svgSelector)[0].setAttribute('d', arrowCollapsed);
			}
		}
	}
}

//// END_SEC //// Mobile navigation

document.addEventListener("DOMContentLoaded", function(e) {
	bindMobileNav();
});