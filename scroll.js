"use strict";

function scroll(opts) {
	this.wrapEl = document.querySelector(opts.selector);
	this.scroller = this.wrapEl.children[0];
	this.init();
}
scroll.prototype = {
	init: function(el) {
		this.scroller.style.transform = 'translate3d(0,0,0)';
		this.setToutchEvent();
	},
	setToutchEvent: function() {
		var scroller = this.scroller;
		// 容器高度
		var containerHeight = this.wrapEl.offsetHeight;
		// 滚动元素的高度
		var scrollerHeight = scroller.offsetHeight;
		// 可以滚动的高度
		var scrollHeight = Number((scrollerHeight - containerHeight) > 0 ? (scrollerHeight - containerHeight):0);
		
		// 初始化记录参数
		var startY = 0;
		var startPosition = 0;
		var startTimestamp = 0;
		var size = 0;
		var moveSize = 0;
		var direction = 0;

		// touch事件注册
		scroller.addEventListener('touchstart', function(event) {
			this['style']['transition'] = 'none';
			startY = event.changedTouches[0]['pageY'];
			startPosition = getTranslate(this);
			size = 0;
			startTimestamp = Date.now();
			event.preventDefault();
		}, false);
		scroller.addEventListener('touchmove', function(event) {
			size = event.changedTouches[0].pageY - startY;
			direction = size > 0 ? 1:-1;
			moveSize = size + Number(startPosition[1]);
			this['style']['transform'] = 'translate3d(0,' + moveSize + 'px,0)';
		}, false);
		scroller.addEventListener('touchend', function(event) {
			var endPosition = getTranslate(this);
			// 惯性滑动距离
			var time = (Date.now()-startTimestamp)/1000;
			var fingerSpeed = Math.abs(size/time).toFixed(2);
			var distance = direction*(fingerSpeed)*0.5;
			if(fingerSpeed>0.5 && time>0.1){
				moveSize = moveSize + distance;
			}
			if(moveSize > 0) {
				moveSize = 0;
			}else if (moveSize < -scrollHeight) {
				moveSize = -1*scrollHeight;
			}
			this['style']['transform'] = 'translate3d(0,' + moveSize + 'px,0)';
			this['style']['transition'] = 'transform '+(time)+'s cubic-bezier(0.333333, 0.666667, 0.666667, 1)';
			console.log(fingerSpeed);
			document.querySelector('header').innerHTML = fingerSpeed;
		}, false);
		// 获取位置
		function getTranslate(el) {
			var str = window.getComputedStyle(el, null);
			var tr = str.getPropertyValue('-webkit-transform') || str.getPropertyValue('transform');
			var values = tr.split('(')[1].split(')')[0].split(',');
			return values.slice(4, 6);
		}
	}
};