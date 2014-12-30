var _PIXELS_ = 30; //length and width in pixels for a grid space
var _MAX_INDEX_ = 3; //4th row/col index = 3
var _ORIGIN_POS_ = 0.5; //starting pixel position for game (top and left side)
var _MAX_RIGHT_ = 300.5;
var _GRID_BOTTOM_ = 600.5;
var _BUFFER_ = 10; //10 pixel buffer to shrink area when checking if a grid space is taken

//pieces
function iPiece(){
				  this.color ='#00ffff'; /*cyan*/
				  //this.rotation = 0;
				  this.gridSize = 4;
				  this.x = 90.5;
				  this.y = _ORIGIN_POS_;
				  this.bottom = this.y+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/ 
				  this.startSet = [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
				  this.currentSet = [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
				  
				 }
function lPiece(){
				  this.color ='#ff6600'; /*orange*/
				  //this.rotation = 0;
				  this.gridSize = 3;
				  this.x = 120.5;
				  this.y = _ORIGIN_POS_;
				  this.bottom = this.y+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[1,0,0],[1,0,0],[1,1,0]];
				  this.currentSet = [[1,0,0],[1,0,0],[1,1,0]];
				 }
function jPiece(){
				  this.color = '#0000ff'; /*blue*/
				  //this.rotation = 0;
				  this.gridSize = 3;
				  this.x = 90.5;
  				  this.y = _ORIGIN_POS_;
				  this.bottom = this.y+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,0,1],[0,0,1],[0,1,1]];
  				  this.currentSet = [[0,0,1],[0,0,1],[0,1,1]];
				 }
function tPiece(){
				  this.color = '#9900cc'; /*purple*/
				  //this.rotation = 0;
				  this.gridSize = 3;
				  this.x = 90.5;
				  this.y = _ORIGIN_POS_;
				  this.bottom = this.y+(_PIXELS_*(this.gridSize-1));
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,1,0],[1,1,1],[0,0,0]];
				  this.currentSet = [[0,1,0],[1,1,1],[0,0,0]];
				 }
function oPiece(){
				  this.color = '#ffff00'; /*yellow*/
				  //this.rotation = 0;
				  this.gridSize = 2;
				  this.x = 120.5;
				  this.y = _ORIGIN_POS_;
				  this.bottom = this.y+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[1,1],[1,1]];
				  this.currentSet = [[1,1],[1,1]];				  
				 }
function sPiece(){
				  this.color = '#00ff00'; /*green*/
				  //this.rotation = 0;
				  this.gridSize = 3;
				  this.x = 90.5;
				  this.y = _ORIGIN_POS_;
				  this.bottom = this.y+(_PIXELS_*(this.gridSize-1));
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,1,1],[1,1,0],[0,0,0]];
				  this.currentSet = [[0,1,1],[1,1,0],[0,0,0]];				  
				 }
function zPiece(){
				  this.color = '#ff0000'; /*red*/
				  //this.rotation = 0;
				  this.gridSize = 3;
				  this.x = 120.5;
				  this.y = _ORIGIN_POS_;
				  this.bottom = this.y+(_PIXELS_*(this.gridSize-1));
				  /*coords: _POSITION_,*/
				  this.startSet = [[1,1,0],[0,1,1],[0,0,0]];
				  this.currentSet = [[1,1,0],[0,1,1],[0,0,0]];				  
				 }

var board;
var board_context;
var currentPiece;

//on page load set up boards
$(function(){
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
	//placed_context.beginPath();
	for(var x = 0.5; x < 300; x+=30){
		for(var y = 0.5; y < 600; y+=30){
			board_context.rect(x, y, 30, 30);
		}
	}
	board_context.closePath();
	board_context.strokeStyle = "#eee";
	board_context.stroke();
	nextPiece();
	drawPiece("board");
});

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
			default:
				break;
		}
	});
});

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
				draw_on_context.fillRect(currentPiece.x+(_PIXELS_*x), currentPiece.y+(_PIXELS_*y), _PIXELS_, _PIXELS_);
			}
		}
	}
	draw_on_context.closePath();
	draw_on_context.strokeStyle = "#000";
	draw_on_context.stroke();
};

