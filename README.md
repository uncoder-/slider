### 说明
仿照iscroll的最小移动端实现，只做了webkit内核的兼容
### 用法
```javascript
var scroll = new scroll({
        selector: el,
        inertance: 100
    });
```
- selector为需要滚动的元素
- inertance设置惯性滚动的距离，默认50