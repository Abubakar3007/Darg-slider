// check how many card show in screen according to window screen
let cardNumberShows;

if (window.innerWidth > 820) {
	cardNumberShows = 3;
}
if (window.innerWidth < 800) {
	cardNumberShows = 2;
}
if (window.innerWidth < 580) {
	cardNumberShows = 1;
}

// make object for index and slider dots
const objectSlider = {
	1: {
		sliderIndex: 0,
		sliderDot: document.querySelector('[data-dot="slider_dot1"]'),
	},
	2: {
		sliderIndex: 0,
		sliderDot: document.querySelector('[data-dot="slider_dot2"]'),
	}
}

// slider button call
const sliderButton = (num, sliderNumber, current) => {
	let sliderParent = current.closest(".latest");
	let sliderContainer = sliderParent.querySelector(".slider_card");
	let sliderChild = sliderContainer.querySelectorAll(".single_object");
	let singleChildWidth = sliderChild[0].offsetWidth;
	objectSlider[`${sliderNumber}`]['sliderIndex'] = objectSlider[`${sliderNumber}`]['sliderIndex'] + num;

	if (objectSlider[`${sliderNumber}`]['sliderIndex'] < 0) {
		objectSlider[`${sliderNumber}`]['sliderIndex'] = (sliderChild.length - cardNumberShows);
	}

	if (objectSlider[`${sliderNumber}`]['sliderIndex'] > (sliderChild.length - cardNumberShows)) {
		objectSlider[`${sliderNumber}`]['sliderIndex'] = 0;
	}
	updateDots(objectSlider[`${sliderNumber}`]['sliderIndex'], sliderNumber);
	sliderMove(sliderContainer, singleChildWidth, objectSlider[`${sliderNumber}`]['sliderIndex']);
}

// create cards dots dynamic
const createDots = (cards, dotContainer) => {
	for (let i = 0; i <= (cards.length - cardNumberShows); i++) {
		let li = document.createElement("li");
		if (i == 0) {
			li.classList.add("active");
		}
		dotContainer.appendChild(li);
	};
};
// make slider dots according to how many card contain main box
const sliderDot1 = document.querySelector("[data-dot='slider_dot1']");
const sliderCard1 = document.querySelectorAll('[data-slider="slider1"] .single_object');
createDots(sliderCard1, sliderDot1);

// make slider dots according to how many card contain main box
const sliderDot2 = document.querySelector("[data-dot='slider_dot2']");
const sliderCard2 = document.querySelectorAll('[data-slider="slider2"] .single_object');
createDots(sliderCard2, sliderDot2);

// Slider move

function sliderMove(container, child, idx) {
	container.scrollLeft = (child + 16) * idx;
}

// update slider when user click left right button
const updateDots = (idx, sliderNumber) => {
	let dots = objectSlider[`${sliderNumber}`]['sliderDot'].querySelectorAll("li");
	// When user click dots then also slider will be update
	removeTabClass(dots, "active");
	dots[idx].classList.add("active");
}


const addDragFunctionality = (sliderContainer, sliderNumber) => {
	let startX, isDragging = false;
	let initialScrollLeft;

	const onMouseDown = (e) => {
		startX = e.pageX || e.touches[0].pageX;
		initialScrollLeft = sliderContainer.scrollLeft;
		isDragging = true;
		sliderContainer.style.cursor = 'grabbing';
	}

	const onMouseMove = (e) => {
		if (!isDragging) return;
		const x = e.pageX || e.touches[0].pageX;
		const walk = (x - startX) * 2; 
		sliderContainer.scrollLeft = initialScrollLeft - walk;
		updateDotsOnScroll(sliderContainer, sliderNumber);
	}

	const onMouseUp = () => {
		isDragging = false;
		sliderContainer.style.cursor = 'grab';
		snapToSlide(sliderContainer, sliderNumber);
	}

	const updateDotsOnScroll = (container, sliderNumber) => {
		const slideWidth = container.querySelector('.single_object').offsetWidth;
		const scrollIndex = Math.round(container.scrollLeft / (slideWidth + 16)); // 16 is for margin
		if (scrollIndex >= 0 && scrollIndex <= (container.querySelectorAll('.single_object').length - cardNumberShows)) {
			objectSlider[`${sliderNumber}`]['sliderIndex'] = scrollIndex;
			updateDots(scrollIndex, sliderNumber);
		}
	}

	const snapToSlide = (container, sliderNumber) => {
		const slideWidth = container.querySelector('.single_object').offsetWidth;
		const newIndex = Math.round(container.scrollLeft / (slideWidth + 16)); // 16 is for margin
		objectSlider[`${sliderNumber}`]['sliderIndex'] = newIndex;
		sliderMove(container, slideWidth, newIndex);
		updateDots(newIndex, sliderNumber);
	}

	sliderContainer.addEventListener('mousedown', onMouseDown);
	sliderContainer.addEventListener('mousemove', onMouseMove);
	sliderContainer.addEventListener('mouseup', onMouseUp);
	sliderContainer.addEventListener('mouseleave', onMouseUp);

	sliderContainer.addEventListener('touchstart', onMouseDown);
	sliderContainer.addEventListener('touchmove', onMouseMove);
	sliderContainer.addEventListener('touchend', onMouseUp);
}

// Add drag functionality to sliders
const sliderContainer1 = document.querySelector('[data-slider="slider1"]');
if (sliderContainer1) {
	let container = sliderContainer1.querySelector(".slider_card");
	addDragFunctionality(container, 1);
}

const sliderContainer2 = document.querySelector('[data-slider="slider2"]');
if (sliderContainer2) {
	let container = sliderContainer2.querySelector(".slider_card");
	addDragFunctionality(container, 2);
}