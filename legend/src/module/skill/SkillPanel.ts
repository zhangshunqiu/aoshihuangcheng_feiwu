/**
 * module : 技能模块视图
 * author : zrj
*/
module game {
    export class SkillPanel extends BaseView {
        public gp_main: eui.Group;
        public btn_career: eui.Button;
        public btn_reborn: eui.Button;
        public btn_back: eui.Button;
        public scroller: eui.Scroller;
        public list: eui.List;

        private offset = 0;
        private heroModel: HeroModel = HeroModel.getInstance();
        private _handleId : number = 0;
        public constructor() {
            super();
            this.skinName = "SkillSkin";
        }

        protected childrenCreated() {
            super.childrenCreated();
            this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_UPDATE_SKILL_PANEL, this.updateView, this);
            // App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT,this.changeList,this);
            this.initView();
            this.validateNow();
        }

        private initView() {
            this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                // this.parent.visible = false;
                App.EventSystem.dispatchEvent(PanelNotify.HERO_CLOSE_SKILL_PANEL);
            }, this);
            this.btn_career.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.btn_career.currentState = "down";
                this.btn_reborn.currentState = "up";
            }, this);
            this.btn_reborn.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.btn_career.currentState = "up";
                this.btn_reborn.currentState = "down";
            }, this);
            this.btn_career.currentState = "down";
            this.list = new eui.List();
            this.list.itemRenderer = SkillItem;
            this.scroller.viewport = this.list;
            this.scroller.addEventListener(eui.UIEvent.CHANGE, (e:eui.UIEvent) => {
                this.offset = this.scroller.viewport.scrollV;
                // console.log(this.offset,this.scroller.height,this.list.height,this.scroller.viewport.contentHeight);
            }, this)
            // this.updateView();
            // this.changeList();
        }

        public updateView() {

            this.changeList();
            // this.scroller.viewport.scrollV = this.offset;
            console.log("upadate skill");
        }

        public changeList() {
            let index = this.heroModel.curPos;
            this.offset = 0;
            let skillInfo = this.heroModel.heroInfo[this.heroModel.curPos].skillDic;
            let temp = [];
            for (let key in skillInfo) {
                temp.push({ id: Number(key), level: skillInfo[key]});
            }
            let data = new eui.ArrayCollection(temp);
            this.offset = this.list.scrollV;
            this.list.dataProvider = data;
            this.list.selectedIndex = 0;
            this.list.validateNow();
            this.list.scrollV = this.offset;
            this.checkGuide();
        }

        public checkGuide() {
            let gp_cost = (<eui.Group>((<SkillItem>this.list.getElementAt(0)).getChildAt(0))).getChildByName("gp_cost");
            App.GuideManager.bindClickBtn((<eui.Group>gp_cost).getChildByName("btn_active"),1004,2);
            App.GuideManager.checkGuide(1004);
        }

        public removeGuide() {
            App.GuideManager.removeClickBtn(1004,2);
        }

        /**
		 * 打开窗口
		 */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            this.changeList();
        }

        public closeWin() {
            super.closeWin()
        }

        public clear(data) {
            super.clear(data);
        }

        /**
		 * 销毁
		 */
        public destroy(): void {
            this.removeGuide();
            App.EventSystem.removeEventListener(PanelNotify.HERO_UPDATE_SKILL_PANEL,this._handleId);
        }
    }

    export class SkillItem extends eui.ItemRenderer {
        public gp_main: eui.Label;
        public baseItem: customui.BaseItem;
        public lb_desc: eui.Label;
        public lb_name: eui.Label;
        public lb_cost: eui.Label;
        public lb_tip: eui.Label;
        public img_cost: eui.Image;
        public gp_cost: eui.Group;
        public btn_active: eui.Button;

        private skillModel: SkillModel = SkillModel.getInstance();
        private heroModel: HeroModel = HeroModel.getInstance();
        public constructor() {
            super();
            this.skinName = "SkillItemSkin";
            this.gp_cost.name = "gp_cost";
            this.btn_active.name = "btn_active";
            this.btn_active.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                // this.skillModel.curData = this.data;
                App.Socket.send(12004, { hero_id: this.heroModel.heroInfo[this.heroModel.curPos].id, skill_id: this.data.id });
            }, this);
        }

        protected dataChanged() {
            // if (this.data.level == 0) {
            //     this.data.level =1;
            // }

            let info = this.skillModel.getSkillUpgrageByIdLevel(this.data.id, this.data.level);
            let nextInfo = this.skillModel.getSkillUpgrageByIdLevel(this.data.id, this.data.level+1)
            if (!info) { //未激活
                info = nextInfo;
            }
            this.lb_name.text = info.name;
            this.lb_desc.text = info.desc;
            this.lb_cost.text = nextInfo?nextInfo.cost_coin : 0 ;
            // this.baseItem.updateBaseItem(3,this.data.skill_id);
            this.baseItem.lb_name.visible = true;
            this.baseItem.lb_name.textColor = 0x3e98a1;
            this.baseItem.lb_name.size = 20;
            this.baseItem.lb_name.text = "等级：" + this.data.level;
            RES.getResAsync(info.icon+"_png",(texture)=>{
                this.baseItem.img_icon.source = texture;
            },this);
            
            // this.lb_tip.text = ;
            if (info.open_lv <= App.RoleManager.roleInfo.lv) {
                if (this.data.level == App.RoleManager.roleInfo.lv) {
                    this.gp_cost.visible = false;
                    this.lb_tip.visible = true;
                    this.lb_tip.text = `等级不能超过人物等级`;
                } else {
                    this.gp_cost.visible = true;
                    this.lb_tip.visible = false;
                }


            } else {
                this.gp_cost.visible = false;
                this.lb_tip.visible = true;
                this.lb_tip.text = `到达${info.open_lv}级开启`;
            }
            if (!nextInfo) { //满级

            }
        }

        public updateView(data) {

        }
    }

}