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
 * 场景伙伴对象
 */
var ScenePartner = (function (_super) {
    __extends(ScenePartner, _super);
    function ScenePartner(objectVo) {
        return _super.call(this, objectVo) || this;
    }
    //更新移动次数和步长
    ScenePartner.prototype.updateMoveStepTimes = function (pos, times, dire) {
        _super.prototype.updateMoveStepTimes.call(this, pos, times, dire);
        // let sendData ={obj_type:this.vo.type,obj_id:this.vo.id,begin_x:Math.floor(this.vo.posX),begin_y:Math.floor(this.vo.posY),end_x:Math.floor(this.endPoint[0]),end_y:Math.floor(this.endPoint[1]),direction:this.vo.dire.dire8};
        // App.Socket.send(11002,sendData);
    };
    /**
     * 更新
     */
    ScenePartner.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    /**
     * 暂停
     */
    ScenePartner.prototype.pause = function () {
        _super.prototype.pause.call(this);
    };
    /**
     * 恢复暂停
     */
    ScenePartner.prototype.resume = function () {
        _super.prototype.resume.call(this);
    };
    /**
     * 销毁
     */
    ScenePartner.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(ScenePartner.prototype, "vo", {
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
    return ScenePartner;
}(ScenePlayer));
__reflect(ScenePartner.prototype, "ScenePartner");
//# sourceMappingURL=ScenePartner.js.map