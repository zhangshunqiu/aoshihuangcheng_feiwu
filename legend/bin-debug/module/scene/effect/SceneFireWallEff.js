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
 * 火墙技能效果 2017/10.\
 */
var SceneFireWallEff = (function (_super) {
    __extends(SceneFireWallEff, _super);
    function SceneFireWallEff(vo) {
        var _this = _super.call(this, vo) || this;
        _this.isComplete = false;
        _this.updateVo(vo);
        return _this;
    }
    /**
     * 更新VO
     */
    SceneFireWallEff.prototype.updateVo = function (value) {
        this.isComplete = false;
        this.vo = value;
        this.playMCKey(this.vo.effKey, "", -1);
        this.x = this.vo.targetPos.x;
        this.y = this.vo.targetPos.y;
        //this.scaleX = this._dire.scale;
        // this.atkEffMc.addEventListener(egret.Event.COMPLETE, (e:egret.Event)=>{
        // 	}, this);
    };
    /**
     * 更新
     */
    SceneFireWallEff.prototype.update = function () {
        if (this.vo.endTime < GlobalModel.getInstance().getTimer()) {
            this.vo.callBackFun();
            return false;
        }
        else {
            //根据火墙的位置产生伤害
        }
        return true;
    };
    /**
     * 销毁
     */
    SceneFireWallEff.prototype.destroy = function () {
        this.vo.destroy();
        _super.prototype.destroy.call(this);
    };
    return SceneFireWallEff;
}(BaseEff));
__reflect(SceneFireWallEff.prototype, "SceneFireWallEff");
//# sourceMappingURL=SceneFireWallEff.js.map