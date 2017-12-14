module customui {
    export class BaseItem extends eui.Component implements eui.UIComponent {
        public gp_main: eui.Group;
        public img_icon: eui.Image;
        public img_career: eui.Image;
        public img_status: eui.Image;
        public img_bg: eui.Image;
        public img_frame: eui.Image;
        public img_select : eui.Image;
        public lb_name: eui.Label;
        public lb_type: eui.Label;
        public lb_star: eui.Label;
        public lb_strength: eui.Label;
        public lb_num: eui.Label;

        private _id: number;
        private _type : number;
        private _POS: any;

        private _redBtnTips:BtnTips;
        get POS() {
            return this._POS;
        }

        set POS(pos) {
            this._POS = pos;
        }

        public constructor(id?) {
            super();
            this.skinName = "BaseItemSkin";
            this._id = id;
            // this.once(egret.Event.REMOVED_FROM_STAGE, () => {
            //     this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.itemTap, this);
            // }, this);

        }

        /**
         * 显示红点
         */
        public showRedTips(value: any) {
            if(this._redBtnTips == null){
                this._redBtnTips = new BtnTips("",this);
            }
            this._redBtnTips.show(value);
        }
        /**
         * 隐藏红点
         */
        public hideRedTips() {
            if(this._redBtnTips){
                this._redBtnTips.hide();
            }
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            if (!RES.getRes("common_default_png")) {
                RES.getResAsync("common_default_png", (texture) => {
                }, this);
            }
            if (!RES.getRes("equipping_jiahao_png")) {
                RES.getResAsync("equipping_jiahao_png", (texture) => {
                }, this);
            }

            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            let itemInfo = undefined
            if (this._id) {

            }
            this.initView(null);
            this.touchEnabled = false;
            // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.itemTap, this);
        }

        private itemTap(event: egret.TouchEvent) {
            console.log("vvvvvvv");
        }

        public initView(params: any) {

        }

        /**
         * type : 类型
         * id : 配置表的id，非背包id
         * num : 数量, 可选
         * equipInfo: 装备位置信息
        */
        public updateBaseItem(type, id, num?, equipInfo?) {
            
            let info = undefined;
            this._type = type;
            this._id = id;
            switch (type) {
                case 0:
                case ClientType.BASE_ITEM: info = App.ConfigManager.itemConfig()[id]; break;
                case ClientType.EQUIP: info = App.ConfigManager.equipConfig()[id]; break;
                case 3:
                default: break;

            }

            if (!info) { //没有信息
                this.lb_name.textColor = ConstTextColor[0];
                if (type == ClientType.BASE_ITEM) {  //物品
                    this.img_icon.source = "";
                } else if (type == ClientType.EQUIP) { //武器
                    RES.getResAsync("common_default_png", (texture) => {
                        this.img_frame.source = texture;
                    }, this);
                    // RES.getResAsync("equipping_jiahao_png", (texture) => {
                    //     this.img_icon.source = texture;
                    // }, this);
                    this.img_icon.source = RES.getRes("equipping_jiahao_png");
                    this.img_frame.source = RES.getRes("common_default_png");
                    this.img_career.visible = false;
                    if (equipInfo) {
                        if (equipInfo.star) {
                            this.lb_star.text = "+" + equipInfo.star;
                            this.lb_star.visible = true;
                        } else {
                            this.lb_star.visible = false;
                        }
                        if (equipInfo.lv) {
                            this.lb_strength.text = "+" + equipInfo.lv;
                            this.lb_strength.visible = true;
                        } else {
                            this.lb_strength.visible = false;
                        }
                    } else {
                        this.lb_star.visible = false;
                        this.lb_strength.visible = false;
                    }
                }
                return;
            }
            //通用
            RES.getResAsync(GlobalUtil.getFrameByColor(info.quality), (texture) => {
                this.img_frame.source = texture;
                this.img_frame.visible = true;
            }, this);
            // info.icon = "";
            RES.getResAsync(String(info.icon) + "_png", (texture) => {
                this.img_icon.source = texture;
            }, this);
            this.lb_name.text = info.name;
            this.lb_name.textColor = ConstTextColor[info.quality];
            if (num && num != 1) {
                this.lb_num.text = "x" + num;
                this.lb_num.visible = true;
            } else {
                this.lb_num.visible = false;
            }
            if (type == ClientType.BASE_ITEM) {  //物品
                this.img_career.visible = false;
            } else if (type == ClientType.EQUIP) { //武器
                RES.getResAsync(ConstCareerIcon[info.limit_career] + "_png", (texture) => {
                    this.img_career.source = texture;
                }, this);
                this.img_career.visible = true;
                if (equipInfo) {
                    if (equipInfo.star) {
                        this.lb_star.text = "+" + equipInfo.star;
                        this.lb_star.visible = true;
                    } else {
                        this.lb_star.visible = false;
                    }
                    if (equipInfo.lv) {
                        this.lb_strength.text = "+" + equipInfo.lv;
                        this.lb_strength.visible = true;
                    } else {
                        this.lb_strength.visible = false;
                    }
                } else {
                    this.lb_star.visible = false;
                    this.lb_strength.visible = false;
                }
                this.lb_name.text = info.limit_lvl + "级";
            }
        }

        /**
         *显示当前item信息
        */
        public showItemInfo() {
            if(this._type && this._id) {
                App.GlobalTips.showItemTips(this._type,this._id,null);
            }
        }
    }
}