/*
	rotate the piece
*/
function rotatePiece(){
	var original_array = currentPiece.currentSet;
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
	if(!checkRotationCollision(transposed_array, currentPiece.y)){
		currentPiece.currentSet = transposed_array;
		setBottom();
		checkRotation();
		setBottom();
	}
	clearPiece(); //remove the piece in original orientation
	drawPiece("board"); //draw the newly rotated piece
};

/*
	check rotation collision
	check for collision with other pieces after a rotation
	if there is a collision shift up until playable. if not playable do not rotate
*/
function checkRotationCollision(transposed_array, coordY){
	var offsetX = currentPiece.x + _BUFFER_;
	var offsetY = coordY + _BUFFER_;
	
	for(row = 0; row < currentPiece.gridSize; ++row){
		for(col = 0; col < currentPiece.gridSize; ++col){
			if(
		}
	}
	
}

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
	move piece left and right
	checks for out of bounds and shifts piece back onto grid if out of bounds detected
*/
function movePieceSide(direction){
	var emptyCols = 0;
	var foundEmptyCol = true;
	if(direction == "left"){
		while(foundEmptyCol){
			for(var col = 0; col < currentPiece.gridSize; ++col){
				for(var row = 0; row < currentPiece.gridSize; ++row){
					if(currentPiece.currentSet[row][col] == 1){
						foundEmptyCol = false;
						break;
					}
				}
				if(foundEmptyCol){
					emptyCols += 1;
				}
				else{
					break;
				}
			}
		}
		if((currentPiece.x - _PIXELS_) >= (-_ORIGIN_POS_ - (_PIXELS_*emptyCols))){	
			clearPiece();
			currentPiece.x -= _PIXELS_;
			drawPiece("board");
		}
	}
	else if(direction == "right"){
		while(foundEmptyCol){
			for(var col = currentPiece.gridSize-1; col >= 0; --col){
				for(var row = 0; row < currentPiece.gridSize; ++row){
					if(currentPiece.currentSet[row][col] == 1){
						foundEmptyCol = false;
						break;
					}
				}
				if(foundEmptyCol){
					emptyCols += 1;
				}
				else{
					break;
				}
			}
		}
		if((currentPiece.x + _PIXELS_) <= ((_MAX_RIGHT_ - (_PIXELS_ * currentPiece.gridSize))+(_PIXELS_*emptyCols))){	
			clearPiece();
			currentPiece.x += _PIXELS_;
			drawPiece("board");
		}
	}
	else{
		throw "Error: WHAT ARE YOU DOING??? invalid direction code";
	}
}

/*
	check sides
	check for collisions when moving side to side
*/
function checkSides(dir){
	for(col = 0; col < currentPiece.gridSize; ++col){
		for(row = 0; row < currentPiece.gridSize; ++row){
			if(dir == "left"){
				if(currentPiece.currentSet[row][col] == 1){
					if(col == 0){
						if(checkSidesHelper(row, col, dir)){ //do not return checkSidesHelper because if false we want to continue.
							return true;
						}
					}
					else{
						if(currentPiece.currentSet[row][col-1] != 1){
							if(checkSidesHelper(row, col, dir)){
								return true;
							}
						}
					}
				}
			}
			else if(dir == "right"){
				if(currentPiece.currentSet[row][col] == 1){
					if(col < currentPiece.gridSize-1){
						if(currentPiece.currentSet[row][col-1] != 1){
							if(checkSidesHelper(row, col, dir)){
								return true;
							}
						}
					}
					else{
						if(checkSidesHelper(row, col, dir)){
							return true;
						}
					}
				}
			}
			else{
				throw "Error: Invalid direction";
			}
		}
	}
	return false;
}

/*
	check sides helper
	check for piece collision when moving left and right
*/
function checkSidesHelper(row, col, dir){
	//var buffer = 10; //buffer to check smaller area to prevent clipping due to inaccurate line drawing from neighboring spaces
	if(dir == "right"){
		var offset = col+1;
	}
	if(dir == "left"){
		var offset = col-1;
	}
	var coordX = currentPiece.x+(_PIXELS_*offset)+_BUFFER_;
	var coordY = currentPiece.y+(_PIXELS_*row)+_BUFFER_;
	var checkPlacedGrid = placed_context.getImageData(coordX, coordY, buffer, buffer);
	return checkForColor(checkPlacedGrid);
}

/*
	move piece down
	(should be automatically called ever certain time interval eventually)
*/
function movePieceDown(){
	if(currentPiece.bottom == _GRID_BOTTOM_){
 		drawPiece("placed");
 		nextPiece();
 		drawPiece("board");
 	}
	else{
		if(checkUnder()){
			drawPiece("placed");
			nextPiece();
			drawPiece("board");
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
	check under
	check under piece to see if it sits on another piece
*/
function checkUnder(){
	for(var row = currentPiece.gridSize-1; row >= 0; --row){
		for(var col = 0; col < currentPiece.gridSize; ++col){
			if(currentPiece.currentSet[row][col] == 1){
				if(row < currentPiece.gridSize-1){
					if(currentPiece.currentSet[row+1][col] != 1){
						if(checkUnderHelper(row, col)){//do not return checkUnderHelper because if false we want to continue.
							return true;
						}
					}
				}
				else{
					if(checkUnderHelper(row, col)){
						return true;
					}
				}
			}
		}
	}
	return false;
}

/*
	check under helper
	check grid space under piece to see if it contains a color (denotes a piece is occupying that space)
*/
function checkUnderHelper(row, col){
	var buffer = 10; //buffer to check smaller area to prevent clipping due to inaccurate line drawing from neighboring spaces
	var coordX = currentPiece.x+(_PIXELS_*col)+buffer;
	var coordY = currentPiece.y+(_PIXELS_*(row+1))+buffer;
	var checkPlacedGrid = placed_context.getImageData(coordX, coordY, buffer, buffer);
	return checkForColor(checkPlacedGrid);
}

/*
	check for color
	check if a grid space contains a color (aka a piece)
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
	delete currently drawn piece
*/
function clearPiece(){
	for(var i = 0; i < currentPiece.gridSize; ++i){
		for(var j = 0; j < currentPiece.gridSize; ++j){
			board_context.rect(currentPiece.x+(30*i), currentPiece.y+(30*j), 30, 30);
			board_context.fillStyle = '#ffffff';
			board_context.fillRect(currentPiece.x+(30*i), currentPiece.y+(30*j), 30, 30);
		}
	}
	board_context.strokeStyle = "#eee";
	board_context.stroke();
}

/*
	get next piece to play
*/
function nextPiece(){
	var allPieces = ["i","j","l","t","o","s","z"];
	var nextPiece = allPieces[Math.floor(Math.random() * 7)];
	switch(nextPiece){
		case "i":
			currentPiece = new iPiece();
			//drawPiece();
			break;
		case "j":
			currentPiece = new jPiece();
			//drawPiece();
			break;
		case "l":
			currentPiece = new lPiece();
			//drawPiece();
			break;
		case "t":
			currentPiece = new tPiece();
			//drawPiece();
			break;
		case "o":
			currentPiece = new oPiece();
			//drawPiece();
			break;
		case "s":
			currentPiece = new sPiece();
			//drawPiece();
			break;
		case "z":
			currentPiece = new zPiece();
			//drawPiece();
			break;
		default:
			throw "Error: could not retrieve next piece";
	}
}