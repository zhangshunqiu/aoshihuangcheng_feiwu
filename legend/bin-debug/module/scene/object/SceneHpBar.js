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
 * 场景对象血条
 */
var SceneHpBar = (function (_super) {
    __extends(SceneHpBar, _super);
    function SceneHpBar(barWidth, barurl, bgurl) {
        if (barWidth === void 0) { barWidth = 60; }
        if (barurl === void 0) { barurl = "sceneHpBar_png"; }
        if (bgurl === void 0) { bgurl = "sceneHpBg_png"; }
        var _this = _super.call(this) || this;
        _this._barBg = new egret.Bitmap();
        _this._barBg.texture = RES.getRes(bgurl);
        _this.addChild(_this._barBg);
        _this._bar = new egret.Bitmap();
        _this._bar.texture = RES.getRes(barurl);
        _this.addChild(_this._bar);
        _this.setWidth(barWidth);
        _this._barBg.y = 0 - _this._barBg.height / 2;
        _this._bar.y = 0 - _this._bar.height / 2;
        if (_this._hpText == null) {
            _this._hpText = new egret.TextField();
            _this.addChild(_this._hpText);
            //this._hpText.width = 150;
            _this._hpText.height = 20;
            // this.nameText.width = 270;
            // this.nameText.height = 70;
            _this._hpText.textColor = 0xffffff;
            _this._hpText.textAlign = egret.HorizontalAlign.CENTER;
            //this._hpText.x = -75;
            // this.nameText.verticalAlign = egret.VerticalAlign.MIDDLE;
            // this.nameText.strokeColor = 0x000000;
            // this.nameText.stroke = 1;
            //this.nameText.italic = true;
            _this._hpText.size = 19;
            _this._hpText.cacheAsBitmap = true;
            _this._hpText.y = -28;
        }
        return _this;
    }
    SceneHpBar.prototype.setWidth = function (value) {
        if (this._barWidth != value) {
            this._barWidth = value;
            this._barBg.scaleX = value / this._barBg.width;
            this._scaleBar = (value - 2) / this._bar.width;
            this._barBg.x = 0 - value / 2;
            this._bar.x = this._barBg.x + 1;
        }
    };
    SceneHpBar.prototype.setValue = function (curValue, total) {
        //this._bar.scaleX = Math.max(Math.min(curValue/total,1),0)*this._scaleBar;
        egret.Tween.get(this._bar).to({ scaleX: Math.max(Math.min(curValue / total, 1), 0) * this._scaleBar }, 200, egret.Ease.sineOut);
        if (this._hpText) {
            this._hpText.text = curValue + " / " + total;
            this._hpText.x = 0 - this._hpText.width / 2;
        }
    };
    return SceneHpBar;
}(egret.DisplayObjectContainer));
__reflect(SceneHpBar.prototype, "SceneHpBar");
//# sourceMappingURL=SceneHpBar.js.map