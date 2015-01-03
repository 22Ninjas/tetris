var _PIXELS_ = 30; //length and width in pixels for a grid space
var _MAX_INDEX_ = 3; //4th row/col index = 3
var _ORIGIN_POS_ = 0.5; //starting pixel position for game (top and left side)
var _MAX_RIGHT_ = 300.5;
var _GRID_BOTTOM_ = 600.5;
var _BUFFER_ = 10; //10 pixel buffer to shrink area when checking if a grid space is taken
var _NEXT_PIECE_ARRAY_ = ["i","i","i","i",
					 "j","j","j","j",
					 "l","l","l","l",
					 "t","t","t","t",
					 "o","o","o","o",
					 "s","s","s","s",
					 "z","z","z","z"]; //guarantees at least 4 instances of a piece each 28 moves.
var _UNPLAYED_PIECES_ = ["i","i","i","i",
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
	moveDownTimer = setInterval(function(){ movePieceDown() }, intervalSpeed);
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
	
	for(var x = _ORIGIN_POS_; x < _MAX_RIGHT_-_ORIGIN_POS_; x+=_PIXELS_){
		for(var y = _ORIGIN_POS_; y < _GRID_BOTTOM_; y+=_PIXELS_){
			board_context.rect(x, y, _PIXELS_, _PIXELS_);
			board_context.fillStyle = '#888888';
			board_context.fillRect(x, y, _PIXELS_-_ORIGIN_POS_, _PIXELS_-_ORIGIN_POS_);
		}
	}
	board_context.closePath();
	board_context.strokeStyle = "#000000";
	board_context.stroke();
	nextPiece();
	drawPiece("board");
}

/*
	listen for keypress
*/
$(function(){
	$('html').keydown(function(e){
		var code = e.which;
		switch(code){
			case 37://left
				if(!checkSides("left")){
					movePieceSide("left");
				}
				e.preventDefault();
				break;
			case 38://up
				rotatePiece();
				e.preventDefault();
				break;
			case 39://right
				if(!checkSides("right")){
					movePieceSide("right");
				}
				e.preventDefault();
				break;
			case 40://down
				movePieceDown();
				e.preventDefault();
				break;
			case 80:
				pauseGame();
			default:
				break;
		}
	});
});

/*
	move piece down
	(should be automatically called ever certain time interval eventually)
*/
function movePieceDown(){
	if(currentPiece.bottom == _GRID_BOTTOM_){
 		drawPiece("placed");
 		clearPiece();
 		var rows = getLineRows();
		var deleteRows = checkRowForLine(rows);
		if(deleteRows.length != 0){
			clearLines(deleteRows);
			shiftDown(deleteRows);
			updateScore(deleteRows.length);
		}
 		nextPiece();
 		drawPiece("board");
 	}
	else{
		if(checkUnder()){
			if(currentPiece.y != _ORIGIN_POS_){
				drawPiece("placed");
				clearPiece();
				var rows = getLineRows();
				var deleteRows = checkRowForLine(rows);
				if(deleteRows.length != 0){
					clearLines(deleteRows);
					shiftDown(deleteRows);
					updateScore(deleteRows.length);
				}
				nextPiece();
				drawPiece("board");
			}
			else{
				drawPiece("placed");
				$('#gameOver').css('display', 'block');
				$('#gameOver').css('z-index', '100');
				gameEnd = true;
				return;
			}
		}
		else{
			clearPiece();
			currentPiece.y += 30;
			setBottom();
			drawPiece("board");
		}
	}
}

/*
	draw current piece onto grid
*/
function drawPiece(contextBoard){
	
	
	if(contextBoard == "placed"){
		draw_on_context = placed_context;
	}
	else if(contextBoard == "board"){
		draw_on_context = board_context;
	}
	else{
		throw "Error: contextBoard undefined";
	}
	draw_on_context.beginPath();
	for(var x = 0; x < currentPiece.gridSize; ++x){
		for(var y = 0; y < currentPiece.gridSize; ++y){
			if(currentPiece.currentSet[y][x] == 1){
				draw_on_context.rect(currentPiece.x+(_PIXELS_*x), currentPiece.y+(_PIXELS_*y), _PIXELS_, _PIXELS_);
				draw_on_context.fillStyle = currentPiece.color;
				draw_on_context.fillRect(currentPiece.x+(_PIXELS_*x), currentPiece.y+(_PIXELS_*y), _PIXELS_-_ORIGIN_POS_, _PIXELS_-_ORIGIN_POS_);
			}
		}
	}
	draw_on_context.closePath();
	draw_on_context.strokeStyle = "#000000";
	draw_on_context.stroke();
};

