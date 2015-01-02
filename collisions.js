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
						if(currentPiece.currentSet[row][col+1] != 1){
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
	var checkPlacedGrid = placed_context.getImageData(coordX, coordY, _BUFFER_, _BUFFER_);
	return checkForColor(checkPlacedGrid);
}

/*
	check under
	check under piece to see if it sits on another piece
*/
function checkUnder(){
	for(var row = currentPiece.gridSize-1; row >= 0; --row){
		for(var col = 0; col < currentPiece.gridSize; ++col){
			if(currentPiece.currentSet[row][col] == 1){
				if(row < currentPiece.gridSize-1){	//check if piece segment is the bottom of the piece
					if(currentPiece.currentSet[row+1][col] != 1){	//check if there is another piece segment beneath current segment
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
	var coordX = currentPiece.x+(_PIXELS_*col)+_BUFFER_;
	var coordY = currentPiece.y+(_PIXELS_*(row+1))+_BUFFER_;
	var checkPlacedGrid = placed_context.getImageData(coordX, coordY, _BUFFER_, _BUFFER_);
	return checkForColor(checkPlacedGrid);
}

/*
	check rotation collision
	check for collision with other pieces after a rotation
*/
function checkRotationCollision(transposed_array){
	//var trans_array = createTransposeArray(transposed_array);
	var offsetX = currentPiece.x + _BUFFER_;
	var offsetY = currentPiece.y + _BUFFER_;
	//console.log(transposed_array[3].toString());
	for(row = 0; row < currentPiece.gridSize; ++row){
	 	for(col = 0; col < currentPiece.gridSize; ++col){
	 		var checkPlacedGrid = placed_context.getImageData(offsetX+(_PIXELS_*row), offsetY+(_PIXELS_*col), _BUFFER_, _BUFFER_);
	 		if(checkForColor(checkPlacedGrid) && (transposed_array[col][row] == 1)){
	 			return true;
	 		}
	 	}
	}
	return false;
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