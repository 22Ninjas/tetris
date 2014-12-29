var _PIXELS_ = 30;
var _MAX_INDEX_ = 3; //4th row/col index = 3
var _SIZE_ = 4; //4x4 grid that contains pieces
var _ORIGIN_POS_ = 0.5; //starting pixel position for game (top and left side)
//var _POSITION_ = {origin: _ORIGIN_POS_, bottom: _ORIGIN_POS_+(_PIXELS_*_SIZE_), sides: [90.5,210.5]}; //starting position for pieces

function iPiece(){
				  this.color ='#00ffff'; /*cyan*/
				  this.rotation = 0;
				  this.gridSize = 4;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/ 
				  this.startSet = [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
				 }
function lPiece(){
				  this.color ='#ff6600'; /*orange*/
				  this.rotation = 0;
				  this.gridSize = 3;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,0,0,0],[0,1,0,0],[0,1,0,0],[0,1,1,0]]
				 }
function jPiece(){
				  this.color = '#0000ff'; /*blue*/
				  this.rotation = 0;
				  this.gridSize = 3;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,0,0,0],[0,0,1,0],[0,0,1,0],[0,1,1,0]]
				 }
function tPiece(){
				  this.color = '#9900cc'; /*purple*/
				  this.rotation = 0;
				  this.gridSize = 3;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]]
				 }
function oPiece(){
				  this.color = '#ffff00'; /*yellow*/
				  this.rotation = 0;
				  this.gridSize = 2;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]
				 }
function sPiece(){
				  this.color = '#00ff00'; /*green*/
				  this.rotation = 0;
				  this.gridSize = 3;
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]]
				 }
function zPiece(){
				  this.color = '#ff0000'; /*red*/
				  this.rotation = 0;
				  this.gridSize = 3;
				  this.bottom = _ORIGIN_POS_+(_PIXELS_*this.gridSize);
				  /*coords: _POSITION_,*/
				  this.startSet = [[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]]
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
	currentPiece = z;
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

//listen for keypress
$(function(){
	$('html').keydown(function(e){
		var code = e.which;
		switch(code){
			case 37://left
				
				break;
			
			case 38://up
				rotatePiece();
				e.preventDefault();
				break;
			/*case 39://right
				var rightpx = parseInt($('#littleboxy').css('left'));
				if(rightpx < 978){
					$('#littleboxy').css('left', rightpx+=1);
				}
				break;
			*/
			/*case 40://down
				var downpx = parseInt($('#littleboxy').css('top'));
				if(downpx < 478){
					$('#littleboxy').css('top', downpx+=1);
				}
				break;
			*/
		}
	});
});

function drawPiece(){
	// console.log(currentPiece.set[0].toString());
	// console.log(currentPiece.set[1].toString());
	// console.log(currentPiece.set[2].toString());
	// console.log(currentPiece.set[3].toString());
	for(var x = 0; x < 4; ++x){
		for(var y = 0; y < 4; ++y){
			if(currentPiece.set[y][x] == 1){
				board_context.fillStyle = currentPiece.color;
				board_context.fillRect(currentPiece.coords.sides[0]+(30*x), currentPiece.coords.top+(30*y), 30, 30);

			}
		}
	}
};

function rotatePiece(){
	var original_array = currentPiece.set;
	var transposed_array = [];
	for(var rows = 0; rows < 4; ++rows){
		transposed_array[rows] = [0,0,0,0];
	}
	for(var x = 0; x < original_array.length; ++x){
		for(var y = 0; y < original_array[0].length; ++y){
			transposed_array[y][3-x] = original_array[x][y];
		}
	}
	currentPiece.set = transposed_array;

	clearPiece(); //remove the piece in original orientation
	drawPiece(); //draw the newly rotated piece
};

function clearPiece(){
	for(var i = 0; i < 4; ++i){
		for(var j = 0; j < 4; ++j){
			board_context.rect(currentPiece.coords.sides[0]+(30*i), currentPiece.coords.top+(30*j), 30, 30);
			board_context.fillStyle = '#ffffff';
			board_context.fillRect(currentPiece.coords.sides[0]+(30*i), currentPiece.coords.top+(30*j), 30, 30);
		}
	}
	board_context.strokeStyle = "#eee";
	board_context.stroke();
};