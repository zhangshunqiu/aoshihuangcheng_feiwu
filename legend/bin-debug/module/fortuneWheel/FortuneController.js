/**
 * Author: yangyipeng                 （必须加上，知道是谁做的）
 * 幸运转盘模块控制器 2017/06/20.
 */
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
var game;
(function (game) {
    var FortuneController = (function (_super) {
        __extends(FortuneController, _super);
        function FortuneController() {
            var _this = _super.call(this) || this;
            _this._fortuneModel = game.FortuneModel.getInstance();
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化事件监听
         */
        FortuneController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 初始化协议
         */
        FortuneController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(35001, this.handlerFortuneViewData, this); //转盘界面数据
            this.registerProtocal(35002, this.handlerFortunePoolData, this); //转盘元宝池 
            this.registerProtocal(35003, this.handlerFortuneStart, this); //转盘开始转动 
            this.registerProtocal(35004, this.handlerFortuneStop, this); //转盘转动结束 
        };
        /**
         * 转盘界面数据
         */
        FortuneController.prototype.handlerFortuneViewData = function (data) {
            // ====转盘界面===
            // message pbDialInterface{
            // 	optional int32 left_time	= 1; // 剩余时间
            // 	optional int32 use_times	= 2; // 已使用次数 
            // }
            this._fortuneModel.fortuneViewData(data);
            if (data.left_time <= 0) {
                App.EventSystem.dispatchEvent(PanelNotify.REMOVE_TOP_BTN, MainUIBtnType.FORTUNE);
            }
            else {
                this.dispatchEvent(PanelNotify.FORTUNE_VIEW_INFO_UPDATE);
            }
        };
        /**
         * 转盘元宝池
         */
        FortuneController.prototype.handlerFortunePoolData = function (data) {
            // message pbDialPool{
            // 	optional int32 gold		= 1;	// 充值数
            // 	optional int32 max_gold	= 2;	// 满值数
            // 	optional string name	= 3;	// 上次幸运玩家名
            // }
            this._fortuneModel.fortunePoolData(data);
            this.dispatchEvent(PanelNotify.FORTUNE_POOL_INFO_UPDATE);
        };
        /**
         * 转盘开始转动
         */
        FortuneController.prototype.handlerFortuneStart = function (data) {
            //pbResult	// 成功返回id, 失败错误提示
            // this._fortuneModel.setFortuneResult(data);
            if (data.result) {
                this.dispatchEvent(PanelNotify.FORTUNE_WHEEL_START, data.result);
            }
        };
        /**
         * 转盘转动结束
         */
        FortuneController.prototype.handlerFortuneStop = function (data) {
            this.dispatchEvent(PanelNotify.FORTUNE_WHEEL_STOP, data.gold);
        };
        /**
         * 清理
         */
        FortuneController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        FortuneController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return FortuneController;
    }(BaseController));
    game.FortuneController = FortuneController;
    __reflect(FortuneController.prototype, "game.FortuneController");
})(game || (game = {}));
//# sourceMappingURL=FortuneController.js.map