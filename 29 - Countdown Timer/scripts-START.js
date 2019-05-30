const timeView = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('.timer__button[data-time]');
const formData = document.querySelector('#custom');
let countdown = null;

function handlerTime(time) {
	clearTimeout(countdown);
	let mins = +Math.floor(time / 60) || '';
	let seconds = +(time % 60).toFixed(1) || '';

	mins = addFormat(mins, 2);
	seconds = addFormat(seconds, 2);
	timeView.innerText = `${mins}:${seconds}`;

	countdown = setTimeout(() => {
		timeView.innerText = `${mins}:${seconds}`;
		if (time <= 0) {
			clearTimeout(countdown);
			return;
		}
		time--;
		handlerTime(time);
	}, 1000 * 1);
}
function changeTime() {
	handlerTime(this.dataset.time);
	handlerEndTime(this.dataset.time);
}
function submit(event) {
	event.preventDefault();
	const time = this.minutes.value * 60;
	handlerTime(time);
	return false;
}
function handlerEndTime(seconds) {
	const now = Date.now();
	const end = new Date(now + seconds * 1000);
	const hour = end.getHours();
  const minutes = end.getMinutes();
  endTime.innerText = `Be Back At ${hour}:${minutes}`;
}
function addFormat(num, length) {
	if((num + "").length >= length) {
			return num;
	}
	return addFormat("0" + num, length)
}
buttons.forEach((item)=>{ item.addEventListener('click', changeTime) });
formData.addEventListener('submit',submit);