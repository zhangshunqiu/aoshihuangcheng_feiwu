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
* 签到UI界面逻辑 2017/06/20.
*/
var game;
(function (game) {
    var SignView = (function (_super) {
        __extends(SignView, _super);
        function SignView(skinName) {
            var _this = _super.call(this, "SignViewSkin") || this;
            _this._event1 = 0;
            return _this;
        }
        SignView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        /**
         * 打开窗口
         */
        SignView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            if (this._event1 == 0) {
                App.EventSystem.addEventListener(PanelNotify.SIGN_INFO_UPDATE, this.handlerGetSigns, this);
            }
            //请求签到数据
            if (!game.SignModel.getInstance().hasData) {
                App.Socket.send(23001, {});
            }
            else {
                this.signItemsUpdate();
                this.listRewardUpdate();
                this.progressUpdate();
            }
            this.list_signItem.itemRenderer = game.SignItem;
        };
        /**
         * 清理
         */
        SignView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._event1 != 0) {
                App.EventSystem.removeEventListener(PanelNotify.SIGN_INFO_UPDATE);
            }
        };
        /**
         * 销毁
         */
        SignView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 创建额外奖励列表
         */
        SignView.prototype.initView = function () {
            // var rewardList = (SignModel.getInstance() as SignModel).reward;
            var signConfig = ConfigManager.getInstance().getSignInfo();
            var signRewardId = 0;
            for (var key in signConfig) {
                if (signConfig[key]["extra"].length > 0) {
                    // var signReward = signConfig[key]["extra"][0];
                    var itemData = signConfig[key];
                    this.gp_reward.addChild(new game.SignReward(itemData, signRewardId));
                    signRewardId++;
                }
            }
        };
        /**
         * 签到列表数据返回
         */
        SignView.prototype.handlerGetSigns = function () {
            this.signItemsUpdate();
            this.listRewardUpdate();
            this.progressUpdate();
        };
        /**
         * SignItem数据更新
         */
        SignView.prototype.signItemsUpdate = function () {
            this.list_signItem.dataProvider = game.SignModel.getInstance().signItemArr;
        };
        /**
         * 额外奖励数据更新
         */
        SignView.prototype.listRewardUpdate = function () {
            var rewardList = game.SignModel.getInstance().reward;
            for (var i = 0; i < rewardList.length; i++) {
                var totalLen = this.gp_reward.width;
                var days = rewardList[i]["day"];
                var signReward = this.gp_reward.getChildAt(i);
                signReward.x = (days / 30) * totalLen - 120;
                signReward.rewardData = rewardList[i];
                signReward.showRewardUi();
            }
        };
        /**
         * 更新进度条
         */
        SignView.prototype.progressUpdate = function () {
            var signDays = game.SignModel.getInstance().signDays;
            var totalDays = 30;
            this.progressBar.value = Math.floor((signDays / totalDays) * 100);
        };
        return SignView;
    }(BaseChildView));
    game.SignView = SignView;
    __reflect(SignView.prototype, "game.SignView");
})(game || (game = {}));
//# sourceMappingURL=SignView.js.map