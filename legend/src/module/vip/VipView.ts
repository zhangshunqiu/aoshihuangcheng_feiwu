/**
 * Author: liuyonggen
 * Vip系统数据模型 2017/11/21
 */
module game {
    export class VipView extends BaseView {
        public img_close: eui.Image;
        public btlb_vip: eui.BitmapLabel;
        public btlb_nextVip: eui.BitmapLabel;
        public lb_nextVip: eui.Label;
        public lb_gold: eui.Label;
        public pageView: PageView;
        public gp_main: eui.Group;
        public img_return: eui.Image;
        public img_left: eui.Image;
        public img_right: eui.Image;
        public img_charge: eui.Image;
        public gp_maxVip: eui.Group;
        public gp_notMaxVip: eui.Group;
        public _eventId: number = 0;
        public _eventId1: number = 0

        private _heroModel: HeroModel = HeroModel.getInstance();
        private _vipModel: VipModel = VipModel.getInstance();

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        public childrenCreated() {
            super.childrenCreated();
            this.initView();
            this.updateView();
            this.validateNow();
        }

        private initView() {
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.closeWin(WinName.VIP);
            }, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.closeWin(WinName.VIP);
            }, this);
            this.img_left.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toLeft, this);
            this.img_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toRight, this);
            this.img_charge.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.openWin(WinName.RECHARGE);
            }, this);

            this.pageView = new PageView();
			this.pageView.setTabbarEnabled(false);
			this.pageView.itemRenderer = vipGroup;
			this.pageView.horizontalCenter = 1;
			this.pageView.height = 1000;
			this.pageView.width = 680;
			this.gp_main.addChild(this.pageView);
            this.pageView.touchEnabled = false;
        }

        private updateVipInfo() {
            this.pageView.dataProvider = new eui.ArrayCollection(this._vipModel.vipArr);
            this.pageView.currentIndex = this._vipModel.currentIndex;
            this.updateView();
            this.onCurrentIndexUpdate();
            this.checkGuide();
        }

        private updateView() {
            let vipInfo = this._vipModel.vipInfo;
            let nextVipInfo = this._vipModel.nextVipInfo;
            this.btlb_vip.text = vipInfo.vip;
            if(vipInfo.vip == 10) {
                this.btlb_nextVip.text = vipInfo.vip;
                this.gp_maxVip.visible = true;
                this.gp_notMaxVip.visible = false;
            } else {
                this.btlb_nextVip.text = vipInfo.vip + 1;
                this.lb_nextVip.text = vipInfo.vip + 1;
                this.lb_gold.text = this._vipModel.upGold + "";
            } 
        }

        private toLeft() {
            let index = this.pageView.currentIndex -1;
            App.loglyg("index",index);
            if(index >= 0) {
                this.pageView.jumpToPages(index);
                // this.pageView.currentIndex = index;
            }
        }

        private toRight() {
            let index = this.pageView.currentIndex + 1;
            if(index <= 10) {
                this.pageView.jumpToPages(index);
                // this.pageView.currentIndex = index;
            }
        }

        private onCurrentIndexUpdate() {
            if(this.pageView.currentIndex === 0) {
                this.img_left.visible = false;
            } else if(this.pageView.currentIndex === 10) {
                this.img_right.visible = false;
            } else {
                this.img_left.visible = true;
                this.img_right.visible = true;
            }
        }

        public checkGuide() {
            let gp = (<eui.Group>(<vipGroup>this.pageView.getChildAt(0)).getChildAt(0));
            App.GuideManager.bindClickBtn((<eui.Group>gp.getChildAt(0)).getChildByName("btn_get"),1021,2);
			App.GuideManager.checkGuide(1021);
		}

		public removeGuide() {
			App.GuideManager.removeClickBtn(1021,2);
		}

        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            App.Socket.send(24001,{});
            if(this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.VIP_REWARD_UPDATE, this.updateVipInfo, this);
            }
            if(this._eventId1 == 0) {
                this._eventId1 = App.EventSystem.addEventListener(PanelNotify.PAGE_CURRENTINDEX_UPDATE, this.onCurrentIndexUpdate, this);
            }
        }

        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        public clear(data: any = null): void {
            super.clear(data);
            if(this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.VIP_REWARD_UPDATE, this._eventId);
                this._eventId = 0;
            }
            if(this._eventId1 != 0) {
                App.EventSystem.removeEventListener(PanelNotify.PAGE_CURRENTINDEX_UPDATE, this._eventId1);
                this._eventId1 = 0;
            }
            this.removeGuide();
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();
        }
    }

    class vipGroup extends PageViewItem {
        public btlb_vip0: eui.BitmapLabel;
        public btlb_vip1: eui.BitmapLabel;
        public lb_backpack: eui.Label;
        public lb_backpackNum: eui.Label;
        public lb_transcript: eui.Label;
        public lb_transcriptNum: eui.Label;
        public lb_moneyTree: eui.Label;
        public lb_moneyTreeNum: eui.Label;
        public lb_quickFight: eui.Label;
        public lb_quickFightNum: eui.Label;
        public lb_arena: eui.Label;
        public lb_arenaNum: eui.Label;
        public lb_partner: eui.Label;
        public lb_partnerNum: eui.Label;
        public lb_smelt: eui.Label;
        public lb_wipe: eui.Label;
        public list: eui.List;
        public scroller: eui.Scroller;
        public img_receive: eui.Image;
        public img_hadReceive: eui.Image;
        public btn_get: eui.Button;
        public gp_list: eui.Group;
        public vipInfo: any;
        public count: number = 1;

        private _heroModel: HeroModel = HeroModel.getInstance();
        private _vipModel: VipModel = VipModel.getInstance();
		public constructor() {
			super();
			this.skinName = "VipGiftSkin";
		}

         public childrenCreated() {
            super.childrenCreated();
            this.gp_list.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouch, this);
            this.btn_get.name = "btn_get";
         }

         private onTouch(event: egret.TouchEvent) {
             event.stopPropagation();
         }

        public updateGift() {
            this.list.itemRenderer = backpackItem;
            let layout = new eui.TileLayout();
			layout.requestedRowCount = 1;
			layout.horizontalGap = 22;
			layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
			this.list.layout = layout;
            let data = [];
            for(let i:number=0; i<this.vipInfo.rewards.length; i++) {
                let obj:any = {};
                obj.type = this.vipInfo.rewards[i][0];
                obj.good_id = this.vipInfo.rewards[i][1];
                obj.num = this.vipInfo.rewards[i][2];
                data.push(obj);
            }
            this.list.dataProvider = new eui.ArrayCollection(data);

            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;

            this.count = 1;
        }

        public reload(data) {
			// this.list.dataProvider = new eui.ArrayCollection(data);
            this.vipInfo = data;
            this.updateGift();
            this.updateView();
		}

         private updateView() {
            let vipInfo = this.vipInfo;
            let nextVipInfo = this._vipModel.nextVipInfo;
            // this.btlb_vip.text = vipInfo.vip;
            this.btlb_vip0.text = vipInfo.vip;
            this.btlb_vip1.text = vipInfo.vip;
            // this.lb_backpackNum.text = vipInfo.bag + "个";
            // this.lb_transcriptNum.text = vipInfo.transcript + "次";
            // this.lb_moneyTreeNum.text = vipInfo.money_tree + "次";
            // this.lb_arenaNum.text = vipInfo.arena + "次";
            // this.lb_quickFightNum.text = vipInfo.quick_fight + "次";
            this.privilege();
            this.judgeGetOrNot();
        }

        private privilege() {
            for(let k in this.vipInfo) {
                switch(k) {
                    case "bag":
                        if(!this.vipInfo[k]) {
                            this.lb_backpack.visible = false;
                            this.lb_backpackNum.visible = false;
                            break;
                        }
                        this.lb_backpack.visible = true;
                        this.lb_backpackNum.visible = true;
                        this.lb_backpack.text = this.count + "、免费获得     背包";
                        this.lb_backpackNum.text = this.vipInfo.bag + "个";
                        this.lb_backpack.y = 8 + (this.count-1) * 36 ;
                        this.lb_backpackNum.y = 8 + (this.count-1) * 36 ;
                        this.count++;
                        break;
                    case "money_tree":
                        if(!this.vipInfo[k]) {
                            this.lb_moneyTree.visible = false;
                            this.lb_moneyTreeNum.visible = false;
                            break;
                        }
                        this.lb_moneyTree.visible = true;
                        this.lb_moneyTreeNum.visible = true;
                        this.lb_moneyTree.text = this.count + "、摇钱树每天可使用";
                        this.lb_moneyTreeNum.text = this.vipInfo.money_tree + "次";
                        this.lb_moneyTree.y = 8 + (this.count-1) * 36 ;
                        this.lb_moneyTreeNum.y = 8 + (this.count -1) * 36 ; 
                        this.count++;
                        break;
                    case "transcript":
                        if(!this.vipInfo[k]) {
                            this.lb_transcript.visible = false;
                            this.lb_transcriptNum.visible = false;
                            break;
                        }
                        this.lb_transcript.visible = true;
                        this.lb_transcriptNum.visible = true;
                        this.lb_transcript.text = this.count + "、每天可购买材料副本";
                        this.lb_transcriptNum.text = this.vipInfo.transcript + "次";
                        this.lb_transcript.y = 8 + (this.count-1) * 36 ;
                        this.lb_transcriptNum.y = 8 + (this.count -1) * 36 ; 
                        this.count++;
                        break;
                    case "quick_fight":
                        if(!this.vipInfo[k]) {
                            this.lb_quickFight.visible = false;
                            this.lb_quickFightNum.visible = false;
                            break;
                        }
                        this.lb_quickFight.visible = true;
                        this.lb_quickFightNum.visible = true;
                        this.lb_quickFight.text = this.count + "、快速战斗每天可购买";
                        this.lb_quickFightNum.text = this.vipInfo.quick_fight + "次";
                        this.lb_quickFight.y = 8 + (this.count-1) * 36 ;
                        this.lb_quickFightNum.y = 8 + (this.count -1) * 36 ; 
                        this.count++;
                        break;
                    case "arena":
                        if(!this.vipInfo[k]) {
                            this.lb_arena.visible = false;
                            this.lb_arenaNum.visible = false;
                            break;
                        }
                        this.lb_arena.visible = true;
                        this.lb_arenaNum.visible = true;
                        this.lb_arena.text = this.count + "、竞技场每天可购买";
                        this.lb_arenaNum.text = this.vipInfo.arena + "次";
                        this.lb_arena.y = 8 + (this.count-1) * 36 ;
                        this.lb_arenaNum.y = 8 + (this.count -1) * 36 ; 
                        this.count++;
                        break;
                    case "partner":
                        if(!this.vipInfo[k]) {
                            this.lb_partner.visible = false;
                            this.lb_partnerNum.visible = false;
                            break;
                        }
                        this.lb_partner.visible = true;
                        this.lb_partnerNum.visible = true;
                        this.lb_partner.text = this.count + "、可提前解锁";
                        this.lb_partnerNum.text = "第"+ this.vipInfo[k] + "个伙伴";
                        this.lb_partner.y = 8 + (this.count-1) * 36 ;
                        this.lb_partnerNum.y = 8 + (this.count -1) * 36 ; 
                        this.count++;
                        break;
                    case "smelt":
                         if(!this.vipInfo[k]) {
                            this.lb_smelt.visible = false;
                            break;
                        }
                        this.lb_smelt.visible = true;
                        this.lb_smelt.text = this.count + "、装备一键熔炼";
                        this.lb_smelt.y = 8 + (this.count-1) * 36 ;
                        this.count++;
                        break;
                     case "wipe":
                         if(!this.vipInfo[k]) {
                            this.lb_wipe.visible = false;
                            break;
                        }
                        this.lb_wipe.visible = true;
                        this.lb_wipe.text = this.count + "、一键扫荡个人BOSS";
                        this.lb_wipe.y = 8 + (this.count-1) * 36 ;
                        this.count++;
                        break;
                }
            }
        }

        private judgeGetOrNot() {
            if(this.vipInfo.rewardList.state == 1) {
                this.img_receive.visible = true;
                this.img_hadReceive.visible = false;
                this.btn_get.visible = true;
                this.btn_get.currentState = "up";
                this.btn_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReward, this);
            } else if(this.vipInfo.rewardList.state == 2) {
                this.img_receive.visible = false;
                this.img_hadReceive.visible = true;
                this.btn_get.visible = true;
                this.btn_get.currentState = "down";
            } else {
                this.img_receive.visible = false;
                this.img_hadReceive.visible = false;
                this.btn_get.visible = false;
            }
        }

        private getReward() {
            App.Socket.send(24002, {lv:this.vipInfo.rewardList.lv});
            this.vipInfo.rewardList.state = 2;
            this.judgeGetOrNot();
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
		}

		protected dataChanged() {
			this.baseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num);
			if (this.data.type == ClientType.EQUIP) {
				let info = App.ConfigManager.equipConfig()[this.data.good_id];
				this.baseItem.lb_name.text = "LV:" + info.limit_lvl;
			}
		}

	}
}
