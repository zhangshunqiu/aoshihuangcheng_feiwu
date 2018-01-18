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
 * module : 广播视图
 * author : zrj
*/
var game;
(function (game) {
    var BroadcastView = (function (_super) {
        __extends(BroadcastView, _super);
        function BroadcastView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.y = App.stageHeight / 4 - 30;
            return _this;
        }
        BroadcastView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.gp_main.mask = this.rect_mask;
            this.lb_content = new RichTextField();
            this.addChild(this.lb_content);
            this.lb_content.size = 24;
            this.lb_content.x = this.gp_main.x + 10;
            this.lb_content.y = 9;
        };
        BroadcastView.prototype.play = function (data) {
            this.lb_content.x = this.gp_main.width + 10;
            if (typeof (data) == "string") {
                this.lb_content.textHtml = "<font fontfamily=\"SimHei\" color=0xbfbfbf >" + data + "</font>";
            }
            else if (typeof (data) == "object") {
                this.lb_content.textFlow = data;
            }
            var speed = App.ConfigManager.getConstConfigByType("CHAT_ROLL_SPEED").value;
            egret.Tween.removeTweens(this);
            egret.Tween.get(this.lb_content).to({ x: -this.lb_content.width }, (this.lb_content.width + 520) * speed / 3000).call(function () {
                this.playComplete();
            }, this);
        };
        BroadcastView.prototype.playComplete = function () {
            GlobalTips.getInstance().removeBroadcastTips();
        };
        /**
         * 打开窗口
         */
        BroadcastView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.play(openParam);
        };
        /**
         * 关闭窗口
         */
        BroadcastView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        BroadcastView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            egret.Tween.removeTweens(this);
        };
        /**
         * 销毁
         */
        BroadcastView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return BroadcastView;
    }(BaseView));
    game.BroadcastView = BroadcastView;
    __reflect(BroadcastView.prototype, "game.BroadcastView");
})(game || (game = {}));
//# sourceMappingURL=BroadcastView.js.map