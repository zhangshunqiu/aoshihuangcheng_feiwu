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
 * Author: zhangshunqiu                                      （必须加上，知道是谁做的）
 * Xxx模块模型 2017/06/20.
 */
var XxxModel = (function (_super) {
    __extends(XxxModel, _super);
    function XxxModel() {
        var _this = _super.call(this) || this;
        _this.wingR = {}; //说明要写
        _this._eventSystem = App.EventSystem;
        return _this;
    }
    Object.defineProperty(XxxModel.prototype, "heroVo", {
        /**
         * 英雄Vo
         */
        get: function () {
            return this._heroVo;
        },
        /**
         * 英雄Vo
         */
        set: function (value) {
            this._heroVo = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 更新其他数据
     */
    XxxModel.prototype.updateOther = function (data) {
        //处理更新数据
        this._eventSystem.dispatchEvent(PanelNotify.BOSS_CHALLENGE, {});
    };
    /**
     *  获取其他数据
     */
    XxxModel.prototype.getOtherData = function (id) {
        //处理获取数据
        return this._heroVo;
    };
    /**
     * 清理
     */
    XxxModel.prototype.clear = function () {
        _super.prototype.clear.call(this);
    };
    /**
     * 销毁
     */
    XxxModel.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        //销毁处理
    };
    return XxxModel;
}(BaseModel));
__reflect(XxxModel.prototype, "XxxModel");
//# sourceMappingURL=XxxModel.js.map