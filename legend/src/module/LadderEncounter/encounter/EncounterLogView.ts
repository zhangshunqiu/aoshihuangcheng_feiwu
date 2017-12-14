/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 天梯争霸tips界面 2017/06/20.
 */
module game {
    export class EncounterLogView extends BaseView {
        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        public scr_logs: eui.Scroller;
        public img_close: eui.Image;
        private _list_log: eui.List = new eui.List();
        private _log_eventId: number = 0;

        private _encountermodel: EncounterModel = EncounterModel.getInstance();

        protected childrenCreated() {
            super.childrenCreated();
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.WinManager.closeWin(WinName.ENCOUNTER_LOGS);
            }, this);

            this.scr_logs.viewport = this._list_log;
            this.scr_logs.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._list_log.itemRenderer = EncounterLogItem;

        }

        public updateLogList() {
            this._list_log.dataProvider = new eui.ArrayCollection(this._encountermodel.log_list);

        }
		/**
				 * 打开窗口
				*/
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            if (this._log_eventId == 0) {
                this._log_eventId = App.EventSystem.addEventListener(PanelNotify.ENCOUNTER_LOG_UPDATE, this.updateLogList, this);
            }
            App.Socket.send(38004,null);
        }

		/**
		 * 关闭窗口
		 */
        public closeWin(callback): void {
            super.closeWin(callback);
        }

		/**
		 * 清理
		 */
        public clear(data: any = null): void {
            super.clear(data);

            if (this._log_eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ENCOUNTER_LOG_UPDATE, this._log_eventId);
                this._log_eventId = 0;
            }

        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
        }

    }

    export class EncounterLogItem extends eui.ItemRenderer {

        public lb_name: eui.Label;
        public lb_time: eui.Label;
        public img_sucess: eui.Label;
        public img_fail: eui.Image;
        public item1: customui.BaseItem;
        public item2: customui.BaseItem;
        public item3: customui.BaseItem;
        public item4: customui.BaseItem;
        public item5: customui.BaseItem;
        public elo: EncounterLogVo;
        private _items: Array<customui.BaseItem> = [];

        public constructor() {
            super();
            this.skinName = "EncounterLogItemSkin";
            this._items.push(this.item1);
            this._items.push(this.item2);
            this._items.push(this.item3);
            this._items.push(this.item4);
            this._items.push(this.item5);
            this.item1.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this.elo.reward_list[0].good_id, null);
            }, this);
            this.item2.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this.elo.reward_list[1].good_id, null);
            }, this);
            this.item3.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this.elo.reward_list[2].good_id, null);
            }, this);
            this.item4.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this.elo.reward_list[3].good_id, null);
            }, this);
            this.item5.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this.elo.reward_list[4].good_id, null);
            }, this);


        }

        public dataChanged() {

            let info = this.data as EncounterLogVo;
            this.elo = info;
            this.lb_name.text = info.name;
            var timestamp = info.time;
            var newDate = new Date();
            newDate.setTime(timestamp * 1000);
            this.lb_time.text = newDate.toLocaleString();//newDate.toLocaleDateString()+.format('yyyy-MM-dd h:m:s')?
            if (info.res = 1) {
                this.img_sucess.visible = true;
                this.img_fail.visible = false;
            }
            else {
                this.img_sucess.visible = false;
                this.img_fail.visible = true;
            }
            for (let i = 0; i < this._items.length; i++) {
                if (i < info.reward_list.length) {
                    this._items[i].updateBaseItem(ClientType.BASE_ITEM, info.reward_list[i].good_id);
                    this._items[i].lb_num.visible = true;
                    this._items[i].lb_num.text = info.reward_list[i].good_num;

                }
                else {
                    this._items[i].visible = false;
                }

            }

        }


    }
}