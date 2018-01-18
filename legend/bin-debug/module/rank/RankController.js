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
 * Author: yangyipeng
 * 排行榜模块控制器
 */
var game;
(function (game) {
    var RankController = (function (_super) {
        __extends(RankController, _super);
        function RankController() {
            var _this = _super.call(this) || this;
            _this._rankModel = game.RankModel.getInstance();
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化事件监听
         */
        RankController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 接收的派发事件
         */
        RankController.prototype.onBroadCastPlay = function () {
            //处理相应事件
        };
        /**
         * 初始化协议
         */
        RankController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            //协议监听示范 ,唯一，只能再一个地方监听
            this.registerProtocal(27001, this.handlerCombat, this); //战力
            this.registerProtocal(27002, this.handlerLv, this); //等级
            this.registerProtocal(27003, this.handlerFighter, this); //战圣
            this.registerProtocal(27004, this.handlerMagic, this); //法神
            this.registerProtocal(27005, this.handlerTaoist, this); //道尊
            this.registerProtocal(27006, this.handlerKill, this); //遭遇
            this.registerProtocal(27007, this.handlerMemal, this); //勋章
            this.registerProtocal(27008, this.handlerKing, this); //王者榜
            this.registerProtocal(27020, this.handlerWorship, this); //膜拜
        };
        RankController.prototype.handlerCombat = function (data) {
            if (data["list"].length > 0) {
                this._rankModel.rankCombat(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE, ConstRankName.COMBAT);
            }
            else {
                this._rankModel.setWorShip(data["worship"], ConstRankName.COMBAT);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING, ConstRankName.COMBAT);
            }
        };
        RankController.prototype.handlerLv = function (data) {
            if (data["list"].length > 0) {
                this._rankModel.rankLevel(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE, ConstRankName.LEVEL);
            }
            else {
                this._rankModel.setWorShip(data["worship"], ConstRankName.LEVEL);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING, ConstRankName.LEVEL);
            }
        };
        RankController.prototype.handlerFighter = function (data) {
            if (data["list"].length > 0) {
                this._rankModel.rankFighter(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE, ConstRankName.FIGHTER);
            }
            else {
                this._rankModel.setWorShip(data["worship"], ConstRankName.FIGHTER);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING, ConstRankName.FIGHTER);
            }
        };
        RankController.prototype.handlerMagic = function (data) {
            if (data["list"].length > 0) {
                this._rankModel.rankMagic(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE, ConstRankName.MAGIC);
            }
            else {
                this._rankModel.setWorShip(data["worship"], ConstRankName.MAGIC);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING, ConstRankName.MAGIC);
            }
        };
        RankController.prototype.handlerTaoist = function (data) {
            if (data["list"].length > 0) {
                this._rankModel.rankTaoist(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE, ConstRankName.TAOIST);
            }
            else {
                this._rankModel.setWorShip(data["worship"], ConstRankName.TAOIST);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING, ConstRankName.TAOIST);
            }
        };
        RankController.prototype.handlerKill = function (data) {
            if (data["list"].length > 0) {
                this._rankModel.rankKill(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE, ConstRankName.KILL);
            }
            else {
                this._rankModel.setWorShip(data["worship"], ConstRankName.KILL);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING, ConstRankName.KILL);
            }
        };
        RankController.prototype.handlerMemal = function (data) {
            if (data["list"].length > 0) {
                this._rankModel.rankMemal(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE, ConstRankName.MEMAL);
            }
            else {
                this._rankModel.setWorShip(data["worship"], ConstRankName.MEMAL);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING, ConstRankName.MEMAL);
            }
        };
        RankController.prototype.handlerKing = function (data) {
            if (data["list"].length > 0) {
                this._rankModel.rankKing(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE, ConstRankName.KING);
            }
            else {
                this._rankModel.setWorShip(data["worship"], ConstRankName.KING);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING, ConstRankName.KING);
            }
        };
        RankController.prototype.handlerWorship = function (data) {
            if (data.result) {
                this._rankModel.worship(data.result);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_WORSHIP_UPDATE);
            }
            else {
                console.log("膜拜失败");
            }
        };
        /**
         * 翅膀信息返回
         * @param data any 返回数据
         */
        // private handlerWingInfo(data) {
        //     //处理协议相关功能
        //     var info:any = data;
        //     //派发事件
        //     this.dispatchEvent(PanelNotify.WING_INFO_UPDATE,info);
        // }
        /**
         * 清理
         */
        RankController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        RankController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return RankController;
    }(BaseController));
    game.RankController = RankController;
    __reflect(RankController.prototype, "game.RankController");
})(game || (game = {}));
//# sourceMappingURL=RankController.js.map