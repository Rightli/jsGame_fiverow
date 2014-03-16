//预加载图片资源

$.cacheImg('checkerboard','../img/checkerpng/checkerboard.png');
$.cacheImg('white','../img/checkerpng/pieces40/white.png');
$.cacheImg('black','../img/checkerpng/pieces40/black.png');
//var num = 0;
$(function(){
	
	 $('#table').canvas('table').autoAnimation(false);
	 $('#piecestable').canvas('piecestable');
	//$('#table').canvas('table');
	
	$("#gamestartscreen")[0].style.display="block";
    btnInit();
    player.init();
   
});

function viewInit(){
	 //num++;
	 setTimeout(function(){
	 	
	 	 //显示玩家身份
	 	//var position = ( player.me().position + num ) % 2 ;
	    $('$table').entity('identity', {
			dx : $('$table').left('3%'),
			dy : $('$table').top('3%'),
			w : ($('$table').left('90%')/15)*0.5,
			h : ($('$table').left('90%')/15)*0.5,
		}).res(["black","white"][player.me().position]).draw();
		
    	if( player.me().position == 0 ){
	    	 player.isYouOrder = true ;
	    }
    },1000);
    
    
	$('$table').entity('grid', {
		dx : $('$table').left('5%'),
		dy : $('$table').top('10%'),
		w : $('$table').left('90%'),
		h : $('$table').left('90%'),
	}).table(15,15).listen('oncross',function(column,row){
		
		var gap = (this.data('w')/15),
			x = this.data('dx')+(column-1)*gap,
			y = this.data('dy')+(row-1) * gap;
			
		game.drawPiecesEvt( x ,y ,column ,row );
		
	}).draw();
	
	//画悔棋按钮
	var style = {
		rect : {
			'fillcolor':'#fff',
		},
		text : {
			'color':'#888',
			'size' : 16 ,
		},
		
	};
	
	$('$table').entity('back', {
		dx : $('$table').left('20%'),
		dy : $('$table').top('3%'),
		w : $('$table').left('10%'),
		h : $('$table').left('6%'),
		// w : 100,
		// h : 50,
	}).button("悔棋",style ,game.back ).draw();
}


window.lconready = function(){ 
	//玩家都到位触发ready事件之后
	
    $("#gamestartscreen")[0].style.display="none";
	$("#mainScreen")[0].style.display="block";
	
	viewInit();
    game.init();
   
    

}  ;