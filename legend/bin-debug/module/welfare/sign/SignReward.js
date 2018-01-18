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
 * Email： 506977655@qq.com
 * 签到额外奖励view界面 2017/11/20.
 */
var game;
(function (game) {
    var SignReward = (function (_super) {
        __extends(SignReward, _super);
        function SignReward(itemData, num) {
            var _this = _super.call(this) || this;
            _this._num = num;
            _this._itemData = itemData;
            _this.skinName = SignRewardSkin;
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeSelf, _this);
            _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.rewardTouch, _this);
            return _this;
        }
        SignReward.prototype.getDay = function () {
            return this._rewardData.day;
        };
        Object.defineProperty(SignReward.prototype, "rewardData", {
            set: function (rewardData) {
                this._rewardData = rewardData;
            },
            enumerable: true,
            configurable: true
        });
        SignReward.prototype.showRewardUi = function () {
            this.showItem();
            this.showDay();
            switch (this._rewardData.state) {
                //（0不能领， 1可领取 2已领取）
                case 0:
                    this.img_state.visible = false;
                    break;
                case 1:
                    this.img_state.visible = false;
                    if (this._movieClip == null) {
                        this._movieClip = new EffectMovieClip();
                        // this._movieClip.frameRate = 1;
                        this._movieClip.x = this.width / 2;
                        this._movieClip.y = this.height / 3;
                        this._movieClip.scaleX = 1;
                        this._movieClip.scaleY = 1;
                        this._movieClip.playMCKey("efficonyuan", "", -1);
                        this.addChild(this._movieClip);
                    }
                    break;
                case 2:
                    this.img_state.visible = true;
                    if (this._movieClip) {
                        this._movieClip.parent.removeChild(this._movieClip);
                        this._movieClip.destroy();
                        this._movieClip = null;
                    }
                    break;
                default:
                    break;
            }
        };
        SignReward.prototype.rewardTouch = function () {
            switch (this._rewardData.state) {
                case 0:
                    console.log("不能领");
                    break;
                case 1:
                    App.Socket.send(23004, { day: this._rewardData.day });
                    break;
                case 2:
                    console.log("已经领");
                    break;
                default:
                    break;
            }
        };
        /**
         * 显示天数
         */
        SignReward.prototype.showDay = function () {
            this.lb_day.text = this._itemData["id"] + "天";
            this.lb_day.textColor = ConstSignRewardTextColor[this._num];
        };
        /**
         * 显示物品图标
         */
        SignReward.prototype.showItem = function () {
            var _this = this;
            var itemArr = this._itemData["extra"][0];
            this.lb_num.text = itemArr[2]; //数量
            var type = itemArr[0]; //类型
            var good_id = itemArr[1]; //物品ID
            var info;
            switch (type) {
                case ClientType.BASE_ITEM:
                    info = App.ConfigManager.itemConfig()[good_id];
                    // var source = RES.getRes(String(info.icon) + "_png");
                    RES.getResAsync(String(info.icon) + "_png", function (texture) {
                        _this.img_item.source = texture;
                    }, this);
                    break;
                case ClientType.EQUIP:
                    info = App.ConfigManager.itemConfig()[good_id];
                    var source = RES.getRes(String(info.icon) + "_png");
                    break;
                default:
                    break;
            }
        };
        SignReward.prototype.removeSelf = function () {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.showRewardUi, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeSelf, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.rewardTouch, this);
        };
        return SignReward;
    }(eui.Component));
    game.SignReward = SignReward;
    __reflect(SignReward.prototype, "game.SignReward");
})(game || (game = {}));
//# sourceMappingURL=SignReward.js.map