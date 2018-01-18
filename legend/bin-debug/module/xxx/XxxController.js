/**
 * Author: zhangshunqiu                                      （必须加上，知道是谁做的）
 * Xxx模块控制器 2017/06/20.
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
//使用方法
//XxxController必须在	MainController里初始化
//如 XxxController.getInstance();
var XxxController = (function (_super) {
    __extends(XxxController, _super);
    function XxxController() {
        var _this = _super.call(this) || this;
        _this._broadEventId = 0;
        _this._broadEventName = "zzz";
        _this._xxxModel = XxxModel.getInstance();
        _this.initProtocol();
        _this.initEventListener();
        return _this;
    }
    /**
     * 初始化事件监听
     */
    XxxController.prototype.initEventListener = function () {
        _super.prototype.initEventListener.call(this);
        if (this._broadEventId == 0) {
            // this._broadEventId = this.addEventListener(PanelNotify.BROADCAST_PLAY,this.onBroadCastPlay,this);
        }
    };
    /**
     * 接收的派发事件
     */
    XxxController.prototype.onBroadCastPlay = function () {
        //处理相应事件
    };
    /**
     * 初始化协议
     */
    XxxController.prototype.initProtocol = function () {
        _super.prototype.initProtocol.call(this);
        //协议监听示范 ,唯一，只能再一个地方监听
        //this.registerProtocal(150214, this.handlerWingInfo, this);
        //协议发送示范
        //this.sendProtocal(1000,{})
    };
    /**
     * 翅膀信息返回
     * @param data any 返回数据
     */
    XxxController.prototype.handlerWingInfo = function (data) {
        //处理协议相关功能
        var info = data;
        //派发事件
        this.dispatchEvent(PanelNotify.WING_INFO_UPDATE, info);
    };
    /**
     * 清理
     */
    XxxController.prototype.clear = function () {
        _super.prototype.clear.call(this);
        //清理处理
        if (this._broadEventId != 0) {
            //this.removeEventListener(PanelNotify.BROADCAST_PLAY,this._broadEventId);
            this._broadEventId = 0;
        }
    };
    /**
     * 销毁
     */
    XxxController.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        //销毁处理
    };
    return XxxController;
}(BaseController));
__reflect(XxxController.prototype, "XxxController");
//# sourceMappingURL=XxxController.js.map