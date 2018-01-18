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
 * 签到数据层逻辑 2017/06/20.
 */
var game;
(function (game) {
    var SignModel = (function (_super) {
        __extends(SignModel, _super);
        function SignModel() {
            var _this = _super.call(this) || this;
            _this._itemsArr = new eui.ArrayCollection([]);
            _this._rewardStatus = [{ day: 1, state: 2 }, { day: 1, state: 2 }, { day: 1, state: 2 }, { day: 1, state: 2 }, { day: 1, state: 2 }]; //额外奖励
            _this._hasData = false; //是否有数据，没有请求
            return _this;
        }
        Object.defineProperty(SignModel.prototype, "signItemArr", {
            get: function () {
                return this._itemsArr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignModel.prototype, "signDays", {
            get: function () {
                return this._signDays;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignModel.prototype, "canSignDays", {
            get: function () {
                return this._canSignDays;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignModel.prototype, "reward", {
            get: function () {
                return this._rewardStatus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignModel.prototype, "hasData", {
            get: function () {
                return this._hasData;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 拿到签到界面数据
         *
         */
        SignModel.prototype.setSignViewData = function (data) {
            this._hasData = true;
            this._rewardStatus = data.extreward_list;
            var signConfigArr = [];
            for (var m = 1; m <= 30; m++) {
                var signItemConfig = ConfigManager.getInstance().getSignInfoById(m);
                signConfigArr.push(signItemConfig);
            }
            this._signDays = data.signed_num;
            var hasSignDays = data.signed_num;
            var canSignDays = data.can_sign_num;
            var leftDays = 30 - hasSignDays - canSignDays;
            // var reSignDays:number = data.fix_num;
            // var leftDays:number = 30 - hasSignDays - canSignDays - reSignDays;
            var signItemArr = [];
            for (var i = 0; i < hasSignDays; i++) {
                var signItemVo = new game.SignItemVo();
                signItemVo.status = ConstSignItemStatus.hasSigned;
                signItemVo.signConfig = signConfigArr.shift();
                signItemArr.push(signItemVo);
            }
            for (var j = 0; j < canSignDays; j++) {
                if (j == 0) {
                    var signItemVo = new game.SignItemVo();
                    signItemVo.status = ConstSignItemStatus.canSign;
                    signItemVo.signConfig = signConfigArr.shift();
                    signItemVo.canSign = true;
                }
                else {
                    var signItemVo = new game.SignItemVo();
                    signItemVo.signConfig = signConfigArr.shift();
                    signItemVo.status = ConstSignItemStatus.canSign;
                }
                signItemArr.push(signItemVo);
            }
            for (var l = 0; l < leftDays; l++) {
                var signItemVo = new game.SignItemVo();
                signItemVo.signConfig = signConfigArr.shift();
                signItemVo.status = ConstSignItemStatus.notSign;
                signItemArr.push(signItemVo);
            }
            this._itemsArr = new eui.ArrayCollection(signItemArr);
        };
        /**
         * 是否有签到奖励(处理红点的)
         */
        SignModel.prototype.hasSignReward = function () {
            for (var i = 0; i < this._rewardStatus.length; i++) {
                var v = this._rewardStatus[i];
                if (v.state == 1) {
                    return true;
                }
            }
            if (this._canSignDays > 0) {
                return true;
            }
            return false;
        };
        /**
         * 清理
         */
        SignModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        SignModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return SignModel;
    }(BaseModel));
    game.SignModel = SignModel;
    __reflect(SignModel.prototype, "game.SignModel");
})(game || (game = {}));
//# sourceMappingURL=SignModel.js.map