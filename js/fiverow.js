

var player = {
	me : null ,	     //position 黑棋(0)   or 白棋(1)
	isYouOrder : null ,    // 控制出牌顺序--->默认是false
	currPos : {}, //[{color : ,pos : column+"_"+row]}]
	back : [],
	myCurr : null, //当前玩家的棋子
	otherCurr : null , //当前对家的棋子
	gap : null, //棋盘格的边长
	column : 15,//棋盘的行数，列数
	row : 15,
	canvasBasex : null , //canvas左上角起点坐标
	canvasBasey : null ,
	colors : [] ,
	// data : {
		// 0 : null,
		// 1 : null,
	// }, //[[],[]] position---sync
	init : function(){
		  // player.data[0] = new SyncArray();
		  // player.data[1] = new SyncArray();
		  // $.sync(player.data);
		  
		  player.isYouOrder = false ;
		  player.colors = [ "black", "white" ] ;
		  player.me = function(){
			 //return JSON.parse($.lc.self());
			 return $.lc.self();
		  };
		  player.currPos = {};
		  player.myCurr = null;
		  player.otherCurr = null;
		 
		
		//？？why	
		$('#mainScreen')[0].setAttribute('width',Config.getInstance().width + 'px');
        $('#mainScreen')[0].setAttribute('height',Config.getInstance().height + 'px');
        $('#backImg')[0].setAttribute('width',Config.getInstance().width + 'px');
        $('#backImg')[0].setAttribute('height',Config.getInstance().height + 'px');
 		
        $("$table").width( Config.getInstance().width );
        $("$table").height( Config.getInstance().height );
        $("$piecestable").width( Config.getInstance().width );
        $("$piecestable").height( Config.getInstance().height );
        
        player.canvasBasex = $("$table").left("5%") ;
		player.canvasBasey = $("$table").top("10%");
		player.gap = $('$table').left('90%')/15;
	},
};


var game = {
	
	init : function(){
		// 初始化棋盘格
		
	},
	
	_caculateXY : function( x ,y ){
		//在棋盘上棋子的左上角坐标点
		
		var str = {
			"x" : x - player.gap*0.4,
			"y" : y - player.gap*0.4,
		};
		return str;
	},
	
	_caculatePos : function( column ,row ){
		//根据column ,row计算出对应的坐标值
		var str ={
			x : (column-1)*player.gap + player.canvasBasex ,
			y : (row-1)*player.gap + player.canvasBasey ,
		};
		
		return str;
	},
	
	drawPieces : function( x ,y ,column ,row ,color ){
		//画出棋子
		
		var str = Config.getInstance().piecesOptions ;
		$.extend( str , { "dx" : x , "dy" : y , "dw" : player.gap*0.8,"dh" : player.gap*0.8 , });
		
		$("$piecestable").entity( color+"_"+column+"_"+row , str ).res( color ).draw();
		//$("$table").entity( color+"_"+column+"_"+row , str ).res( color ).draw();
		
	},
	
	removePieces : function( str ){
		
		 $("$piecestable@"+str.color+"_"+str.name ).remove();
		//$("$table@"+str.color+"_"+str.name ).remove();
	},
	
	hasPieces : function( name ){ 
		//遍历player。currPos数组---〉是否已有column_row
		
		// var message = player.currPos.some(function( value ,index ){
			// if( value.pos == name ){
				// return true ;
			// }
		// });
		var message = !!player.currPos[name] ;
		return message ;
	},
	
	drawPiecesEvt : function( x ,y ,column ,row ){
		//判断此位置是否已经有棋子了且order=true
		
		var name = column+"_"+row ,
			color = player.colors[ player.me().position ] ;
			
		if ( player.isYouOrder && !game.hasPieces( name ) ){
			
			player.isYouOrder = false ;
			
			var pos = game._caculateXY( x ,y ) ;
			game.drawPieces( pos.x ,pos.y ,column ,row ,color ) ;
			
			player.currPos[name] = {color : color ,};
			player.myCurr = {color : color ,name : name };
			player.back[player.me().position] = {color : color ,name : name };
			// player.currPos.push({color : color ,pos : name ,num:{ns:1,ew:1,en_ws:1,es_wn:1} });
			// player.data[ player.me().position ].push();
			var str = {
				'data' : {
					options : color+"_"+column+"_"+row,
                	column : column,
                	row : row ,
				},
				'eventTag' : "dropPieces" ,
			};
			game.notifyAll( str );
			game._isSuccess( column ,row ,color );
            
		}
		// else{
			// console.log("已经有棋子了"+JSON.stringify( player.currPos) );
		// }
	},
	
	_isSuccess : function( column ,row ,color ){//判断输赢
		//var nameArr = name.substr( name.indexOf( "_" ) ).split( "_" ) ;
		var judgeObj = new Judge( column ,row ,color );
		var result = judgeObj.result( );
		if ( result){
			var str = {
				'data' : {info : player.me().name+"success"},
				'eventTag' : "successEvent" ,
			};
			game.notifyAll( str );
		}else{
			
		}
	},
	
	notifyAll : function( str ){
		
		str.from = str.from || player.me();
		$.lc.notify('all', {
                'eventTag' : str.eventTag ,
                'from' : str.from ,
                'data' : str.data ,
            });
	},
	
	back : function(){ //悔棋响应函数
		if( !player.isYouOrder){
			var str = {
				'eventTag' : "goback" ,
				'data' : [],
			};
			game.notifyAll( str );
		}
	},
	
};

$.addRemoteEventListener('dropPieces', function(event){
    var who = event.from.position ,
    	data = event.data ,
    	name = data.options ,
    	pos = game._caculatePos( data.column ,data.row);
    if (who !== player.me().position ){
    	player.isYouOrder = true;
    	
    	var XY = game._caculateXY( pos.x , pos.y );
    	game.drawPieces( XY.x ,XY.y ,data.column ,data.row ,player.colors[who] );
    	
    	player.currPos[ data.column+"_"+ data.row ] = {color : player.colors[who] ,};
    	player.otherCurr = {color : player.colors[who] ,name : data.column+"_"+ data.row };
    	player.back[$.lc.getBackward().position] = {color : color ,name : name };
    	//player.currPos.push({color : player.colors[who] ,pos : data.column+"_"+ data.row });
    	
    }

});

$.addRemoteEventListener('successEvent', function(event){
	$("#again")[0].style.display = "block" ;
	var e = document.getElementById("successInfo");
	player.isYouOrder = false;
	e.innerHTML = event.data.info;
});

$.addRemoteEventListener('goback', function(event){ //悔棋事件
	//删除当前棋子，为当前玩家isOrder置为true，对家置为false
	var mycurr = player.myCurr ,
	othercurr = player.otherCurr ,
	who = event.from.position ;
	
	if( who == player.me().position ){
		player.isYouOrder = true ;
		game.removePieces( mycurr );
		delete player.currPos [ mycurr.name ];
	}else{
		player.isYouOrder = false ;
		game.removePieces( othercurr );
		delete player.currPos[ othercurr.name ] ;
	}
});
