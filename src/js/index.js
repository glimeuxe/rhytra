// BGM playing function
function startBGM(mapID) {
	if ($(".map").hasClass("map-selected") === false) {
		audioNew = new Audio();
		audioNew.crossOrigin = "anonymous";
		audioNew.muted = false;
		context = new (window.AudioContext || window.webkitAudioContext)();
		analyser = context.createAnalyser();
		audioNew.src = "https://chloeliang.github.io/rhythm-game/media/music.mp3"; // Source path (cannot be local file)
		source = context.createMediaElementSource(audioNew);
		source.connect(analyser);
		analyser.connect(context.destination);
		frequency_array = new Uint8Array(analyser.frequencyBinCount);
		audioNew.play();
	} else {
		audioNew.src = "";
		audioNew.play();
	}
}

// When main menu play button is clicked,
$("#main-menu-play-btn").click(function () {
	// hide:
	// 1. Main menu
	$("#main-menu").fadeOut(300);
	// show:
	// 1. Maps
	$("#map-list").fadeIn(300);
	// 2. Left pane
	$("#left-pane").fadeIn(300);
	// 3. Filter bar
	$("#filter-bar").fadeIn(300).css("display", "flex");
});

// When status bar home button is clicked,
$("#status-bar-home-btn").click(function () {
	// hide:
	// 1. Maps
	$("#map-list").fadeOut(300);
	// 2. Left pane
	$("#left-pane").fadeOut(300);
	// 3. Filter bar
	$("#filter-bar").fadeOut(300);
	// show:
	// 1. Main menu
	$("#main-menu").fadeIn(300);
});

// When "sort by" category is clicked,
$("#sort-bar li").click(function () {
	// 1. remove "selected" class from all "sort by" categories
	$("#sort-bar li").removeClass("sort-bar-selected");
	// 2. add "selected" class to selected "sort by" category
	$(this).addClass("sort-bar-selected");
});

// When mod is clicked,
$(".mod").click(function () {
	// 1. check if conflicting with other mod(s) and remove "selected" class from other mods if so
	if ($(this).hasClass("mod-conflicting")) $(".mod-conflicting").not(this).removeClass("mod-selected");
	// 2. toggle "selected" class on selected mod
	$(this).toggleClass("mod-selected");
});

// When map is clicked,
$(".map").click(function () {
	// 1. set mapID to selected map's ID (attribute)
	mapID = $(this).attr("id");
	// 2. change body's background
	$("body").css("background", 'url("maps/' + mapID + '/bgi-blur.png") no-repeat center center fixed');
	$("body").css("-webkit-background-size", "cover");
	$("body").css("-moz-background-size", "cover");
	// 3. change preview window's background
	$("#preview-window").css("background", 'url("maps/' + mapID + '/bgi-pv.png") no-repeat');
	// If map had already been selected,
	if ($("#" + mapID).hasClass("map-selected") === true) {
		// hide:
		// 1. Status bar
		$("#status-bar").fadeOut(300);
		// 2. Maps
		$("#map-list").fadeOut(300);
		// 3. Left pane
		$("#left-pane").fadeOut(300);
		// 4. Filter bar
		$("#filter-bar").fadeOut(300);
		// show:
		// 1. Game frame (for respective map)
		$("#game-window").fadeIn(300);
		$("#game-window").css("display", "flex");

		// Remove any existing mapJS and gameJS
		$("#mapJS").remove();
		$("#gameJS").remove();

		// Load respective mapJS,
		var mapJSLoader = document.createElement("script");
		mapJSLoader.type = "text/javascript";
		mapJSLoader.src = "maps/" + mapID + "/map.js";
		mapJSLoader.innerHTML = null;
		mapJSLoader.id = "mapJS";
		document.body.appendChild(mapJSLoader);
		// append map BGM,
		$("#map-bgm").append('<source src="maps/' + mapID + '/bgm.mp3" type="audio/ogg" />');
		// then load gameJS
		var gameJSLoader = document.createElement("script");
		gameJSLoader.type = "text/javascript";
		gameJSLoader.src = "src/js/game.js";
		gameJSLoader.innerHTML = null;
		gameJSLoader.id = "gameJS";
		document.body.appendChild(gameJSLoader);
	}
	// If map had not already been selected,
	else {
		// 1. remove "selected" class from all maps
		$(".map").removeClass("map-selected");
		// 2. add "selected" class to selected map
		$("#" + mapID).toggleClass("map-selected");
	}
});
