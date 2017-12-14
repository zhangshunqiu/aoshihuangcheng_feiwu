/**
* Author: lihe
* Email： hersletter@qq.com
* 天梯争霸UI界面逻辑 2017/06/20.
*/
module game {
	export class LabberHegemonyWin extends BaseView {
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		// bg
		public commonWin: customui.CommonWin;
		public img_close: eui.Image;
		public rb_encounter: eui.RadioButton;
		public rb_labber: eui.RadioButton;
		private _curSelView: BaseChildView;
		private _curSelIndex: number = 0;
		public view_labber: LabberView;
		public view_encounter: EncounterView;

		protected childrenCreated() {
			super.childrenCreated();

			this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.HEGEMONY);
			}, this);
			RES.getResAsync("encounter_zaoyuzhan_title_png", (texture) => {
					this.commonWin.img_title.texture = texture;
				}, this);
			this.initView();
		}

		private initView() {

			var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
			radioGroup.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
				var radioGroup: eui.RadioButtonGroup = evt.target;
				this.updateView(radioGroup.selectedValue);
			}, this);
			this.rb_encounter.group = radioGroup;
			this.rb_encounter.value = 1;
			this.rb_encounter.label = "遭遇";
			this.rb_encounter.selected = true;
			this.rb_labber.group = radioGroup;
			this.rb_labber.label = "争霸";
			this.rb_labber.value = 2;
		}

		private updateView(index: number): void {
			if (this._curSelIndex == index) {
				return;
			}
			if (this._curSelView) {
				this._curSelView.clear();
			}
			if (index == 1) {
				RES.getResAsync("encounter_zaoyuzhan_title_png", (texture) => {
					this.commonWin.img_title.texture = texture;
				}, this);
				if (this.view_encounter == null) {
					this.view_encounter = new EncounterView("EncounterSkin")
				}
				this.addChild(this.view_encounter);
				this.view_encounter.readyOpen({ data: {} });
				this._curSelView = this.view_encounter;

			} else if (index == 2) {
				RES.getResAsync("labber_tiantizhengba_title_png", (texture) => {
					this.commonWin.img_title.texture = texture;
				}, this);
				if (this.view_labber == null) {
					this.view_labber = new LabberView("LabberSkin")
				}
				this.addChild(this.view_labber);
				this.view_labber.readyOpen({ data: {} });
				this._curSelView = this.view_labber;
			}
			this._curSelIndex = index;
		}

		/**
	     * 打开窗口
	    */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (this.view_encounter == null) {
				this.view_encounter = new EncounterView("EncounterSkin")
			}
			this.addChild(this.view_encounter);
			this.view_encounter.readyOpen({ data: {} });
			this._curSelView = this.view_encounter;
			this._curSelIndex = 1;
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

			super.clear();
			if (this._curSelView) {
				this._curSelView.clear();
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