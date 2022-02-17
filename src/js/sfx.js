// Status bar
// Button click
$(".status-bar-btn").click(function () {
	$("#click-backward").clone()[0].play();
});

// Main menu
// Button hover
$(".main-menu-btn").hover(
	function () {
		$("#hover-menu").clone()[0].play();
	},
	function () {}
);
// Play button click (only play button for now)
$("#main-menu-play-btn").click(function () {
	$("#click-forward").clone()[0].play();
});

// Maps
// Hover
$(".map").hover(
	function () {
		$("#hover-map").clone()[0].play();
	},
	function () {}
);
// Click
$(".map").click(function () {
	$("#select-map").clone()[0].play();
});

// Mods
// Hover
$(".mod").hover(
	function () {
		$("#hover-mod").clone()[0].play();
	},
	function () {}
);
// Click
$(".mod").click(function () {
	$("#select-mod").clone()[0].play();
});
