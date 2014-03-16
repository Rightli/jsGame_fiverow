
//为button注册事件监听器

function btnInit(){
	$("#start")[0].addEventListener("click",btnAction.disappearAll($("#start")[0]),false);
    $("#quit")[0].addEventListener("click",btnAction.disappearAll($("#quit")[0]),false);
    $("#start")[0].addEventListener("click",btnAction.ready,false);
    $("#quit")[0].addEventListener("click",btnAction.quit,false);
    //$("#back")[0].addEventListener("click",btnAction.back,false); //悔棋事件监听器
    $("#playAgain")[0].addEventListener("click",btnAction.disappearAlla($("#playAgain")[0]),false);
    $("#close")[0].addEventListener("click",btnAction.disappearAlla($("#close")[0]),false);
    $("#playAgain")[0].addEventListener("click",btnAction.playAgain,false);
    $("#close")[0].addEventListener("click",btnAction.close,false);

}


var btnAction = {
    ready: function(){
        $.lc.ready();       //发送准备完毕消息
    },
    quit: function(){
       // console.log("bye");
    },
    disappearAll: function(e){
        return function(){
    //        ele.style.display = "none";
            e.parentNode.style.display = "none";
        };
    },
    disappearAlla: function(e){
        return function(){
    //        ele.style.display = "none";
            e.parentNode.parentNode.style.display = "none";
        };
    },
    back : function(){
    	game.back();
    },
    playAgain : function(){
    	$("$table").clearAll(); //?clear了什么？
    	$("$piecestable").clearAll(); 
    	
    	player.init();
    	viewInit();
    	game.init();
    },
    close : function(){
    	//$.lc.close();  
    },
    
};


