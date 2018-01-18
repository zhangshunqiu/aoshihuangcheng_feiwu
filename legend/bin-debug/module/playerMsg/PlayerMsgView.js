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
 * 查看玩家信息模块视图窗口
 */
var game;
(function (game) {
    var PlayerMsgWin = (function (_super) {
        __extends(PlayerMsgWin, _super);
        function PlayerMsgWin(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._effectArr = [];
            _this._eventId = 0;
            _this._eventId1 = 0;
            _this._playerMsgModel = game.PlayerMsgModel.getInstance();
            return _this;
        }
        /**
         * 创建皮肤（初始化调用一次）
         */
        PlayerMsgWin.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                WinManager.getInstance().closePopWin(WinName.POP_PLAYER_MSG);
            }, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                WinManager.getInstance().closePopWin(WinName.POP_PLAYER_MSG);
            }, this);
            this.tab_head.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.tabItemHandler, this);
            this.tab_head.itemRenderer = game.PlayerMsgTabItem;
            this.img_detail.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                WinManager.getInstance().openPopWin(WinName.POP_PLAYER_HERO_ATTR);
            }, this);
        };
        /**
         * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
         */
        PlayerMsgWin.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this.openData) {
                // console.log(this.openData);
                App.Socket.send(15030, { id: this.openData });
            }
            if (this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.PLAYER_MSG_INQUIRE, this.playerMsgData, this);
            }
            if (this._eventId1 == 0) {
                //英雄属性页面可以切换英雄
                this._eventId1 = App.EventSystem.addEventListener(PanelNotify.PLAYER_HERO_ATTRIBUTE_INDEX_CHANGE, this.changeHero, this);
            }
        };
        PlayerMsgWin.prototype.playerMsgData = function () {
            this._playerMsgModel.curPos = 0; //默认选中第一个英雄
            this.updateTabhead();
            this.changeHero();
            this.updatePlayerMsg();
        };
        PlayerMsgWin.prototype.updateTabhead = function () {
            var headPicArr = this._playerMsgModel.herosHeadPic();
            this.tab_head.dataProvider = new eui.ArrayCollection(headPicArr);
        };
        /**
         * 选项卡切换英雄
         */
        PlayerMsgWin.prototype.tabItemHandler = function (event) {
            if (event.itemIndex <= this._playerMsgModel.heroNum) {
                this._playerMsgModel.curPos = event.itemIndex;
                this.changeHero();
            }
        };
        /**
         * 改变切换卡选中状态
         */
        PlayerMsgWin.prototype.tabSelectIndex = function () {
            var index = this._playerMsgModel.curPos;
            var items = this.tab_head.$children;
            for (var i = 0; i < items.length; i++) {
                if (i == index) {
                    items[i].img_select.visible = true;
                }
                else {
                    items[i].img_select.visible = false;
                }
            }
        };
        /**
         * 显示英雄信息
         */
        PlayerMsgWin.prototype.changeHero = function () {
            this.tabSelectIndex();
            var index = this._playerMsgModel.curPos;
            var heroList = this._playerMsgModel.heroList;
            if (heroList.length < 0) {
                return;
            }
            var heroData = heroList[index];
            this.updateEquip(heroData["equip_info"]);
            this.updateModel(heroData);
            this.updateScore(heroData["score"]);
            this.updateSpecialEquip(heroData["sp_equip"]);
        };
        /**
         * 显示玩家信息
         */
        PlayerMsgWin.prototype.updatePlayerMsg = function () {
            var _this = this;
            var playerVo = this._playerMsgModel.playVo;
            //名字
            this.lb_player_name.text = playerVo.name;
            //等级
            if (playerVo.turn) {
                this.lb_player_level.text = playerVo.turn + "转" + playerVo.lv + "级";
            }
            else {
                this.lb_player_level.text = playerVo.lv + "级";
            }
            //头像(玩家头像和主角英雄头像是一样的)
            var headPicObj = this._playerMsgModel.herosHeadPic()[0];
            if (headPicObj) {
                var sex = headPicObj["sex"];
                var job = headPicObj["job"];
                var headKey = App.ConfigManager.getSmallHeroIconBySexAndJob(sex, job, 2);
                RES.getResAsync(headKey + "_png", function (texture) {
                    _this.img_player.source = texture;
                }, this);
            }
            //勋章图片
            var medalLv = playerVo.medal_lv;
            var medalConfig = ConfigManager.getInstance().getMedalAttrInfoByLv(medalLv);
            if (medalConfig["model"]) {
                this.img_medal_lv.source = medalConfig["model"] + "_png";
            }
        };
        /**
         * 显示特殊装备
         */
        PlayerMsgWin.prototype.updateSpecialEquip = function (special_equips) {
            for (var i = 0; i < special_equips.length; i++) {
                //特效
                var effect = new EffectMovieClip();
                effect.scaleX = effect.scaleY = 0.4;
                effect.x = 45;
                effect.y = 50;
                effect.touchEnabled = false;
                effect.playMCKey(ConstSpecialEquipEffect[i + 1], "", -1, null, function () {
                    effect.frameRate = 8;
                }, null, this);
                this._effectArr.push(effect);
                this["special_item" + i].addChild(effect);
                //更新信息
                this["special_item" + i].updateBaseItem(ClientType.EQUIP, 0, null);
                //没有装备显灰 有不显灰
                if (special_equips[i]["id"]) {
                    UIActionManager.setGrey(this["special_item" + i], false);
                }
                else {
                    UIActionManager.setGrey(this["special_item" + i], true);
                }
            }
        };
        /**
         * 显示装备
         */
        PlayerMsgWin.prototype.updateEquip = function (equipData) {
            // for(var i:number =0;i<equipData.length;i++) {
            // 	(this["baseItem"+ (i+1)] as customui.BaseItem).updateBaseItem(ClientType.EQUIP,equipData[i]["good_id"],null,equipData[i]);
            // }
            for (var i = 0; i < 10; i++) {
                if (equipData[i]["good_id"]) {
                    this["baseItem" + (i + 1)].updateBaseItem(ClientType.EQUIP, equipData[i]["good_id"], null, equipData[i]);
                    var equipInfo = game.EquipModel.getInstance().getEquipInfoById(equipData[i]["good_id"]);
                    this["baseItem" + (i + 1)].setItemName(equipInfo.limit_lvl + "级");
                    this["baseItem" + (i + 1)].setItemNameVisible(true);
                    // (this["baseItem"+ (i+1)] as customui.BaseItem).lb_type.visible = false;
                }
                else {
                    this["baseItem" + (i + 1)].updateBaseItem(ClientType.EQUIP, null);
                    var type = this._playerMsgModel.getTypeByPos(i + 1);
                    // (this["baseItem"+ (i+1)] as customui.BaseItem).lb_type.text = ConstEquipType[type];
                    // (this["baseItem"+ (i+1)] as customui.BaseItem).lb_type.visible = true;
                }
            }
        };
        /**
         * 显示英雄模型
         */
        PlayerMsgWin.prototype.updateModel = function (heroData) {
            var _this = this;
            var equipInfo = heroData["equip_info"];
            var wingInfo = heroData["wing_info"];
            //显示武器
            for (var i = 0; i < equipInfo.length; i++) {
                if (equipInfo[i]["part"] == ConstEquipPart.WEAPON && equipInfo[i]["good_id"]) {
                    var info = App.ConfigManager.getEquipConfigById(equipInfo[i]["good_id"]);
                    RES.getResAsync(info["model"] + "_png", function (texture) {
                        _this.img_weapon.source = texture;
                    }, this);
                    break;
                }
            }
            //显示衣服
            for (var i = 0; i < equipInfo.length; i++) {
                if (equipInfo[i]["part"] == ConstEquipPart.CLOTH && equipInfo[i]["good_id"]) {
                    var info = App.ConfigManager.getEquipConfigById(equipInfo[i]["good_id"]);
                    RES.getResAsync(info["model"] + "_png", function (texture) {
                        _this.img_body.source = texture;
                    }, this);
                    break;
                }
            }
            //显示翅膀
            if (wingInfo["wing_id"]) {
                var photo = game.WingModel.getInstance().getWingPhoto(wingInfo["wing_id"]);
                RES.getResAsync(photo + "_png", function (texture) {
                    _this.img_wing.source = texture;
                }, this);
            }
        };
        PlayerMsgWin.prototype.updateScore = function (score) {
            this.bitmap_score.text = score + "";
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        PlayerMsgWin.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.PLAYER_MSG_INQUIRE, this._eventId);
                this._eventId = 0;
            }
            this._effectArr.forEach(function (value, index, array) {
                value.destroy();
            }, this);
        };
        /**
         * 销毁
         */
        PlayerMsgWin.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return PlayerMsgWin;
    }(BaseView));
    game.PlayerMsgWin = PlayerMsgWin;
    __reflect(PlayerMsgWin.prototype, "game.PlayerMsgWin");
})(game || (game = {}));
//# sourceMappingURL=PlayerMsgView.js.map