/*
	create transpose array
	create array of transposed (rotated) original array
*/
function createTransposeArray(origArray){
	var original_array = origArray;
	var transposed_array = [];
	for(var rows = 0; rows < currentPiece.gridSize; ++rows){
		if(currentPiece.gridSize == 4){
			transposed_array[rows] = [0,0,0,0];
		}
		else if(currentPiece.gridSize == 3){
			transposed_array[rows] = [0,0,0];
		}
		else if(currentPiece.gridSize == 2){
			transposed_array[rows] = [0,0];
		}
		else{
			throw "Error: invalid piece size";
		}
	}
	for(var x = 0; x < currentPiece.gridSize; ++x){
		for(var y = 0; y < currentPiece.gridSize; ++y){
			transposed_array[y][currentPiece.gridSize-1-x] = original_array[x][y];
		}
	}
	return transposed_array;
}

/*
	set bottom
	set currentPiece.bottom to the bottom of the actual piece, not the grid
*/
function setBottom(){
	for(var row = currentPiece.gridSize-1; row >= 0; --row){
		for(var col = 0; col < currentPiece.gridSize; ++col){
			if(currentPiece.currentSet[row][col] == 1){
				currentPiece.bottom = currentPiece.y+(_PIXELS_*(row+1));
				return true;
			}
		}
	}
}

/*
	rotate the piece
*/
function rotatePiece(){
	var transposed_array = createTransposeArray(currentPiece.currentSet);
	var origin_y = currentPiece.y;
	if(!checkRotationCollision(transposed_array)){
		currentPiece.currentSet = transposed_array;
		setBottom();
		checkRotation();
		setBottom();
	}
	clearPiece(); //remove the piece in original orientation
	drawPiece("board"); //draw the newly rotated piece
};


/*
	check if rotation goes off board
	if the piece (or part of it) gets drawn off board shit it over so it fits on the grid properly
*/
function checkRotation(){
	var shift = 0;
	//check left grid bounds
	if(currentPiece.x < _ORIGIN_POS_){
		var colOverflow = (-(currentPiece.x-_ORIGIN_POS_)/_PIXELS_);
		for(var col = 0; col < colOverflow; ++col){
			for(var row = 0; row < currentPiece.gridSize; ++row){
				if(currentPiece.currentSet[row][col] == 1){
					shift += 1;
					break;
				}
			}
		}
		currentPiece.x += 30*shift;
	}
	//check right grid bounds
	else if(currentPiece.x+(_PIXELS_*currentPiece.gridSize) > _MAX_RIGHT_){
		var colOverflow = (currentPiece.x+(_PIXELS_*currentPiece.gridSize)-_MAX_RIGHT_)/_PIXELS_;
		for(var col = currentPiece.gridSize-1; col >= currentPiece.gridSize-colOverflow; --col){
			for(var row = 0; row < currentPiece.gridSize; ++row){
				if(currentPiece.currentSet[row][col] == 1){
					shift -= 1;
					break;
				}
			}
		}
		currentPiece.x += 30*shift;
	}
	//check bottom grid bounds
	else if(currentPiece.y+(_PIXELS_*currentPiece.gridSize) > _GRID_BOTTOM_){
		var colOverflow = (currentPiece.y+(_PIXELS_*currentPiece.gridSize)-_GRID_BOTTOM_)/_PIXELS_;
		for(var row = currentPiece.gridSize-1; row >= currentPiece.gridSize-colOverflow; --row){
			for(var col = 0; col < currentPiece.gridSize; ++col){
				if(currentPiece.currentSet[row][col] == 1){
					shift -= 1;
					break;
				}
			}
		}
		currentPiece.y += 30*shift;
	}
}

