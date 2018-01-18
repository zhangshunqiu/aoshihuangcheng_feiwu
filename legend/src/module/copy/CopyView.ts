/**
 * Author: liuyonggen
 * 副本系统数据模型 2017/11/27
 */
module game {
    export class CopyView extends BaseView {
        public commonWin: customui.CommonWin;
        public img_back: eui.Image;
        public gp_boss: eui.Group;
        public gp_material: eui.Group;
        public gp_challenge: eui.Group;
        public scroller_boss: eui.Scroller;
        public scroller_material: eui.Scroller;
        public list_boss: eui.List;
        public list_material: eui.List;
        public list_challenge: eui.List;
        public btn_challenge: eui.Button;
        public img_challenge: eui.Image;
        public img_done: eui.Image;
        public lb_score: eui.Label;
        public lb_tip: eui.Label;
        public gp_bossModel: eui.Group;
        public img_nextBoss1: eui.Image;
        public img_nextBoss2: eui.Image;
        public lb_nowLevel: eui.Label;
        public lb_level: eui.Label;
        public lb_nextLevel1: eui.Label;
        public lb_nextLevel2: eui.Label;
        public img_btnBg1: eui.Image;
        public img_btnBg2: eui.Image;
        public img_btnBg3: eui.Image;
        public tabbar: eui.TabBar;
        private _bossMc: AMovieClip;
        private _copyInfoUpdateEventId: number = 0;
        private _curIndex: number = 0;
        private _askChallengeEventId: number = 0;

        private _copyModel: CopyModel = CopyModel.getInstance();

        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        public childrenCreated() {
            super.childrenCreated();
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            RES.getResAsync("copy_fuben_title_png", (texture) => {
                this.commonWin.img_title.texture = texture;
            }, this);
            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.initView();
        }

