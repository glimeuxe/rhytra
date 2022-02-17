var isHolding = {
	s: false,
	d: false,
	f: false,
	" ": false,
	j: false,
	k: false,
	l: false,
};

var hits = { perfect: 0, good: 0, bad: 0, miss: 0 };
var multiplier = {
	perfect: 1,
	good: 0.8,
	bad: 0.5,
	miss: 0,
	combo40: 1.05,
	combo80: 1.1,
};
var isPlaying = false;
// Speed is 0 by default
var speed = 0;
// Faded is false by default
var faded = false;
var combo = 0;
var maxCombo = 0;
var score = 0;
var animation = "moveDown";
var startTime;
var trackContainer;
var tracks;
var keypress;
var comboText;

var initializeNotes = function () {
	var noteElement;
	var trackElement;

	while (trackContainer.hasChildNodes()) {
		trackContainer.removeChild(trackContainer.lastChild);
	}

	song.sheet.forEach(function (key, index) {
		trackElement = document.createElement("div");
		trackElement.classList.add("track");

		key.notes.forEach(function (note) {
			noteElement = document.createElement("div");
			noteElement.classList.add("note");
			// Do not change -- to -
			noteElement.classList.add("note--" + index);
			noteElement.style.background = key.color;
			noteElement.style.animationName = animation;
			noteElement.style.animationTimingFunction = "linear";
			noteElement.style.animationDuration = note.duration - speed + "s";
			noteElement.style.animationDelay = note.delay + speed + "s";
			noteElement.style.animationPlayState = "paused";
			trackElement.appendChild(noteElement);
		});

		trackContainer.appendChild(trackElement);
		tracks = document.querySelectorAll(".track");
	});
};

var setupSpeed = function () {
	// Set speed to 1 if brisk mod was selected
	if ($("#mod-brisk").hasClass("mod-selected")) speed = 1;
	// Set speed to 2 if sprint mod was selected
	if ($("#mod-sprint").hasClass("mod-selected")) speed = 2;
	initializeNotes();
};

var setupFade = function () {
	if ($("#mod-faded").hasClass("mod-selected")) {
		// Set faded to true if faded mod was selected
		faded = true;
		animation = "moveDownFade";
	}
	initializeNotes();
};

var setupStartButton = function () {
	isPlaying = true;
	startTime = Date.now();

	startTimer(song.duration);
	$("#map-bgm")[0].play();
	document.querySelectorAll(".note").forEach(function (note) {
		note.style.animationPlayState = "running";
	});
};

var startTimer = function (duration) {
	var timer = duration;
	var minutes;
	var seconds;

	$(".timer").fadeIn();

	var songDurationInterval = setInterval(function () {
		minutes = Math.floor(timer / 60);
		seconds = timer % 60;
		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		$(".timer")[0].innerHTML = minutes + ":" + seconds;

		if (--timer < 0) {
			clearInterval(songDurationInterval);
			showResult();
			comboText.style.transition = "all 1s";
			comboText.style.opacity = 0;
		}
	}, 1000);
};

var showResult = function () {
	document.querySelector(".perfect-count").innerHTML = hits.perfect;
	document.querySelector(".good-count").innerHTML = hits.good;
	document.querySelector(".bad-count").innerHTML = hits.bad;
	document.querySelector(".miss-count").innerHTML = hits.miss;
	document.querySelector(".combo-count").innerHTML = maxCombo + "x";
	document.querySelector(".score-count").innerHTML = score;
	$(".game").fadeOut();
	$(".timer").fadeOut();
	$(".summary").css("display", "flex").fadeIn();
};

var setupNoteMiss = function () {
	trackContainer.addEventListener("animationend", function (event) {
		var index = event.target.classList.item(1)[6];

		displayAccuracy("miss");
		updateHits("miss");
		updateCombo("miss");
		updateMaxCombo();
		removeNoteFromTrack(event.target.parentNode, event.target);
		updateNext(index);
	});
};

/**
 * Allows keys to be only pressed one time. Prevents keydown event
 * from being handled multiple times while held down.
 */
