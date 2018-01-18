/**
 * module : 活动模块主界面 显示
 * author ：zrj
*/

module game {
	export class ActivityMainView extends BaseView {
		public gp_main: eui.Group;
		public commonWin: customui.CommonWin;
		public gp_subview: eui.Group;
		public scroller: eui.Scroller;
		public list: eui.List = new eui.List();
		public img_close: eui.Image;
		public img_back: eui.Image;
		public img_next:eui.Image;
		public img_front:eui.Image;

		private _viewDict: any = {};
		private _curSubView: any;  //当前子页面
		private _mainHandleId: number = 0;
		private _changeHandleId: number = 0;
		private _viewHandleId: number = 0;

		private activityModel: ActivityModel = ActivityModel.getInstance();
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initView();
		}

		private initView() {
			this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
			this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
			let layout = new eui.HorizontalLayout();
			layout.gap = 10;
			layout.verticalAlign = egret.VerticalAlign.MIDDLE;
			this.list.layout = layout;
			this.list.itemRenderer = ActivityMainItem;

			this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
			this.scroller.horizontalScrollBar.autoVisibility = false;
			this.scroller.horizontalScrollBar.visible = false;
			this.scroller.viewport = this.list;

			this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, (event: eui.ItemTapEvent) => {
				if (ActivityManager.getInstance().curActivityId != event.item) {
					ActivityManager.getInstance().openActivity(event.item);
				}
			}, this);
			this.img_front.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				this.scroller.viewport.scrollH -= this.list.width;
				if(this.scroller.viewport.scrollH <=0) {
					this.scroller.viewport.scrollH =0
				}
			},this)
			this.img_next.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				this.scroller.viewport.scrollH += this.list.width;
				var childNum = this.list.numChildren;
				var showNum:number = 5
				var totalLen:number = Math.floor(childNum/5) * 540;
				if(this.scroller.viewport.scrollH >=totalLen) {
					this.scroller.viewport.scrollH = totalLen;
				}
			},this)
		}

		private changeActivity(data) {
			if (!data.id) {
				return;
			}
			if (!this._curSubView) {

			} else {
				this._curSubView.clear();
				this._curSubView = undefined;

			}
			if (this._viewDict[data.id]) { //存在这个view了
				this._curSubView = this._viewDict[data.id];
				this._curSubView.readyOpen(data);
			} else {
				let clazz: any = egret.getDefinitionByName(ActivityConfig[data.id].view);
				this._curSubView = new clazz();
				this._curSubView.readyOpen(data);
				this.gp_subview.addChild(this._curSubView);
				this._viewDict[data.id] = this._curSubView;
			}
		}

		private updateMainView() {
			this.list.dataProvider = new eui.ArrayCollection(ActivityManager.getInstance().activityDict);
			this.list.validateNow();
			this.changeActivity({ id: this.list.dataProvider.getItemAt(0) });
			let count = 0;
			for (let i = 0; i < this.list.dataProvider.length; i++) {
				this.activityModel.checkActicityRedDot(this.list.dataProvider.getItemAt(i));
				switch (i) {
					case 4: {
						App.GlobalTimer.addSchedule(count * 100, 1, () => {
							App.Socket.send(30008, {});
						}, this)
						break;
					}
					case 5: {
						App.GlobalTimer.addSchedule(count * 100, 1, () => {
							App.Socket.send(30010, {});
						}, this)
						break;
					}
				}
				count++;
			}
		}

		private updateSubView() {
			if (this._curSubView && this._curSubView.updateView) {
				this._curSubView.updateView();
				this.checkRedDot();
			}
		}

		private closeView() {
			// ActivityManager.getInstance().closeActivity();
			App.WinManager.closeWin(WinName.ACTIVITY);
		}

		//红点显隐
		private checkRedDot() {
			for (let i = 0; i < this.list.dataProvider.length; i++) {
				if (this.list.dataProvider.getItemAt(i) && i < this.list.numChildren) {
					let item: ActivityMainItem = <ActivityMainItem>this.list.getChildAt(i);
					if (item) {
						if (this.activityModel.redDotDict[this.list.dataProvider.getItemAt(i)]) {
							item.showTips();
						} else {
							item.hideTips();
						}
					}
				}
			}
		}

		/**
		 * 打开窗口
		 * @param openParam.id 要打开的活动id，不传默认打开第一个
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (this._mainHandleId == 0) {
				this._mainHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_UPDATE_MAIN_VIEW, this.updateMainView, this);
			}
			if (this._changeHandleId == 0) {
				this._changeHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_CHANGE_VIEW, this.changeActivity, this);
			}
			if (this._viewHandleId == 0) {
				this._viewHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW, this.updateSubView, this);
			}
			if (openParam && openParam.id) {

			}
			App.Socket.send(30001, {});
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
			if (this._mainHandleId != 0) {
				App.EventSystem.removeEventListener(PanelNotify.ACTIVITY_UPDATE_MAIN_VIEW, this._mainHandleId);
				this._mainHandleId = 0;
			}
			if (this._changeHandleId != 0) {
				App.EventSystem.removeEventListener(PanelNotify.ACTIVITY_CHANGE_VIEW, this._changeHandleId);
				this._changeHandleId = 0;
			}
			if (this._viewHandleId != 0) {
				App.EventSystem.removeEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW, this._viewHandleId);
				this._viewHandleId = 0;
			}

			for (let key in this._viewDict) {
				this._viewDict[key].clear();
			}
			ActivityManager.getInstance().closeActivity();
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}

	}

	export class ActivityMainItem extends eui.ItemRenderer {
		public img_name: eui.Image;
		public btn_icon: eui.Button;

		public redDot: BtnTips;
		public constructor() {
			super();
			this.skinName = "ActivityMainItemSkin";
			this.redDot = App.BtnTipManager.creatBtnTip("", this);
		}

		protected dataChanged() {
			RES.getResAsync(ActivityConfig[this.data].nameIcon, (texture) => {
				this.img_name.source = texture;
			}, this);

			RES.getResAsync(ActivityConfig[this.data].icon, (texture: egret.Texture) => {
				this.btn_icon.iconDisplay.texture = texture;

			}, this);

		}

		public showTips(data?) {
			this.redDot.show(data);
		}

		public hideTips() {
			this.redDot.hide();
		}

	}
}