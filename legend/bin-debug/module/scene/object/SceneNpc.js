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
 * 场景NPC对象
 */
var SceneNpc = (function (_super) {
    __extends(SceneNpc, _super);
    function SceneNpc(objectVo) {
        var _this = _super.call(this, objectVo) || this;
        _this.bodyUrl = "";
        return _this;
    }
    /**
     * 初始化
     */
    SceneNpc.prototype.init = function () {
        this.showShadow();
        if (this.vo) {
            this.updateBody(this.vo.bodyId, "");
            this.updateName(this.vo.name);
            this.x = this.vo.posX;
            this.y = this.vo.posY;
            this.setGridPosition(this.vo.gridX, this.vo.gridY);
        }
    };
    /**
     * 更新VO
     */
    SceneNpc.prototype.updateVo = function (vo) {
        this.vo = vo;
        this.init();
    };
    /**
     * 设置格子位置
     */
    SceneNpc.prototype.setGridPosition = function (gx, gy) {
        this._sceneModel.removeGridTablePos(this.vo);
        _super.prototype.setGridPosition.call(this, gx, gy);
        this._sceneModel.addGridTablePos(this.vo);
    };
    /**
      * 更新模型
      */
    SceneNpc.prototype.updateBody = function (bodyUrl, action, scaleX, times) {
        if (bodyUrl === void 0) { bodyUrl = ""; }
        if (action === void 0) { action = ""; }
        if (scaleX === void 0) { scaleX = 1; }
        if (times === void 0) { times = -1; }
        if (this.bodyMc == null) {
            this.bodyMc = new AMovieClip();
            this.addChild(this.bodyMc);
        }
        this.bodyUrl = bodyUrl;
        this.bodyMc.playMCKey(bodyUrl, action, times);
        this.bodyMc.scaleX = scaleX;
    };
    /**
      * 更新名称
      */
    SceneNpc.prototype.updateName = function (text) {
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
            this.nameText.size = 20;
            this.nameText.cacheAsBitmap = true;
        }
        this.nameText.text = this.vo.name;
        this.nameText.x = 0 - this.nameText.textWidth / 2;
        this.nameText.y = 0 - this.nameText.textHeight / 2 - 120;
    };
    /**
     * 更新
     */
    SceneNpc.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    /**
     * 暂停
     */
    SceneNpc.prototype.pause = function () {
        _super.prototype.pause.call(this);
    };
    /**
     * 恢复暂停
     */
    SceneNpc.prototype.resume = function () {
        _super.prototype.resume.call(this);
    };
    /**
     * 销毁
     */
    SceneNpc.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(SceneNpc.prototype, "vo", {
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
    return SceneNpc;
}(SceneBaseObj));
__reflect(SceneNpc.prototype, "SceneNpc");
//# sourceMappingURL=SceneNpc.js.map