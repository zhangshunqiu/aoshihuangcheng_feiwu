/**
 * Author: liuyonggen
 * Boss模块视图窗口  2017/11/13
 */
module game{
    export class BossView extends BaseView{
        public btlb_guanqia: eui.BitmapLabel;
        public gp_challenge: eui.Group;
        public img_close: eui.Image;
        public lb_no1: eui.Label;
        public lb_no2: eui.Label;
        public lb_no3: eui.Label;
        public lb_no1_guanqia: eui.Label;
        public lb_no2_guanqia: eui.Label;
        public lb_no3_guanqia: eui.Label;
        public img_back: eui.Image;
        public list: eui.List;
        public mc: AMovieClip;
        public gp_boss: eui.Group;
        public img_bossName: eui.Image;
        public img_passReward: eui.Image;
        public pb_challengeNum: eui.ProgressBar;

        public gp_getReward: eui.Group;
        public img_getReward: eui.Image;
        public img_passReward1: eui.Image;
        public lb_passRewardName: eui.Label;
        public gp_main : eui.Group;
      
        private _bossRewardEventId: number = 0;
        private _askChallengeEventId: number = 0;

        private _curGuideId : number;
        public bossModel: BossModel = BossModel.getInstance(); 

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, (e:Event)=>{  //点击叉关闭挑战boss窗口
                App.WinManager.closeWin(WinName.BOSS);
            }, this);

            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, (e:Event)=>{  //点击返回关闭挑战boss窗口
                App.WinManager.closeWin(WinName.BOSS);
            }, this);

            this.gp_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.challengeBoss, this);  //点击挑战boss

            this.img_getReward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetReward, this);
            this.getReward();
            this.initView(); //初始化挑战boss界面
        }

        private challengeBoss() {
            if((BackpackModel.getInstance() as BackpackModel).getRemindCapacity() < 20) { //如果背包容量不足20
                App.WinManager.openWin(WinName.BOSS_BAG_TIP);   //弹出容量不足提示框
            } else {
                App.Socket.send(13002,{});
            }
        }

        private getReward() {
            if(this.bossModel.getBossRewardNum > 0) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.BOSS_CHALLENGE, true);
                this.gp_getReward.visible = true;
                this.lb_passRewardName.text = this.bossModel.passReward.name;
                this.img_passReward1.source = this.bossModel.passReward.icon + "_png";
            } else {
                this.gp_getReward.visible = false;
                App.BtnTipManager.setTypeValue(ConstBtnTipType.BOSS_CHALLENGE, false);
            }
        }

        private onGetReward() {
            App.Socket.send(13011, {});
            this.bossModel.getBossRewardNum --;
            this.bossModel.getPassReward();
            this.getReward();
        }

        private initView() {
            //获取关卡
            this.btlb_guanqia.text = "第" + this.bossModel.sceneInfo.lv_limit + "关";
            //获取关卡排名
            let ranking = this.bossModel.ranking;
            for(let i:number=1; i<=3; i++) {
                this["lb_no"+i].text = i + "、" + ranking[i-1]["name"];
                this["lb_no"+i+"_guanqia"].text = "第" + ranking[i-1]["guanqia"] + '关';
            }
            //获取关卡boss
            let bossInfo = this.bossModel.bossInfo;
            this.joinBoss(bossInfo.resId, bossInfo.magnify_ratio);
            //获取boss名称
            let bossName = "boss_txt_" + bossInfo.name_photo + "_png";
            this.img_bossName.source = bossName;
            //获取已挑战次数
            this.pb_challengeNum.value = this.bossModel.sceneInfo.lv_limit % 10;
            //获取掉落物品
            this.getDrop();
        }

        private getDrop() {
            this.img_passReward.source = this.bossModel.currentPassReward.icon + "_png";
            this.list.itemRenderer = backpackItem;
            let layout = new eui.TileLayout();
			layout.requestedRowCount = 1;
			layout.horizontalGap = 20;
			layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
			this.list.layout = layout;
            this.list.dataProvider = new eui.ArrayCollection(this.bossModel.showDrop);
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
            this.img_passReward.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.GlobalTips.showItemTips(1, this.bossModel.currentPassReward.id, null);
            }, this);
        }

        private itemTap(event: eui.ItemTapEvent) {
			let itemData = event.item;
			App.GlobalTips.showItemTips(itemData.type, itemData.good_id, itemData.id);

		}

        private joinBoss(resId, scale) {
            this.mc = new AMovieClip();
            this.mc.scaleX = scale;
            this.mc.scaleY = scale;
            this.gp_boss.addChild(this.mc);
            this.mc.frameRate = 4;
            this.mc.playMCKey(resId + "15");
        }

        public checkGuide() {
            if (App.GuideManager.startGuide && App.GuideManager.curGuideId) { //开始引导了，有引导id
                let curGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(App.GuideManager.curGuideId, 2);
                if (curGuideInfo.type == 1 ) { //挑战boss引导
                    this._curGuideId = App.GuideManager.curGuideId;
                    App.GuideManager.bindClickBtn(this.gp_challenge, App.GuideManager.curGuideId, 2);
                    App.GuideManager.checkGuide(this._curGuideId);
                }
            }
        }

        public removeGuide() {
            if (this._curGuideId) {
                App.GuideManager.removeClickBtn(this._curGuideId,2);
            }
        }



        /**
		 * 打开窗口
		 */
		public openWin(openParam:any = null):void{
			super.openWin(openParam);
            if(this._bossRewardEventId == 0) {
                this._bossRewardEventId = App.EventSystem.addEventListener(PanelNotify.BOSS_REWARD_UPDATE, this.getReward, this);
            }
            if(this._askChallengeEventId == 0) {
                this._askChallengeEventId = App.EventSystem.addEventListener(PanelNotify.BOSS_CHALLENGE, this.closeWin, this);
            }
            App.Socket.send(13012, {});
            this.checkGuide();
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
		public clear(data:any = null):void{
            super.clear();
            if(this._bossRewardEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.BOSS_REWARD_UPDATE, this._bossRewardEventId);
                this._bossRewardEventId = 0;
            }
            this.removeGuide();
            if(this._askChallengeEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.BOSS_CHALLENGE, this._askChallengeEventId);
                this._askChallengeEventId = 0;
            }
		}
		/**
		 * 销毁
		 */
        public destory():void{
             super.destroy();
        }
    }


    class backpackItem extends eui.ItemRenderer {
		public baseItem: customui.BaseItem;
		public constructor() {
			super();
			this.skinName = `<?xml version="1.0" encoding="utf-8"?>
				<e:Skin class="backpackItemSkin" width="100" height="125" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
					<e:Group id="gp_main" left="0" right="0" top="0" bottom="0">
						<customui:BaseItem id="baseItem" width="100" height="100" horizontalCenter="0" top="0" anchorOffsetX="0" anchorOffsetY="0"/>
					</e:Group>
				</e:Skin>`;
			this.baseItem.lb_name.visible = true;
            this.baseItem.lb_num.visible = false;
		}

		protected dataChanged() {
			this.baseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num);
			if (this.data.type == ClientType.EQUIP) {
				let info = App.ConfigManager.equipConfig()[this.data.good_id];
				if (info) {
					this.baseItem.lb_name.text = "LV:" + info.limit_lvl;
				}
			}
		}

	} 
}