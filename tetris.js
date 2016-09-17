var PIXELS = 30; //length and width in pixels for a grid space
var ORIGIN_POS = 0.5; //coordinate for origin of board
var MAX_RIGHT = 300.5; //coordinate for rightmost edge of board
var GRID_BOTTOM = 600.5; //coordinate for lower edge of board
var BUFFER = 10; //10 pixel buffer to shrink area when checking if a grid space is taken
var BOARD_WIDTH = (MAX_RIGHT - ORIGIN_POS)/PIXELS;
var NEXT_PIECE_ARRAY = [
  'i','i','i','i',
  'j','j','j','j',
  'l','l','l','l',
  't','t','t','t',
  'o','o','o','o',
  's','s','s','s',
  'z','z','z','z'
]; //guarantees at least 4 instances of a piece each 28 moves.
var UNPLAYED_PIECES = [
  'i','i','i','i',
  'j','j','j','j',
  'l','l','l','l',
  't','t','t','t',
  'o','o','o','o',
  's','s','s','s',
  'z','z','z','z'
]; //unplayed pieces

/*
	do not instantiated these global variables until gameStart()
	they need to be reset when a new game is started
*/
/**
	canvas and their contexts
	@board - canvas associated with #tetrisboard
	@board_context - context for @board canvas where the pieces will be drawn
	@placed_board - canvas associated with #board
	@placed_context - context for @placed_board where the set pieces will be drawn
*/
var board, board_context, placed_board, placed_context;
var currentPiece; //current piece being played
var paused; 	  //boolean status of whether game is paused or not (true = paused, false = unpaused)
var intervalSpeed;//the frequency of how often moveDown() is called to auto drop a piece
var moveDownTimer;//setInterval object to call the moveDown() method to drop the piece
var score;		  //player's score
var gameEnd;	  //boolean for whether the game is over or not

//on page load start game
$(function(){
	startGame();
});

//clear the canvases' contexts when reset button is pressed to start new game
$(function(){
	$('#reset').click(function(){
		clearInterval(moveDownTimer);
		$('#score p:nth-of-type(2)').remove();
		$('#gameOver').css('display','none');
		board_context.clearRect(0,0,$('#tetrisboard').width(), $('#tetrisboard').height());
		placed_context.clearRect(0,0,$('#board').width(), $('#board').height());
		startGame();
	});
});

function initVars(){
	paused = false;
	intervalSpeed = 1000;
	gameEnd = false;
	score = 0;
	moveDownTimer = setInterval(function(){
						if(!currentPiece.moveDown()){
							currentPiece.clear();
							currentPiece.draw('placed');
							var rows = getLineRows();
							var deleteRows = checkRowForLine(rows);
							if(deleteRows.length != 0){
								clearLines(deleteRows);
								shiftDown(deleteRows);
								updateScore(deleteRows.length);
							}
							currentPiece = nextPiece();
						}
						else{
							currentPiece.clear();
							currentPiece.y += 30;
							currentPiece.setBottom();
						}
						currentPiece.draw('board');
					}, intervalSpeed);
	var scoreText = '<p>'+score+'</p>';
	$('#score').append(scoreText);
	board = document.getElementById('tetrisboard');
	board_context = board.getContext('2d');
	board_context.beginPath();
	board_context.rect(0, 0, $('#tetrisboard').width(), $('#tetrisboard').height());
	board_context.closePath();
	board_context.stroke();

	placed_board = document.getElementById('board');
	placed_context = placed_board.getContext('2d');
	placed_context.beginPath();
	placed_context.rect(0, 0, $('#board').width(), $('#board').height());
	placed_context.closePath();
	placed_context.stroke();
	
	board_context.beginPath();
	
	for(var x = ORIGIN_POS; x < MAX_RIGHT-ORIGIN_POS; x+=PIXELS){
		for(var y = ORIGIN_POS; y < GRID_BOTTOM; y+=PIXELS){
			board_context.rect(x, y, PIXELS, PIXELS);
			board_context.fillStyle = "rgba(136,136,136, .5)";
			board_context.fillRect(x, y, PIXELS-ORIGIN_POS, PIXELS-ORIGIN_POS);
		}
	}
	board_context.closePath();
	board_context.strokeStyle = '#000000';
	board_context.stroke();
}
/**
	startGame function
	instantiate variables that hold game status.
*/
function startGame(){
	initVars();
	currentPiece = nextPiece();
	currentPiece.draw('board');
}
/**
	nextPiece function
	randomly selects a piece to play
	NEXT_PIECE_ARRAY/UNPLAYED_PIECES array guarantees that each piece is played at least 4 times per 28
*/
function nextPiece(){
	var newPiece;
	if(UNPLAYED_PIECES == 0){
		UNPLAYED_PIECES = new Array(NEXT_PIECE_ARRAY.length);
		for(var x = 0; x < NEXT_PIECE_ARRAY.length; ++x){
			UNPLAYED_PIECES[x] = NEXT_PIECE_ARRAY[x];
		}
	}
	var arrayLength = UNPLAYED_PIECES.length;
	var indexNextPiece = Math.floor(Math.random()*arrayLength);
	var nextPiece = UNPLAYED_PIECES[indexNextPiece];
	UNPLAYED_PIECES.splice(indexNextPiece,1);
	switch(nextPiece){
		case 'i':
			newPiece = new I();
			return newPiece;
			break;
		case 'j':
			newPiece = new J();
			return newPiece;
			break;
		case 'l':
			newPiece = new L();
			return newPiece;
			break;
		case 't':
			newPiece = new T();
			return newPiece;
			break;
		case 'o':
			newPiece = new O();
			return newPiece;
			break;
		case 's':
			newPiece = new S();
			return newPiece;
			break;
		case 'z':
			newPiece = new Z();
			return newPiece;
			break;
		default:
			throw 'Error: could not retrieve next piece';
	}
}

