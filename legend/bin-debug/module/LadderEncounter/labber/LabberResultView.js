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
 * 天梯争霸结算界面 2017/06/20.
 */
var game;
(function (game) {
    var LabberResultView = (function (_super) {
        __extends(LabberResultView, _super);
        function LabberResultView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.reward_stars = [];
            _this.tier_stars = [];
            _this.reward_items = [];
            _this._item_posi = 0;
            _this._result_timeId = 0;
            _this._count_timeId = 0;
            _this._auto_time = 6;
            _this._labbermodel = game.LabberHegemonyModel.getInstance();
            return _this;
        }
        LabberResultView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.reward_stars.push(this.star_reward1);
            this.reward_stars.push(this.star_reward2);
            this.reward_stars.push(this.star_reward3);
            this.tier_stars.push(this.star_tier1);
            this.tier_stars.push(this.star_tier2);
            this.tier_stars.push(this.star_tier3);
            this.btn_take.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReward, this);
        };
        /**
         * 打开窗口
        */
        LabberResultView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            App.WinManager.closeWin(WinName.COUNTERDOWN);
            if (this._labbermodel.result == 1) {
                this.gp_win.visible = true;
                this.gp_lose.visible = false;
            }
            else {
                this.gp_win.visible = false;
                this.gp_lose.visible = true;
            }
            for (var i = 0; i < this.reward_stars.length; i++) {
                if (i < this._labbermodel.star_res)
                    this.reward_stars[i].visible = true;
                else
                    this.reward_stars[i].visible = false;
            }
            //old tier
            this.showTierInfo(this._labbermodel.old_tier, this._labbermodel.old_lv, this._labbermodel.old_star);
            this._cur_tier = this._labbermodel.old_tier;
            this._cur_lv = this._labbermodel.old_lv;
            this._cur_star = this._labbermodel.old_star;
            if (this._result_timeId == 0) {
                this._result_timeId = App.GlobalTimer.addSchedule(500, 0, this.showNewTier, this);
            }
            if (this._count_timeId == 0) {
                this._count_timeId = App.GlobalTimer.addSchedule(1000, 0, this.onCountDown, this);
            }
            this._auto_time = 6;
            for (var i = 0; i < this._labbermodel.surprise_list.length; i++) {
                var item = new customui.BaseItem();
                item.x = 52 + this._item_posi;
                item.y = 388;
                this._item_posi += (item.width + 10);
                item.setItemNumVisible(true);
                item.updateBaseItem(ClientType.BASE_ITEM, this._labbermodel.surprise_list[i].id, this._labbermodel.surprise_list[i].num);
                //item.lb_num.visible = true;
                //item.lb_num.text = this._labbermodel.surprise_list[i].num + "";
                this.reward_items.push(item);
                this.gp_content.addChild(this.reward_items[this.reward_items.length - 1]);
            }
        };
        LabberResultView.prototype.onCountDown = function () {
            this.lb_countDown.text = this._auto_time + "";
            this._auto_time--;
            if (this._auto_time < 0) {
                if (this._count_timeId != 0) {
                    App.GlobalTimer.remove(this._count_timeId);
                    this._count_timeId = 0;
                }
                this.getReward();
            }
        };
        LabberResultView.prototype.showNewTier = function () {
            this.showTierInfo(this._cur_tier, this._cur_lv, this._cur_star);
            if (this._cur_lv == this._labbermodel.new_lv && this._cur_star == this._labbermodel.new_star && this._cur_tier == this._labbermodel.new_tier) {
                if (this._result_timeId != 0) {
                    App.GlobalTimer.remove(this._result_timeId);
                    this._result_timeId = 0;
                }
                return;
            } // return;
            if (this._labbermodel.result == 0) {
                if (this._cur_star == 1) {
                    this._cur_star = 3;
                    if (this._cur_lv == 5) {
                        this._cur_lv = 1;
                        this._cur_tier--;
                    }
                    else {
                        this._cur_lv++;
                    }
                }
                else {
                    this._cur_star--;
                }
            }
            if (this._labbermodel.result == 1) {
                if (this._cur_star == 3) {
                    this._cur_star = 1;
                    if (this._cur_lv == 1) {
                        this._cur_lv = 5;
                        this._cur_tier++;
                    }
                    else {
                        this._cur_lv--;
                    }
                }
                else {
                    this._cur_star++;
                }
            }
            //egret.setTimeout(this.showNewTier, this, 2000);
        };
        LabberResultView.prototype.showTierInfo = function (tier, lv, stars) {
            var _this = this;
            //new tier
            for (var i = 0; i < this.tier_stars.length; i++) {
                if (i < stars)
                    this.tier_stars[i].visible = true;
                else
                    this.tier_stars[i].visible = false;
            }
            RES.getResAsync(GlobalUtil.getTierIcon(tier), function (texture) {
                _this.img_tier.source = texture;
            }, this);
            this.lb_lv.text = lv + "";
        };
        LabberResultView.prototype.getReward = function () {
            App.Socket.send(13001, null);
            App.WinManager.closeWin(WinName.HEGEMONY_LABBER_RESULT);
            App.WinManager.openWin(WinName.HEGEMONY, { index: 2 });
        };
        /**
         * 关闭窗口
         */
        LabberResultView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        LabberResultView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            // App.Socket.send(13001, null);
            for (var i = 0; i < this.reward_items.length; i++) {
                this.gp_content.removeChild(this.reward_items[i]);
            }
            this.reward_items.splice(0);
            if (this._result_timeId != 0) {
                App.GlobalTimer.remove(this._result_timeId);
                this._result_timeId = 0;
            }
            if (this._count_timeId != 0) {
                App.GlobalTimer.remove(this._count_timeId);
                this._count_timeId = 0;
            }
        };
        /**
         * 销毁
         */
        LabberResultView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return LabberResultView;
    }(BaseView));
    game.LabberResultView = LabberResultView;
    __reflect(LabberResultView.prototype, "game.LabberResultView");
})(game || (game = {}));
//# sourceMappingURL=LabberResultView.js.map