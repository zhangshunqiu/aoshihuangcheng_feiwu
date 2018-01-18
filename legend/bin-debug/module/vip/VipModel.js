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
 * Author: liuyonggen
 * Vip系统数据模型 2017/11/21
 */
var game;
(function (game) {
    var VipModel = (function (_super) {
        __extends(VipModel, _super);
        function VipModel() {
            var _this = _super.call(this) || this;
            _this.vipInfo = {};
            _this.nextVipInfo = {};
            _this.vipArr = [];
            _this.upGold = 0;
            _this.currentIndex = 0;
            _this.hasReward = false;
            _this.getVipInfo();
            return _this;
        }
        VipModel.prototype.getVipInfo = function () {
            this.vipArr = [];
            this.vipInfo = App.ConfigManager.getVipInfoById(App.RoleManager.roleInfo.vipLv);
            if (this.vipInfo.vip != 10) {
                this.nextVipInfo = App.ConfigManager.getVipInfoById(this.vipInfo.vip + 1);
                this.currentIndex = this.vipInfo.vip + 1;
            }
            else {
                this.currentIndex = this.vipInfo.vip;
            }
            for (var i = 0; i <= 10; i++) {
                var vipInfo = App.ConfigManager.getVipInfoById(i);
                this.vipArr.push(vipInfo);
            }
        };
        VipModel.prototype.updateInterfaceInfo = function (data) {
            this.upGold = data.up_gold;
            var rewardList = data.reward_list;
            for (var i = 0; i < rewardList.length; i++) {
                this.vipArr[i].rewardList = rewardList[i];
            }
            for (var i = 0; i < rewardList.length; i++) {
                if (rewardList[i].state == 1) {
                    this.currentIndex = rewardList[i].lv;
                    this.hasReward = true;
                    break;
                }
            }
        };
        VipModel.prototype.btnRedTip = function () {
            for (var i = 0; i < this.vipArr.length; i++) {
                if (this.vipArr[i].rewardList.state == 1) {
                    this.hasReward = true;
                    return;
                }
            }
            this.hasReward = false;
        };
        /**
         * 清理
         */
        VipModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        VipModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return VipModel;
    }(BaseModel));
    game.VipModel = VipModel;
    __reflect(VipModel.prototype, "game.VipModel");
})(game || (game = {}));
//# sourceMappingURL=VipModel.js.map