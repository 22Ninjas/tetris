/*
	Piece Object
*/
var Piece = function(pieceShape, color, size, coordX, coordY, bot, startSet){
	this.shape = pieceShape;
	this.color = color;
	this.gridSize = size;
	this.x = coordX;
	this.y = coordY;
	this.bottom = bot;
	this.startSet = startSet;
	this.currentSet = startSet;
};
//Piece methods

/**
	setBottom method
	set the y-coordinate of the bottom of the piece
*/
Piece.prototype.setBottom = function(){
	for(var row = this.gridSize-1; row >= 0; --row){
		for(var col = 0; col < this.gridSize; ++col){
			if(this.currentSet[row][col] == 1){
				this.bottom = this.y+(PIXELS*(row+1));
				return true;
			}
		}
	}
}
/**
	createTranspose method
	transposes the array that represents the orientation of the piece
	@origArray the array that represents the current orientation
*/
Piece.prototype.createTranspose = function(origArray){
	var original_array = origArray;
	var transposed_array = [];
	for(var rows = 0; rows < this.gridSize; ++rows){
		if(this.gridSize == 4){
			transposed_array[rows] = [0,0,0,0];
		}
		else if(this.gridSize == 3){
			transposed_array[rows] = [0,0,0];
		}
		else if(this.gridSize == 2){
			transposed_array[rows] = [0,0];
		}
		else{
			throw "Error: invalid piece size";
		}
	}
	for(var x = 0; x < this.gridSize; ++x){
		for(var y = 0; y < this.gridSize; ++y){
			transposed_array[y][this.gridSize-1-x] = original_array[x][y];
		}
	}
	return transposed_array;
}
/**
	rotate method
	begin the process for rotating a piece
*/
Piece.prototype.rotate = function(){
	var transposed_array = this.createTranspose(this.currentSet);
	var origin_y = this.y;
	if(!this.checkRotationCollision(transposed_array)){
		this.currentSet = transposed_array;
		this.setBottom();
		this.checkRotation();
		this.setBottom();
	}
	this.clear(); //remove the piece in original orientation
	this.draw("board"); //draw the newly rotated piece
}
/**
	checkRotation method
	check the validity of a rotation to see if the piece goes out of bound
*/
Piece.prototype.checkRotation = function(){
	var shift = 0; //number of lines to shift left/right
	//check left grid bounds
	if(this.x < ORIGIN_POS){
		var colOverflow = (-(this.x-ORIGIN_POS)/PIXELS);
		for(var col = 0; col < colOverflow; ++col){
			for(var row = 0; row < this.gridSize; ++row){
				if(this.currentSet[row][col] == 1){
					shift += 1;
					break;
				}
			}
		}
		this.x += 30*shift;
	}
	//check right grid bounds
	else if(this.x+(PIXELS*this.gridSize) > MAX_RIGHT){
		var colOverflow = (this.x+(PIXELS*this.gridSize)-MAX_RIGHT)/PIXELS;
		for(var col = this.gridSize-1; col >= this.gridSize-colOverflow; --col){
			for(var row = 0; row < this.gridSize; ++row){
				if(this.currentSet[row][col] == 1){
					shift -= 1;
					break;
				}
			}
		}
		this.x += 30*shift;
	}
	//check bottom grid bounds
	else if(this.y+(PIXELS*this.gridSize) > GRID_BOTTOM){
		var colOverflow = (this.y+(PIXELS*this.gridSize)-GRID_BOTTOM)/PIXELS;
		for(var row = this.gridSize-1; row >= this.gridSize-colOverflow; --row){
			for(var col = 0; col < this.gridSize; ++col){
				if(this.currentSet[row][col] == 1){
					shift -= 1;
					break;
				}
			}
		}
		this.y += 30*shift;
	}
}
/**
	checkRotationCollision method
	checks the validity of a rotation to check for overlapping piece
*/
Piece.prototype.checkRotationCollision = function(transposed_array){
	var offsetX = this.x + BUFFER;
	var offsetY = this.y + BUFFER;
	for(row = 0; row < this.gridSize; ++row){
	 	for(col = 0; col < this.gridSize; ++col){
	 		var checkPlacedGrid = placed_context.getImageData(offsetX+(PIXELS*row), offsetY+(PIXELS*col), BUFFER, BUFFER);
	 		if(checkForColor(checkPlacedGrid) && (transposed_array[col][row] == 1)){
	 			return true;
	 		}
	 	}
	}
	return false;
}
Piece.prototype.moveSide = function(dir){
	var emptyCols = 0;
	var foundEmptyCol = true;
	var column;
	while(foundEmptyCol){
		for(var col = 0; col < this.gridSize; ++col){
			column = col;
			for(var row = 0; row < this.gridSize; ++row){
				if(dir == 'right'){
					column = this.gridSize - col;
				}
				if(this.currentSet[row][column] == 1){
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
	if(dir == 'left'){
		if((this.x - PIXELS) >= (-ORIGIN_POS - (PIXELS*emptyCols))){	
			this.clear();
			this.x -= PIXELS;
			this.draw("board");
		}
	}
	else if(dir == 'right'){
		if((this.x + (2*PIXELS)) <= ((MAX_RIGHT - (PIXELS * this.gridSize))+(PIXELS*emptyCols))){	
			this.clear();
			this.x += PIXELS;
			this.draw("board");
		}
	}
	else{
		throw 'Error: invalid direction';
	}
}
Piece.prototype.checkLeft = function(){
	for(var col = 0; col < this.gridSize; ++col){
		for(var row = 0; row < this.gridSize; ++row){
			if(this.currentSet[row][col] == 1){
				if(col == 0){
					if(this.checkSidesHelper(row, col, "left")){ //do not return this.checkSidesHelper because if false we want to continue.
						return true;
					}
				}
				else{
					if(this.currentSet[row][col-1] != 1){
						if(this.checkSidesHelper(row, col, "left")){
							return true;
						}
					}
				}
			}
		}
	}
}
Piece.prototype.checkRight = function(){
	for(var col = this.gridSize-1; col >= 0; --col){
		for(var row = 0; row < this.gridSize; ++row){
			if(this.currentSet[row][col] == 1){
				if(col < this.gridSize-1){
					if(this.currentSet[row][col+1] != 1){
						if(this.checkSidesHelper(row, col, "right")){
							return true;
						}
					}
				}
				else{
					if(this.checkSidesHelper(row, col, "right")){
						return true;
					}
				}
			}
		}
	}
}
Piece.prototype.checkSidesHelper = function(row, col, dir){
	//var buffer = 10; //buffer to check smaller area to prevent clipping due to inaccurate line drawing from neighboring spaces
	if(dir == "right"){
		var offset = col+1;
	}
	if(dir == "left"){
		var offset = col-1;
	}
	var coordX = this.x+(PIXELS*offset)+BUFFER;
	var coordY = this.y+(PIXELS*row)+BUFFER;
	var checkPlacedGrid = placed_context.getImageData(coordX, coordY, BUFFER, BUFFER);
	return checkForColor(checkPlacedGrid);
}
Piece.prototype.moveDown = function(){
	if(this.bottom == GRID_BOTTOM){
 		return false;
 	}
	else{
		if(this.checkUnder()){
			if(this.y != ORIGIN_POS){
				return false;
			}
			else{
				this.draw("placed");
				$('#gameOver').css('display', 'block');
				gameEnd = true;
				return false;
			}
		}
		else{
			return true;
		}
	}
}
Piece.prototype.checkUnder = function(){
	for(var row = this.gridSize-1; row >= 0; --row){
		for(var col = 0; col < this.gridSize; ++col){
			if(this.currentSet[row][col] == 1){
				if(row < this.gridSize-1){	//check if piece segment is the bottom of the piece
					if(this.currentSet[row+1][col] != 1){	//check if there is another piece segment beneath current segment
						if(this.checkUnderHelper(row, col)){//do not return checkUnderHelper because if false we want to continue.
							return true;
						}
					}
				}
				else{
					if(this.checkUnderHelper(row, col)){
						return true;
					}
				}
			}
		}
	}
	return false;
}
Piece.prototype.checkUnderHelper = function(row, col){
	var coordX = this.x+(PIXELS*col)+BUFFER;
	var coordY = this.y+(PIXELS*(row+1))+BUFFER;
	var checkPlacedGrid = placed_context.getImageData(coordX, coordY, BUFFER, BUFFER);
	return checkForColor(checkPlacedGrid);
}
Piece.prototype.draw = function(contextBoard){
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
	for(var x = 0; x < this.gridSize; ++x){
		for(var y = 0; y < this.gridSize; ++y){
			if(this.currentSet[y][x] == 1){
				draw_on_context.rect(this.x+(PIXELS*x), this.y+(PIXELS*y), PIXELS, PIXELS);
				draw_on_context.fillStyle = this.color;
				draw_on_context.fillRect(this.x+(PIXELS*x), this.y+(PIXELS*y), PIXELS-ORIGIN_POS, PIXELS-ORIGIN_POS);
			}
		}
	}
	draw_on_context.closePath();
	draw_on_context.strokeStyle = "#000000";
	draw_on_context.stroke();
}
Piece.prototype.clear = function(){
	for(var i = 0; i < this.gridSize; ++i){
		for(var j = 0; j < this.gridSize; ++j){
			board_context.rect(this.x+(PIXELS*i), this.y+(PIXELS*j), PIXELS, PIXELS);
			board_context.fillStyle = '#888888';
			board_context.fillRect(this.x+(PIXELS*i), this.y+(PIXELS*j), PIXELS, PIXELS);
		}
	}
	board_context.strokeStyle = "#000000";
	board_context.stroke();
}
//pieces
I.prototype = new Piece();
I.prototype.constructor = I;
function I(){
	Piece.call(this, 'iPiece', '#00ffff', 4, 90.5, ORIGIN_POS, ORIGIN_POS+(PIXELS*4), 
		[
			[0,1,0,0],
			[0,1,0,0],
			[0,1,0,0],
			[0,1,0,0]
		]
	);
}
L.prototype = new Piece();
L.prototype.constructor = L;
function L(){
	Piece.call(this, 'lPiece', '#ff6600', 3, 120.5, ORIGIN_POS, ORIGIN_POS+(PIXELS*3), 
		[
			[1,0,0],
			[1,0,0],
			[1,1,0]
		]
	);
}
J.prototype = new Piece();
J.prototype.constructor = J;
function J(){
	Piece.call(this, 'jPiece', '#0000ff', 3, 90.5, ORIGIN_POS, ORIGIN_POS+(PIXELS*3), 
		[
			[0,0,1],
			[0,0,1],
			[0,1,1]
		]
	);
}
T.prototype = new Piece();
T.prototype.constructor = T;
function T(){
	Piece.call(this, 'tPiece', '#9900cc', 3, 90.5, ORIGIN_POS, ORIGIN_POS+(PIXELS*3), 
		[
			[0,1,0],
			[1,1,1],
			[0,0,0]
		]
	);
}
O.prototype = new Piece();
O.prototype.constructor = O;
function O(){
	Piece.call(this, 'oPiece', '#ffff00', 2, 120.5, ORIGIN_POS, ORIGIN_POS+(PIXELS*2), 
		[
			[1,1],
			[1,1]
		]
	);
}
S.prototype = new Piece();
S.prototype.constructor = S;
function S(){
	Piece.call(this, 'sPiece', '#00ff00', 3, 90.5, ORIGIN_POS, ORIGIN_POS+(PIXELS*3), 
		[
			[0,1,1],
			[1,1,0],
			[0,0,0]
		]
	);
}
Z.prototype = new Piece();
Z.prototype.constructor = Z;
function Z(){
	Piece.call(this, 'zPiece', '#ff0000', 3, 120.5, ORIGIN_POS, ORIGIN_POS+(PIXELS*3), 
		[
			[1,1,0],
			[0,1,1],
			[0,0,0]
		]
	);
}

