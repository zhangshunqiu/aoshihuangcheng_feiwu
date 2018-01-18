/**
 * module : 英雄模块子视图
 * author ： lh
*/
module game {

	/**
	 * 顶部英雄列表
	*/
    export class SelectHeroHeadView extends BaseChildView {
        private item_hero1: HeroHeadItem;
        private item_hero2: HeroHeadItem;
        private item_hero3: HeroHeadItem;
        private _heroHeadList: Array<HeroHeadItem> = [];
        public gp_main: eui.Group;
        public gp_head0: eui.Group;
        public gp_head1: eui.Group;
        public gp_head2: eui.Group;
        public lb_tip1: eui.Label;
        public lb_tip2: eui.Label;


        public currentIndex: number = undefined;

        private _selectMC: EffectMovieClip;
        private _partnerHandleEventId: number = 0;
        private heroModel: HeroModel = HeroModel.getInstance() as HeroModel;

        private _redTipList: Array<BtnTips> = [];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
        private _tipFrameArray: Array<AMovieClip> = [];

        public constructor(_skinName: string = "") {
            super(_skinName);
            this.skinName = "HeadComponent";
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
        }

        private initView() {

            this._heroHeadList.push(this.item_hero1);
            this._heroHeadList.push(this.item_hero2);
            this._heroHeadList.push(this.item_hero3);

            for (let i = 0; i <= 1; i++) {
                let mc1 = new AMovieClip();
                mc1.x = mc1.y = 53;
                mc1.scaleX = mc1.scaleY = 1.4;
                mc1.playMCKey("efficon", "", -1, null, () => { mc1.frameRate = 8; }, this);
                mc1.visible = false;
                (this.gp_main.getChildAt(i + 1) as eui.Group).addChild(mc1);
                this._tipFrameArray.push(mc1);
            }

            for (let i = 0; i < 3; i++) {
                this.gp_main.getChildAt(i).addEventListener(egret.TouchEvent.TOUCH_TAP, (event: TouchEvent) => {
                    if (i <= this.heroModel.heroInfo.length - 1) { //有角色
                        this.changeIndex(i);
                    } else {
                        this.showNewHero(i);
                    }
                }, this);

                var btnTip: BtnTips = new BtnTips(null, (this.gp_main.getChildAt(i) as egret.DisplayObjectContainer));
                // btnTip.show("1");
                this._redTipList.push(btnTip);
            }
            let info1 = App.ConfigManager.getPartnerConfigById(1); //第二个
            let info2 = App.ConfigManager.getPartnerConfigById(2); //第三个
            this.lb_tip1.lineSpacing = 6;
            this.lb_tip1.textFlow = [{ text: info1.level + "级\n", style: { textColor: 0xf59411 } }, { text: "解锁", style: { textColor: 0xc39b82 } }];
            this.lb_tip2.lineSpacing = 6;
            if (info2.level != 0) {
                this.lb_tip2.textFlow = [{ text: info2.level + "级\n", style: { textColor: 0xf59411 } }, { text: "解锁", style: { textColor: 0xc39b82 } }];
            } else {
                this.lb_tip2.textFlow = [{ text: info2.transmigration + "转\n", style: { textColor: 0xf59411 } }, { text: "解锁", style: { textColor: 0xc39b82 } }];
            }


            //打开上次位置
            this.changeIndex(HeroModel.getInstance().curPos);

            this.updateView();
        }

        private changeIndex(i) {
            if (this.currentIndex == undefined) {
                this.currentIndex = i;
            } else if (this.currentIndex == i) {
                return;
            }
            (<eui.Group>this.gp_main.getChildAt(this.currentIndex)).getChildAt(2).visible = false;
            (<eui.Group>this.gp_main.getChildAt(i)).getChildAt(2).visible = true;
            this.currentIndex = i;
            HeroModel.getInstance().curPos = i;
            App.EventSystem.dispatchEvent(PanelNotify.HERO_CHANGE, i);
            App.EventSystem.dispatchEvent(PanelNotify.HERO_ON_HERO_SELECT, i);
        }

