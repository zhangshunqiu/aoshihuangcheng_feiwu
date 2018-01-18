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
* module : 寻宝模块  橙装移动到这里来了
* author : zrj
*openParam: {index:代表打开哪个标签}
*/
var game;
(function (game) {
    var RaiderView = (function (_super) {
        __extends(RaiderView, _super);
        function RaiderView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.pageView = new PageView();
            _this._itemArray = [];
            _this.heroModel = game.HeroModel.getInstance();
            _this.raiderModel = game.RaiderModel.getInstance();
            return _this;
        }
        RaiderView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        RaiderView.prototype.initView = function () {
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRaider, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.returnPreview, this);
            this.tabbar.dataProvider = new eui.ArrayCollection(["寻宝", "橙装", "仓库"]);
            this.tabbar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.changeIndex, this);
            this.tabbar.selectedIndex = 0;
            this.img_withdraw.addEventListener(egret.TouchEvent.TOUCH_TAP, this.withdrawAll, this);
            this.btn_buyone.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyOne, this);
            this.btn_buyten.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyTen, this);
            this.initRaiderEquip();
            this.initStorage();
            this.gp_raid.visible = true;
            this.gp_storage.visible = false;
            this.gp_orange.visible = false;
            // this.updateRaiderEquip();
        };
        RaiderView.prototype.initRaiderEquip = function () {
            var posXArray = [100, 215, 505, 620];
            for (var i = 0; i < 12; i++) {
                var item_1 = new customui.BaseItem();
                item_1.x = posXArray[i % 4];
                item_1.y = 60 + (Math.floor(i / 4)) * 130;
                this.gp_raid.addChild(item_1);
                this._itemArray.push(item_1);
            }
            //中间两个
            var item = new customui.BaseItem();
            item.x = 360;
            item.y = 140;
            this.gp_raid.addChild(item);
            this._itemArray.push(item);
            var item2 = new customui.BaseItem();
            item2.x = 360;
            item2.y = 305;
            this.gp_raid.addChild(item2);
            this._itemArray.push(item2);
            // for (let i = 0; i < this._itemArray.length; i++) {
            // 	this._itemArray[i].addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // 		this._itemArray[i].showItemInfo();
            // 	}, this);
            // }
            //播报布局
            var layout = new eui.VerticalLayout();
            layout.gap = 20;
            layout.paddingLeft = 60;
            layout.paddingTop = 10;
            this.gp_broadcast.layout = layout;
        };
        RaiderView.prototype.changeIndex = function (event) {
            var index = event.itemIndex;
            if (index == 0) {
                this.gp_raid.visible = true;
                this.gp_storage.visible = false;
                this.gp_orange.visible = false;
                this.updateRaiderEquip();
            }
            else if (index == 1) {
                // App.WinManager.openWin(WinName.FORGE_ORANGE, { lastModule: WinName.RAIDER });
                this.gp_raid.visible = false;
                this.gp_storage.visible = false;
                this.gp_orange.visible = true;
                this.updateOrangeView();
            }
            else if (index == 2) {
                this.gp_raid.visible = false;
                this.gp_storage.visible = true;
                this.gp_orange.visible = false;
                // this.updateStorage();
                App.Socket.send(26005, {});
            }
            else {
                this.gp_raid.visible = true;
                this.gp_storage.visible = false;
                this.updateRaiderEquip();
            }
        };
        RaiderView.prototype.initStorage = function () {
            this.pageView.setTabbarEnabled(true);
            this.pageView.itemRenderer = RaiderStorageGroup;
            this.pageView.horizontalCenter = 0;
            this.pageView.width = this.gp_page.width;
            this.pageView.height = this.gp_page.height;
            this.gp_page.addChild(this.pageView);
            // this.pageView.left = this.pageView.right = this.pageView.top = this.pageView.bottom = 0;
            this.pageView.dataProvider = new eui.ArrayCollection([]);
            this.pageView.setTabbarOffset(-50);
        };
        //更新寻宝界面
        RaiderView.prototype.updateRaiderEquip = function () {
            var _this = this;
            RES.getResAsync("raider_xunbao_title_png", function (texture) {
                _this.commonWin.img_title.texture = texture;
            }, this);
            var temp = App.ConfigManager.getRaiderInfoByDay(this.raiderModel.curDay);
            var data = [];
            for (var i = 0; i < temp.length; i++) {
                if (temp[i].career == this.heroModel.getCurHero().job || temp[i].career == 0) {
                    data.push(temp[i]);
                }
            }
            for (var i = 0; i < this._itemArray.length; i++) {
                for (var k in data) {
                    if (data[k].house_id == i + 1) {
                        this._itemArray[i].updateBaseItem(data[k].type, data[k].item);
                        if (data[k].house_id <= 12) {
                            this._itemArray[i].setItemNameVisible(true);
                        }
                        break;
                    }
                }
            }
            //寻宝记录
            this.gp_broadcast.removeChildren();
            for (var k in this.raiderModel.storageRecord) {
                var info = this.raiderModel.storageRecord[k];
                var itemInfo_1 = undefined;
                if (info.good_type == ClientType.BASE_ITEM) {
                    itemInfo_1 = App.ConfigManager.getItemInfoById(info.good_id);
                }
                else {
                    itemInfo_1 = App.ConfigManager.getEquipById(info.good_id);
                }
                var label = new eui.Label();
                label.fontFamily = "SimHei";
                label.size = 24;
                label.textFlow = [{ text: info.player_nick, style: { textColor: 0x5cbcff } }, { text: "获得了" }, { text: itemInfo_1.name, style: { textColor: 0xf6a527 } }];
                this.gp_broadcast.addChild(label);
                label.left = 80;
            }
            var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, App.ConfigManager.getConstConfigByType("TREASURE_GOODS").value);
            if (!itemInfo) {
                RES.getResAsync("common_yuanbao_png", function (texture) {
                    _this.img_costone.source = texture;
                }, this);
                this.lb_costone.text = String(App.ConfigManager.getConstConfigByType("TREASURE_GOLD").value);
            }
            else {
                RES.getResAsync(itemInfo.icon + "_png", function (texture) {
                    _this.img_costone.source = texture;
                }, this);
                this.lb_costone.text = "*1";
            }
            this.lb_costten.text = String(App.ConfigManager.getConstConfigByType("TREASURE_GOLDS").value);
        };
        //更新仓库
        RaiderView.prototype.updateStorage = function () {
            var _this = this;
            RES.getResAsync("raider_cangku_title_png", function (texture) {
                _this.commonWin.img_title.texture = texture;
            }, this);
            var finalData = [];
            var data = this.raiderModel.storageItem;
            var count = Math.floor(data.length / 25);
            for (var i = 0; i < count; i++) {
                finalData.push(data.slice(i * 25, (i + 1) * 25));
            }
            if (count * 25 != data.length) {
                finalData.push(data.slice(count * 25, data.length));
            }
            this.pageView.dataProvider = new eui.ArrayCollection(finalData);
            this.lb_capacity.text = "容量：" + this.raiderModel.storageCapacity + "/" + App.ConfigManager.getConstConfigByType("TREASURE_WAREHOUSE").value;
        };
        //更新显示橙装界面
        RaiderView.prototype.updateOrangeView = function () {
            var _this = this;
            RES.getResAsync("raider_chengzhuang_title_png", function (texture) {
                _this.commonWin.img_title.texture = texture;
            }, this);
            this.forgeOrangeView.updateView(null);
        };
        RaiderView.prototype.updateView = function () {
            this.updateRaiderEquip();
        };
        //打开寻宝奖励
        RaiderView.prototype.openReward = function (data) {
            // if (this._rewardView && this._rewardView.parent) { //还存在奖励界面
            // 	PopUpManager.removePopUp(this._rewardView);
            // 	this._rewardView = undefined;
            // }
            // this._rewardView = new RaiderRewardView(data);
            // PopUpManager.addPopUp({obj:this._rewardView});
            App.WinManager.openWin(WinName.POP_RAIDER_REWARD, { data: data });
        };
        //从仓库中取出所有
        RaiderView.prototype.withdrawAll = function () {
            App.Socket.send(26006, {});
        };
        RaiderView.prototype.closeRaider = function () {
            App.WinManager.closeWin(WinName.RAIDER);
        };
        RaiderView.prototype.returnPreview = function () {
            App.WinManager.closeWin(WinName.RAIDER);
            if (this._lastModuleName) {
                App.WinManager.openWin(this._lastModuleName);
            }
        };
        RaiderView.prototype.buyOne = function () {
            App.Socket.send(26003, {});
        };
        RaiderView.prototype.buyTen = function () {
            App.Socket.send(26004, {});
        };
        /**
         * 打开窗口
         */
        RaiderView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam) {
                this._lastModuleName = openParam.lastModule; //上次打开模块
                if (openParam.index || openParam.index == 0) {
                    var event_1 = new eui.ItemTapEvent("");
                    event_1.itemIndex = openParam.index;
                    this.tabbar.selectedIndex = openParam.index;
                    this.changeIndex(event_1);
                }
            }
            this.forgeOrangeView.openWin(openParam);
            App.EventSystem.addEventListener(PanelNotify.RAIDER_UPDATE_VIEW, this.updateView, this);
            App.EventSystem.addEventListener(PanelNotify.RAIDER_OPEN_REWARD, this.openReward, this);
            App.EventSystem.addEventListener(PanelNotify.RAIDER_UPDATE_STORAGE, this.updateStorage, this);
            App.Socket.send(26001, {});
        };
        /**
         * 关闭窗口
         */
        RaiderView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
            this.forgeOrangeView.closeWin(callback);
        };
        /**
         * 清理
         */
        RaiderView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            this.forgeOrangeView.clear(data);
            App.EventSystem.removeEventListener(PanelNotify.RAIDER_UPDATE_VIEW);
            App.EventSystem.removeEventListener(PanelNotify.RAIDER_OPEN_REWARD);
            App.EventSystem.removeEventListener(PanelNotify.RAIDER_UPDATE_STORAGE);
        };
        /**
         * 销毁
         */
        RaiderView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this.forgeOrangeView.destroy();
        };
        return RaiderView;
    }(BaseView));
    game.RaiderView = RaiderView;
    __reflect(RaiderView.prototype, "game.RaiderView");
    var RaiderStorageItem = (function (_super) {
        __extends(RaiderStorageItem, _super);
        function RaiderStorageItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"RaiderStorageItemSkin\" width=\"100\" height=\"125\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:Group id=\"gp_main\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t<customui:BaseItem id=\"baseItem\" width=\"100\" height=\"100\" horizontalCenter=\"0\" top=\"0\" anchorOffsetX=\"0\" anchorOffsetY=\"0\"/>\n\t\t\t\t\t</e:Group>\n\t\t\t\t</e:Skin>";
            _this.baseItem.setItemNameVisible(true);
            return _this;
            // this.baseItem.setStopShowTips(true);
        }
        RaiderStorageItem.prototype.dataChanged = function () {
            this.baseItem.updateBaseItem(this.data.good_type, this.data.good_id, this.data.num);
            this.baseItem.setItemNameAtt({ size: 22 });
            this.baseItem.setItemNameAtt({ y: 96 });
        };
        return RaiderStorageItem;
    }(eui.ItemRenderer));
    __reflect(RaiderStorageItem.prototype, "RaiderStorageItem");
    var RaiderStorageGroup = (function (_super) {
        __extends(RaiderStorageGroup, _super);
        function RaiderStorageGroup() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"RaiderStorageGroupSkin\" width=\"580\" height=\"640\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:List id=\"list\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t\n\t\t\t\t\t</e:List>\n\t\t\t\t</e:Skin>";
            var layout = new eui.TileLayout();
            layout.requestedColumnCount = 5;
            layout.requestedRowCount = 5;
            layout.verticalGap = 0;
            layout.horizontalGap = 20;
            layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
            _this.list.layout = layout;
            _this.list.itemRenderer = RaiderStorageItem;
            return _this;
            // this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
        }
        RaiderStorageGroup.prototype.reload = function (data) {
            this.list.dataProvider = new eui.ArrayCollection(data);
        };
        RaiderStorageGroup.prototype.itemTap = function (event) {
            var itemData = event.item;
            App.GlobalTips.showItemTips(itemData.good_type, itemData.good_id, itemData.id);
        };
        return RaiderStorageGroup;
    }(PageViewItem));
    __reflect(RaiderStorageGroup.prototype, "RaiderStorageGroup");
})(game || (game = {}));
//# sourceMappingURL=RaiderView.js.map