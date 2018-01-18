var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: zhangshunqiu zrj
 * Email： 21102585@qq.com
 * 提示信息管理器
 *
 * 说明：
 *  App.GlobalTips.showTips(); 中间文字提示
 * 	App.GlobalTips.showErrCodeTips(); 错误码返回提示
 * 	App.GlobalTips.showBroadcastTips(); 系统广播提示
 * 	App.GlobalTips.showAlert();         提示窗口提示
 * 	App.GlobalTips.showItemTips();      物品提示
 *  App.GlobalTips.showCombatTips();    战力提示
 */
var GlobalTips = (function () {
    function GlobalTips() {
        this._maxTextTipNum = 10;
        this._maxTextTipQueueNum = 20;
        this._textTipsItemCache = [];
        this._eventSystem = EventSystem.getInstance();
        this._textTipWinEvent = new WinManagerEvent(new WinManagerVO("", "", WinLay.EFFECT_LAY), null);
        this._textTipsQueue = [];
        this._textTipsItemList = [];
        this._broadcastQueue = [];
        //this._itemTipsList = [];
    }
    GlobalTips.getInstance = function () {
        if (this._instance == null) {
            this._instance = new GlobalTips();
        }
        return this._instance;
    };
    /**
     * 清理
     */
    GlobalTips.prototype.clear = function () {
        this._textTipsItemCache = [];
        this._textTipsQueue = [];
        for (var i = 0; i < this._textTipsItemList.length; i++) {
            var item = this._textTipsItemList[i];
            item.destroy();
            if (item.parent) {
                item.parent.removeChild(item);
            }
        }
        this._textTipsItemList = [];
        this._broadcastQueue = [];
        App.WinManager.closeWin(WinName.BROADCAST);
    };
    /**
     * 错误码文字提示信息
     */
    GlobalTips.prototype.showErrCodeTips = function (errorCode, suffixTips) {
        this.showTips(App.ConfigManager.getErrInfoById(errorCode).des + (suffixTips ? suffixTips : ""));
    };
    /**
     * 中间的文字提示信息
     */
    GlobalTips.prototype.showTips = function (data) {
        if (this._textTipsItemList.length > this._maxTextTipNum) {
            if (this._textTipsQueue.length < this._maxTextTipQueueNum) {
                this._textTipsQueue.push(data);
            }
            return;
        }
        var item;
        if (this._textTipsItemCache.length > 0) {
            item = this._textTipsItemCache.pop();
        }
        else {
            item = new TextTipsItem();
        }
        item.init(data);
        this._textTipsItemList.push(item);
        item.x = App.stageWidth / 2;
        item.y = App.stageHeight / 2;
        this._textTipWinEvent.setView(item);
        this._eventSystem.dispatchEvent(WinManagerEvent.WIN_ADD, this._textTipWinEvent);
        if (this._textTipsItemList.length > 1) {
            for (var i = 0; i < this._textTipsItemList.length; i++) {
                var view = this._textTipsItemList[i];
                egret.Tween.removeTweens(view);
                var offset = App.stageHeight / 2 - (this._textTipsItemList.length - i) * 52 - 40;
                egret.Tween.get(view).to({ y: offset }, 300);
                //egret.Tween.get(view).to({ y: offset }, 300).wait(500).call(this.removeTips, this);
            }
        }
        else {
            var offset = App.stageHeight / 2 - 52 - 40;
            egret.Tween.get(item).to({ y: offset }, 300);
        }
    };
    /**
     * 移除文字提示
     */
    GlobalTips.prototype.removeTips = function () {
        if (this._textTipsItemList.length > 0) {
            var item = this._textTipsItemList.shift();
            if (item.parent) {
                item.parent.removeChild(item);
            }
            this._textTipsItemCache.push(item);
            // this._textTipWinEvent.setView(this._textTipsItemList.shift());
            // this._eventSystem.dispatchEvent(WinManagerEvent.WIN_REMOVE, this._textTipWinEvent);
        }
        if (this._textTipsItemList.length < 10) {
            for (var i = this._textTipsItemList.length; i < this._maxTextTipNum; i++) {
                if (this._textTipsQueue.length > 0) {
                    this.showTips(this._textTipsQueue.shift());
                }
            }
        }
    };
    /**
     * 物品提示面板
     */
    GlobalTips.prototype.showItemTips = function (type, id, uuid, info) {
        if (info === void 0) { info = undefined; }
        var view = undefined;
        switch (type) {
            case 1: {
                // view = new game.ItemTip(id, uuid);
                App.WinManager.openWin(WinName.ITEMTIPS, { id: id, uuid: uuid });
                break;
            }
            case 2: {
                App.WinManager.openWin(WinName.EQUIP, { type: 0, id: id, uuid: uuid, info: info });
                return;
            }
        }
        // PopUpManager.addPopUp({ obj: view, effectType: 0 });
    };
    /**
     * 物品获取途径提示面板
     */
    GlobalTips.prototype.showItemWayTips = function (type, id) {
        // let view = new ItemWay(type, id);
        // PopUpManager.addPopUp({ obj: view });
        App.WinManager.openWin(WinName.ITEMWAYS, { type: type, id: id });
    };
    /**
     * 提示面板
     */
    GlobalTips.prototype.showAlert = function (params) {
        // let view = new AlertTips(params);
        // PopUpManager.addPopUp({ obj: view });
        App.WinManager.openWin(WinName.ALERTTIPS, params);
    };
    /**
     * 广播提示
     */
    GlobalTips.prototype.showBroadcastTips = function (data) {
        if (data === void 0) { data = null; }
        if (data) {
            this._broadcastQueue.push(data);
            if (App.WinManager.isOpen(WinName.BROADCAST)) {
            }
            else {
                App.WinManager.openWin(WinName.BROADCAST, this._broadcastQueue.shift());
            }
        }
    };
    /**
     * 移除广播提示
     */
    GlobalTips.prototype.removeBroadcastTips = function () {
        if (this._broadcastQueue.length > 0) {
            App.WinManager.openWin(WinName.BROADCAST, this._broadcastQueue.shift());
        }
        else {
            App.WinManager.closeWin(WinName.BROADCAST);
        }
    };
    /**
     * 显示战力提升
     */
    GlobalTips.prototype.showCombatTips = function (beforeArr, afterArr) {
        game.CombatTips.getInstance().showCombat(beforeArr, afterArr);
    };
    return GlobalTips;
}());
__reflect(GlobalTips.prototype, "GlobalTips");
//# sourceMappingURL=GlobalTips.js.map