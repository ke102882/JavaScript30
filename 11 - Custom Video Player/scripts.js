/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer'); // 影片
const progress = player.querySelector('.progress'); // 時間軸wrap
const progressBar = player.querySelector('.progress__filled'); // 時間軸顏色條
const toggle = player.querySelector('.toggle'); // 播放 暫停
const skipButtons = player.querySelectorAll('[data-skip]'); // 跳轉秒數
const ranges = player.querySelectorAll('.player__slider'); // 音量 / 速度
const rangesBar = player.querySelectorAll('.player__slider__bar'); // 跳轉秒數
const fullScreenButton = player.querySelector('.full__screen'); // 全螢幕
/* Build out functions */
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  console.log(icon);
  toggle.textContent = icon;
}

function skip() {
 video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
	progressBar.style.flexBasis = `${percent}%`;
	setLocalStorage('currentTime', video.currentTime)
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
	video.currentTime = scrubTime;
	setLocalStorage('currentTime', video.currentTime)
}

function rangeHandler(e) {
	let current = event.currentTarget.lastElementChild;
	const dataName = current.dataset.name;
	const dataMax = current.dataset.max;
	const dataMin = current.dataset.min;
	const dataStep = current.dataset.step;

	const rangeHandler = (( e.offsetX / ranges[0].offsetWidth ).toFixed(1)) * dataStep * 2 * 10;

	video[dataName] = rangeHandler < dataMin ? dataMin : rangeHandler > dataMax ? dataMax : rangeHandler;
	current.style.width = e.offsetX + 'px';
	// console.log(video[dataName])
	// setLocalStorage('currentTime', video.currentTime)
}

function fullScreen() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  }
}

function setLocalStorage(key, value) {
	localStorage.setItem(key, value)
}

// 頁面載入完之後(load end)，取得時間
function getAfterCurrentTime() {
	const currentTime = localStorage.getItem('currentTime');
	video.currentTime = currentTime;
}

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
// video.addEventListener('progress', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
// ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
// ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

ranges.forEach(range => {
	range.addEventListener('click', rangeHandler);
	range.addEventListener('mousemove', (e) => mousedown && rangeHandler(e));
	range.addEventListener('mousedown', () => mousedown = true);
	range.addEventListener('mouseup', () => mousedown = false);
	// range.addEventListener('mousemove', handleRangeUpdate)
});

fullScreenButton.addEventListener('click', fullScreen);

window.addEventListener('load', getAfterCurrentTime)
