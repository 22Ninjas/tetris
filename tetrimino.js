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

/*
	get next piece to play
*/
function nextPiece(){
	if(_UNPLAYED_PIECES_ == 0){
		_UNPLAYED_PIECES_ = new Array(_NEXT_PIECE_ARRAY_.length);
		for(var x = 0; x < _NEXT_PIECE_ARRAY_.length; ++x){
			_UNPLAYED_PIECES_[x] = _NEXT_PIECE_ARRAY_[x];
		}
	}
	var arrayLength = _UNPLAYED_PIECES_.length;
	var indexNextPiece = Math.floor(Math.random()*arrayLength);
	var nextPiece = _UNPLAYED_PIECES_[indexNextPiece];
	_UNPLAYED_PIECES_.splice(indexNextPiece,1);
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