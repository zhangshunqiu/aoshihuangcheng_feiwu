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
* 遭遇战系统数据模型 2017/12/7
*/
var game;
(function (game) {
    var EncounterModel = (function (_super) {
        __extends(EncounterModel, _super);
        function EncounterModel() {
            var _this = _super.call(this) || this;
            _this.killNum = 0; //杀戮值
            _this.rank = 0; //排名
            _this.refreshTime = 0; //刷新时间
            _this.pkNum = 0; //pk值
            _this.playerList = []; //玩家列表
            _this.log_list = [];
            return _this;
        }
        EncounterModel.prototype.updateInfo = function (data) {
            this.killNum = data.killing_num;
            this.rank = data.rank;
            this.refreshTime = data.refresh_time;
            this.pkNum = data.pk;
            this.playerList = data.pk_player;
        };
        /**
         * 清理
         */
        EncounterModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        EncounterModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        EncounterModel.prototype.getEncounterLogInfo = function (data) {
            this.log_list.splice(0);
            for (var i = 0; i < data.pk_log.length; i++) {
                var info = new game.EncounterLogVo();
                info.name = data.pk_log[i].nick;
                info.res = data.pk_log[i].result;
                info.time = data.pk_log[i].time;
                info.reward_list = data.pk_log[i].reward;
                this.log_list.push(info);
            }
        };
        return EncounterModel;
    }(BaseModel));
    game.EncounterModel = EncounterModel;
    __reflect(EncounterModel.prototype, "game.EncounterModel");
})(game || (game = {}));
//# sourceMappingURL=EncounterModel.js.map