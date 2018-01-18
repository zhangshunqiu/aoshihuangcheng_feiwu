/**
 * Author: liuyonggen
 * 月卡购买奖励弹窗 2017/11/24
 */
module game{
    export class MonthCardReward extends BaseView{
        public re_close: eui.Group;
        public list: eui.List;
        private _monthCardModel: MonthCardModel = MonthCardModel.getInstance();

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.list.itemRenderer = backpackItem;
            let layout = new eui.TileLayout();
			layout.requestedRowCount = 1;
			layout.horizontalGap = 20;
			layout.horizontalAlign = egret.HorizontalAlign.CENTER;
			this.list.layout = layout;
            this.list.dataProvider = new eui.ArrayCollection(this._monthCardModel.rewardList);
        }
        
        /**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
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
		public clear(data: any = null): void {
            super.clear(data);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
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
						<customui:BaseItem id="baseItem" width="90" height="90" horizontalCenter="0" top="0" anchorOffsetX="0" anchorOffsetY="0"/>
					</e:Group>
				</e:Skin>`;
			this.baseItem.setItemNameVisible(true);
        }

        protected dataChanged() {
            this.baseItem.updateBaseItem(this.data[0], this.data[1], this.data[2]);
        }

    }
}