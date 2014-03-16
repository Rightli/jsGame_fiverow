/**
 * @author Administrator
 */
Mind.fn.Entity.fn.extend({
	button : function( text, style ,fn ) {
		this.data('text', text);
		this.data('style', style);
		this.data('fn', fn);
		this.shape(function() {
			
			var dx = this.data('dx'), 
				dy = this.data('dy'), 
				w = this.data('w'), 
				h = this.data('h'), 
				text = this.data('text'), 
				style = this.data('style');
				
			//画矩形
			this.canvas().rect(dx,dy,dx+w,dy+h,style.rect);
			
			//画文字
			this.canvas().text(dx+w*0.2,dy+h*0.65,text,style.text);
		});
		
		this.tap(function(){
			var fn = this.data('fn');
			fn();
		});
		
		return this;
	}
});