//listen for key presses and call respective methods
$(function(){
	$('html').keydown(function(e){
		var code = e.which;
		switch(code){
			case 37://left
				if(!currentPiece.checkLeft()){
					currentPiece.moveSide('left');
				}
				e.preventDefault();
				break;
			case 38://up
				currentPiece.rotate();
				e.preventDefault();
				break;
			case 39://right
				if(!currentPiece.checkRight()){
					currentPiece.moveSide('right');
				}
				e.preventDefault();
				break;
			case 40://down
				if(!currentPiece.moveDown()){
					currentPiece.clear();
					currentPiece.draw('placed');
					var rows = getLineRows();
					var deleteRows = checkRowForLine(rows);
					if(deleteRows.length != 0){
						clearLines(deleteRows);
						shiftDown(deleteRows);
						updateScore(deleteRows.length);
					}
					currentPiece = nextPiece();
				}
				else{
					currentPiece.clear();
					currentPiece.y += 30;
					currentPiece.setBottom();
				}
				currentPiece.draw('board');
				e.preventDefault();
				break;
			case 80:
				pauseGame();
			default:
				break;
		}
	});
});
/**
	checkForColor function
	checks the rectangular area of placed_context to check for color
	if it contains color it means a piece has been played there.
	@checkPlacedGrid the image data of a given section of the context that we are checking for color
*/
function checkForColor(checkPlacedGrid){
	if(checkPlacedGrid.data[0] != 0){
		return true;
	}
	else if(checkPlacedGrid.data[1] != 0){
		return true;
	}
	else if(checkPlacedGrid.data[2] != 0){
		return true;
	}
	else{
		return false;
	}
}
/**
	getLineRows function
	gets the lines we need to check for complete lines
	lines to check are determined by lines occupied by a recently played piece
*/
function getLineRows(){
	var checkLines = [];
	for(var row = 0; row < currentPiece.gridSize; ++row){
		for(var col = 0; col < currentPiece.gridSize; ++col){
			if(currentPiece.currentSet[row][col] == 1){
				checkLines.push(currentPiece.y+(PIXELS*row));
				break;
			}
		}
	}
	return checkLines;
}
/**
	checkRowForLine function
	checks the given lines to see if all 10 sub rectangles are filled or not
	@lines y-coordinates of the lines we need to check
*/
function checkRowForLine(lines){
	var linesToDel = [];
	for(var i = 0; i < lines.length; ++i){
		var filledSpaces = 0;
		for(var y = 0; y < BOARD_WIDTH; ++y){
			var checkPlacedGrid = placed_context.getImageData(BUFFER+(PIXELS*y), lines[i]+BUFFER, BUFFER, BUFFER);
			if(checkForColor(checkPlacedGrid)){
				filledSpaces += 1;
			}
		}
		if(filledSpaces == BOARD_WIDTH){
			linesToDel.push(lines[i]);
		}
	}
	return linesToDel;
}
/**
	clearLines function
	clear lines if they are found to be complete
	@deleteLines the y-coordinate of the line that we are clearing (reseting the colors)
*/
function clearLines(deleteLines){
	placed_context.beginPath();
	board_context.beginPath();
	for(var row = 0; row < deleteLines.length; ++row){
		for(var r = 0; r < BOARD_WIDTH; ++r){
			placed_context.rect(ORIGIN_POS+(PIXELS*r), deleteLines[row], PIXELS, PIXELS);
			placed_context.fillStyle = "rgba(136,136,136,0)";
			placed_context.fillRect(ORIGIN_POS+(PIXELS*r), deleteLines[row], PIXELS-ORIGIN_POS, PIXELS-ORIGIN_POS);
			
			board_context.rect(ORIGIN_POS+(PIXELS*r), deleteLines[row], PIXELS, PIXELS);
			board_context.fillStyle = "rgba(136,136,136,0)";
			board_context.fillRect(ORIGIN_POS+(PIXELS*r), deleteLines[row], PIXELS-ORIGIN_POS, PIXELS-ORIGIN_POS);
		}
		placed_context.closePath();
		placed_context.strokeStyle = '#000000';
		placed_context.stroke();
		board_context.closePath();
		board_context.strokeStyle = '#000000';
		board_context.stroke();
	}
}
/**
	shiftDown function
	take the image data of the canvas above the cleared lines and shift it down one row
	@deletedRows y-coordinates of cleared lines
*/
function shiftDown(deletedRows){
	for(var x = 0; x < deletedRows.length; ++x){
		var aboveLines = placed_context.getImageData(ORIGIN_POS, ORIGIN_POS, MAX_RIGHT, deletedRows[x]);
		placed_context.putImageData(aboveLines, ORIGIN_POS, PIXELS+ORIGIN_POS);
	}
}
/**
	updateScore function
	add to score after clearing lines
	1 line = 1 pt
	4 lines (tetris) = 10 pts
	@lines number of lines cleared
*/
function updateScore(lines){
	if(lines < 4){
		if(10-(score%10)-lines<=0){ //check if added lines puts score past multiple of 10
			updateInterval();
		}
		score += lines;
	}
	else{
		score += 10;
		updateInterval();
	}
	$('#score p:nth-of-type(2)').text(score);
}
/**
	pauseGame function
	when 'p' is pressed we (un)pause the game
*/
function pauseGame(){
	if(paused){
		$('#paused').css('display','none');
		paused = false;
		moveDownTimer = setInterval(function(){
							if(!currentPiece.moveDown()){
								currentPiece.clear();
								currentPiece.draw('placed');
								var rows = getLineRows();
								var deleteRows = checkRowForLine(rows);
								if(deleteRows.length != 0){
									clearLines(deleteRows);
									shiftDown(deleteRows);
									updateScore(deleteRows.length);
								}
								currentPiece = nextPiece();
							}
							else{
								currentPiece.clear();
								currentPiece.y += 30;
								currentPiece.setBottom();
							}
							currentPiece.draw('board');
						}, intervalSpeed);
	}
	else{
		$('#paused').css('display','block');
		paused = true;
		clearInterval(moveDownTimer);
	}
}
/**
	updateInterval
	when the score reaches a multiple of 10 we increase the drop speed by 125ms
*/
function updateInterval(){
	intervalSpeed -= 125;
	clearInterval(moveDownTimer);
	moveDownTimer = setInterval(function(){
						if(!currentPiece.moveDown()){
							currentPiece.clear();
							currentPiece.draw('placed');
							var rows = getLineRows();
							var deleteRows = checkRowForLine(rows);
							if(deleteRows.length != 0){
								clearLines(deleteRows);
								shiftDown(deleteRows);
								updateScore(deleteRows.length);
							}
							currentPiece = nextPiece();
						}
						else{
							currentPiece.clear();							
							currentPiece.y += 30;
							currentPiece.setBottom();
						}
						currentPiece.draw('board');
					}, intervalSpeed);
}