        //选择新英雄
        private showNewHero(index) {
            let view = new HeroNewPartner(index);
            (EventSystem.getInstance() as EventSystem).dispatchEvent(WinManagerEvent.WIN_ADD, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), view));
        }

        public updateView() {
            this.heroModel.heroInfo.forEach((value, index, array) => {
                let headKey = //value.job + "0000" + value.sex;
                    App.ConfigManager.getSmallHeroIconBySexAndJob(value.sex, value.job, 2);
                RES.getResAsync(headKey + "_png", (texture) => {
                    (<eui.Image>(<eui.Group>this.gp_main.getChildAt(index)).getChildAt(1)).source = texture;
                    //(<eui.Image>(<eui.Group>this.gp_main.getChildAt(index)).getChildAt(1)).scaleX = 0.76;
                    //(<eui.Image>(<eui.Group>this.gp_main.getChildAt(index)).getChildAt(1)).scaleY = 0.76;
                }, this);
                (<eui.Image>(<eui.Group>this.gp_main.getChildAt(index)).getChildAt(0)).visible = true;
                let careerTag = ConstCareerIcon[value.job]
                RES.getResAsync(careerTag + "_png", (texture) => {
                    (<eui.Image>(<eui.Group>this.gp_main.getChildAt(index)).getChildAt(0)).source = texture;
                }, this);
            }, this)
            for (let i = 0; i < 3; i++) {
                if (i + 1 <= this.heroModel.heroInfo.length) { //有角色
                    if (i == 1) {
                        this.lb_tip1.visible = false;

                    } else if (i == 2) {
                        this.lb_tip2.visible = false;

                    }
                } else {
                    if (i == 1) {
                        this.lb_tip1.visible = true;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(1)).getChildAt(0)).visible = false;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(1)).getChildAt(1)).visible = false;
                    } else if (i == 2) {
                        this.lb_tip2.visible = true;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(2)).getChildAt(0)).visible = false;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(1)).getChildAt(1)).visible = false;
                    }
                }
            }
        }

		/**
		 * 打开窗口
		 */
        public open(openParam: any = null): void {
            super.open(openParam);
            //打开上次位置
            this.changeIndex(HeroModel.getInstance().curPos);
            this.updateView();
            if (this._partnerHandleEventId == 0) {
                this._partnerHandleEventId = App.EventSystem.addEventListener(PanelNotify.HERO_NEW_PARTNER, this.updateView, this);
            }
        }

        /**
        * 显示红点按钮提示
        */
        public showRedTips(index: number, value: any): void {
            var d: BtnTips = this._redTipList[index];
            if (d) {
                d.show(value);
            }
        }

        /**
        * 关闭红点按钮提示
        */
        public hideRedTips(index: number): void {
            var d: BtnTips = this._redTipList[index];
            if (d) {
                d.hide();
            }
        }

        /**
		 * 显示红点按钮提示,value值控制显隐,空值为隐藏
		 */
        public setRedTips(index: number, value: any): void {
            var d: BtnTips = this._redTipList[index];
            if (d) {
                if (value) {
                    d.show(value);
                } else {
                    d.hide();
                }
            }
        }

        public setNewPartnerTip(index, value) {
            let mc = this._tipFrameArray[index];
            if (value) {
                mc.visible = true;
            } else {
                mc.visible = false;
            }
        }

        /**
		 * 清理所有红点按钮提示
		 */
        public clearAllRedTips(): void {
            for (var i: number = 0; i < this._redTipList.length; i++) {
                (this._redTipList[i] as BtnTips).hide();
            }
        }
		/**
		 * 清理
		 */
        public clear(data: any = null): void {
            super.clear();
            if (this._partnerHandleEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_NEW_PARTNER, this._partnerHandleEventId);
                this._partnerHandleEventId = 0;
            }
        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
            for (let i = 0; i < this._tipFrameArray.length; i++) {
                this._tipFrameArray[i].destroy();
            }
        }
    }


    export class HeroHeadItem extends eui.ItemRenderer {

        private gp_head: eui.Group;
        private img_career: eui.Image;
        private img_head: eui.Image;
        private img_select: eui.Image;
        private img_lock: eui.Image;
        private lb_tip: eui.Label;



        public constructor() {
            super();
            this.skinName = "HeroHeadItemSkin";


        }


    }




}