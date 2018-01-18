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
 * 幸运转盘模块视图窗口 2017/06/20.
 */
var game;
(function (game) {
    var FortuneView = (function (_super) {
        __extends(FortuneView, _super);
        function FortuneView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._eventId1 = 0;
            _this._eventId2 = 0;
            _this._eventId3 = 0;
            _this._eventId4 = 0;
            _this._intervalId = 0;
            return _this;
        }
        /**
         * 创建皮肤（初始化调用一次）
         */
        FortuneView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_fortuneBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerFortuneStart, this);
            App.Socket.send(35002, {}); //转盘池请求 只需要发一次
            // this._pbMc = new EffectMovieClip();
            //  this._pbMc.visible = true;
            //  this._pbMc.x = 300;
            // this._pbMc.y = 12;
            // this._pbMc.scaleX = 1.42;
            // this._pbMc.playMCKey("jdtm", "", -1, null, () => {
            //     this._pbMc.frameRate = 8;
            // },null, this);
            // this.addChild(this._pbMc);
        };
        /**
         * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
         */
        FortuneView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            var setTimeOutId = setTimeout(function () {
                App.Socket.send(35001, {}); //转盘界面数据请求,延迟发送,不然和35002粘包
                clearTimeout(setTimeOutId);
            }, 100);
            if (this._eventId1 == 0) {
                this._eventId1 = App.EventSystem.addEventListener(PanelNotify.FORTUNE_VIEW_INFO_UPDATE, this.handlerUpdateView, this);
            }
            if (this._eventId2 == 0) {
                this._eventId2 = App.EventSystem.addEventListener(PanelNotify.FORTUNE_POOL_INFO_UPDATE, this.handlerUpdatePool, this);
            }
            if (this._eventId3 == 0) {
                this._eventId3 = App.EventSystem.addEventListener(PanelNotify.FORTUNE_WHEEL_START, this.handlerWheelStart, this);
            }
            if (this._eventId4 == 0) {
                this._eventId4 = App.EventSystem.addEventListener(PanelNotify.FORTUNE_WHEEL_STOP, this.handlerWheelStop, this);
            }
        };
        /**
         * 点击转盘按钮
         */
        FortuneView.prototype.handlerFortuneStart = function () {
            if (this._isRotating) {
                return;
            }
            var vip = RoleManager.getInstance().roleInfo.vipLv;
            var gold = RoleManager.getInstance().roleWealthInfo.gold;
            var curTimes = game.FortuneModel.getInstance().useTimes;
            if (curTimes == null) {
                return;
            }
            var nextConfigData = ConfigManager.getInstance().getFortuneTimesInfoById(curTimes + 1);
            if (nextConfigData) {
                //配置表有下一次
                if (vip >= nextConfigData.vip && gold >= nextConfigData.gold) {
                    App.Socket.send(35003, {}); //转盘开始转
                }
                else {
                    //飘字
                    App.GlobalTips.showTips("vip等级不够或元宝不足");
                }
            }
            else {
                //飘字 
                App.GlobalTips.showTips("达到最多转动次数");
            }
        };
        /**
         * 转盘开始转
         */
        FortuneView.prototype.handlerWheelStart = function (result) {
            this._isRotating = true;
            var finalAngle = ConstFortuneWheel[result];
            var randomAngle = RandomUtils.getInstance().limit(10, 12);
            finalAngle = finalAngle + Math.round(randomAngle) * 360;
            finalAngle = finalAngle + RandomUtils.getInstance().limit(-22.5, 22.5); //再做一次随机
            if (this._tween == null) {
                this._tween = egret.Tween.get(this.img_pointer).to({ rotation: finalAngle }, 5000, egret.Ease.quadInOut).wait(200).call(this.rotateComplete, this);
            }
        };
        // private _isWinClose:boolean = false;
        FortuneView.prototype.rotateComplete = function () {
            this._isRotating = false;
            App.Socket.send(35004, {}); //转盘结束
            var timeOutId = setTimeout(function () {
                App.Socket.send(35001, {}); //转盘界面数据重新请求
                clearTimeout(timeOutId);
            }, 100);
            if (this._tween) {
                egret.Tween.removeTweens(this.img_pointer);
                this._tween = null;
            }
        };
        FortuneView.prototype.handlerWheelStop = function (result_gold) {
            // var resultView:FortuneResultView = new FortuneResultView(result_gold);
            // PopUpManager.addPopUp({obj:resultView});
            WinManager.getInstance().openPopWin(WinName.POP_FORTUNE_RESULT, result_gold);
        };
        /**
         * 视图数据更新
         */
        FortuneView.prototype.handlerUpdateView = function () {
            if (game.FortuneModel.getInstance().leftTime > 0) {
                this.lb_leftTime.textFlow = [
                    { text: "剩余时间: ", style: { textColor: 0xf87500 } },
                    { text: game.InvestUtil.getFormatBySecond1(game.FortuneModel.getInstance().leftTime), style: { textColor: 0x07E426 } }
                ];
                if (this._intervalId != 0) {
                    App.GlobalTimer.remove(this._intervalId);
                    this._intervalId = 0;
                }
                this._intervalId = App.GlobalTimer.addSchedule(1000, game.FortuneModel.getInstance().leftTime, this.updateTime, this);
            }
            else {
                //超时显示剩余时间为0
                this.lb_leftTime.textFlow = [
                    { text: "剩余时间: ", style: { textColor: 0xf87500 } },
                    { text: game.InvestUtil.getFormatBySecond1(0), style: { textColor: 0x07E426 } }
                ];
                App.Socket.send(35001, {});
            }
            var times = game.FortuneModel.getInstance().useTimes; //已使用次数
            var timesConfigData = ConfigManager.getInstance().getFortuneTimesInfoById(times + 1);
            if (timesConfigData) {
                var costGold = timesConfigData.gold; //下一次次数消耗元宝
                this.bitmap_cost.text = costGold + "";
            }
            else {
                // this.lb_cost.text = "达到转盘使用最多次数";
            }
        };
        /**
         * 倒计时
         */
        FortuneView.prototype.updateTime = function () {
            game.FortuneModel.getInstance().leftTime--;
            this.lb_leftTime.textFlow = [
                { text: "剩余时间: ", style: { textColor: 0xf87500 } },
                { text: game.InvestUtil.getFormatBySecond1(game.FortuneModel.getInstance().leftTime), style: { textColor: 0x07E426 } }
            ];
        };
        /**
         * 转盘池更新
         */
        FortuneView.prototype.handlerUpdatePool = function () {
            var _this = this;
            var name = game.FortuneModel.getInstance().name;
            if (name == "") {
                this.lb_name.textFlow = [
                    { text: "幸运玩家: " }, { text: "未诞生", style: { textColor: 0xFF1F1F } }
                ];
            }
            else {
                this.lb_name.textFlow = [
                    { text: "幸运玩家: " }, { text: name, style: { textColor: 0xFF1F1F } }
                ];
            }
            var gold = game.FortuneModel.getInstance().gold;
            var max_gold = game.FortuneModel.getInstance().maxGold;
            if (max_gold) {
                if (this._pbGoMc == null) {
                    this._pbGoMc = new EffectMovieClip();
                    this._pbGoMc.visible = true;
                    this._pbGoMc.scaleX = 1;
                    this._pbGoMc.x = -200;
                    this._pbGoMc.y = 28.5;
                    this.gp_progress.addChildAt(this._pbGoMc, 2);
                    this._pbGoMc.mask = this.re_mask;
                    this._pbGoMc.playMCKey("effkjdt", "", -1, null, function () {
                        _this._pbGoMc.frameRate = 8;
                    }, null, this);
                }
                this.lb_progress.text = gold + "/" + max_gold;
                var progressValue = 100 * (gold / max_gold);
                this._pbGoMc.x = -200 + 499 * (gold / max_gold);
                // this.progress.value = progressValue;
                var rewardGold = ConfigManager.getInstance().getFortuneRewardByMaxgold(max_gold)["gold"];
                this.lb_desc.textFlow = [
                    { text: "当奖池总金额达到上限时，将在本轮转盘的参与者中抽取一位给与", style: { textColor: 0xf87500 } },
                    { text: rewardGold + "", style: { textColor: 0xffea01 } },
                    { text: "元宝奖励", style: { textColor: 0xf87500 } },
                ];
            }
        };
        FortuneView.prototype.closeWin = function () {
            // this._isWinClose = true;
            WinManager.getInstance().closeWin(this.winVo.winName);
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        FortuneView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._isRotating) {
                this.rotateComplete();
                this._isRotating = false;
            }
            if (this._eventId1 != 0) {
                App.EventSystem.removeEventListener(PanelNotify.FORTUNE_VIEW_INFO_UPDATE, this._eventId1);
                this._eventId1 = 0;
            }
            if (this._eventId2) {
                App.EventSystem.removeEventListener(PanelNotify.FORTUNE_POOL_INFO_UPDATE, this._eventId2);
                this._eventId2 = 0;
            }
            if (this._eventId3 != 0) {
                App.EventSystem.removeEventListener(PanelNotify.FORTUNE_WHEEL_START, this._eventId3);
                this._eventId3 = 0;
            }
            if (this._eventId4 != 0) {
                App.EventSystem.removeEventListener(PanelNotify.FORTUNE_WHEEL_STOP, this._eventId4);
                this._eventId4 = 0;
            }
            if (this._intervalId != 0) {
                App.GlobalTimer.remove(this._intervalId);
                this._intervalId = 0;
            }
            if (this._tween) {
                this.rotateComplete();
                egret.Tween.removeTweens(this.img_pointer);
                this._tween = null;
            }
            // this._isWinClose = null;
        };
        /**
         * 销毁
         */
        FortuneView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            if (this._pbGoMc) {
                if (this._pbGoMc.parent) {
                    this._pbGoMc.parent.removeChild(this._pbGoMc);
                }
                this._pbGoMc.destroy();
                this._pbGoMc = null;
            }
        };
        return FortuneView;
    }(BaseView));
    game.FortuneView = FortuneView;
    __reflect(FortuneView.prototype, "game.FortuneView");
})(game || (game = {}));
//# sourceMappingURL=FortuneView.js.map