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
* Email： hersletter@qq.com
* 邮件MailDetail UI视图层 2017/06/20.
*/
var game;
(function (game) {
    var MailDetail = (function (_super) {
        __extends(MailDetail, _super);
        function MailDetail(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._eventId1 = 0;
            return _this;
            // this._mailData = this.openData;
            // this._mailData = data;
            // this.skinName = MailDetailSkin;
        }
        MailDetail.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.list_items.itemRenderer = game.MailBaseItem;
            this.list_items.itemRendererSkinName = MailBaseItemSkin;
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerCloseBtn, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerCloseBtn, this);
            this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerReward, this);
        };
        MailDetail.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this);
            if (this._eventId1 == 0) {
                this._eventId1 = App.EventSystem.addEventListener(PanelNotify.MAIL_ATTACHMENT_SUCCESS, this.rewardSuccess, this);
            }
            this._mailData = this.openData;
            this.showViewUi();
            this.readMail();
        };
        MailDetail.prototype.rewardSuccess = function () {
            this.img_reward1.visible = false;
            this.img_reward2.visible = true;
            this.btn_reward.touchEnabled = false;
        };
        MailDetail.prototype.showViewUi = function () {
            //邮件内容
            this.lb_content.textFlow = (new egret.HtmlTextParser).parser(this._mailData.content);
            //邮件附件显示
            if (this._mailData.reward.length > 0) {
                this.list_items.dataProvider = this._mailData.reward;
            }
            //已领取后按钮样式
            if (this._mailData.isRead) {
                this.img_reward1.visible = false;
                this.img_reward2.visible = true;
                this.btn_reward.touchEnabled = false;
            }
            //没有附件时按钮样式
            if (this._mailData.reward.length <= 0) {
                this.gp_attachBtn.visible = false;
                this.lb_attachBtn.visible = true;
            }
            else {
                this.gp_attachBtn.visible = true;
                this.lb_attachBtn.visible = false;
            }
        };
        /**
         * 读取邮件,发送读取协议
         */
        MailDetail.prototype.readMail = function () {
            if (!this._mailData.isRead && this._mailData.reward.length <= 0) {
                // (MailModel.getInstance() as MailModel).readMail(this._mailData.id);
                App.Socket.send(21002, { id: this._mailData.id });
            }
            else {
                return;
            }
        };
        /**
         * 领取附件内容
         */
        MailDetail.prototype.handlerReward = function () {
            if (this._mailData.isRead) {
                return;
            }
            else {
                // (MailModel.getInstance() as MailModel).readMail(this._mailData.id);
                App.Socket.send(21003, { id: this._mailData.id });
            }
        };
        /**
         * 界面返回
         */
        MailDetail.prototype.handlerCloseBtn = function () {
            // PopUpManager.removePopUp(this,0);
            WinManager.getInstance().closePopWin(WinName.POP_MAILDETAIL);
        };
        MailDetail.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this.img_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerCloseBtn, this);
            this.img_return.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerCloseBtn, this);
            if (this._eventId1 != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MAIL_ATTACHMENT_SUCCESS, this._eventId1);
                this._eventId1 = 0;
            }
        };
        MailDetail.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return MailDetail;
    }(BaseView));
    game.MailDetail = MailDetail;
    __reflect(MailDetail.prototype, "game.MailDetail");
})(game || (game = {}));
//# sourceMappingURL=MailDetail.js.map