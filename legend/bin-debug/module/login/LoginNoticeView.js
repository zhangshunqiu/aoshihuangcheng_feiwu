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
* Author: lihe
* Email： hersletter@qq.com
* 登陆公告UI界面逻辑 2017/06/20.
*/
var game;
(function (game) {
    var LoginNoticeView = (function (_super) {
        __extends(LoginNoticeView, _super);
        function LoginNoticeView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            return _super.call(this, viewConf) || this;
        }
        LoginNoticeView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
            this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.LOGIN_NOTICE);
            }, this);
            this.scroller.viewport = this.vp_scr;
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
        };
        LoginNoticeView.prototype.initView = function () {
        };
        /**
         * 打开窗口
        */
        LoginNoticeView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            // App.Socket.send(16001,{});
            var data = game.LoginModel.getInstance().getNotice();
            this.lb_title.textFlow = (new egret.HtmlTextParser).parser(data.top);
            this.lb_content.textFlow = (new egret.HtmlTextParser).parser(data.word);
        };
        /**
         * 关闭窗口
         */
        LoginNoticeView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        LoginNoticeView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        LoginNoticeView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return LoginNoticeView;
    }(BaseView));
    game.LoginNoticeView = LoginNoticeView;
    __reflect(LoginNoticeView.prototype, "game.LoginNoticeView");
})(game || (game = {}));
//# sourceMappingURL=LoginNoticeView.js.map