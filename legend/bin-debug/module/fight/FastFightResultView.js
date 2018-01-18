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
 * module : 快速战斗结算
 * author : zrj
*/
var game;
(function (game) {
    var FastFightResultView = (function (_super) {
        __extends(FastFightResultView, _super);
        function FastFightResultView(info) {
            var _this = _super.call(this, info) || this;
            _this.skinName = "FastFightResultSkin";
            return _this;
            // this._data = info;
        }
        FastFightResultView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            // this.initView();
        };
        FastFightResultView.prototype.initView = function () {
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // PopUpManager.removePopUp(this);
                App.WinManager.closeWin(WinName.POP_FAST_FIGHT_RESULT);
            }, this);
            var textArray = [];
            var sceneInfo = App.ConfigManager.getSceneConfigById(this._data.scene_id);
            textArray.push({ text: "快速战斗时长：", style: { textColor: 0xbfbfbf } }, { text: GlobalUtil.getFormatBySecond1(this._data.time * 60) + "\n", style: { textColor: 0xbfbfbf } });
            textArray.push({ text: "快速战斗地图：", style: { textColor: 0xbfbfbf } }, { text: sceneInfo.name + "\n", style: { textColor: 0xbfbfbf } });
            textArray.push({ text: "快速战斗获得经验：", style: { textColor: 0xbfbfbf } }, { text: this._data.exp + "\n", style: { textColor: 0xbfbfbf } });
            textArray.push({ text: "快速战斗获得金币：", style: { textColor: 0xbfbfbf } }, { text: this._data.coin + "\n", style: { textColor: 0xbfbfbf } });
            this.lb_info.lineSpacing = 14;
            this.lb_info.textFlow = textArray;
            var equipArray = [];
            var temp = {};
            equipArray.push({ text: "快速战斗获得装备：", style: { textColor: 0xbfbfbf } });
            for (var k in this._data.list) {
                var data = this._data.list[k];
                var info = App.ConfigManager.equipConfig()[data.id];
                if (temp[info.limit_lvl]) {
                    if (temp[info.limit_lvl][info.quality]) {
                        temp[info.limit_lvl][info.quality] += data.num;
                    }
                    else {
                        temp[info.limit_lvl][info.quality] = data.num;
                    }
                }
                else {
                    temp[info.limit_lvl] = {};
                    temp[info.limit_lvl][info.quality] = data.num;
                }
            }
            for (var k in temp) {
                for (var j in temp[k]) {
                    equipArray.push({ text: k + "级" + ConstColorName[j] + "装备*" + temp[k][j] + "\n", style: { textColor: ConstTextColor[j] } });
                    equipArray.push({ text: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t" });
                }
            }
            this.lb_get.lineSpacing = 14;
            this.lb_get.textFlow = equipArray;
        };
        /**
         * 打开窗口
         */
        FastFightResultView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._data = openParam.data;
            this.initView();
        };
        /**
         * 关闭窗口
         */
        FastFightResultView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        FastFightResultView.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        FastFightResultView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return FastFightResultView;
    }(BaseView));
    game.FastFightResultView = FastFightResultView;
    __reflect(FastFightResultView.prototype, "game.FastFightResultView");
})(game || (game = {}));
//# sourceMappingURL=FastFightResultView.js.map