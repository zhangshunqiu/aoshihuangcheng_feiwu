/**
 * module : 英雄模块子视图
 * author ： zrj
*/
module game {
	/**
	 * 顶部英雄列表
	*/
    export class HeroHeadComponentView extends BaseChildView {
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
            for (let i = 0; i <= 1; i++) {
                let mc1 = new AMovieClip();
                mc1.x = mc1.y = 45;
                mc1.scaleX = mc1.scaleY = 1.0;
                mc1.playMCKey("effjsxjs", "", -1, null, () => { mc1.frameRate = 8; }, this);
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

                var btnTip: BtnTips = new BtnTips(null, (this.gp_main.getChildAt(i) as egret.DisplayObjectContainer), 90, 90);
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
                this.lb_tip2.textFlow = [{ text: info2.transmigration + "转\n", style: { textColor: 0xf10000 } }, { text: "解锁", style: { textColor: 0xc39b82 } }];
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
                RES.getResAsync(careerTag, (texture) => {
                    (<eui.Image>(<eui.Group>this.gp_main.getChildAt(index)).getChildAt(0)).source = texture;
                }, this);
            }, this)
            for (let i = 0; i < 3; i++) {
                if (i + 1 <= this.heroModel.heroInfo.length) { //有角色
                    if (i == 1) {
                        this.lb_tip1.visible = false;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(1)).getChildAt(0)).visible = true;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(1)).getChildAt(1)).visible = true;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(1)).getChildAt(3)).visible = false;

                    } else if (i == 2) {
                        this.lb_tip2.visible = false;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(2)).getChildAt(0)).visible = true;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(2)).getChildAt(1)).visible = true;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(2)).getChildAt(3)).visible = false;

                    }
                } else {
                    if (i == 1) {
                        this.lb_tip1.visible = true;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(1)).getChildAt(0)).visible = false;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(1)).getChildAt(1)).visible = false;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(1)).getChildAt(3)).visible = true;
                    } else if (i == 2) {
                        this.lb_tip2.visible = true;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(2)).getChildAt(0)).visible = false;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(2)).getChildAt(1)).visible = false;
                        (<eui.Image>(<eui.Group>this.gp_main.getChildAt(2)).getChildAt(3)).visible = true;
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

	/**
	 * 创建新伙伴
	*/
    export class HeroNewPartner extends BaseView {
        public lb_desc: eui.Label;
        public btn_warrior: eui.Button;
        public btn_magic: eui.Button;
        public btn_pastor: eui.Button;
        public img_career: eui.Image;
        public btn_male: eui.Button;
        public btn_female: eui.Button;
        public gp_middle: eui.Group;;
        public img_selected: eui.Image;
        public img_return: eui.Image;
        public img_open: eui.Image;
        public img_over1: eui.Image;
        public img_over2: eui.Image;
        public img_over3: eui.Image;
        public commonWin: customui.CommonWin;

        public lb_tip: eui.Label;
        private career: number;
        private sex: number;
        private img_role: eui.Image;
        private _handle: number;
        private heroModel: HeroModel = HeroModel.getInstance() as HeroModel;
        private _index: number = 1; //英雄位置，从0开始计算

        public constructor(index) {
            super();
            this.skinName = "HeroSelectSkin";
            this._index = index;
            this.readyOpenWin();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.y += 64;
            this.initView();
            this.updateView();
        }

        private initView() {
            RES.getResAsync("partner_kaiqixinjuese_title_png", (texture) => {
                this.commonWin.img_title.texture = texture;
            }, this);
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                (EventSystem.getInstance() as EventSystem).dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), this));
            }, this);

            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                (EventSystem.getInstance() as EventSystem).dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), this));
            }, this);

            this.img_open.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                if (this.heroModel.heroHeadFrame[this._index - 1]) {
                    App.Socket.send(15011, { sex: this.sex, job: this.career });
                }
            }, this);

            (<eui.Label>this.btn_male.labelDisplay).textColor = 0xFFFC00;
            (<eui.Label>this.btn_female.labelDisplay).textColor = 0xFFFC00;
            this.btn_male.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.sex = ConstSex.MAN;
                this.updateView();
            }, this);
            this.btn_female.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.sex = ConstSex.WOMAN;
                this.updateView();
            }, this);
            this.btn_warrior.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.career = CareerType.SOLDIER;
                this.updateView();
            }, this);
            this.btn_magic.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.career = CareerType.MAGES;
                this.updateView();
            }, this);
            this.btn_pastor.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.career = CareerType.TAOIST;
                this.updateView();
            }, this);
            this.img_role = new eui.Image;
            this.img_role.horizontalCenter = 1;
            this.img_role.scaleX = this.img_role.scaleY = 0.7;
            this.img_role.y = -220;
            this.gp_middle.addChild(this.img_role);

            let exist = {};  //存在职业
            this.heroModel.heroInfo.forEach((value, index, array) => {
                if (value.job == CareerType.SOLDIER) {
                    this.btn_warrior.touchEnabled = false;
                    exist[1] = true;
                    this.img_over1.visible = true;
                } else if (value.job == CareerType.MAGES) {
                    this.btn_magic.touchEnabled = false;
                    exist[2] = true;
                    this.img_over2.visible = true;
                } else {
                    this.btn_pastor.touchEnabled = false;
                    exist[3] = true;
                    this.img_over3.visible = true;
                }
            }, this);
            this.sex = ConstSex.MAN;
            this.career = CareerType.SOLDIER;
            for (let i = 1; i <= 3; i++) {
                if (!exist[i]) {
                    this.career = i;
                    break;
                }
            }
            let info = App.ConfigManager.getPartnerConfigById(this._index);
            if (info.level != 0) {
                this.lb_tip.textFlow = [{ text: "解锁需要：" }, { text: info.level + "级", style: { textColor: 0xff7900 } }, { text: "或" }, { text: "VIP" + info.vip, style: { textColor: 0xff0000 } }];
            } else {
                this.lb_tip.textFlow = [{ text: "解锁需要：" }, { text: info.transmigration + "转", style: { textColor: 0xff7900 } }, { text: "或" }, { text: "VIP" + info.vip, style: { textColor: 0xff0000 } }];
            }
        }

        private updateView() {

            let info = LoginModel.getInstance().getInfoByCareerAndSex(this.career, this.sex); //拿配置信息
            this.sex == ConstSex.WOMAN ? this.btn_warrior.currentState = "down" : this.btn_warrior.currentState = "up";
            this.sex == ConstSex.WOMAN ? this.btn_magic.currentState = "down" : this.btn_magic.currentState = "up";
            this.sex == ConstSex.WOMAN ? this.btn_pastor.currentState = "down" : this.btn_pastor.currentState = "up";

            switch (this.career) {
                case CareerType.SOLDIER: {
                    this.img_selected.y = this.btn_warrior.y - 19;
                    this.img_career.source = RES.getRes("role_zhan_png");
                    break;
                }

                case CareerType.MAGES: {
                    this.img_selected.y = this.btn_magic.y - 19;
                    this.img_career.source = RES.getRes("role_fa_png");
                    break;
                }

                case CareerType.TAOIST: {
                    this.img_selected.y = this.btn_pastor.y - 19;
                    this.img_career.source = RES.getRes("role_dao_png");
                    break;
                }
            }

            this.sex == ConstSex.MAN ? this.btn_male.currentState = "down" : this.btn_male.currentState = "up";
            this.sex == ConstSex.WOMAN ? this.btn_female.currentState = "down" : this.btn_female.currentState = "up";
            this.updateDesc(info.description);
        }

        private updateDesc(desc) {
            this.lb_desc.text = desc;
            let key = this.career + "000" + this.sex;

            RES.getResAsync(key + "_png", (texture) => {
                this.img_role.source = texture;
            }, this);

        }

        private createRoleCallback(data) {
            (EventSystem.getInstance() as EventSystem).dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), this));
        }

        /**
		 * 打开窗口
		 */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            if (!this._handle) {
                this._handle = App.EventSystem.addEventListener(PanelNotify.HERO_NEW_PARTNER, this.createRoleCallback, this);
            }
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
            if (this._handle) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_NEW_PARTNER, this._handle);
            }
        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
        }

    }
}