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
 * 场景加载器 2017/06/20
 */
var SceneLoading = (function (_super) {
    __extends(SceneLoading, _super);
    function SceneLoading() {
        var _this = _super.call(this) || this;
        _this.stageW = egret.MainContext.instance.stage.stageWidth;
        _this.stageH = egret.MainContext.instance.stage.stageHeight;
        _this.ww = 0;
        _this.hh = 0;
        _this._bg = new egret.Bitmap();
        _this.addChild(_this._bg);
        _this.createView();
        // RES.getResByUrl(ResUrlUtil.getLogoUrl(),this.logoLoadComplete,this,RES.ResourceItem.TYPE_IMAGE);
        RES.getResByUrl(ResUrlUtil.getLoadingBgUrl(), _this.logoLoadComplete, _this, RES.ResourceItem.TYPE_IMAGE);
        return _this;
    }
    SceneLoading.prototype.logoLoadComplete = function (event) {
        var img = event;
        if (img) {
            this._bg.texture = img;
            this.ww = this._bg.width;
            this.hh = this._bg.height;
            // this._bg.x = (this.stageW - this.ww)/2;
            this._bg.y = (this.stageH - this.hh) / 2;
        }
    };
    SceneLoading.prototype.createView = function () {
        this._textField = new egret.TextField();
        this.addChild(this._textField);
        //this.textField.x = 100;
        //this.textField.y = 0;
        this._textField.width = 480;
        this._textField.height = 100;
        this._textField.textAlign = "center";
        this._textField.size = 24;
        this._textField.x = (this.stageW - 480) / 2;
        this._textField.y = (this.stageH - 100) / 2 + 240;
        this._textField.text = "场景加载中...   (0/0)";
    };
    SceneLoading.prototype.setProgress = function (current, total) {
        this._textField.text = "\u573A\u666F\u52A0\u8F7D\u4E2D...  (" + current + "/" + total + ")";
    };
    return SceneLoading;
}(egret.Sprite));
__reflect(SceneLoading.prototype, "SceneLoading");
//# sourceMappingURL=SceneLoading.js.map