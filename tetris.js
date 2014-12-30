var _PIXELS_ = 30; //length and width in pixels for a grid space
var _MAX_INDEX_ = 3; //4th row/col index = 3
//var _SIZE_ = 4; //4x4 grid that contains pieces
//var _MAX_ROT_STATE_ = 3; //rotation states: 0, 1, 2, 3
var _ORIGIN_POS_ = 0.5; //starting pixel position for game (top and left side)
var _MAX_RIGHT_ = 300.5;
var _GRID_BOTTOM_ = 600.5;
//var _POSITION_ = {origin: _ORIGIN_POS_, bottom: _ORIGIN_POS_+(_PIXELS_*_SIZE_), sides: [90.5,210.5]}; //starting position for pieces


//pieces
function iPiece(){
				  this.color ='#00ffff'; /*cyan*/
				  //this.rotation = 0;
				  this.gridSize = 4;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/ 
				  this.startSet = [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
				  this.currentSet = [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
				  this.x = 90.5;
				  this.y = _ORIGIN_POS_;
				 }
function lPiece(){
				  this.color ='#ff6600'; /*orange*/
				  //this.rotation = 0;
				  this.gridSize = 3;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[1,0,0],[1,0,0],[1,1,0]];
				  this.currentSet = [[1,0,0],[1,0,0],[1,1,0]];
				  this.x = 120.5;
				  this.y = _ORIGIN_POS_;
				 }
function jPiece(){
				  this.color = '#0000ff'; /*blue*/
				  //this.rotation = 0;
				  this.gridSize = 3;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,0,1],[0,0,1],[0,1,1]];
  				  this.currentSet = [[0,0,1],[0,0,1],[0,1,1]];
  				  this.x = 90.5;
  				  this.y = _ORIGIN_POS_;
				 }
function tPiece(){
				  this.color = '#9900cc'; /*purple*/
				  //this.rotation = 0;
				  this.gridSize = 3;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,1,0],[1,1,1],[0,0,0]];
				  this.currentSet = [[0,1,0],[1,1,1],[0,0,0]];
				  this.x = 90.5;
				  this.y = _ORIGIN_POS_;
				 }
function oPiece(){
				  this.color = '#ffff00'; /*yellow*/
				  //this.rotation = 0;
				  this.gridSize = 2;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[1,1],[1,1]];
				  this.currentSet = [[1,1],[1,1]];
				  this.x = 120.5;
				  this.y = _ORIGIN_POS_;
				 }
function sPiece(){
				  this.color = '#00ff00'; /*green*/
				  //this.rotation = 0;
				  this.gridSize = 3;
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,1,1],[1,1,0],[0,0,0]];
				  this.currentSet = [[0,1,1],[1,1,0],[0,0,0]];
				  this.x = 90.5;
				  this.y = _ORIGIN_POS_;
				 }
function zPiece(){
				  this.color = '#ff0000'; /*red*/
				  //this.rotation = 0;
				  this.gridSize = 3;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[1,1,0],[0,1,1],[0,0,0]];
				  this.currentSet = [[1,1,0],[0,1,1],[0,0,0]];
				  this.x = 120.5;
				  this.y = _ORIGIN_POS_;
				 }

var board;
var board_context;
var currentPiece;
$(function(){
	board = document.getElementById("tetrisboard");
	board_context = board.getContext("2d");
	board_context.rect(0, 0, $('#tetrisboard').width(), $('tetrisboard').height());
	board_context.stroke();

	for(var x = 0.5; x < 300; x+=30){
		for(var y = 0.5; y < 600; y+=30){
			board_context.rect(x, y, 30, 30);
		}
	}
	board_context.strokeStyle = "#eee";
	board_context.stroke();
	currentPiece = new iPiece();
	drawPiece(currentPiece);
	/*
	board_context.beginPath();
	for(var x = 0.5; x < $('#tetrisboard').width(); x+=($('#tetrisboard').width()/10)){
		board_context.moveTo(x,0);
		board_context.lineTo(x,$('#tetrisboard').height());
	}
	board_context.strokeStyle = "#eee";
	board_context.stroke();
	board_context.beginPath();
	for(var y = 0.5; y < $('#tetrisboard').height(); y+=($('#tetrisboard').height()/20)){
		board_context.moveTo(0,y);
		board_context.lineTo($('#tetrisboard').width(),y);
	}
	board_context.strokeStyle = "#eee";
	board_context.stroke();
	*/
});

/*
	listen for keypress
*/
$(function(){
	$('html').keydown(function(e){
		var code = e.which;
		switch(code){
			case 37://left
				movePieceSide("left");
				e.preventDefault();
				break;
			case 38://up
				rotatePiece();
				e.preventDefault();
				break;
			case 39://right
				movePieceSide("right");
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
function drawPiece(){
	// console.log(currentPiece.set[0].toString());
	// console.log(currentPiece.set[1].toString());
	// console.log(currentPiece.set[2].toString());
	// console.log(currentPiece.set[3].toString());
	board_context.beginPath();
	for(var x = 0; x < currentPiece.gridSize; ++x){
		for(var y = 0; y < currentPiece.gridSize; ++y){
			if(currentPiece.currentSet[y][x] == 1){
				board_context.fillStyle = currentPiece.color;
				board_context.fillRect(currentPiece.x+(_PIXELS_*x), currentPiece.y+(_PIXELS_*y), _PIXELS_, _PIXELS_);
			}
			//debugging purposes
			board_context.rect(currentPiece.x+(_PIXELS_*x), currentPiece.y+(_PIXELS_*y), _PIXELS_, _PIXELS_);
			board_context.strokeStyle = '#000';
			board_context.stroke();
		}
	}
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
	currentPiece.currentSet = transposed_array;
	checkRotation();
	clearPiece(); //remove the piece in original orientation
	drawPiece(); //draw the newly rotated piece
};

/*
	check if rotation goes off board
	if the piece (or part of it) gets drawn off board shit it over so it fits on the grid properly
*/
function checkRotation(){
	var shift = 0;
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
	}
	else if(currentPiece.x + (_PIXELS_*currentPiece.gridSize) > _MAX_RIGHT_){
		var colOverflow = (currentPiece.x+(_PIXELS_*currentPiece.gridSize)-_MAX_RIGHT_)/_PIXELS_;
		console.log(colOverflow);
		for(var col = currentPiece.gridSize-1; col >= currentPiece.gridSize-colOverflow; --col){
			for(var row = 0; row < currentPiece.gridSize; ++row){
				if(currentPiece.currentSet[row][col] == 1){
					shift -= 1;
					break;
				}
			}
		}
	}
	currentPiece.x += 30*shift;
}

/*
	move piece left and right
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
			drawPiece();
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
			currentPiece.x += 30;
			drawPiece();
		}
	}
	else{
		throw "Error: WHAT ARE YOU DOING??? invalid direction code";
	}
}

/*
	move piece down
	(should be automatically called ever certain time interval eventually)
*/
function movePieceDown(){
	clearPiece();
	currentPiece.y += 30;
	drawPiece();
}

/*
	check bottom
	see if the piece sits on another piece or has reached the bottom of grid
*/// 
// function checkBottom(){
// 	if(currentPiece.bottom == 
// }
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
