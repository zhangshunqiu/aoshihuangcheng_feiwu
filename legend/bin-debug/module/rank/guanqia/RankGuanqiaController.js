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
 * author:yangyipeng
 * 关卡排行榜控制器
 */
var game;
(function (game) {
    var RankGuanqiaController = (function (_super) {
        __extends(RankGuanqiaController, _super);
        function RankGuanqiaController() {
            var _this = _super.call(this) || this;
            _this._guanqiaModel = game.RankGuanqiaModel.getInstance();
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化事件监听
         */
        RankGuanqiaController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 初始化协议
         */
        RankGuanqiaController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(27009, this.handlerGuanqia, this); //战力
        };
        RankGuanqiaController.prototype.handlerGuanqia = function (data) {
            this._guanqiaModel.ReceiveGuanqiaData(data);
            this.dispatchEvent(PanelNotify.RANK_GUANQIA_UPDATE);
        };
        /**
         * 清理
         */
        RankGuanqiaController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        RankGuanqiaController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return RankGuanqiaController;
    }(BaseController));
    game.RankGuanqiaController = RankGuanqiaController;
    __reflect(RankGuanqiaController.prototype, "game.RankGuanqiaController");
})(game || (game = {}));
//# sourceMappingURL=RankGuanqiaController.js.map