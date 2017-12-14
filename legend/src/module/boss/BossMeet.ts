/**
 * Author: liuyonggen
 * 遭遇Boss模块视图窗口  2017/11/27
 */
module game{
    export class BossMeet extends BaseView{
        public img_close: eui.Image;
        public img_thinkAgain: eui.Image;
		public img_challengeBoss: eui.Image;
		public lb_bossName: eui.Label;
		public lb_bossLv: eui.Label;
        public list: eui.List;
        private _bossMc: AMovieClip;
        public gp_boss: eui.Group;
        private _bossModel: BossModel = BossModel.getInstance(); 

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_thinkAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
			this.img_challengeBoss.addEventListener(egret.TouchEvent.TOUCH_TAP, this.challengeBoss, this);
			
			this.list.itemRenderer = backpackItem;
            let layout = new eui.TileLayout();
			layout.requestedRowCount = 1;
			layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
			this.list.layout = layout;
			this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
        }

       private challengeBoss() {
			App.Socket.send(13014, {});
			this.closeWin();
		}

		private itemTap(event: eui.ItemTapEvent) {
			let itemData = event.item;
			App.GlobalTips.showItemTips(ClientType.BASE_ITEM, itemData[0], null);

		}
		
        private joinBoss(resId, scale) {
			if(this._bossMc == null){
				this._bossMc = new AMovieClip();
				this._bossMc.scaleX = scale;
				this._bossMc.scaleY = scale;
				this.gp_boss.addChild(this._bossMc);
				this._bossMc.frameRate = 4;
			}
            this._bossMc.playMCKey(resId + "15");  //加15是获得模型的正面
        }

		private updateView(){
			this.joinBoss(this._bossModel.meetBossInfo.resId, this._bossModel.meetBossInfo.magnify_ratio || 2);
			this.lb_bossName.text = this._bossModel.meetBossInfo.name;
			this.lb_bossLv.text = "Lv." + this._bossModel.meetBossInfo.lv;
			this.list.dataProvider = new eui.ArrayCollection(this._bossModel.sceneInfo.drop_list);
		}

        /**
		 * 打开窗口
		 */
		public openWin(openParam:any = null):void{
			super.openWin(openParam);
			this.updateView();
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(): void {
			super.closeWin();
		}

		/**
		 * 清理
		 */
		public clear(data:any = null):void{
            super.clear();
			if(this._bossMc){
				this._bossMc.destroy();
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
		}

		protected dataChanged() {
			this.baseItem.updateBaseItem(ClientType.BASE_ITEM, this.data[0], this.data[2]);
			if (this.data.type == ClientType.EQUIP) {
				let info = App.ConfigManager.equipConfig()[this.data.good_id];
				if (info) {
					this.baseItem.lb_name.text = "LV:" + info.limit_lvl;
				}
			}
		}

	} 
}