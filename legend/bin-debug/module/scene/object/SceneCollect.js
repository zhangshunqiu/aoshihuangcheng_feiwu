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
 * Email： 21102585@qq.com  2017/6/20
 * 场景采集对象
 */
var SceneCollect = (function (_super) {
    __extends(SceneCollect, _super);
    function SceneCollect(objectVo) {
        return _super.call(this, objectVo) || this;
    }
    /**
     * 初始化
     */
    SceneCollect.prototype.init = function () {
        _super.prototype.init.call(this);
    };
    /**
     * 更新VO
     */
    SceneCollect.prototype.updateVo = function (vo) {
        this.vo = vo;
        this.init();
    };
    /**
     * 设置格子位置
     */
    SceneCollect.prototype.setGridPosition = function (gx, gy) {
        this._sceneModel.removeGridTablePos(this.vo);
        _super.prototype.setGridPosition.call(this, gx, gy);
        this._sceneModel.addGridTablePos(this.vo);
    };
    /**
 * 更新模型
 */
    SceneCollect.prototype.updateBody = function (bodyUrl) {
        if (bodyUrl === void 0) { bodyUrl = ""; }
        if (this.bodyMc == null) {
            this.bodyMc = new egret.Bitmap();
            this.addChild(this.bodyMc);
        }
        if (this.bodyUrl != bodyUrl) {
            this.bodyUrl = bodyUrl;
            RES.getResAsync(bodyUrl, this.loadBodyComplete, this);
        }
    };
    SceneCollect.prototype.loadBodyComplete = function (data) {
        this.bodyMc.texture = data;
        this.bodyMc.x = 0 - this.bodyMc.width / 2;
        this.bodyMc.y = 0 - this.bodyMc.height / 2;
    };
    /**
      * 更新名称
      */
    SceneCollect.prototype.updateName = function (text) {
        if (text === void 0) { text = ""; }
        if (this.nameText == null) {
            this.nameText = new egret.TextField();
            this.addChild(this.nameText);
            // this.nameText.width = 270;
            // this.nameText.height = 70;
            this.nameText.textColor = 0xffffff;
            //this.nameText.textAlign = egret.HorizontalAlign.CENTER;
            // this.nameText.verticalAlign = egret.VerticalAlign.MIDDLE;
            this.nameText.strokeColor = 0x000000;
            this.nameText.stroke = 1;
            //this.nameText.italic = true;
            //this.nameText.size = 18;
            this.nameText.cacheAsBitmap = true;
        }
        this.nameText.text = this.vo.name;
        this.nameText.x = 0 - this.nameText.textWidth / 2;
        //this.nameText.y = 0 - this.nameText.textHeight/2-40;
        this.nameText.italic = false;
        this.nameText.size = 20;
        this.nameText.y = 0 - this.nameText.textHeight / 2 - 40;
    };
    /**
     * 更新
     */
    SceneCollect.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    /**
     * 暂停
     */
    SceneCollect.prototype.pause = function () {
        _super.prototype.pause.call(this);
    };
    /**
     * 恢复暂停
     */
    SceneCollect.prototype.resume = function () {
        _super.prototype.resume.call(this);
    };
    /**
     * 销毁
     */
    SceneCollect.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(SceneCollect.prototype, "vo", {
        /**
         * 获取VO
         */
        get: function () {
            return this._objVo;
        },
        /**
         * 设置VO
         */
        set: function (value) {
            this._objVo = value;
        },
        enumerable: true,
        configurable: true
    });
    return SceneCollect;
}(SceneItem));
__reflect(SceneCollect.prototype, "SceneCollect");
//# sourceMappingURL=SceneCollect.js.map