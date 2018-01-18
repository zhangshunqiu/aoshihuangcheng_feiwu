var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 *  子页面2
 */
var XxxView2 = (function (_super) {
    __extends(XxxView2, _super);
    function XxxView2(skinName) {
        return _super.call(this, "skinlName") || this;
    }
    XxxView2.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        //this.isCreated = true;
    };
    /**
     * 外面调用 ，可以不要实现
     */
    // public readyOpen(openParam: any = null){
    // 	this.openData = openParam;
    // 	this.__isReadyOpenWin = true;
    // 	if(this.__isCreatComplete){
    // 		this.open(openParam);
    // 	}
    // }
    /**
     * 打开窗口
     */
    XxxView2.prototype.open = function (openParam) {
        if (openParam === void 0) { openParam = null; }
        _super.prototype.open.call(this, openParam);
    };
    /**
     * 清理
     */
    XxxView2.prototype.clear = function (data) {
        if (data === void 0) { data = null; }
        _super.prototype.clear.call(this);
    };
    /**
     * 销毁
     */
    XxxView2.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    return XxxView2;
}(BaseChildView));
__reflect(XxxView2.prototype, "XxxView2");
//# sourceMappingURL=XxxView2.js.map