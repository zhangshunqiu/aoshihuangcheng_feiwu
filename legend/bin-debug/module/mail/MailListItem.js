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
* 邮件ListItem UI视图层 2017/06/20.
*/
var game;
(function (game) {
    var MailListItem = (function (_super) {
        __extends(MailListItem, _super);
        function MailListItem() {
            return _super.call(this) || this;
        }
        MailListItem.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.skinName = MailListItemSkin;
            // this.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            // 	// App.WinManager.openWin(WinName.MAIL_DETAIL);
            // 	var detailView = new MailDetail(this.data);
            // 	PopUpManager.addPopUp({obj:detailView,effectType:1,dark:true});
            // 	// (MailModel.getInstance() as MailModel).mailArr.removeItemAt(0);
            // },this);
        };
        MailListItem.prototype.dataChanged = function () {
            this.lb_time.text = this.data.Time;
            // this.lb_theme.text = this.data.Theme;
            if (this.data.isRead) {
                this.lb_theme0.textFlow = [{ text: this.data.Theme, style: { textColor: 0xFFC000 } }, { text: "  已读", style: { textColor: 12566463 } }];
                // this.lb_read.text = "已读"
                // this.lb_read.textColor = 780544;
            }
            else {
                this.lb_theme0.textFlow = [{ text: this.data.Theme, style: { textColor: 0xFFC000 } }, { text: "  未读", style: { textColor: 780544 } }];
                // this.lb_read.text = "未读";
                // this.lb_read.textColor = 12566463;
            }
            if (this.data.rewardState) {
                this.img_reward.visible = false; //已领取
            }
            else {
                this.img_reward.visible = true;
            }
        };
        return MailListItem;
    }(eui.ItemRenderer));
    game.MailListItem = MailListItem;
    __reflect(MailListItem.prototype, "game.MailListItem");
})(game || (game = {}));
//# sourceMappingURL=MailListItem.js.map