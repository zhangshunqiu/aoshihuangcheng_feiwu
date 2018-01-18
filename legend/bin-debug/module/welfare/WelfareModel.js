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
 * 福利数据层逻辑 2017/06/20.
 */
var game;
(function (game) {
    var WelfareModel = (function (_super) {
        __extends(WelfareModel, _super);
        function WelfareModel() {
            var _this = _super.call(this) || this;
            _this.lvList = []; //      
            _this.hasRedPoint = false;
            return _this;
        }
        WelfareModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        WelfareModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        // public updateLvList(data) {
        //     if (this.lvList && this.lvList.length) {
        //         this.lvList.splice(0);
        //         for (let i = 0; i < data.list.length; i++) {
        //             let wlo: WelfareLvVo = new WelfareLvVo();
        //             wlo.lv = data.list[i].lv;
        //             wlo.state = data.list[i].state;
        //             wlo.left_num = data.list[i].left_num;
        //             this.lvList.push(wlo);
        //         }
        //         this.lvList.sort((a, b) => {
        //             if (a.state == 1 && b.state != 1)
        //                 return -1;
        //             else if (a.state != 1 && b.state == 1)
        //                 return 1;
        //             return 0;
        //         });
        //     } else {
        //         for (let i = 0; i < data.list.length; i++) {
        //             var d: any = data.list[i];
        //             var isFind: boolean = false;
        //             for (var j: number = 0; j < this.lvList.length; j++) {
        //                 var vo: WelfareLvVo = this.lvList[j];
        //                 if (vo.lv == d.lv) {
        //                     isFind = true;
        //                     vo.state = d.state;
        //                     vo.left_num = d.left_num;
        //                 }
        //             }
        //             if (isFind == false) {
        //                 let wlo: WelfareLvVo = new WelfareLvVo();
        //                 wlo.lv = d.lv;
        //                 wlo.state = d.state;
        //                 wlo.left_num = d.left_num;
        //                 this.lvList.push(wlo);
        //             }
        //         }
        //     }
        // }
        WelfareModel.prototype.updateRewardLeftNum = function (data) {
            for (var i = 0; i < this.lvList.length; i++) {
                if (this.lvList[i].id = data.id) {
                    this.lvList[i].left_num = data.left_num;
                    if (this.lvList[i].state == 1 && this.lvList[i].left_num > 0)
                        this.hasRedPoint = true;
                }
            }
            App.BtnTipManager.setTypeValue(ConstBtnTipType.WELFARE_LEVEN, this.hasRedPoint);
        };
        WelfareModel.prototype.getWelfareLvList = function (data) {
            this.hasRedPoint = false;
            this.lvList.splice(0);
            for (var i = 0; i < data.list.length; i++) {
                var wlo = new game.WelfareLvVo();
                wlo.id = data.list[i].id;
                wlo.state = data.list[i].state;
                wlo.left_num = data.list[i].left_num;
                if (wlo.state == 1 && (wlo.left_num > 0 || wlo.left_num == -1))
                    this.hasRedPoint = true;
                this.lvList.push(wlo);
            }
            App.BtnTipManager.setTypeValue(ConstBtnTipType.WELFARE_LEVEN, this.hasRedPoint);
            this.lvList.sort(function (a, b) {
                if (a.state == 1) {
                    if (b.state != 1)
                        return -1;
                    else
                        return 0;
                }
                if (a.state == 0) {
                    if (b.state == 0)
                        return 0;
                    if (b.state == 1)
                        return 1;
                    if (b.state == 2)
                        return -1;
                }
                if (a.state == 2) {
                    if (b.state != 2)
                        return 1;
                    else
                        return 0;
                }
                return 0;
            });
        };
        return WelfareModel;
    }(BaseModel));
    game.WelfareModel = WelfareModel;
    __reflect(WelfareModel.prototype, "game.WelfareModel");
})(game || (game = {}));
//# sourceMappingURL=WelfareModel.js.map