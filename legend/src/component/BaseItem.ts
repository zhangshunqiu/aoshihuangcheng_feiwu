module customui {
    export class BaseItem extends eui.Component implements egret.IEventDispatcher {
        private gp_main: eui.Group;
        private img_icon: eui.Image;
        private img_career: eui.Image;
        private img_frame: eui.Image;
        private img_select: eui.Image;
        private lb_name: eui.Label;
        private lb_tips: eui.Label;
        private lb_star: eui.Label;
        private lb_strength: eui.Label;
        private lb_num: eui.Label;
        private lb_lv: eui.Label;

        private equipInfo: any = undefined; //服务端的装备属性
        private _id: number;
        private _type: number;
        private _isStopShowTips: boolean = false;
        private _redBtnTips: BtnTips;

        private _itemMiniNum:number = 1;

        private _qualityMC:AMovieClip;//品质动画

        private _itemNameVisible:boolean = false;//物品名称是否显示
        private _careerVisible:boolean = false;//职业是否显示
        private _isSelect:boolean = false;
        private _textTipsVisible:boolean = false;//文本类型
        private _textStarVisible:boolean = false;//星级
        private _textStrengthVisible:boolean = false;//强化
        private _textNumVisible:boolean = false;//数量
        private _textLvVisible:boolean = false;//级别

        public constructor(id?) {
            super();
            this.skinName = "BaseItemSkin";
            this._id = id;
            if(this.hasEventListener(egret.Event.REMOVED_FROM_STAGE) == false){
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
            }
        }
        
        private onRemoveFromStage(){
            this.destroy();
        }
        /**
         * 销毁
         */
        public destroy(){
            if(this._qualityMC){
                this._qualityMC.stop();
                this._qualityMC.destroy();
                if(this._qualityMC.parent){
                    this._qualityMC.parent.removeChild(this._qualityMC);
                }
                this._qualityMC = null;
            }
        }

        /**
         * 显示红点
         */
        public showRedTips(value: any) {
            if (this._redBtnTips == null) {
                this._redBtnTips = new BtnTips(null, this);
            }
            this._redBtnTips.show(value);
        }
        /**
         * 隐藏红点
         */
        public hideRedTips() {
            if (this._redBtnTips) {
                this._redBtnTips.hide();
            }
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            // if (!RES.getRes("common_default_png")) {
            //     RES.getResAsync("common_default_png", (texture) => {
            //     }, this);
            // }
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            // let itemInfo = undefined
            // if (this._id) {

            // }
            this.touchEnabled = false;
            if(this.hasEventListener(egret.TouchEvent.TOUCH_TAP) == false){
                this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemClick, this);
            }
        }

        private onItemClick(event: egret.TouchEvent) {
            if (this._isStopShowTips) {
                return;
            }
            if (!this._type || !this._id) {
                return;
            }
            let map = this.$getEventMap();
            if (map && map[egret.TouchEvent.TOUCH_TAP]) {
                if (map[egret.TouchEvent.TOUCH_TAP].length > 1) {
                    this.setStopShowTips(true);
                    return;
                }
            }
            App.GlobalTips.showItemTips(this._type, this._id, null, this.equipInfo);
        }

        /**
         * 禁止弹出通用提示
         * @params ban  boolean
        */
        public setStopShowTips(b:boolean) {
            this._isStopShowTips = b;
            if (this._isStopShowTips) {
                this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemClick, this);
            } else {
                if(this.hasEventListener(egret.TouchEvent.TOUCH_TAP) == false){
                    this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemClick, this);
                }
            }
        }

        /**
         * type : 类型
         * id : 配置表的id，非背包id
         * num : 数量, 可选
         * equipInfo: 装备位置信息
        */
        public updateBaseItem(type:number, id:number, num?:number, equipInfo?) {
            let info:any = undefined;
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
                if (type == ClientType.BASE_ITEM) {  //物品
                    this.setStrengthLv(0);
                    this.setStarLv(0);
                } else if (type == ClientType.EQUIP) { //武器
                    this.setStrengthLv(0);
                    this.setStarLv(0);
                    this.setItemBg(this.getFrameByQuality(-1));
                }
                //this.setQualityBg(-1);//可以不设
                this.setItemIcon(null);
                this.setItemName("");

                this.setItemNum(0);
                this.setCarrerIcon(0);
                this.setItemLv(0);
                if (equipInfo) {
                    this.setStrengthLv(equipInfo.lv);
                    this.setStarLv(equipInfo.star);
                    this.equipInfo = equipInfo;
                } else {
                    this.setStrengthLv(0);
                    this.setStarLv(0);
                }
                return;
            }


            this.setQualityBg(info.quality);
            this.setItemIcon(info.icon);
            this.setItemNum(num);
            if (type == ClientType.BASE_ITEM) {  //物品
                
                this.setCarrerIcon(0);
                //特殊处理，宝石
                if (info.type == ItemType.RUBY) {
                    this.setItemName(ConstJewelName[info.sub_type],ConstTextColor[info.quality]);
                    this.setItemLv(info.limit_lv);
                }else{
                    this.setItemLv(0);
                    this.setItemName(info.name,ConstTextColor[info.quality]);
                }
                this.setStrengthLv(0);
                this.setStarLv(0);
                this.setCarrerIconVisible(false);
            } else if (type == ClientType.EQUIP) { //武器
                if (info.reincarnation) {
                    this.setItemName(info.reincarnation + "转",ConstTextColor[info.quality]);
                }else{
                    this.setItemName(info.limit_lvl + "级",ConstTextColor[info.quality]);
                }
                this.setItemLv(0);
                this.setCarrerIcon(info.limit_career);
                this.setCarrerIconVisible(true);
                
                if (equipInfo) {
                    this.setStrengthLv(equipInfo.lv);
                    this.setStarLv(equipInfo.star);
                    this.equipInfo = equipInfo;
                } else {
                    this.setStrengthLv(0);
                    this.setStarLv(0);
                }
            }
        }
        /**
         * 设置是否选择
         */
        public setSelect(b:boolean){
            this._isSelect = b;
            if(this.img_select){
                this.img_select.visible = b;
            }
        }

        /**
         * 设置物品图标
         */
        public setItemIcon(icon:string | egret.Texture ){
            if(icon){
                RES.getResAsync(icon + "_png", (texture) => {
                    if(this.img_icon){
                         this.img_icon.source = texture;
                    }
                }, this);
            }else{
                this.img_icon.source = null; 
            }
        }

        /**
         * 获取物品图标
         */
        public getItemIcon() {
            return this.img_icon.source;
        }

        /**
         * 设置品质背景
         */
        private setQualityBg(quality:number){
            // RES.getResAsync(this.getFrameByQuality(quality), (texture) => {
            //     if(this.img_frame){
            //         this.img_frame.source = texture;
            //     }
            // }, this);
            this.setItemBg(this.getFrameByQuality(quality));
            if(quality == ConstQuality.ORANGE){
                if(this._qualityMC == null){
                    this._qualityMC = new AMovieClip();
                    this.addChild(this._qualityMC);
                    this._qualityMC.x = this.width/2;
                    this._qualityMC.y = this.height/2;
                }
                this._qualityMC.playMCKey("effgjzb");
                this._qualityMC.visible = true;
            }else{
                if(this._qualityMC){
                    this._qualityMC.stop();
                    this._qualityMC.visible = false;
                }
            }
        }

        /*
         * 设置背景
         */
        public setItemBg(picurl:string){
            RES.getResAsync(picurl, (texture) => {
                if(this.img_frame){
                    this.img_frame.source = texture;
                }
            }, this);
        }

        /**
         * 设置职业
         */
        private setCarrerIcon(carrer:number){
            if (carrer && carrer > 0  && carrer < 4) {
               RES.getResAsync(ConstCareerIcon[carrer], (texture) => {
                   if( this.img_career){
                       this.img_career.source = texture;
                   }
                }, this);
                this.img_career.visible = this._careerVisible;
            } else {
                this.img_career.visible = false;
            }
        }
        //设置职业是否显示
        public setCarrerIconVisible(b:boolean){
            if(this.img_career){
                this.img_career.visible = b;
            }
            this._careerVisible = b;
        }

        /**
         * 设置物品名称
         */
        public setItemName(data:any,textColor:number = ConstTextColor[0]){
            if (data) {
                if(typeof(data) == "string" || typeof(data) == "number"){
                     this.lb_name.text = String(data);
                }else if(typeof(data) == "object"){
                    this.lb_name.textFlow = data;
                }
                this.lb_name.textColor = textColor;
                this.lb_name.visible = this._itemNameVisible;
            } else {
                this.lb_name.visible = false;
            }
        }
        //设置物品名称是否显示
        public setItemNameVisible(b:boolean){
            this._itemNameVisible = b;
            if(this.lb_name){
                this.lb_name.visible = b;
            }
        }
        /**
         * 设置物品名称样式
         */
        public setItemNameAtt(param:any){
            if (param.textColor) {
                 this.lb_name.textColor = param.textColor;
            }else if(param.top) {
                this.lb_name.top = param.top;
            }else if(param.size){
                this.lb_name.size = param.size;
            }else if(param.x){
                this.lb_name.x = param.x;
            }else if(param.y){
                this.lb_name.y = param.y;
            }
        }

        /**
         * 设置文本提示
         */
        public setTextTips(str:string){
            if (str && str !="") {
                this.lb_tips.text = str;
                this.lb_tips.visible = this._textTipsVisible;
            } else {
                this.lb_tips.visible = false;
            }
        }
        //设置文本提示是否显示
        public setTextTipsVisible(b:boolean){
            this._textTipsVisible = b;
            if(this.lb_tips){
                this.lb_tips.visible = b;
            }
        }

        /**
         * 设置数量
         */
        private setItemNum(num:number){
            if (num && num > this._itemMiniNum) {
                this.lb_num.text = String(num);
                this.lb_num.visible = this._textNumVisible;
            } else {
                 this.lb_num.visible = false;
            }
        }
        //设置数量是否显示
        public setItemNumVisible(b:boolean){
            this._textNumVisible = b;
            if(this.lb_num){
                this.lb_num.visible = b;
            }
        }
        public setItemMiniNum(v:number){
            this._itemMiniNum = v;
        }

        /**
         * 设置物品等级
         */
        private setItemLv(lv:any){
            if (lv && lv > 0 ) {
                this.lb_lv.text = "Lv." + lv;
                this.lb_lv.visible = this._textLvVisible;
            } else {
                this.lb_lv.visible = false;
            }
        }
        //设置物品等级是否显示
        public setItemLvVisible(b:boolean){
            this._textLvVisible = b;
            if(this.lb_lv){
                this.lb_lv.visible = b;
            }
        }

        /**
         * 设置强化等级
         */
        private setStrengthLv(lv:any){
            if (lv && lv > 0 ) {
                this.lb_strength.text = "+" + lv;
                this.lb_strength.visible = this._textStrengthVisible;
            } else {
                this.lb_strength.visible = false;
            }
        }
        //设置强化等级是否显示
        public setStrengthLvVisible(b:boolean){
            this._textStrengthVisible = b;
            if(this.lb_strength){
                this.lb_strength.visible = b;
            }
        }

        /**
         * 设置星级
         */
        private setStarLv(lv:any){
            if (lv && lv >0) {
                this.lb_star.text = "+" + lv;
                this.lb_star.visible = this._textStarVisible;
            } else {
                this.lb_star.visible = false;
            }
        }
        //设置星级是否显示
        public setStarLvVisible(b:boolean){
            this._textStarVisible = b;
            if(this.lb_star){
                this.lb_star.visible = b;
            }
        }
        /**
         * 设置所有显示状态
         */
        public setAllVisible(b:boolean){
            this.setStarLvVisible(b);
            this.setStrengthLvVisible(b);
            this.setItemLvVisible(b);
            this.setItemNumVisible(b);
            this.setTextTipsVisible(b);
            this.setItemNameVisible(b);
            this.setCarrerIconVisible(b);
        }

        /**
         * 获取品质框
         */
        private getFrameByQuality(quality: number):string {
            if(quality && quality > 0){
                 return "com_frame_item" + quality + "_png";
            }
            return "com_frame_itemDef_png";
        }
    }
}