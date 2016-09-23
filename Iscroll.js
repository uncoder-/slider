/**
 * 首先明确的是touch是分4个事件的，而且对于move，cancel这两个（start触发它们不一定触发）
 * 
 */

// 自执行函数隔离全局作用域
(function(window, document, Math){

	// 创建内部自用的公共方法（和scroll无关的，写在原型对象里也可以的）
	var until = (function(){
		var me = {};

		var _elementStyle = document.createElement('div').style;
		var _vendor = (function () {
			var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'];
			var transform;
			var l = vendors.length;
			for ( var i = 0; i < l; i++ ) {
				transform = vendors[i] + 'ransform';
				if (transform in _elementStyle){
					return vendors[i].substr(0, vendors[i].length-1);
				} 
			}
			return false;
		})();
		function _prefixStyle (style) {
			if ( _vendor === false ) return false;
			if ( _vendor === '' ) return style;
			return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
		}
		// 获取css的兼容性前缀
		var _transform = _prefixStyle('transform');
		var _transition = _prefixStyle('transition');
		var _translate3d = _prefixStyle('translate3d');
		me.transform = _transform;
		me.transition = _transition;
		me.translate3d = _translate3d;
		// 获取当前时间
		me.getTime = Date.now || function getTime(){ return new Date().getTime(); };

		return me;
	})();

	// 定义滚动对象的构造函数,首字母大写
	function Iscroll(opts) {
		// 容器元素
		this.wrapEl = document.querySelector(opts.selector);
		// 滚动元素
		this.scroller = this.wrapEl.children[0];
		// 设置默认参数
		this.scroller['style'][until['']+'transform'] = 'translate3d(0px,0px,0px)';
		// 容器元素高度
		var containerHeight = this.wrapEl.offsetHeight;
		// 滚动元素的高度
		var scrollerHeight = this.scroller.offsetHeight;
		// 可以滚动的高度
		this.scrollHeight = containerHeight-scrollerHeight < 0 ? (containerHeight-scrollerHeight):0;
		this.refresh();
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
			scroller.addEventListener('touchcancel', this, false);
		},
		_start:function(event){
			// 初始化记录参数
			this.size = 0;
			this.moveSize = 0;
			this.direction = 0;
			this.pageY = event.changedTouches[0]['pageY'];
			this.startPosition = this.getComputedPosition();
			this.startTime = until.getTime();
		},
		_move:function(event){
			event.preventDefault();
			// 新的滑动距离
			this.size = event.changedTouches[0].pageY - this.pageY;
			// 判定滑动方向?1向上:-1向下
			this.direction = this.size > 0 ? 1:-1;
			// 真实移动的距离＝已经滑动的距离＋新的滑动距离
			this.moveSize = this.size + Number(this.startPosition[1]);
			this.scroller['style']['transform'] = 'translate3d(0px,' + this.moveSize + 'px,0px)';
		},
		_end:function(event){
			event.preventDefault();
			this.endTime = until.getTime();
			var moveSize = this.moveSize;
			if(moveSize >= 0) {
				moveSize = 0;
			}else if (moveSize <= this.scrollHeight) {
				moveSize = this.scrollHeight;
			}
			this.scroller['style']['transform'] = 'translate3d(0px,' + moveSize + 'px,0px)';
			this.scroller['style']['transition'] = 'transform .3s cubic-bezier(0.333333, 0.666667, 0.666667, 1)';
		},
		getComputedPosition:function(){
			var str = window.getComputedStyle(this.scroller, null);
			var tr = str.getPropertyValue('transform');
			var values = tr.split('(')[1].split(')')[0].split(',');
			return values.slice(4,6);
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
		},
		refresh:function(){
			this.endTime = 0;
		}
	};
	// 移花接木
	Iscroll.until = until;
	// 暴漏出给全局
	window.Iscroll = Iscroll;
})(window,document,Math);