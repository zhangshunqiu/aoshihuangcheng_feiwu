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
 * module : 离线结算
 * author ：zrj
*/
var game;
(function (game) {
    var MainOffline = (function (_super) {
        __extends(MainOffline, _super);
        function MainOffline(info) {
            var _this = _super.call(this, info) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this.skinName = "MainOfflineSkin";
            return _this;
            // this._data = info;
        }
        MainOffline.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            // this.initView();
        };
        MainOffline.prototype.initView = function () {
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // PopUpManager.removePopUp(this);
                App.WinManager.closeWin(WinName.POP_OFFLINE_RESULT);
            }, this);
            var textArray = [];
            var sceneInfo = App.ConfigManager.getSceneConfigById(this._data.scene_id);
            textArray.push({ text: "离线挂机时长：", style: { textColor: 0xbfbfbf } }, { text: GlobalUtil.getFormatBySecond1(this._data.time * 60) + "\n", style: { textColor: 0xbfbfbf } });
            textArray.push({ text: "离线挂机地图：", style: { textColor: 0xbfbfbf } }, { text: sceneInfo.name + "\n", style: { textColor: 0xbfbfbf } });
            textArray.push({ text: "离线获得经验：", style: { textColor: 0xbfbfbf } }, { text: this._data.exp + "\n", style: { textColor: 0xbfbfbf } });
            textArray.push({ text: "离线获得金币：", style: { textColor: 0xbfbfbf } }, { text: this._data.coin + "\n", style: { textColor: 0xbfbfbf } });
            this.lb_info.lineSpacing = 14;
            this.lb_info.textFlow = textArray;
            var equipArray = [];
            var temp = {};
            equipArray.push({ text: "离线获得装备： ", style: { textColor: 0xbfbfbf } });
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
                    equipArray.push({ text: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t" });
                }
            }
            this.lb_get.lineSpacing = 14;
            this.lb_get.textFlow = equipArray;
        };
        MainOffline.prototype.openWin = function (openParam) {
            _super.prototype.openWin.call(this, openParam);
            this._data = openParam.data;
            this.initView();
        };
        MainOffline.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        MainOffline.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        MainOffline.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return MainOffline;
    }(BaseView));
    game.MainOffline = MainOffline;
    __reflect(MainOffline.prototype, "game.MainOffline");
})(game || (game = {}));
//# sourceMappingURL=MainOffline.js.map