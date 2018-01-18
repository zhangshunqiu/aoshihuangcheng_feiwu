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
 * 熔炼数据模型
 * author : zrj
*/
var game;
(function (game) {
    var SmeltModel = (function (_super) {
        __extends(SmeltModel, _super);
        function SmeltModel() {
            var _this = _super.call(this) || this;
            _this._dataArray = []; //选中的熔炼装备
            _this.curSmeltArr = []; //当前要熔炼的装备
            _this.selectedQuality = {}; //熔炼选中的品质
            return _this;
        }
        SmeltModel.prototype.filterEquip = function () {
            // let equipBackpack = BackpackModel.getInstance().equipBackpack;
            var temp = [];
            for (var i = 0; i < this._dataArray.length; i++) {
                var info = App.ConfigManager.equipConfig()[this._dataArray[i].good_id];
                if (this.selectedQuality[info.quality]) {
                    temp.push(this._dataArray[i]);
                }
            }
            this._dataArray = temp;
        };
        SmeltModel.prototype.FilterEquipByScore = function () {
            var _this = this;
            this._dataArray = [];
            var equipModel = game.EquipModel.getInstance();
            var result = [];
            var temp = { 1: {}, 2: {}, 3: {}, 4: {} }; //保存未穿戴装备最强的
            var heroInfo = game.HeroModel.getInstance().heroInfo;
            game.BackpackModel.getInstance().equipBackpack.forEach(function (value, index, array) {
                var exist = false; //是否有这个职业
                var equipInfo = App.ConfigManager.equipConfig()[value.good_id];
                var mypos = equipModel.getPosByType(equipInfo.sub_type); //拿到对应part
                var hadSelect = false; //已经选了这个装备
                for (var key in result) {
                    if (result[key].id == value.id) {
                        hadSelect = true;
                    }
                }
                //还没被选择
                if (!hadSelect) {
                    var changeResult_1 = function (career, pos) {
                        if (career == 0) {
                            return;
                        }
                        if (!temp[career][pos]) {
                            if (pos == ConstEquipPart.HAND2 || pos == ConstEquipPart.RING2) {
                                if (temp[career][pos - 1] && temp[career][pos - 1].id != value.id) {
                                    temp[career][pos] = value;
                                }
                                else if (!temp[career][pos - 1]) {
                                    temp[career][pos] = value;
                                }
                            }
                            else {
                                temp[career][pos] = value;
                            }
                        }
                        else if (temp[career][pos].score < value.score) {
                            if (pos == ConstEquipPart.HAND1 || pos == ConstEquipPart.RING1) {
                                if (!temp[career][pos + 1]) {
                                    temp[career][pos + 1] = value;
                                }
                                else {
                                    if (temp[career][pos + 1].score > temp[career][pos].score) {
                                        result.push(temp[career][pos]);
                                        temp[career][pos] = value;
                                    }
                                    else {
                                        result.push(temp[career][pos + 1]);
                                        temp[career][pos + 1] = temp[career][pos];
                                        temp[career][pos] = value;
                                    }
                                }
                            }
                            else if (pos == ConstEquipPart.HAND2 || pos == ConstEquipPart.RING2) {
                            }
                            else {
                                result.push(temp[career][pos]);
                                temp[career][pos] = value;
                            }
                        }
                        else if (pos == ConstEquipPart.HAND1 || pos == ConstEquipPart.RING1) {
                            if (!temp[career][pos + 1]) {
                                temp[career][pos + 1] = value;
                            }
                        }
                        else {
                            if (temp[career][pos].id != value.id) {
                                result.push(value);
                            }
                        }
                    };
                    heroInfo.forEach(function (value2, index2, array2) {
                        if (value2.job == equipInfo.limit_career) {
                            exist = true;
                            var doFilte_1 = function (pos) {
                                var part = value2.equipExist(pos);
                                if (part >= 0) {
                                    if (value2.equip_info[part].equip.score < value.score) {
                                        changeResult_1(value2.job, pos);
                                    }
                                    else {
                                        result.push(value);
                                    }
                                }
                                else {
                                    changeResult_1(value2.job, pos);
                                }
                            };
                            doFilte_1.bind(_this);
                            if (equipInfo.sex == 0 || value2.sex == equipInfo.sex) {
                                if (typeof mypos == "number") {
                                    doFilte_1(mypos);
                                }
                                else {
                                    mypos.forEach(function (v, i, a) {
                                        doFilte_1(v);
                                    }, _this);
                                }
                            }
                            else {
                                result.push(value);
                            }
                        }
                    }, _this);
                    //不存在这个职业
                    if (!exist) {
                        if (typeof mypos == "number") {
                            changeResult_1(equipInfo.limit_career, mypos);
                        }
                        else {
                            mypos.forEach(function (v, i, a) {
                                changeResult_1(equipInfo.limit_career, v);
                            }, _this);
                        }
                    }
                }
            }, this);
            var tempResult = [];
            var mark = {};
            for (var i = 0; i < result.length; i++) {
                if (mark[result[i].id]) {
                }
                else {
                    tempResult.push(result[i]);
                    mark[result[i].id] = true;
                }
            }
            result = tempResult;
            var finalResult = []; //最后
            var _loop_1 = function (i) {
                var equipInfo = App.ConfigManager.equipConfig()[result[i].good_id];
                var pos = equipModel.getPosByType(equipInfo.sub_type);
                if (typeof pos == "number") {
                    if (temp[equipInfo.limit_career][pos] && temp[equipInfo.limit_career][pos].id == result[i].id) {
                        // result.splice(i, 1);
                    }
                    else {
                        finalResult.push(result[i]);
                    }
                }
                else {
                    var exist_1 = false;
                    pos.forEach(function (v, index, a) {
                        if (temp[equipInfo.limit_career][v] && temp[equipInfo.limit_career][v].id == result[i].id) {
                            // result.splice(i, 1);
                            exist_1 = true;
                        }
                        else {
                        }
                    }, this_1);
                    if (!exist_1) {
                        finalResult.push(result[i]);
                    }
                }
            };
            var this_1 = this;
            for (var i = 0; i < result.length; i++) {
                _loop_1(i);
            }
            this._dataArray = finalResult;
        };
        SmeltModel.prototype.sortByQuality = function () {
            var whiteArr = [];
            var greenArr = [];
            var blueArr = [];
            var pupleArr = [];
            for (var i = 0; i < this._dataArray.length; i++) {
                var equipInfo = App.ConfigManager.equipConfig()[this._dataArray[i].good_id];
                switch (equipInfo.quality) {
                    case ConstQuality.WHITE:
                        whiteArr.push(this._dataArray[i]);
                        break;
                    case ConstQuality.GREEN:
                        greenArr.push(this._dataArray[i]);
                        break;
                    case ConstQuality.BLUE:
                        blueArr.push(this._dataArray[i]);
                        break;
                    case ConstQuality.PUPLE:
                        pupleArr.push(this._dataArray[i]);
                        break;
                }
            }
            this._dataArray = whiteArr.concat(greenArr, blueArr, pupleArr);
        };
        SmeltModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        SmeltModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return SmeltModel;
    }(BaseModel));
    game.SmeltModel = SmeltModel;
    __reflect(SmeltModel.prototype, "game.SmeltModel");
})(game || (game = {}));
//# sourceMappingURL=SmeltModel.js.map