        private initView() {
            let data = ["个人BOSS", "材料副本", "挑战副本"];
            this.tabbar.dataProvider = new eui.ArrayCollection(data);
            this.tabbar.selectedIndex = this._curIndex;
            this.tabbar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.changeIndex, this);
            this.initBossView();
            this.initMaterialView();
            this.initChallegeView();
            this.validateNow();

            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.COPY_PERSONAL, this.tabbar.getChildAt(0) as egret.DisplayObjectContainer);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.COPY_MATERIAL, this.tabbar.getChildAt(1) as egret.DisplayObjectContainer);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.COPY_CHALLENGE, this.tabbar.getChildAt(2) as egret.DisplayObjectContainer);
        }

        /**红点 */
        private setBtnRedTip() {
            if (this._copyModel.canChallenge.bossBool) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.COPY_PERSONAL, true);
            } else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.COPY_PERSONAL, false);
            }
            if (this._copyModel.canChallenge.materialBool) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.COPY_MATERIAL, true);
            } else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.COPY_MATERIAL, false);
            }
        }

        private changeIndex(event: eui.ItemTapEvent) {
            this.changeView(event.itemIndex);
            if (event.itemIndex == ConstCopyType.Tower) {
                if (App.BtnTipManager.getTypeValue(ConstBtnTipType.COPY_CHALLENGE)) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.COPY_CHALLENGE, false);
                }
            }
        }

        private changeView(selectIndex) {
            this.gp_boss.visible = false;
            this.gp_challenge.visible = false;
            this.gp_material.visible = false;
            this.img_btnBg1.visible = false;
            this.img_btnBg2.visible = false;
            this.img_btnBg3.visible = false;
            switch (selectIndex) {
                case 0:
                    this.gp_boss.visible = true;
                    App.Socket.send(31001, { id: 1 });
                    this.img_btnBg1.visible = true;
                    break;
                case 1:
                    this.gp_material.visible = true;
                    App.Socket.send(31001, { id: 2 });
                    this.img_btnBg2.visible = true;
                    break;
                case 2:
                    this.gp_challenge.visible = true;
                    App.Socket.send(31001, { id: 3 });
                    this.img_btnBg3.visible = true;
                    break;
            }
        }

        private initBossView() {
            this.list_boss.itemRenderer = bossItem;
            let layout = new eui.TileLayout();
            layout.requestedColumnCount = 1;
            layout.verticalGap = 2;
            layout.verticalAlign = egret.VerticalAlign.TOP;
            this.list_boss.layout = layout;
            this.scroller_boss.viewport = this.list_boss;
            this.scroller_boss.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller_boss.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller_boss.verticalScrollBar.autoVisibility = false;
            this.scroller_boss.verticalScrollBar.visible = false
        }

        private initChallegeView() {
            this.list_challenge.itemRenderer = backpackItem;
            let layout = new eui.TileLayout();
            layout.requestedRowCount = 1;
            layout.horizontalGap = 0;
            layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
            this.list_challenge.layout = layout;
            // this.list_challenge.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallengeBoss, this);
            this.img_nextBoss1.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.updateChallengeView(this._copyModel.challengeCopyInfo1);
            }, this);
            this.img_nextBoss2.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.updateChallengeView(this._copyModel.challengeCopyInfo2);
            }, this);
            this.gp_bossModel.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.updateChallengeView(this._copyModel.challengeCopyInfo0);
            }, this);
        }

        private initMaterialView() {
            this.list_material.itemRenderer = MaterialItem;
            let layout = new eui.TileLayout();
            layout.requestedColumnCount = 1;
            layout.verticalAlign = egret.VerticalAlign.TOP;
            this.list_material.layout = layout;

            this.scroller_material.viewport = this.list_material;
            this.scroller_material.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller_material.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller_material.verticalScrollBar.autoVisibility = false;
            this.scroller_material.verticalScrollBar.visible = false;
        }

        private updateChallengeView(challengeCopyInfo) {
            this.list_challenge.dataProvider = new eui.ArrayCollection(challengeCopyInfo.drop_list);
            this.lb_score.text = challengeCopyInfo.score;
            this.lb_nowLevel.text = "第" + (this._copyModel.topId - 30199) + "关";
            this.lb_level.text = "第" + (this._copyModel.topId - 30199) + "关";
            this.lb_nextLevel1.text = "第" + (this._copyModel.topId - 30198) + "关";
            this.lb_nextLevel2.text = "第" + (this._copyModel.topId - 30197) + "关";
            if (challengeCopyInfo.scene_id == this._copyModel.topId) {
                this.btn_challenge.visible = true;
                this.img_challenge.visible = true;
                this.lb_tip.visible = false;
                this.joinBoss(this._copyModel.bossInfo.resId, 1);
            } else {
                this.btn_challenge.visible = false;
                this.img_challenge.visible = false;
                this.lb_tip.visible = true;
                this.lb_tip.text = "人物达到" + challengeCopyInfo.lv_limit + "级可进行挑战";
            }
        }

        private updateBossView() {
            this.list_boss.dataProvider = new eui.ArrayCollection(this._copyModel.bossCopyInfoArr);
            this.list_boss.validateNow();
            this.checkGuide();
        }

        private updateMaterialInfo() {
            this.list_material.dataProvider = new eui.ArrayCollection(this._copyModel.materialCopyInfoArr);
        }

        private updateInfo(type) {
            if (type == 1) {
                this.updateBossView();
            } else if (type == 2) {
                this.updateMaterialInfo();
            } else {
                this.updateChallengeView(this._copyModel.challengeCopyInfo0);
            }
            this.setBtnRedTip();
        }

        private joinBoss(resId, scale) {
            if (this._bossMc == null) {
                this._bossMc = new AMovieClip();
                this._bossMc.scaleX = scale;
                this._bossMc.scaleY = scale;
                this.gp_bossModel.addChild(this._bossMc);
                this._bossMc.frameRate = 4;
            }
            this._bossMc.playMCKey(resId + "15");  //加15是获得模型的正面
        }

        private onTouchChallengeBoss() {
            if (!GlobalUtil.checkBagCapacity()) {
                App.Socket.send(31002, { type: 3, id: this._copyModel.topId });
            }
        }

        // private itemTap(event: eui.ItemTapEvent) {
        //     let itemData = event.item;
        //     App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
        // }

        public checkGuide() {
            if (this.list_boss.numChildren > 0) {
                App.GuideManager.bindClickBtn((<eui.Group>(<bossItem>this.list_boss.getChildAt(0)).getChildByName("gp_right")).getChildByName("btn_challenge"), 1016, 2);
                App.GuideManager.checkGuide(1016);
            }

        }

        public removeGuide() {
            App.GuideManager.removeClickBtn(1016, 2);
        }

        /**
         * openParam 
         * @param {type: ConstCopyType.Boss}  ConstCopyType.Boss为boss副本，ConstCopyType.Material为材料副本,ConstCopyType.Tower为爬塔副本
         */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            if (openParam) {
                this.tabbar.selectedIndex = openParam.type;
                this.changeView(this.tabbar.selectedIndex);
            }
            App.Socket.send(31001, { id: 1 });
            egret.setTimeout(() => {
                App.Socket.send(31001, { id: 2 });
            }, this, 100);
            if (this._copyInfoUpdateEventId == 0) {
                this._copyInfoUpdateEventId = App.EventSystem.addEventListener(PanelNotify.COPY_INFO_UPDATE, this.updateInfo, this);
            }
            if (this._askChallengeEventId == 0) {
                this._askChallengeEventId = App.EventSystem.addEventListener(PanelNotify.COPY_ASK_CHALLENGE_RESULT, this.closeWin, this);
            }
        }

        /**
		 * 关闭窗口
		 */
        public closeWin(): void {
            super.closeWin();
        }

        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        public clear(data: any = null): void {
            super.clear(data);
            if (this._copyInfoUpdateEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.COPY_INFO_UPDATE, this._copyInfoUpdateEventId);
                this._copyInfoUpdateEventId = 0;
            }
            if (this._askChallengeEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.COPY_ASK_CHALLENGE_RESULT, this._askChallengeEventId);
                this._askChallengeEventId = 0;
            }
            this.removeGuide();
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();
            if (this._bossMc) {
                this._bossMc.destroy();
                this._bossMc = null;
            }
        }
    }

    class bossItem extends eui.ItemRenderer {
        public lb_bossName: eui.Label;
        public img_bossIcon: eui.Image;
        public gp_right: eui.Group;
        public btn_challenge: eui.Button;
        public list: eui.List;
        public lb_challengeNum: eui.Label;
        public img_challenge: eui.Label;
        public img_done: eui.Label;
        public lb_tip: eui.Label;

        public constructor() {
            super();
            this.skinName = "BossItem";
            this.initView();
            this.gp_right.name = "gp_right";
            this.btn_challenge.name = "btn_challenge";
        }

        private initView() {
            this.list.itemRenderer = backpackItem;
            let layout = new eui.TileLayout();
            layout.requestedRowCount = 1;
            layout.horizontalGap = 0;
            layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
            this.list.layout = layout;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                if (!GlobalUtil.checkBagCapacity()) {
                    App.Socket.send(31002, { type: 1, id: this.data.scene_id });
                }
            }, this);
        }

        private itemTap(event: eui.ItemTapEvent) {
            let itemData = event.item;
            App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
        }

        protected dataChanged() {
            this.lb_bossName.text = this.data.name;
            this.img_bossIcon.source = this.data.icon + "_png";
            this.lb_challengeNum.text = Math.max(this.data.times_limit, 0) + "次";
            this.list.dataProvider = new eui.ArrayCollection(this.data.drop_list);
            this.updateBtn();
        }

        private updateBtn() {
            if ((App.RoleManager.roleInfo.lv >= this.data.lv_limit) && this.data.lv_limit != 0 || (App.RoleManager.roleInfo.turn >= this.data.transmigration && this.data.transmigration)) {
                this.gp_right.visible = true;
                this.lb_tip.visible = false;
                if (this.data.times_limit > 0) {
                    this.btn_challenge.currentState = "up";
                    this.btn_challenge.touchEnabled = true;
                    this.img_challenge.visible = true;
                    this.img_done.visible = false;
                } else {
                    this.btn_challenge.currentState = "down";
                    this.btn_challenge.touchEnabled = false;
                    this.img_challenge.visible = false;
                    this.img_done.visible = true;
                }
            } else {
                this.gp_right.visible = false;
                this.lb_tip.visible = true;
                if (this.data.lv_limit) {
                    this.lb_tip.text = "人物达到" + this.data.lv_limit + "级可进行挑战";
                } else {
                    this.lb_tip.text = "人物达到" + this.data.transmigration + "转可进行挑战";
                }

            }

        }

    }

    class MaterialItem extends eui.ItemRenderer {
        public img_materialName: eui.Image;
        public lb_desText: eui.Label;
        public gp_sweep: eui.Group;
        public img_sweep: eui.Image;
        public lb_gold: eui.Label;
        public lb_challengeNum: eui.Label;
        public gp_right: eui.Group;
        public btn_challenge: eui.Button;
        public img_challenge: eui.Label;
        public img_done: eui.Label;
        public lb_tip: eui.Label;
        public img_bg: eui.Image;
        public img_icon: eui.Image;

        public constructor() {
            super();
            this.skinName = "MaterialItem";
            this.initView();
        }

        private initView() {
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                if (this.data.times_limit > 0) {
                    if (!GlobalUtil.checkBagCapacity()) {
                        App.Socket.send(31002, { type: 2, id: this.data.scene_id });
                    }
                } else if (this.data.sweep > 0) {
                    if (!GlobalUtil.checkBagCapacity()) {
                        App.Socket.send(31003, { type: 2, id: this.data.scene_id });
                    }
                } else {

                }
            }, this);
        }

        protected dataChanged() {
            switch (this.data.name) {
                case "翅膀副本":
                    this.img_materialName.source = "copy_material_name_chibangfuben_png";
                    this.img_icon.source = "copy_material_icon_icon_chibang_png";
                    this.img_bg.source = "copy_material_bg_chibang_png";
                    break;
                case "护盾副本":
                    this.img_materialName.source = "copy_material_name_hudunfuben_png";
                    this.img_icon.source = "copy_material_hudun_png";
                    this.img_bg.source = "copy_material_bg_hudun_png";
                    break;
                case "肩甲副本":
                    this.img_materialName.source = "copy_material_name_jianjiafuben_png";
                    this.img_icon.source = "copy_material_icon_jianjia_png";
                    this.img_bg.source = "copy_material_bg_jianjia_png";
                    break;
            }
            this.updateBtn();
        }

        private updateBtn() {
            if (App.RoleManager.roleInfo.lv >= this.data.lv_limit) {
                this.gp_right.visible = true;
                this.lb_tip.visible = false;
                this.btn_challenge.currentState = "up";
                this.btn_challenge.touchEnabled = true;
                this.lb_desText.textAlign = "left";
                this.lb_challengeNum.visible = true;
                this.img_done.visible = false;
                if (this.data.times_limit > 0) {
                    this.img_challenge.visible = true;
                    this.gp_sweep.visible = false;
                    this.lb_desText.text = "挑战次数：";
                    this.lb_challengeNum.text = Math.max(this.data.times_limit, 0) + "次";
                } else if (this.data.sweep > 0) {
                    this.img_challenge.visible = false;
                    this.gp_sweep.visible = true;
                    this.img_sweep.visible = true;
                    this.img_done.visible = false;
                    this.lb_desText.text = "扫荡次数：";
                    this.lb_challengeNum.text = Math.max(this.data.sweep, 0) + "次";
                    this.lb_gold.text = App.ConfigManager.getConstConfigByType("MATERIAL_SWEEP_GOLD").value;
                } else {
                    this.btn_challenge.currentState = "down";
                    this.btn_challenge.touchEnabled = false;
                    this.img_challenge.visible = false;
                    this.gp_sweep.visible = false;
                    this.img_done.visible = true;
                    this.lb_desText.text = "提升VIP可增加扫荡次数";
                    this.lb_desText.textAlign = "center";
                    this.lb_challengeNum.visible = false;
                }
            } else {
                this.gp_right.visible = false;
                this.lb_tip.visible = true;
                if (this.data.lv_limit) {
                    this.lb_tip.text = "人物达到" + this.data.lv_limit + "级可进行挑战";
                }

            }

        }

    }

    class backpackItem extends eui.ItemRenderer {
        public baseItem: customui.BaseItem;
        public constructor() {
            super();
            this.skinName = `<?xml version="1.0" encoding="utf-8"?>
				<e:Skin class="backpackItemSkin" width="100" height="125" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
					<e:Group id="gp_main" left="0" right="0" top="0" bottom="0">
						<customui:BaseItem id="baseItem" width="90" height="90" horizontalCenter="0" top="0" anchorOffsetX="0" anchorOffsetY="0"/>
					</e:Group>
				</e:Skin>`;
            // this.baseItem.lb_name.visible = true;
        }

        protected dataChanged() {
            this.baseItem.updateBaseItem(this.data[0], this.data[1], null);
        }

    }
}
