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
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 文本提示
 */
var TextTipsItem = (function (_super) {
    __extends(TextTipsItem, _super);
    function TextTipsItem() {
        var _this = _super.call(this) || this;
        _this._timeOutId = 0;
        _this._bgWidth = 180;
        _this._bg = new egret.Bitmap();
        _this.addChild(_this._bg);
        _this._label = new egret.TextField();
        _this.addChild(_this._label);
        RES.getResAsync("common_bg_tips_png", _this.loadComplete, _this);
        return _this;
    }
    TextTipsItem.prototype.loadComplete = function (event) {
        this._bg.texture = event;
        //this.height = 50;
        //this._bg.$invalidate();
        this._bg.width = this._bgWidth;
        this._bg.scale9Grid = new egret.Rectangle(60, 15, 1, 1);
    };
    /**
     * 初始化数据
     */
    TextTipsItem.prototype.init = function (data, color) {
        if (color === void 0) { color = null; }
        if (data) {
            if (typeof (data) == "string") {
                this._label.text = data;
            }
            else if (typeof (data) == "object") {
                this._label.textFlow = data;
            }
            if (color) {
                this._label.textColor = color;
            }
            this._label.x = 0 - this._label.width / 2;
            this._label.y = 0 - this._label.height / 2;
            this._bgWidth = Math.max(this._label.width + 20, 180);
            this._bg.width = this._bgWidth;
            this._bg.height = Math.min(this._label.height + 20, 50);
            this._bg.x = 0 - this._bg.width / 2;
            this._bg.y = 0 - this._bg.height / 2;
        }
        if (this._timeOutId != 0) {
            egret.clearTimeout(this._timeOutId);
        }
        this._timeOutId = egret.setTimeout(this.destroy, this, 1000);
        // this.x = App.stageWidth / 2;
        // this.y = App.stageHeight / 2;
    };
    TextTipsItem.prototype.destroy = function () {
        egret.clearTimeout(this._timeOutId);
        GlobalTips.getInstance().removeTips();
    };
    return TextTipsItem;
}(egret.DisplayObjectContainer));
__reflect(TextTipsItem.prototype, "TextTipsItem");
//# sourceMappingURL=TextTipsItem.js.map