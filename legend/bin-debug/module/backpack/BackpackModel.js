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
 * module : 背包模块数据模型
 * author ：zrj
 *
*/
var game;
(function (game) {
    var BackpackModel = (function (_super) {
        __extends(BackpackModel, _super);
        function BackpackModel() {
            var _this = _super.call(this) || this;
            /**
             * 装备背包
            */
            _this.equipBackpack = [];
            /**
             * 物品背包
            */
            _this.itemBackpack = [];
            /**
             * 功能道具背包
            */
            _this.chestBackpack = [];
            /**
             * 背包容量
            */
            _this.maxCapacity = 0;
            /**
             * 背包当前容量
            */
            _this.capacity = 0;
            _this.heroModel = game.HeroModel.getInstance();
            _this.equipBackpack = [];
            _this.itemBackpack = [];
            _this.chestBackpack = [];
            return _this;
        }
        BackpackModel.prototype.updateBackpack = function (info) {
            this.equipBackpack = [];
            this.itemBackpack = [];
            this.chestBackpack = [];
            for (var k in info.playergoods) {
                var itemInfo = info.playergoods[k];
                if (itemInfo.type == ClientType.BASE_ITEM) {
                    var info3 = App.ConfigManager.getItemInfoById(itemInfo.good_id);
                    if (!info3) {
                        continue;
                    }
                    var info2 = info3.type;
                    if (info2 == 0) {
                        this.itemBackpack.push(new game.ItemVO(itemInfo));
                    }
                    else {
                        this.chestBackpack.push(new game.ItemVO(itemInfo));
                    }
                }
                else if (itemInfo.type == ClientType.EQUIP) {
                    this.equipBackpack.push(new game.EquipVO(itemInfo));
                }
            }
            this.maxCapacity = info.total;
            this.capacity = this.itemBackpack.length + this.chestBackpack.length + this.equipBackpack.length;
            //是否提示熔炼
            this.updateSmeltBtnTip();
            this.handleRedDot(null);
            this.sortEquipBackpack();
        };
        BackpackModel.prototype.updateBackpackItemInfo = function (info) {
            for (var k in info) {
                var item = info[k];
                var pack = this.itemBackpack;
                var exist = false;
                //查找是否存在这个item
                if (item.type == 1) {
                    var tempInfo = App.ConfigManager.getItemInfoById(item.good_id);
                    if (tempInfo.type == 0) {
                        pack = this.itemBackpack;
                    }
                    else {
                        pack = this.chestBackpack;
                    }
                }
                else if (item.type == ClientType.EQUIP) {
                    pack = this.equipBackpack;
                }
                for (var i = 0; i < pack.length; i++) {
                    if (pack[i].id == item.id) {
                        if (item.num > pack[i].num) {
                            var temp = new game.ItemVO(item);
                            temp.num = item.num - pack[i].num;
                            pack[i].updateInfo(item);
                            this.handleReward(temp);
                        }
                        else {
                            pack[i].updateInfo(item);
                            this.handleCost(item);
                            if (item.num == 0) {
                                pack.splice(i, 1);
                                this.capacity -= 1;
                            }
                        }
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    if (item.type == ClientType.BASE_ITEM) {
                        var info2 = App.ConfigManager.getItemInfoById(item.good_id).type;
                        if (info2 == 0) {
                            this.itemBackpack.push(new game.ItemVO(item));
                        }
                        else {
                            this.chestBackpack.push(new game.ItemVO(item));
                        }
                    }
                    else if (item.type == ClientType.EQUIP) {
                        var newItem = new game.EquipVO(item);
                        var exist_1 = false;
                        var newEquipInfo = App.ConfigManager.getEquipById(newItem.good_id);
                        //@这里性能好差，优化一下@勇根
                        for (var i = 0; i < this.equipBackpack.length; i++) {
                            var equipInfo = App.ConfigManager.getEquipById(this.equipBackpack[i].good_id);
                            //这里要考虑if不为true情况 @勇根
                            if (equipInfo.sorting < newEquipInfo.sorting) {
                                this.equipBackpack.splice(i, 0, newItem);
                                exist_1 = true;
                                break;
                            }
                        }
                        //这里要考虑背包为空的情况 @勇根
                        if (this.equipBackpack.length == 0 || !exist_1) {
                            this.equipBackpack.push(newItem);
                        }
                        // this.equipBackpack.push(newItem);
                    }
                    this.capacity += 1;
                    this.handleReward(item);
                }
                this.handleRedDot(item);
            }
            //是否提示熔炼
            this.updateSmeltBtnTip();
        };
        BackpackModel.prototype.sortEquipBackpack = function () {
            this.equipBackpack.sort(function (item1, item2) {
                var equipInfo1 = App.ConfigManager.getEquipById(item1.good_id);
                var equipInfo2 = App.ConfigManager.getEquipById(item2.good_id);
                if (equipInfo1 && equipInfo2) {
                    return equipInfo2.sorting - equipInfo1.sorting;
                }
            });
        };
        /**
         * 获得物品
        */
        BackpackModel.prototype.handleReward = function (reward) {
            var info = undefined;
            if (reward.type == ClientType.BASE_ITEM) {
                info = App.ConfigManager.getItemInfoById(reward.good_id);
            }
            else if (reward.type == ClientType.EQUIP) {
                info = App.ConfigManager.getEquipById(reward.good_id);
            }
            else if (reward.type == ClientType.CURRENCY) {
                if (reward.good_id == CurrencyType.COIN) {
                    info = { name: "金币", quality: 0 };
                }
                else if (reward.good_id == CurrencyType.GOLD) {
                    info = { name: "元宝", quality: 0 };
                }
                else if (reward.good_id == CurrencyType.TURN_EXP) {
                    info = { name: "修为", quality: 0 };
                }
            }
            var text = [{ text: "获得 ", style: { textColor: 0xffff00, size: 24, fontFamily: "SimHei" } }, { text: info.name + "*" + reward.num, style: { textColor: ConstTextColor[info.quality], size: 24, fontFamily: "SimHei" } }];
            App.GlobalTips.showTips(text);
        };
        /**
         * 消耗物品
        */
        BackpackModel.prototype.handleCost = function (cost) {
        };
        /**
         * 根据 type id uuid 获取背包里的内容，没有返回null,
         * @param type ClientType
         * @param id 配置表id
         * @param uuid 背包唯一id
        */
        BackpackModel.prototype.getItemByTypeIdUuid = function (type, good_id, uuid) {
            switch (type) {
                case 1: {
                    var item = undefined;
                    for (var key in this.itemBackpack) {
                        if (uuid && this.itemBackpack[key].id == uuid) {
                            return this.itemBackpack[key];
                        }
                        else if (Number(good_id) == this.itemBackpack[key].good_id) {
                            if (!item) {
                                item = new game.ItemVO(this.itemBackpack[key]);
                            }
                            else {
                                item.num += this.itemBackpack[key].num;
                            }
                        }
                    }
                    for (var key in this.chestBackpack) {
                        if (uuid && this.chestBackpack[key].id == uuid) {
                            return this.chestBackpack[key];
                        }
                        else if (Number(good_id) == this.chestBackpack[key].good_id) {
                            if (!item) {
                                item = new game.ItemVO(this.chestBackpack[key]);
                            }
                            else {
                                item.num += this.chestBackpack[key].num;
                            }
                        }
                    }
                    return item;
                }
                case 2: {
                    for (var key in this.equipBackpack) {
                        if (this.equipBackpack[key].id == uuid) {
                            return this.equipBackpack[key];
                        }
                    }
                    break;
                }
            }
            return null;
        };
        /**
         * 根据 品质 获取背包里的内容，没有返回null
        */
        BackpackModel.prototype.getEquipByQuality = function (quality) {
            var arr = [];
            for (var key in this.equipBackpack) {
                var info = App.ConfigManager.getEquipById(this.equipBackpack[key].good_id);
                if (info.quality == quality) {
                    arr.push(this.equipBackpack[key]);
                }
            }
            return arr;
        };
        /**
         * 根据 职业 部位 获取背包里的内容，没有返回null
        */
        BackpackModel.prototype.getEquipByCareerPart = function (career, part) {
            var equipModel = game.EquipModel.getInstance();
            var arr = [];
            for (var key in this.equipBackpack) {
                var info = App.ConfigManager.getEquipById(this.equipBackpack[key].good_id);
                if ((info.limit_career == career || part >= 11) && info.sub_type == equipModel.getTypeByPos(part)) {
                    arr.push(this.equipBackpack[key]);
                }
            }
            return arr;
        };
        /**
         * 根据 类型 获取背包里的道具数组，非装备，没有返回null
        */
        BackpackModel.prototype.getItemArrayByTypeAndSubType = function (type, subType) {
            var arr = [];
            var item = undefined;
            for (var key in this.itemBackpack) {
                var info = App.ConfigManager.getItemInfoById(this.itemBackpack[key].good_id);
                if (type == info.type) {
                    if (subType) {
                        if (subType == info.sub_type) {
                            arr.push(this.itemBackpack[key]);
                        }
                    }
                    else {
                        arr.push(this.itemBackpack[key]);
                    }
                }
            }
            for (var key in this.chestBackpack) {
                var info = App.ConfigManager.getItemInfoById(this.chestBackpack[key].good_id);
                if (type == info.type) {
                    if (subType) {
                        if (subType == info.sub_type) {
                            arr.push(this.chestBackpack[key]);
                        }
                    }
                    else {
                        arr.push(this.chestBackpack[key]);
                    }
                }
            }
            return arr;
        };
        /**
         * 背包剩余空间
        */
        BackpackModel.prototype.getRemindCapacity = function () {
            return this.maxCapacity - this.capacity;
        };
        //背包空间红点
        BackpackModel.prototype.updateSmeltBtnTip = function () {
            var num = this.getRemindCapacity();
            if (num <= 0) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.BACKPACK_SMELT, true);
                App.BtnTipManager.setTypeValue(ConstBtnTipType.BACKPACK, true); //由于需要父级显示不同的内容所以才加
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_BACKPAG_FULL_TIPS, true, 500);
            }
            else if (num < 30) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.BACKPACK_SMELT, true);
                App.BtnTipManager.setTypeValue(ConstBtnTipType.BACKPACK, true); //由于需要父级显示不同的内容所以才加	
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_BACKPAG_FULL_TIPS, false, 500);
            }
            else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.BACKPACK_SMELT, false);
                App.EventSystem.dispatchEvent(PanelNotify.MAIN_BACKPAG_FULL_TIPS, false, 500);
            }
        };
        /**
         * 更新橙装熔炼提示
         */
        BackpackModel.prototype.updateSmeltOrangeBtnTip = function () {
        };
        //处理背包改变的相关红点
        BackpackModel.prototype.handleRedDot = function (item) {
            if (!item) {
                this.heroModel.heroInfo.forEach(function (value, index, array) {
                    game.ForgeModel.getInstance().checkCanStrength(index);
                    game.ForgeModel.getInstance().checkCanStarup(index);
                    game.ForgeModel.getInstance().checkCanOrangeUp(index);
                }, this);
                this.heroModel.checkBetterEquipRedDotAll();
                this.heroModel.checkSpecialEquipRedDotAll();
                game.SynthesisModel.getInstance().checkJewelCanSynthesisAll();
                game.SynthesisModel.getInstance().checkWingCanSynthesisAll();
                game.JewelModel.getInstance().checkCanUpgradeAll();
            }
            else if (item.type == ClientType.EQUIP) {
                this.heroModel.checkBetterEquipRedDot(item);
            }
            else if (item.type == ClientType.BASE_ITEM) {
                if (item.good_id == 10) {
                    this.heroModel.heroInfo.forEach(function (value, index, array) {
                        game.ForgeModel.getInstance().checkCanStrength(index);
                    }, this);
                }
                else if (item.good_id == 11) {
                    this.heroModel.heroInfo.forEach(function (value, index, array) {
                        game.ForgeModel.getInstance().checkCanOrangeUp(index);
                    }, this);
                }
                else if (item.good_id == 18) {
                    this.heroModel.heroInfo.forEach(function (value, index, array) {
                        game.ForgeModel.getInstance().checkCanStarup(index);
                    }, this);
                }
                else if (item.good_id == 22 || item.good_id == 23 || item.good_id == 24 || item.good_id == 25) {
                    game.HeroModel.getInstance().checkSpecialEquipRedDotAll();
                }
                else {
                    var itemInfo = App.ConfigManager.getItemInfoById(item.good_id);
                    if (itemInfo.type == ItemType.RUBY || item.good_id == 1000) {
                        game.SynthesisModel.getInstance().checkJewelCanSynthesisAll();
                        game.JewelModel.getInstance().checkCanUpgradeAll();
                        game.JewelModel.getInstance().checkCanEmbleAll();
                    }
                    else if (itemInfo.type == ItemType.WING || item.good_id == 200) {
                        game.SynthesisModel.getInstance().checkWingCanSynthesisAll();
                    }
                }
            }
        };
        BackpackModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        BackpackModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return BackpackModel;
    }(BaseModel));
    game.BackpackModel = BackpackModel;
    __reflect(BackpackModel.prototype, "game.BackpackModel");
})(game || (game = {}));
//# sourceMappingURL=BackpackModel.js.map