
var Judge = function( column ,row ,color ){
	this.column = column ;
	this.row = row ;
	this.color = color ;
};

//player.currPos
//分四条路径 A（南-北）、 B（东-西） 、 C（西北-东南） 、 D（东北-西南）

Judge.prototype = {
	columnAll : player.column ,
	rowAll : player.row ,
	
	myPos : function(){
		//得到玩家自己的棋子信息
		
		var pos = {};
		for( var i in player.currPos ){
			if( player.currPos[i].color == this.color ){
				pos[i] = player.currPos[i] ;
			}
		}
		
		return pos ;
	},
	judgeNorth_South : function(){
		var col ,numN_S = 1 ,
		    myPos = this.myPos();
		    
		col = this.column+1;
		for( var i=col ;i< this.columnAll ;i++ ){
				var name = i+"_"+this.row ;
				if( !!myPos[ name ] ){
					numN_S++;
				}else{
					break ;
				}
			}	
		
		
		col = this.column - 1 ;
		for( var j=col ;j > 0 ;j-- ){
				var name = j+"_"+this.row ;
				if( !!myPos[ name ] ){
					//alert(col);
					numN_S++;
				}else{
					break ;
				}
			}
		
		return numN_S ;
	},
	judgeWest_East : function(){
		
		var row ,numW_E = 1 ,
		    myPos = this.myPos();
		    
		row = this.row+1;
		for( var i=row ;i< this.rowAll ;i++ ){
				var name = this.column+"_"+i ;
				if( !!myPos[ name ] ){
					numW_E++;
				}else{
					break ;
				}
			}	
		
		
		row = this.row - 1 ;
		for( var j=row ;j > 0 ;j-- ){
				var name = this.column+"_"+j ;
				if( !!myPos[ name ] ){
					//alert(col);
					numW_E++;
				}else{
					break ;
				}
			}
		
		return numW_E ;
	},
	
	judgeWestnorth_Eastsouth : function(){
		
		var row ,col ,numWN_ES = 1 ,
		    myPos = this.myPos();
		    
		row = this.row+1;
		col = this.column + 1;
		for( var i=row, k=col ;i< this.rowAll&&k<this.columnAll ;i++ ,k++){
				var name = k+"_"+i ;
				if( !!myPos[ name ] ){
					numWN_ES++;
				}else{
					break ;
				}
			}	
		
		row = this.row - 1;
		col = this.column - 1;
		for( var j=row ,h=col ;j > 0&&h>0 ;j--,h-- ){
				var name = h+"_"+j ;
				if( !!myPos[ name ] ){
					numWN_ES++;
				}else{
					break ;
				}
			}
		
		return numWN_ES ;
	},
	
	judgeEastnorth_Westsouth : function(){
		
		var row ,col ,numEN_WS = 1 ,
		    myPos = this.myPos();
		    
		row = this.row+1;
		col = this.column - 1;
		for( var i=row, k=col ;i< this.rowAll&&k<this.columnAll ;i++ ,k--){
				var name = k+"_"+i ;
				if( !!myPos[ name ] ){
					numEN_WS++;
				}else{
					break ;
				}
			}	
		
		row = this.row - 1;
		col = this.column + 1;
		for( var j=row ,h=col ;j > 0&&h>0 ;j--,h++ ){
				var name = h+"_"+j ;
				if( !!myPos[ name ] ){
					numEN_WS++;
				}else{
					break ;
				}
			}
		
		return numEN_WS ;
		
	},
	
	result : function(){
		
		if( this.judgeNorth_South()>=5 ){
			return true ;
		}else if( this.judgeWest_East()>=5 ){
			return true ;
		}else if( this.judgeWestnorth_Eastsouth()>=5 ){
			return true ;
		}else if( this.judgeEastnorth_Westsouth()>=5 ){
			return true ;
		}else{
			return false ;
		}
	},
};
