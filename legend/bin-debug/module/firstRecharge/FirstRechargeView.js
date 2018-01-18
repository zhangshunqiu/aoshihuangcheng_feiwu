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
 * 首冲模块视图窗口 2017/06/20.
 */
var game;
(function (game) {
    var FirstRechargeView = (function (_super) {
        __extends(FirstRechargeView, _super);
        function FirstRechargeView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            return _super.call(this, viewConf) || this;
        }
        /**
         * 创建皮肤（初始化调用一次）
         */
        FirstRechargeView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.list_charge.itemRenderer = game.FirstRechargeListItem;
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.gp_rewardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerGetReward, this);
        };
        /**
         * 领取首冲奖励
         */
        FirstRechargeView.prototype.handlerGetReward = function () {
            App.Socket.send(28001, {});
        };
        /**
         * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
         */
        FirstRechargeView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.initView();
        };
        FirstRechargeView.prototype.closeWin = function () {
            WinManager.getInstance().closeWin(this.winVo.winName);
        };
        FirstRechargeView.prototype.initView = function () {
            var chargeConfig = ConfigManager.getInstance().getFirstChargeInfo()["1"];
            //首冲大礼包
            var chargeRewardArr = chargeConfig.reward;
            for (var i = 0; i < chargeRewardArr.length; i++) {
                (function (i, gp_reward) {
                    var type = chargeRewardArr[i][0];
                    var good_id = chargeRewardArr[i][1];
                    var num = chargeRewardArr[i][2];
                    var baseItem = new customui.BaseItem();
                    baseItem.setItemNameVisible(true);
                    baseItem.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                        App.GlobalTips.showItemTips(type, good_id, null);
                    }, this);
                    baseItem.updateBaseItem(type, good_id, num);
                    baseItem.setItemNameAtt({ textColor: 0xFA8100 });
                    gp_reward.addChild(baseItem);
                    // console.log(this);//这个this是window
                })(i, this.gp_reward);
            }
            //战力暴涨多少
            this.lb_artifact.text = chargeConfig.grade;
            //根据传入参数判断显示逻辑
            if (this.openData) {
                this.gp_rewardBtn.visible = true;
                this.list_charge.visible = false;
                this.gp_charge.visible = false;
            }
            else {
                //0未首充 1已充未领奖励
                this.gp_rewardBtn.visible = false;
                this.list_charge.visible = true;
                this.gp_charge.visible = true;
                //首冲多少人民币对应奖励元宝
                var chargeArr = chargeConfig.charge_list;
                this.list_charge.dataProvider = new eui.ArrayCollection(chargeArr);
            }
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        FirstRechargeView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        FirstRechargeView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return FirstRechargeView;
    }(BaseView));
    game.FirstRechargeView = FirstRechargeView;
    __reflect(FirstRechargeView.prototype, "game.FirstRechargeView");
})(game || (game = {}));
//# sourceMappingURL=FirstRechargeView.js.map