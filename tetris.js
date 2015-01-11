var PIXELS = 30; //length and width in pixels for a grid space
var MAX_INDEX = 3; //4th row/col index = 3
var ORIGIN_POS = 0.5; //starting pixel position for game (top and left side)
var MAX_RIGHT = 300.5;
var GRID_BOTTOM = 600.5;
var BUFFER = 10; //10 pixel buffer to shrink area when checking if a grid space is taken
var NEXT_PIECE_ARRAY = ["i","i","i","i",
					 "j","j","j","j",
					 "l","l","l","l",
					 "t","t","t","t",
					 "o","o","o","o",
					 "s","s","s","s",
					 "z","z","z","z"]; //guarantees at least 4 instances of a piece each 28 moves.
var UNPLAYED_PIECES = ["i","i","i","i",
					 "j","j","j","j",
					 "l","l","l","l",
					 "t","t","t","t",
					 "o","o","o","o",
					 "s","s","s","s",
					 "z","z","z","z"]; //unplayed pieces

var board, board_context, placed_board, placed_context, currentPiece, paused, intervalSpeed, moveDownTimer, score, gameEnd;

//on page load set up boards
$(function(){
	startGame();
});
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
function startGame(){
	paused = false;
	intervalSpeed = 1000;
	gameEnd = false;
	score = 0;
	moveDownTimer = setInterval(function(){
									if(!currentPiece.moveDown()){
										currentPiece.clear();
										currentPiece.draw("placed");
										currentPiece = nextPiece();
									}
									else{
										currentPiece.clear();
										currentPiece.y += 30;
										currentPiece.setBottom();
									}
									currentPiece.draw("board");
								}, intervalSpeed);
	var scoreText = '<p>'+score+'</p>';
	$('#score').append(scoreText);
	board = document.getElementById("tetrisboard");
	board_context = board.getContext("2d");
	board_context.beginPath();
	board_context.rect(0, 0, $('#tetrisboard').width(), $('#tetrisboard').height());
	board_context.closePath();
	board_context.stroke();

	placed_board = document.getElementById("board");
	placed_context = placed_board.getContext("2d");
	placed_context.beginPath();
	placed_context.rect(0, 0, $('#board').width(), $('#board').height());
	placed_context.closePath();
	placed_context.stroke();
	
	board_context.beginPath();
	
	for(var x = ORIGIN_POS; x < MAX_RIGHT-ORIGIN_POS; x+=PIXELS){
		for(var y = ORIGIN_POS; y < GRID_BOTTOM; y+=PIXELS){
			board_context.rect(x, y, PIXELS, PIXELS);
			board_context.fillStyle = '#888888';
			board_context.fillRect(x, y, PIXELS-ORIGIN_POS, PIXELS-ORIGIN_POS);
		}
	}
	board_context.closePath();
	board_context.strokeStyle = "#000000";
	board_context.stroke();
	currentPiece = nextPiece();
	currentPiece.draw("board");
}
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
		case "i":
			newPiece = new I();
			return newPiece;
			break;
		case "j":
			newPiece = new J();
			return newPiece;
			break;
		case "l":
			newPiece = new L();
			return newPiece;
			break;
		case "t":
			newPiece = new T();
			return newPiece;
			break;
		case "o":
			newPiece = new O();
			return newPiece;
			break;
		case "s":
			newPiece = new S();
			return newPiece;
			break;
		case "z":
			newPiece = new Z();
			return newPiece;
			break;
		default:
			throw "Error: could not retrieve next piece";
	}
}
$(function(){
	$('html').keydown(function(e){
		var code = e.which;
		switch(code){
			case 37://left
				if(!currentPiece.checkLeft()){
					currentPiece.moveLeft();
				}
				e.preventDefault();
				break;
			case 38://up
				currentPiece.rotate();
				e.preventDefault();
				break;
			case 39://right
				if(!currentPiece.checkRight()){
					currentPiece.moveRight();
				}
				e.preventDefault();
				break;
			case 40://down
				if(!currentPiece.moveDown()){
					currentPiece.clear();
					currentPiece.draw("placed");
					currentPiece = nextPiece();
				}
				else{
					currentPiece.clear();
					currentPiece.y += 30;
					currentPiece.setBottom();
				}
				currentPiece.draw("board");
				e.preventDefault();
				break;
			case 80:
				pauseGame();
			default:
				break;
		}
	});
});
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
function checkRowForLine(lines){
	var boardWidth = (MAX_RIGHT - ORIGIN_POS)/PIXELS;
	var linesToDel = [];
	for(var i = 0; i < lines.length; ++i){
		var filledSpaces = 0;
		for(var y = 0; y < boardWidth; ++y){
			var checkPlacedGrid = placed_context.getImageData(BUFFER+(PIXELS*y), lines[i]+BUFFER, BUFFER, BUFFER);
			if(checkForColor(checkPlacedGrid)){
				filledSpaces += 1;
			}
		}
		if(filledSpaces == boardWidth){
			linesToDel.push(lines[i]);
		}
	}
	return linesToDel;
}
function clearLines(deleteLines){
	var boardWidth = (MAX_RIGHT - ORIGIN_POS)/PIXELS;
	placed_context.beginPath();
	board_context.beginPath();
	for(var row = 0; row < deleteLines.length; ++row){
		for(var r = 0; r < boardWidth; ++r){
			placed_context.rect(ORIGIN_POS+(PIXELS*r), deleteLines[row], PIXELS, PIXELS);
			placed_context.fillStyle = '#888888';
			placed_context.fillRect(ORIGIN_POS+(PIXELS*r), deleteLines[row], PIXELS-ORIGIN_POS, PIXELS-ORIGIN_POS);
			
			board_context.rect(ORIGIN_POS+(PIXELS*r), deleteLines[row], PIXELS, PIXELS);
			board_context.fillStyle = '#888888';
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
function shiftDown(deletedRows){
	for(var x = 0; x < deletedRows.length; ++x){
		var aboveLines = placed_context.getImageData(ORIGIN_POS, ORIGIN_POS, MAX_RIGHT, deletedRows[x]);
		placed_context.putImageData(aboveLines, ORIGIN_POS, PIXELS+ORIGIN_POS);
	}
}
function updateScore(lines){
	if(lines < 4){
		if(10-(score%10)-lines<=0){
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
function pauseGame(){
	if(paused){
		$('#paused').css('display','none');
		paused = false;
		moveDownTimer = setInterval(function(){
									if(!currentPiece.moveDown()){
										currentPiece.clear();
										currentPiece.draw("placed");
										currentPiece = nextPiece();
									}
									else{
										currentPiece.clear();
										currentPiece.y += 30;
										currentPiece.setBottom();
									}
									currentPiece.draw("board");
								}, intervalSpeed);
	}
	else{
		$('#paused').css('display','block');
		paused = true;
		clearInterval(moveDownTimer);
	}
}
function updateInterval(){
	intervalSpeed -= 125;
	clearInterval(moveDownTimer);
	moveDownTimer = setInterval(function(){
									if(!currentPiece.moveDown()){
										currentPiece.clear();
										currentPiece.draw("placed");
										currentPiece = nextPiece();
									}
									else{
										currentPiece.clear();							
										currentPiece.y += 30;
										currentPiece.setBottom();
									}
									currentPiece.draw("board");
								}, intervalSpeed);
}