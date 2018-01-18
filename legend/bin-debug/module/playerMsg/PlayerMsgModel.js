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
 * 查看玩家信息模块模型 2017/06/20.
 */
var game;
(function (game) {
    var PlayerMsgModel = (function (_super) {
        __extends(PlayerMsgModel, _super);
        function PlayerMsgModel() {
            var _this = _super.call(this) || this;
            _this._heroList = [];
            _this._playerVo = new PlayerVo();
            return _this;
        }
        Object.defineProperty(PlayerMsgModel.prototype, "curPos", {
            get: function () {
                return this._curPos;
            },
            set: function (cur) {
                this._curPos = cur;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerMsgModel.prototype, "heroNum", {
            get: function () {
                return this._heroNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerMsgModel.prototype, "heroList", {
            get: function () {
                return this._heroList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerMsgModel.prototype, "playVo", {
            get: function () {
                return this._playerVo;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 根据部位获得装备类型
        */
        PlayerMsgModel.prototype.getTypeByPos = function (pos) {
            var type = 1; //装备类型
            if (pos <= 4) {
                type = pos;
            }
            else if (pos == 5 || pos == 6) {
                type = 5;
            }
            else if (pos == 7 || pos == 8) {
                type = 6;
            }
            else if (pos > 8) {
                type = pos - 2;
            }
            return type;
        };
        PlayerMsgModel.prototype.updateData = function (data) {
            this._playerVo.updateData(data);
            this._heroNum = data.hero.length - 1; //从零开始算
            this._heroList = data.hero;
        };
        PlayerMsgModel.prototype.herosHeadPic = function () {
            var arr = [];
            for (var i = 0; i < this._heroList.length; i++) {
                var job;
                var sex;
                for (var key in this._heroList[i]) {
                    if (key == "job") {
                        job = this._heroList[i]["job"];
                        break;
                    }
                }
                for (var key in this._heroList[i]) {
                    if (key == "sex") {
                        sex = this._heroList[i]["sex"];
                        break;
                    }
                }
                arr.push({ sex: sex, job: job });
            }
            while (arr.length < 3) {
                arr.push(null);
            }
            return arr;
        };
        //根据属性key去拿属性的值
        PlayerMsgModel.prototype.getAtrributeByKey = function (key, attributesArr) {
            for (var i = 0; i < attributesArr.length; i++) {
                if (key == attributesArr[i].key) {
                    return attributesArr[i];
                }
            }
        };
        /**
         * 清理
         */
        PlayerMsgModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        PlayerMsgModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return PlayerMsgModel;
    }(BaseModel));
    game.PlayerMsgModel = PlayerMsgModel;
    __reflect(PlayerMsgModel.prototype, "game.PlayerMsgModel");
    var PlayerVo = (function () {
        function PlayerVo() {
        }
        PlayerVo.prototype.updateData = function (data) {
            this.lv = data.lv;
            this.medal_lv = data.medal_lv;
            this.name = data.name;
            this.career = data.career;
            this.sex = data.sex;
            this.turn = data.turn;
            this.player_id = data.player_id;
        };
        return PlayerVo;
    }());
    game.PlayerVo = PlayerVo;
    __reflect(PlayerVo.prototype, "game.PlayerVo");
})(game || (game = {}));
//# sourceMappingURL=PlayerMsgModel.js.map