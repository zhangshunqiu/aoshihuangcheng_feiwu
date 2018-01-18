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
 * 福利公告界面 2017/06/20.
 */
var game;
(function (game) {
    /**
     *  公告界面
     */
    var WelfareNoteView = (function (_super) {
        __extends(WelfareNoteView, _super);
        function WelfareNoteView(skinName) {
            return _super.call(this, "WelfareNoteSkin") || this;
        }
        WelfareNoteView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            //this.isCreated = true;
            this.btn_noteback.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.WELFARE);
            }, this);
            //公告
            this.scr_note.viewport = this.vp_note;
            this.scr_note.scrollPolicyH = eui.ScrollPolicy.OFF;
        };
        /**
         * 打开窗口
         */
        WelfareNoteView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            var data = game.LoginModel.getInstance().getNotice();
            this.lb_notetitle.textFlow = (new egret.HtmlTextParser).parser(data.top);
            this.lb_notecontent.textFlow = (new egret.HtmlTextParser).parser(data.word);
        };
        /**
         * 清理
         */
        WelfareNoteView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        WelfareNoteView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WelfareNoteView;
    }(BaseChildView));
    game.WelfareNoteView = WelfareNoteView;
    __reflect(WelfareNoteView.prototype, "game.WelfareNoteView");
})(game || (game = {}));
//# sourceMappingURL=WelfareNoteView.js.map