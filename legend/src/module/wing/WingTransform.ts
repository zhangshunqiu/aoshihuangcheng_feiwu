/**
 * Author: liuyonggen
 * 翅膀转换视图模块  2017/11/20
 */
module game {
    export class WingTransform extends BaseView {
        public btn_transform: eui.Button;
        public gp_noWingQuipe: eui.Group;
        public list: eui.List;
        public scroller: eui.Scroller;
        public img_selectorFrame: eui.Image;
        public img_selectorIcon: eui.Image;
        public lb_selectorName: eui.Label;
        public img_otherFrame0: eui.Image;
        public img_otherFrame1: eui.Image;
        public img_otherFrame2: eui.Image;
        public img_otherIcon0: eui.Image;
        public img_otherIcon1: eui.Image;
        public img_otherIcon2: eui.Image;
        public lb_otherName0: eui.Label;
        public lb_otherName1: eui.Label;
        public lb_otherName2: eui.Label;
        public img_selectorBg0: eui.Image;
        public img_selectorBg1: eui.Image;
        public img_selectorBg2: eui.Image;
        public lb_gold: eui.Label;
        private _backpackModel = BackpackModel.getInstance() as BackpackModel;
        public gp_content: eui.Group;

        public currentId;
        public itemType = {};
        public currentType;
        private _eventId:number = 0;

        public constructor() {
            super();
            this.skinName = "WingTransformSkin"
        }

        public childrenCreated() {
            super.childrenCreated();
            this.initView();
        }

         private initView() {
            this.btn_transform.addEventListener(egret.TouchEvent.TOUCH_TAP, this.transform, this);
            for(let i:number = 0; i<3; i++) {
                this["img_otherIcon" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                    this.currentType = this.itemType[i];
                    for(let j:number = 0; j<3; j++) {
                        if(i === j) {
                            this["img_selectorBg" + j].visible = true;
                        } else {
                            this["img_selectorBg" + j].visible = false;
                        }
                    }
                }, this);
            }
                  
            this.list = new eui.List();
            this.list.itemRenderer = getItem;
            let layout = new eui.TileLayout();
            layout.requestedRowCount = 1;
            layout.verticalGap = 10;
            layout.horizontalGap = 18;
            layout.horizontalAlign = egret.HorizontalAlign.LEFT;
            this.list.layout = layout;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);  //点击物品弹出对应物品信息

            this.scroller.viewport = this.list;
            this.scroller.scrollPolicyH = eui.ScrollPolicy.ON;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;

            this.list.dataProvider = new eui.ArrayCollection([]);
            this.getWingEquip();
        }

        /**
         * 转换
         */
        private transform() {
            if(!this.currentType) {
                let text = [{text:"请选择要转换的羽翼装备类型", style:{textColor:0xffffff,size:24,fontFamily:"SimHei"}}];
                App.GlobalTips.showTips(text);
                return ;
            } else {
                App.Socket.send(14012,{good_id:this.currentId, to_type:this.currentType});
                // this.gp_content.visible = false;
            }
            
        }

        /**
         * 从背包的里把翅膀装备拿出来
         */
        public getWingEquip() {
            if(this.list){
                let data = this._backpackModel.chestBackpack;
                let wingEquip = [];
                for(let i=0; i<data.length; i++) {
                    if(data[i].good_id > 200 && data[i].good_id < 600) {
                        wingEquip.push(data[i]);
                    }
                }
                if(wingEquip.length == 0) {
                    this.gp_noWingQuipe.visible = true;
                } else {
                    this.gp_noWingQuipe.visible = false;
                    this.list.dataProvider = new eui.ArrayCollection(wingEquip); 
                }
                
            }
        }

        /**
         * 选中羽翼装备后的处理函数
         */
        private itemTap(event: eui.ItemTapEvent) {
            App.loglyg("event", event);
            let itemData = event.item;
            let data = App.ConfigManager.getItemInfoById(itemData.good_id);
            this.currentId = itemData.good_id;
            this.gp_content.visible = true;
            this.btn_transform.currentState = "up";
            this.btn_transform.touchEnabled = true;
            this.img_selectorIcon.visible = true;
            this.img_selectorIcon.source = data.icon + "_png";
            this.img_selectorFrame.source = QualityFrame[data.quality];
            this.lb_selectorName.text = data.name;
            let wingStepInfo = App.ConfigManager.getWingStepById(data.limit_lv);  //阶数对应信息
            this.lb_gold.text = wingStepInfo.transition_money;
            let data1;
            let data2;
            let data3;
            switch(data.sub_type) {
                case 1:
                    data1 = App.ConfigManager.getItemInfoById(itemData.good_id + 100);
                    data2 = App.ConfigManager.getItemInfoById(itemData.good_id + 200);
                    data3 = App.ConfigManager.getItemInfoById(itemData.good_id + 300);
                    break;
                case 2:
                    data1 = App.ConfigManager.getItemInfoById(itemData.good_id - 100);
                    data2 = App.ConfigManager.getItemInfoById(itemData.good_id + 100);
                    data3 = App.ConfigManager.getItemInfoById(itemData.good_id + 200);
                    break;
                case 3:
                    data1 = App.ConfigManager.getItemInfoById(itemData.good_id - 100);
                    data2 = App.ConfigManager.getItemInfoById(itemData.good_id - 200);
                    data3 = App.ConfigManager.getItemInfoById(itemData.good_id + 100);
                    break;
                case 4:
                    data1 = App.ConfigManager.getItemInfoById(itemData.good_id - 100);
                    data2 = App.ConfigManager.getItemInfoById(itemData.good_id - 200);
                    data3 = App.ConfigManager.getItemInfoById(itemData.good_id - 300);
                    break;
            }
            this.otherWingEquip(data1, 0);
            this.otherWingEquip(data2, 1);
            this.otherWingEquip(data3, 2);          
        }

        private otherWingEquip(data, pos) {
            this.itemType[pos] = data.sub_type;
            this["img_otherIcon" + pos].visible = true;
            this["img_otherFrame" + pos].source = QualityFrame[data.quality];
            this["img_otherIcon" + pos].source = data.icon + "_png";
            this["lb_otherName" + pos].text = data.name;
        }

        public transformResult(data) {
            if(data.result) {
                this.gp_content.visible = false;
                this.btn_transform.currentState = "down";
                this.btn_transform.touchEnabled = false;
            }
        }
         /**
		 * 打开窗口
		 */
		public openWin(openParam:any = null):void{
			super.openWin(openParam);
            if(this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.WING_TRANSFORM_RESULT, this.transformResult, this);
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
		public clear(data:any = null):void{
            super.clear();
            if(this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_TRANSFORM_RESULT, this._eventId);
                this._eventId = 0;
            }
		}
		/**
		 * 销毁
		 */
		public destroy():void{
			super.destroy();
		}

    }

    class getItem extends eui.ItemRenderer {
		public baseItem : customui.BaseItem;
		public constructor() {
			super();
			this.skinName = `<?xml version="1.0" encoding="utf-8"?>
				<e:Skin class="getItemSkin" width="100" height="125" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" xmlns:customui="customui.*">
					<e:Group id="gp_main" left="0" right="0" top="0" bottom="0">
						<customui:BaseItem id="baseItem" width="100" height="100" horizontalCenter="0" top="0" anchorOffsetX="0" anchorOffsetY="0"/>
					</e:Group>
				</e:Skin>`;
			this.baseItem.lb_name.visible = true;
	    }

        protected dataChanged() {
			this.baseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num);
		}
    }
}