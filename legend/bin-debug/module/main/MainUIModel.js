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
 * 主界面数据模型
 * author : zrj
*/
var game;
(function (game) {
    var MainUIModel = (function (_super) {
        __extends(MainUIModel, _super);
        function MainUIModel() {
            var _this = _super.call(this) || this;
            _this._hookRewardInfo = undefined; //挂机收益信息
            _this.showOffline = false; //是否弹出离线收益
            _this.fastFightTime = undefined; //快速战斗的次数
            _this.fastFightInfo = undefined; //快速战斗的收益信息
            _this.taskId = 0; //主线任务
            _this.taskState = 0;
            _this.totalTask = 0;
            _this.curTaskIndex = 0;
            _this.isMainTaskShow = true;
            return _this;
            // this.hookRewardInfo = {
            //     time:3666,
            //     scene_id :1,
            //     exp:99999999,
            //     coin:1111111,
            //     list:[{id:1,num:3},{id:32,num:5},{id:4,num:2},{id:12,num:1}]
            // }
        }
        Object.defineProperty(MainUIModel.prototype, "hookRewardInfo", {
            get: function () {
                return this._hookRewardInfo;
            },
            set: function (info) {
                this._hookRewardInfo = info;
                this._hookRewardInfo.exp = info.exp.toNumber();
                // this._hookRewardInfo.time = info.time.toNumber();
                this._hookRewardInfo.coin = info.coin.toNumber();
                // console.log(this._hookRewardInfo);
                this.showOffline = this._hookRewardInfo.type == 0 ? true : false;
            },
            enumerable: true,
            configurable: true
        });
        MainUIModel.prototype.getMainLineTaskInfo = function (data) {
            this.taskId = data.id;
            this.taskState = data.state;
            this.curTaskIndex = data.num;
            this.totalTask = data.total_num;
            //..............................
        };
        return MainUIModel;
    }(BaseModel));
    game.MainUIModel = MainUIModel;
    __reflect(MainUIModel.prototype, "game.MainUIModel");
})(game || (game = {}));
//# sourceMappingURL=MainUIModel.js.map