var setupKeys = function () {
	document.addEventListener("keydown", function (event) {
		var keyIndex = getKeyIndex(event.key);

		if (Object.keys(isHolding).indexOf(event.key) !== -1 && !isHolding[event.key]) {
			isHolding[event.key] = true;
			keypress[keyIndex].style.display = "block";

			if (isPlaying && tracks[keyIndex].firstChild) {
				judge(keyIndex);
			}
		}
	});

	document.addEventListener("keyup", function (event) {
		if (Object.keys(isHolding).indexOf(event.key) !== -1) {
			var keyIndex = getKeyIndex(event.key);
			isHolding[event.key] = false;
			keypress[keyIndex].style.display = "none";
		}
	});
};

var getKeyIndex = function (key) {
	if (key === "s") {
		return 0;
	} else if (key === "d") {
		return 1;
	} else if (key === "f") {
		return 2;
	} else if (key === " ") {
		return 3;
	} else if (key === "j") {
		return 4;
	} else if (key === "k") {
		return 5;
	} else if (key === "l") {
		return 6;
	}
};

var judge = function (index) {
	var timeInSecond = (Date.now() - startTime) / 1000;
	var nextNoteIndex = song.sheet[index].next;
	var nextNote = song.sheet[index].notes[nextNoteIndex];
	var perfectTime = nextNote.duration + nextNote.delay;
	var accuracy = Math.abs(timeInSecond - perfectTime);
	var hitJudgement;

	/**
	 * As long as the note has travelled less than 3/4 of the height of
	 * the track, any key press on this track will be ignored.
	 */
	if (accuracy > (nextNote.duration - speed) / 4) {
		return;
	}

	hitJudgement = getHitJudgement(accuracy);
	displayAccuracy(hitJudgement);
	showHitEffect(index);
	updateHits(hitJudgement);
	updateCombo(hitJudgement);
	updateMaxCombo();
	calculateScore(hitJudgement);
	removeNoteFromTrack(tracks[index], tracks[index].firstChild);
	updateNext(index);
};

var getHitJudgement = function (accuracy) {
	if (accuracy < 0.1) {
		return "perfect";
	} else if (accuracy < 0.2) {
		return "good";
	} else if (accuracy < 0.3) {
		return "bad";
	} else {
		return "miss";
	}
};

var displayAccuracy = function (accuracy) {
	var accuracyText = document.createElement("div");
	document.querySelector(".hit-accuracy").remove();
	accuracyText.classList.add("hit-accuracy");
	accuracyText.classList.add("hit-accuracy-" + accuracy);
	accuracyText.innerHTML = accuracy;
	document.querySelector(".hit").appendChild(accuracyText);
};

var showHitEffect = function (index) {
	var key = document.querySelectorAll(".key")[index];
	var hitEffect = document.createElement("div");
	hitEffect.classList.add("key-symbol");
	key.appendChild(hitEffect);
};

var updateHits = function (judgement) {
	hits[judgement]++;
};

var updateCombo = function (judgement) {
	if (judgement === "miss") {
		combo = 0;
		comboText.innerHTML = "0x";
	} else {
		comboText.innerHTML = ++combo + "x";
	}
};

var updateMaxCombo = function () {
	maxCombo = maxCombo > combo ? maxCombo : combo;
};

var calculateScore = function (judgement) {
	if (combo >= 80) {
		score += 1000 * multiplier[judgement] * multiplier.combo80;
	} else if (combo >= 40) {
		score += 1000 * multiplier[judgement] * multiplier.combo40;
	} else {
		score += 1000 * multiplier[judgement];
	}
};

var removeNoteFromTrack = function (parent, child) {
	parent.removeChild(child);
};

var updateNext = function (index) {
	song.sheet[index].next++;
};

trackContainer = document.querySelector(".track-container");
keypress = document.querySelectorAll(".key-afterglow");
comboText = document.querySelector(".hit-combo");

initializeNotes();
setupSpeed();
setupFade();
setupStartButton();
setupKeys();
setupNoteMiss();
