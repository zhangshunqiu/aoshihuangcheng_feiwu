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
 * Author: liuyonggen
 * vip系统控制模块 2017/11/21
 */
var game;
(function (game) {
    var VipController = (function (_super) {
        __extends(VipController, _super);
        function VipController() {
            var _this = _super.call(this) || this;
            _this._eventId = 0;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        VipController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(24001, this.handlerVipInterface, this);
            this.registerProtocal(24002, this.handlerVipGetReward, this);
        };
        VipController.prototype.handlerVipInterface = function (data) {
            game.VipModel.getInstance().updateInterfaceInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.VIP_REWARD_UPDATE);
        };
        VipController.prototype.handlerVipGetReward = function (data) {
            if (data) {
                this.dispatchEvent(PanelNotify.VIP_GET_REWARD_SUCCESS);
            }
        };
        /**
        * 初始化事件监听
        */
        VipController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
            if (this._eventId == 0) {
                App.EventSystem.addEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, function () {
                    game.VipModel.getInstance().getVipInfo();
                }, this);
            }
        };
        /**
         * 清理
         */
        VipController.prototype.clear = function () {
            _super.prototype.clear.call(this);
            if (this._eventId != 0) {
                App.EventSystem.dispatchEvent(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this._eventId);
                this._eventId = 0;
            }
        };
        /**
         * 销毁
         */
        VipController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return VipController;
    }(BaseController));
    game.VipController = VipController;
    __reflect(VipController.prototype, "game.VipController");
})(game || (game = {}));
//# sourceMappingURL=VipController.js.map