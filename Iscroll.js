
// 自执行函数隔离全局作用域
(function(window, document, Math){
	// 创建内部自用的公共方法（和scroll无关的，写在原型对象里也可以的）
	var until = (function(){
		var me = {};
		me.getTime = Date.now || function getTime () { return new Date().getTime(); };
		return me;
	})();
	// 定义滚动对象的构造函数,首字母大写
	function Iscroll(opts) {
		// 容器元素
		this.wrapEl = document.querySelector(opts.selector);
		// 滚动元素
		this.scroller = this.wrapEl.children[0];
		// 设置默认参数
		this.scroller.style.transform = 'translate3d(0px,0px,0px)';
		// 容器元素高度
		var containerHeight = this.wrapEl.offsetHeight;
		// 滚动元素的高度
		var scrollerHeight = this.scroller.offsetHeight;
		// 可以滚动的高度
		this.scrollHeight = containerHeight-scrollerHeight < 0 ? (containerHeight-scrollerHeight):0;
		this._init();
	}
	// 覆盖原型
	Iscroll.prototype = {
		_init: function(el) {
			this._setToutchEvent();
		},
		_setToutchEvent: function() {
			var scroller = this.scroller;
			// touch事件注册
			scroller.addEventListener('touchstart', this, false);
			scroller.addEventListener('touchmove', this, false);
			scroller.addEventListener('touchend', this, false);
		},
		_start:function(event){
			// 初始化记录参数
			this.size = 0;
			this.moveSize = 0;
			this.direction = 0;
			this.startY = event.changedTouches[0]['pageY'];
			this.startPosition = this.getComputedPosition();
			this.startTime = until.getTime();
		},
		_move:function(event){
			event.preventDefault();
			this.size = event.changedTouches[0].pageY - this.startY;
			this.direction = this.size > 0 ? 1:-1;
			this.moveSize = this.size + Number(this.startPosition[1]);
			this.scroller['style']['transform'] = 'translate3d(0px,' + this.moveSize + 'px,0px)';
		},
		_end:function(event){
			event.preventDefault();
			var moveSize = this.moveSize;
			if(moveSize > 0) {
				moveSize = 0;
			}else if (moveSize <= this.scrollHeight) {
				moveSize = this.scrollHeight;
			}
			this.scroller['style']['transform'] = 'translate3d(0,' + moveSize + 'px,0)';
			this.scroller['style']['transition'] = 'transform .3s cubic-bezier(0.333333, 0.666667, 0.666667, 1)';
		},
		getComputedPosition:function(){
			var str = window.getComputedStyle(this.scroller, null);
			var tr = str.getPropertyValue('-webkit-transform') || str.getPropertyValue('transform');
			var values = tr.split('(')[1].split(')')[0].split(',');
			return values.slice(4, 6);
		},
		handleEvent: function(event) {
			switch ( event.type ) {
				case 'touchstart':
					this._start(event);
					break;
				case 'touchmove':
					this._move(event);
					break;
				case 'touchend':
				case 'touchcancel':
					this._end(event);
					break;
			}
		}
	};
	// 移花接木
	Iscroll.until = until;
	// 暴漏出给全局
	window.Iscroll = Iscroll;
})(window,document,Math);