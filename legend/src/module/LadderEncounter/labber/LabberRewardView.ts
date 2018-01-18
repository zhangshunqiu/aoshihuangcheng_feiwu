/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 天梯争霸tips界面 2017/06/20.
 */
module game {
    export class LabberRewardView extends BaseView {
        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        public item1: customui.BaseItem;
        public item2: customui.BaseItem;
        public item3: customui.BaseItem;
        public item4: customui.BaseItem;
        public scr_reward: eui.Scroller;
        public img_close: eui.Image;
        public img_return: eui.Image;
        public lb_lv: eui.BitmapLabel;
        public lb_margin: eui.Label;
        public img_tier: eui.Image;
        private _list_reward: eui.List = new eui.List();
        private _reward_eventId: number = 0;
        private _labbermodel: LabberHegemonyModel = LabberHegemonyModel.getInstance();

        protected childrenCreated() {
            super.childrenCreated();

            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.WinManager.closeWin(WinName.HEGEMONY_LABBER_REWARD);
            }, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.WinManager.closeWin(WinName.HEGEMONY_LABBER_REWARD);
            }, this);
            this.scr_reward.viewport = this._list_reward;
            this.scr_reward.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._list_reward.itemRenderer = LabberRewardItem;

            // this._labbermodel.tier_reward_list = App.ConfigManager.getLabberTierRewardInfo();
            // this._labbermodel.rank_reward_List = App.ConfigManager.getLabberRankRewardInfo();

            this.item1.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[0][1], null);
            }, this);

            this.item2.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[1][1], null);
            }, this);

            this.item3.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[2][1], null);
            }, this);

            this.item4.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[3][1], null);
            }, this);


        }

		/**
	   * 打开窗口
	   */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);

            if (this._reward_eventId == 0) {
                this._reward_eventId = App.EventSystem.addEventListener(PanelNotify.HEGEMONY_REWARD_UPDATE, this.updateRewardInfo, this);
            }

            App.Socket.send(37004, null);
            //this.updateRewardInfo();
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

            if (this._reward_eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HEGEMONY_REWARD_UPDATE, this._reward_eventId);
                this._reward_eventId = 0;
            }


        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
        }

        public updateRewardInfo() {


            RES.getResAsync(GlobalUtil.getTierIcon(this._labbermodel.my_tier), (texture) => {
                this.img_tier.source = texture;
                this.img_tier.width = texture.width;
                this.img_tier.height = texture.height;
            }, this);
            this.lb_lv.text = this._labbermodel.my_lv + "";
            this.lb_margin.text = this._labbermodel.my_margin + "";
            this.item1.setItemNumVisible(true);
            this.item2.setItemNumVisible(true);
            this.item3.setItemNumVisible(true);
            this.item4.setItemNumVisible(true);
            this.item1.updateBaseItem(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[0][1],this._labbermodel.tier_reward_list[0][2]);
            this.item2.updateBaseItem(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[1][1], this._labbermodel.tier_reward_list[1][2]);
            this.item3.updateBaseItem(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[2][1],this._labbermodel.tier_reward_list[2][2]);
            this.item4.updateBaseItem(ClientType.BASE_ITEM, this._labbermodel.tier_reward_list[3][1],this._labbermodel.tier_reward_list[3][2]);
            // this.item1.lb_num.visible = true;
            // this.item1.lb_num.text = this._labbermodel.tier_reward_list[0][2];
            // this.item2.lb_num.visible = true;
            // this.item2.lb_num.text = this._labbermodel.tier_reward_list[1][2];
            // this.item3.lb_num.visible = true;
            // this.item3.lb_num.text = this._labbermodel.tier_reward_list[2][2];
            // this.item4.lb_num.visible = true;
            // this.item4.lb_num.text = this._labbermodel.tier_reward_list[3][2];

            this._list_reward.dataProvider = new eui.ArrayCollection(this._labbermodel.reward_list);

        }
    }


    export class LabberRewardItem extends eui.ItemRenderer {

        public lb_name: eui.Label;
        public lb_margin: eui.Label;
        public lb_lv: eui.BitmapLabel;
        public lb_rank: eui.Label;
        public img_tier: eui.Image;
        public img_rank: eui.Image;
        public item: customui.BaseItem;
        public lrv: LabberRewardVo;


        public constructor() {
            super();
            this.skinName = "LabberRewardItemSkin";

            this.item.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.showRewardTips();
            }, this);


        }

        public dataChanged() {

            let lv = this.data as LabberRewardVo;
            this.lrv = lv;
            if (lv.player_id > 0) {
                this.lb_name.text = lv.name;
                this.lb_lv.text = lv.lv + "";
                this.lb_margin.text = lv.margin + "场";
                this.img_tier.visible = true;
                RES.getResAsync(GlobalUtil.getTierIcon(lv.tier), (texture) => {
                    this.img_tier.source = texture;
                    this.img_tier.width = texture.textureWidth;
                    this.img_tier.height = texture.textureHeight;
                }, this);
            }
            else {
                this.lb_name.text = "珍稀奖励，等你来夺";
                this.lb_lv.text = "";
                this.lb_margin.text = "";
                this.img_tier.visible = false;
            }
            
            this.item.setItemNumVisible(true)
            this.item.updateBaseItem(ClientType.BASE_ITEM, lv.reward_id, lv.reward_num);
            // this.item.lb_num.visible = true;
            // this.item.lb_num.text = lv.reward_num + "";


            if (lv.rank == 1) {
                this.img_rank.visible = true;
                RES.getResAsync("ranking list_1_png", (texture) => {
                    this.img_rank.source = texture;
                    this.img_rank.width = texture.textureWidth;
                    this.img_rank.height = texture.textureHeight;
                }, this);
            }
            else if (lv.rank == 2) {
                this.img_rank.visible = true;
                RES.getResAsync("ranking list_2_png", (texture) => {
                    this.img_rank.source = texture;
                    this.img_rank.width = texture.textureWidth;
                    this.img_rank.height = texture.textureHeight;
                }, this);

            }
            else if (lv.rank == 3) {
                this.img_rank.visible = true;
                RES.getResAsync("ranking list_3_png", (texture) => {
                    this.img_rank.source = texture;
                    this.img_rank.width = texture.textureWidth;
                    this.img_rank.height = texture.textureHeight;
                }, this);

            }
            else {
                this.img_rank.visible = false;
                this.lb_rank.text = lv.rank + "";
            }


        }


        public showRewardTips() {

            App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this.lrv.reward_id, null);
        }
    }
}