/*
	get line rows
	get the rows the piece was just played in to check for completed lines
*/
function getLineRows(){
	var checkLines = [];
	for(var row = 0; row < currentPiece.gridSize; ++row){
		for(var col = 0; col < currentPiece.gridSize; ++col){
			if(currentPiece.currentSet[row][col] == 1){
				checkLines.push(currentPiece.y+(_PIXELS_*row));
				break;
			}
		}
	}
	return checkLines;
}

/*
	check row for line
	check given rows to see if they are completed lines
*/
function checkRowForLine(lines){
	var boardWidth = (_MAX_RIGHT_ - _ORIGIN_POS_)/_PIXELS_;
	var linesToDel = [];
	for(var i = 0; i < lines.length; ++i){
		var filledSpaces = 0;
		for(var y = 0; y < boardWidth; ++y){
			var checkPlacedGrid = placed_context.getImageData(_BUFFER_+(_PIXELS_*y), lines[i]+_BUFFER_, _BUFFER_, _BUFFER_);
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

/*
	clear lines
	clear found lines
*/
function clearLines(deleteLines){
	var boardWidth = (_MAX_RIGHT_ - _ORIGIN_POS_)/_PIXELS_;
	placed_context.beginPath();
	board_context.beginPath();
	for(var row = 0; row < deleteLines.length; ++row){
		for(var r = 0; r < boardWidth; ++r){
			placed_context.rect(_ORIGIN_POS_+(_PIXELS_*r), deleteLines[row], _PIXELS_, _PIXELS_);
			placed_context.fillStyle = '#888888';
			placed_context.fillRect(_ORIGIN_POS_+(_PIXELS_*r), deleteLines[row], _PIXELS_-_ORIGIN_POS_, _PIXELS_-_ORIGIN_POS_);
			
			board_context.rect(_ORIGIN_POS_+(_PIXELS_*r), deleteLines[row], _PIXELS_, _PIXELS_);
			board_context.fillStyle = '#888888';
			board_context.fillRect(_ORIGIN_POS_+(_PIXELS_*r), deleteLines[row], _PIXELS_-_ORIGIN_POS_, _PIXELS_-_ORIGIN_POS_);
		}
		placed_context.closePath();
		placed_context.strokeStyle = '#000000';
		placed_context.stroke();
		board_context.closePath();
		board_context.strokeStyle = '#000000';
		board_context.stroke();
	}
}

/*
	shift down
	shift lines above cleared lines down to fill in space
*/
function shiftDown(deletedRows){
	for(var x = 0; x < deletedRows.length; ++x){
		var aboveLines = placed_context.getImageData(_ORIGIN_POS_, _ORIGIN_POS_, _MAX_RIGHT_, deletedRows[x]);
		placed_context.putImageData(aboveLines, _ORIGIN_POS_, _PIXELS_+_ORIGIN_POS_);
	}
}

/*
	delete currently drawn piece
*/
function clearPiece(){
	for(var i = 0; i < currentPiece.gridSize; ++i){
		for(var j = 0; j < currentPiece.gridSize; ++j){
			board_context.rect(currentPiece.x+(_PIXELS_*i), currentPiece.y+(_PIXELS_*j), _PIXELS_, _PIXELS_);
			board_context.fillStyle = '#888888';
			board_context.fillRect(currentPiece.x+(_PIXELS_*i), currentPiece.y+(_PIXELS_*j), _PIXELS_, _PIXELS_);
		}
	}
	board_context.strokeStyle = "#000000";
	board_context.stroke();
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
		paused = false;
		moveDownTimer = setInterval(function(){ movePieceDown() }, intervalSpeed);
	}
	else{
		paused = true;
		clearInterval(moveDownTimer);
	}
}

function updateInterval(){
	intervalSpeed -= 125;
	clearInterval(moveDownTimer);
	moveDownTimer = setInterval(function(){ movePieceDown() }, intervalSpeed);
}