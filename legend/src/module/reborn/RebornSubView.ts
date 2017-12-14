/**
 * 转生模块子视图
 * author ：zrj
*/
module game {
    //转生获取修为界面
    export class RebornPointView extends BaseView {
        public gp_main: eui.Group;
        public img_close: eui.Image;
        public list: eui.List = new eui.List();

        private _infoHandle: number;
        private _array : Array<RebornPointItem> = [];
        public constructor() {
            super();
            this.skinName = "RebornPointSkin";
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.readyOpenWin();
            this.initView();
            App.Socket.send(20002,{});
        }

        public initView() {
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                PopUpManager.removePopUp(this);
            }, this);
            this.gp_main.addChild(this.list);
            this.list.horizontalCenter = 0;
            this.list.top = 70;
            this.list.itemRenderer = RebornPointItem;
            // this.updateView();
            let id = [100,19,20];
            for(let i =0; i< id.length ;i++) {
                let item = new RebornPointItem(id[i]);
                this.gp_main.addChild(item);
                item.y = 70+i*120;
                item.horizontalCenter = 0;
                this._array.push(item);
            }
        }

        public updateView() {
            // this.list.dataProvider = new eui.ArrayCollection([100, 19, 20]);
            let id = [100,19,20];
            this._array.forEach((value,index,array)=>{
                value.update({id:id[index],index:index});
            },this);
        }

        /**
		 * 打开窗口
		 */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            if (!this._infoHandle){
                this._infoHandle = App.EventSystem.addEventListener(PanelNotify.REBORN_UPDATE_INFO_VIEW, this.updateView, this);
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
            if (this._infoHandle) {
                App.EventSystem.removeEventListener(PanelNotify.REBORN_UPDATE_INFO_VIEW, this._infoHandle);
                this._infoHandle = undefined;
            }
        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
        }
    }

    class RebornPointItem extends eui.ItemRenderer {
        public baseItem: customui.BaseItem;
        public lb_name: eui.Label;
        public lb_cost: eui.Label;
        public lb_time: eui.Label;

        public img_use: eui.Image;
        public img_gold: eui.Image;
        public img_change: eui.Image;

        private rebornModel: RebornModel = RebornModel.getInstance();
        private _index : number = 0;
        private redDot : BtnTips ;
        public constructor(data) {
            super();
            this.skinName = "RebornPointItemSkin";
            this.img_use.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
                App.Socket.send(20003,{type:this._index+1});
            },this); 
            this.baseItem.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
                // let view = new game.ItemTip(this.data,null);
                // PopUpManager.addPopUp({ obj: view, effectType: 0, opacity:0 });
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM,this.data,null);
            },this); 
            // this._index = this.itemIndex;
            this.redDot = App.BtnTipManager.creatBtnTip("",this);
            this.redDot.x = 510;
            this.redDot.y = 50;
        }

        protected dataChanged() {
            this.baseItem.updateBaseItem(ClientType.BASE_ITEM, this.data);
            this.baseItem.lb_name.visible = false;

            if (this._index + 1 == ConstRebornExchangeType.LEVEL) {
                let lvInfo = App.ConfigManager.getRebornInfoByLevel(App.RoleManager.roleInfo.lv);
                if (!lvInfo) {
                    lvInfo = {number : 0};
                }
                RES.getResAsync("reborn_txt_duihuan_png", (texture) => {
                    this.img_change.source = texture;
                }, this)
                this.img_gold.visible = false;
                let remind = App.ConfigManager.getConstConfigByType("TRANSMI_CONVERT_NUM").value - this.rebornModel.getExchangeInfoByType(ConstRebornExchangeType.LEVEL).used_times;
                this.lb_time.textFlow = [{ text: "今天还可兑换" }, { text: String(remind), style: { textColor: 0x59ff10 } }, { text: "次" }];
                this.lb_name.textFlow = [{ text: "增加" }, { text: String(lvInfo.number), style: { textColor: 0x59ff10 } }, { text: "修为" }];
                this.lb_cost.text = "等级兑换：降" + App.ConfigManager.getConstConfigByType("TRANSMI_REDUCE_LEVEL").value + "级";

                if (this.rebornModel.checkCanExchangeLevel()) {
                    this.redDot.show();
                } else {
                    this.redDot.hide();
                }
            } else if (this._index + 1 == ConstRebornExchangeType.REDUCE) {
                let info = App.ConfigManager.getItemInfoById(this.data);
                let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, this.data);
                if (!itemInfo) {
                    this.lb_cost.text = info.name + "\t\t\t\t\t" + App.ConfigManager.getConstConfigByType("TRANSMI_EXPERP_GOLD").value;
                    this.img_gold.visible = true;
                    RES.getResAsync("reborn_goumaibingshiyong_png", (texture) => {
                        this.img_change.source = texture;
                    }, this)
                } else {
                    this.lb_cost.text = "背包剩余" + itemInfo.num + "个";
                    this.img_gold.visible = false;
                    RES.getResAsync("reborn_txt_shiyong_png", (texture) => {
                        this.img_change.source = texture;
                    }, this)
                }
                let remind = App.ConfigManager.getConstConfigByType("TRANSMI_EXPERP_NUM").value - this.rebornModel.getExchangeInfoByType(ConstRebornExchangeType.REDUCE).used_times;
                this.lb_time.textFlow = [{ text: "今天还可兑换" }, { text: String(remind), style: { textColor: 0x59ff10 } }, { text: "次" }];
                this.lb_name.textFlow = [{ text: "增加" }, { text: String(App.ConfigManager.getConstConfigByType("TRANSMI_EXPERP_LIFT").value), style: { textColor: 0x59ff10 } }, { text: "修为" }];
            
                if (this.rebornModel.checkCanExchangeExpert()) {
                    this.redDot.show();
                } else {
                    this.redDot.hide();
                }
            } else {
                let info = App.ConfigManager.getItemInfoById(this.data);
                let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, this.data);
                if (!itemInfo) {
                    this.lb_cost.text = info.name + "\t\t\t\t\t" + App.ConfigManager.getConstConfigByType("TRANSMI_SUPER_GOLD").value;
                    this.img_gold.visible = true;
                    RES.getResAsync("reborn_goumaibingshiyong_png", (texture) => {
                        this.img_change.source = texture;
                    }, this)
                } else {
                    this.lb_cost.text = "背包剩余" + itemInfo.num + "个";
                    this.img_gold.visible = false;
                    RES.getResAsync("reborn_txt_shiyong_png", (texture) => {
                        this.img_change.source = texture;
                    }, this)
                }
                let remind = App.ConfigManager.getConstConfigByType("TRANSMI_SUPER_NUM").value - this.rebornModel.getExchangeInfoByType(ConstRebornExchangeType.SUPER).used_times;
                this.lb_time.textFlow = [{ text: "今天还可兑换" }, { text: String(remind), style: { textColor: 0x59ff10 } }, { text: "次" }];
                this.lb_name.textFlow = [{ text: "增加" }, { text: String(App.ConfigManager.getConstConfigByType("TRANSMI_SUPER_LIFT").value), style: { textColor: 0x59ff10 } }, { text: "修为" }];
                
                if (this.rebornModel.checkCanExchangeSuper()) {
                    this.redDot.show();
                } else {
                    this.redDot.hide();
                }
            }
        }

        public update(data) {
            this._index = data.index;
            this.data = data.id;
            // this.dataChanged();
        }

    }
}