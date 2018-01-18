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
* 邮件控制层 2017/06/20.
*/
var game;
(function (game) {
    var MailController = (function (_super) {
        __extends(MailController, _super);
        function MailController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化事件监听
         */
        MailController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 初始化协议
         */
        MailController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            //协议监听示范 ,唯一，只能再一个地方监听
            this.registerProtocal(21001, this.getMailsList, this);
            this.registerProtocal(21002, this.readMail, this);
            this.registerProtocal(21003, this.mailRewardStatus, this);
            this.registerProtocal(21004, this.mailsReceiveStatus, this);
            this.registerProtocal(21005, this.getMail, this);
            this.registerProtocal(21006, this.getMailsList, this);
            //协议发送示范
            //this.sendProtocal(1000,{})
        };
        /**
         * 收到邮件列表
         */
        MailController.prototype.getMailsList = function (mailsData) {
            // console.log(mailsData[0][])
            game.MailModel.getInstance().receiveMails(mailsData);
            App.EventSystem.dispatchEvent(PanelNotify.MAIL_INFO_UPDATE);
            this.updateMailTips();
        };
        /**
         * 收到单条邮件
         */
        MailController.prototype.getMail = function (data) {
            game.MailModel.getInstance().receiveSingleMail(data);
            App.EventSystem.dispatchEvent(PanelNotify.MAIL_INFO_UPDATE);
            this.updateMailTips();
        };
        /**
         * 读取邮件返回
         */
        MailController.prototype.readMail = function (mail) {
            if (mail.id) {
                game.MailModel.getInstance().readMail(mail.id);
                App.EventSystem.dispatchEvent(PanelNotify.MAIL_INFO_UPDATE);
                this.updateMailTips();
            }
        };
        /**
         * 领取邮件返回 // 0背包不足 1成功 邮件id
         */
        MailController.prototype.mailRewardStatus = function (data) {
            if (data.res) {
                game.MailModel.getInstance().mailAttachSingle(data.id);
                App.EventSystem.dispatchEvent(PanelNotify.MAIL_INFO_UPDATE);
                App.EventSystem.dispatchEvent(PanelNotify.MAIL_ATTACHMENT_SUCCESS);
            }
            else {
                GlobalTips.getInstance().showTips("领取附件失败,请检查你的背包容量");
                // console.log("领取附件失败,请检查你的背包");
            }
            this.updateMailTips();
        };
        /**
         * 一键领取附件返回
         */
        MailController.prototype.mailsReceiveStatus = function (data) {
            if (data.length <= 0) {
                //一键领取了0个邮件
                return;
            }
            game.MailModel.getInstance().mailAttachBundle(data);
            App.EventSystem.dispatchEvent(PanelNotify.MAIL_INFO_UPDATE);
            this.updateMailTips();
        };
        MailController.prototype.updateMailTips = function () {
            var mailModel = game.MailModel.getInstance();
            if (mailModel.hasNoReadMail()) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.MAIL, true);
            }
            else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.MAIL, false);
            }
        };
        /**
         * 清理
         */
        MailController.prototype.clear = function () {
            _super.prototype.clear.call(this);
            //清理处理
            // if(this._broadEventId != 0){
            // 	this.removeEventListener(PanelNotify.BROADCAST_PLAY,this._broadEventId);
            // 	this._broadEventId = 0;
            // }
        };
        /**
         * 销毁
         */
        MailController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return MailController;
    }(BaseController));
    game.MailController = MailController;
    __reflect(MailController.prototype, "game.MailController");
})(game || (game = {}));
//# sourceMappingURL=MailController.js.map