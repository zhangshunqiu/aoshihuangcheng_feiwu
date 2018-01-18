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
 * 遭遇战每日奖励界面 2017/06/20.
 */
var game;
(function (game) {
    var EncounterRewardView = (function (_super) {
        __extends(EncounterRewardView, _super);
        function EncounterRewardView(vo) {
            return _super.call(this, vo) || this;
            // this.skinName = EncounterRewardViewSkin;
        }
        EncounterRewardView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.closeWin();
            }, this);
            this.list_reward.itemRenderer = game.EncounterRewardListItem;
            this.scroller.verticalScrollBar.visible = false;
            this.scroller.verticalScrollBar.autoVisibility = false;
        };
        /**
         * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
         */
        EncounterRewardView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.showUi();
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        EncounterRewardView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        EncounterRewardView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        EncounterRewardView.prototype.showUi = function () {
            var rewardConfigData = ConfigManager.getInstance().getEncounterRankReward();
            var arr = [];
            for (var key in rewardConfigData) {
                arr.push(rewardConfigData[key]);
            }
            var dataArr = new eui.ArrayCollection(arr);
            this.list_reward.dataProvider = dataArr;
            this.lb_myRank.textFlow = [
                { text: "我的当前排名: ", style: { textColor: 0xf87500 } },
                { text: game.EncounterModel.getInstance().rank + "", style: { textColor: 0xffea00 } }
            ];
        };
        EncounterRewardView.prototype.closeWin = function () {
            // PopUpManager.removePopUp(this);
            WinManager.getInstance().closePopWin(WinName.POP_Encounter_Reward);
        };
        return EncounterRewardView;
    }(BaseView));
    game.EncounterRewardView = EncounterRewardView;
    __reflect(EncounterRewardView.prototype, "game.EncounterRewardView");
})(game || (game = {}));
//# sourceMappingURL=EncounterRewardView.js.map