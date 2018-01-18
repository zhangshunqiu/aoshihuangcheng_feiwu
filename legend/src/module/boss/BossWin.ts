/**
 * Author: liuyonggen
 * 挑战boss成功弹出面板  2017/11/13
 */
module game {
    export class BossWin extends BaseView {
        public lb_exp: eui.Label;
        public lb_level: eui.Label;
        public gp_get: eui.Group;
        public gp_nextLevel: eui.Group;
        public pb_exp: eui.ProgressBar;
        public scroller: eui.Scroller;
        public countDownNum: number = 5;
        public btlb_countDown: eui.BitmapLabel;
        public gp_bossTop: eui.Group;
        public gp_worldBossTop: eui.Group;
        public lb_rank: eui.Label;
        public img_rewardType: eui.Image;
        public lb_rewardDes: eui.Label;

        private _bossModel: BossModel = BossModel.getInstance();
        private _heroModel: HeroModel = HeroModel.getInstance();
        public list: eui.List;
        private _timerId: number = 0;
        private _tower: boolean = false;  //是否在爬塔
        private _worldBoss: boolean = false;  //是否在挑战世界boss
        private _copySweep: boolean = false;  //副本扫荡
        private _startChallengeTowerEventId: number = 0;  //请求挑战副本事件

        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
        }

        private initView() {
            this.lb_exp.text = "经验：" + (this._bossModel.bossInfo.exp || 0);
            this.lb_level.text = "LV." + App.RoleManager.roleInfo.lv;
            this.pb_exp.maximum = App.ConfigManager.getExpConfigByLv(Number(App.RoleManager.roleInfo.lv) + 1).exp;  //升级所需经验
            this.pb_exp.value = App.RoleManager.roleInfo.exp; //人物当前经验

            this.list = new eui.List();
            this.list.itemRenderer = getItem;
            let layout = new eui.TileLayout();
            layout.requestedColumnCount = 4;
            layout.verticalGap = 10;
            layout.horizontalGap = 10;
            layout.horizontalAlign = egret.HorizontalAlign.LEFT;
            this.list.layout = layout;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);  //点击物品弹出对应物品信息

            this.scroller.viewport = this.list;
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;

            this.list.dataProvider = new eui.ArrayCollection([]);
            this.gp_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetAward, this);
            this.dropItem();
        }

        /**
         * 领取奖励
         */
        private onGetAward() {
            this.stopTime();
            App.WinManager.closeWin(WinName.BOSS_WIN);
            if (this._bossModel.hookId > 40000) {
                App.WinManager.openWin(WinName.INCOME_PROMOTE);  //弹出关卡收益提升
            }
        }

        private dropItem() {
            if (this.list) {
                this.list.dataProvider = new eui.ArrayCollection(this._bossModel.dropItem);
            }
        }

        /**
         * 点击弹出物品信息
         */
        private itemTap(event: eui.ItemTapEvent) {
            let itemData = event.item;
            App.GlobalTips.showItemTips(itemData.type, itemData.id, null);
        }


        private timeUpdate() {
            if (this.countDownNum >= 0) {
                this.btlb_countDown.text = this.countDownNum + "";
                this.countDownNum--;
            } else {
                this.stopTime();
                this._tower = false;
                this.onGetAward();
            }
        }

        /**
         * 停止计时器
         */
        private stopTime() {
            if (this._timerId != 0) {
                App.GlobalTimer.remove(this._timerId);
                this._timerId = 0;
            }
        }
        /**
        * 打开窗口
        */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            this._tower = false;
            this._worldBoss = false;
            this.countDownNum = 5;
            if (this._timerId == 0) {
                this._timerId = App.GlobalTimer.addSchedule(1000, 0, this.timeUpdate, this);
            }
            if (openParam) {
                if (openParam >= 30200 && openParam < 30300) {  //爬塔副本
                    this.gp_get.x = 167;
                    this.gp_nextLevel.visible = true;
                    this.gp_nextLevel.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                        App.Socket.send(31002, { type: 3, id: ++(CopyModel.getInstance() as CopyModel).topId });
                        this._tower = true;
                    }, this);
                    if (this._startChallengeTowerEventId == 0) {
                        this._startChallengeTowerEventId = App.EventSystem.addEventListener(PanelNotify.COPY_ASK_CHALLENGE_RESULT, this.closeWin, this);
                    }
                } else if (openParam == "encounter") {  //遭遇战
                    this.gp_bossTop.visible = false;
                    this.gp_worldBossTop.visible = false;
                    this.lb_rewardDes.y = 310;
                    this.scroller.y = 360;
                } else if (openParam == "copySweep") {  //副本扫荡
                    this._copySweep = true;
                }
            } else if (SceneUtil.isWorldBossScene(SceneModel.getInstance().sceneId)) {
                this.gp_bossTop.visible = false;
                this.lb_rewardDes.visible = false;
                this.gp_worldBossTop.visible = true;
                this.lb_rank.text = "第" + this._bossModel.rank;
                if (this._bossModel.rank == 1) {
                    this.img_rewardType.source = "worldboss_jishadajiang_png";
                } else {
                    this.img_rewardType.source = "worldboss_canyudajiang_png";
                }
                this._worldBoss = true;
            }

            this.dropItem();
        }

		/**
		 * 关闭窗口
		 */
        public closeWin(): void {
            super.closeWin();
        }

        /**
		 * 清理
		 */
        public clear(data: any = null): void {
            super.clear();
            this.stopTime();
            if (this._worldBoss) {
                App.Socket.send(36008, {});
                this._worldBoss = false;
                this._tower = true;  //此处设置只是为了不发13001
            } else if (this._copySweep) {

            } else if (!this._tower) {
                App.Socket.send(13001, {});
                if (this._startChallengeTowerEventId != 0) {
                    App.EventSystem.removeEventListener(PanelNotify.COPY_ASK_CHALLENGE_RESULT, this._startChallengeTowerEventId);
                    this._startChallengeTowerEventId = 0;
                }
            }
            this._bossModel.wave = 0;
            App.EventSystem.dispatchEvent(PanelNotify.BOSS_WAVE_UPDATE);
        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
        }

    }

    class getItem extends eui.ItemRenderer {
        public baseItem: customui.BaseItem;
        public constructor() {
            super();
            this.skinName = `<?xml version="1.0" encoding="utf-8"?>
				<e:Skin class="getItemSkin" width="100" height="125" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
					<e:Group id="gp_main" left="0" right="0" top="0" bottom="0">
						<customui:BaseItem id="baseItem" width="100" height="100" horizontalCenter="0" top="0" anchorOffsetX="0" anchorOffsetY="0"/>
					</e:Group>
				</e:Skin>`;
            this.baseItem.setItemNameVisible(true);
        }

        protected dataChanged() {
            this.data.id = this.data.id || this.data.good_id;
            this.data.type = this.data.type || ClientType.BASE_ITEM;
            this.data.num = this.data.num || this.data.good_num;
            this.baseItem.updateBaseItem(this.data.type, this.data.id, this.data.num);
        }
    }
}