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
 * 场景技能效果
 */
var SceneSkillEff = (function (_super) {
    __extends(SceneSkillEff, _super);
    function SceneSkillEff(objectVo) {
        if (objectVo === void 0) { objectVo = null; }
        var _this = _super.call(this, objectVo) || this;
        _this.bodyUrl = "";
        return _this;
    }
    /**
     * 初始化
     */
    SceneSkillEff.prototype.init = function () {
        _super.prototype.init.call(this);
        if (this.vo) {
            this.updateBody(this.vo.bodyId, "");
            this.x = this.vo.posX;
            this.y = this.vo.posY;
            this.setGridPosition(this.vo.gridX, this.vo.gridY);
        }
    };
    /**
     * 更新VO
     */
    SceneSkillEff.prototype.updateVo = function (vo) {
        this.vo = vo;
        this.init();
    };
    /**
      * 更新模型
      */
    SceneSkillEff.prototype.updateBody = function (bodyUrl, action, scaleX, times) {
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
     * 更新
     */
    SceneSkillEff.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.vo.endTime < GlobalModel.getInstance().getTimer()) {
        }
    };
    /**
     * 暂停
     */
    SceneSkillEff.prototype.pause = function () {
        _super.prototype.pause.call(this);
    };
    /**
     * 恢复暂停
     */
    SceneSkillEff.prototype.resume = function () {
        _super.prototype.resume.call(this);
    };
    /**
     * 销毁 不要继承父类的
     */
    SceneSkillEff.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(SceneSkillEff.prototype, "vo", {
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
    return SceneSkillEff;
}(SceneBaseObj));
__reflect(SceneSkillEff.prototype, "SceneSkillEff");
//# sourceMappingURL=SceneSkillEff.js.map