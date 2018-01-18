/**
 * Author: liuyonggen
 * 翅膀模块视图窗口  2018/1/3
 */
module game {
	export class WingAllView extends BaseView {
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		// public img_close: eui.Image;
		public img_back: eui.Image;
		public rb_develop: eui.RadioButton;
		public rb_equip: eui.RadioButton;
		// public rb_transform: eui.RadioButton;
		private _curSelView: BaseChildView;
		private _curSelIndex: number = 0;
		public view_develop: WingDevelopView;
		public view_equip: WingEquipView;
		public view_transform: WingTransformView;
		public heroHead: HeroHeadComponentView;
		private _wingInfoUpdateEventId: number = 0;
		private _changeHeroEventId: number = 0;
		private _partnerHandleEventId: number = 0;
		private wingModel: WingModel = WingModel.getInstance();
		private baseViewBg: ComBaseViewBg;

		protected childrenCreated() {
			super.childrenCreated();

			this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
			this.initView();

			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WING_TRAIN, this.rb_develop, 128, -1);
			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WING_EQUIP, this.rb_equip, 128, -1);
		}

		private heroBtnTip() {
			let _wingModel: WingModel = WingModel.getInstance();
			let btnTip = _wingModel.judgeBtnTip();
			for (let i: number = 0; i < btnTip.length; i++) {
				if (btnTip[i].devBool || btnTip[i].equipBool) {
					this.heroHead.showRedTips(i, true);
				} else {
					this.heroHead.hideRedTips(i);
				}
			}
		}

		private updateWingbtnTips() {
			let _wingModel: WingModel = WingModel.getInstance();
			let btnTip = _wingModel.judgeBtnTip();

			if (btnTip[(HeroModel.getInstance() as HeroModel).curPos].devBool) {
				App.BtnTipManager.setTypeValue(ConstBtnTipType.WING_TRAIN, true);
			} else {
				App.BtnTipManager.setTypeValue(ConstBtnTipType.WING_TRAIN, false);
			}
			if (btnTip[(HeroModel.getInstance() as HeroModel).curPos].equipBool) {
				App.BtnTipManager.setTypeValue(ConstBtnTipType.WING_EQUIP, true);
			} else {
				App.BtnTipManager.setTypeValue(ConstBtnTipType.WING_EQUIP, false);
			}
			
		}

		private checkAllBtnTip() {
			let btnTip = this.wingModel.judgeBtnTip();
			for (let i: number = 0; i < btnTip.length; i++) {
				if (btnTip[i].devBool || btnTip[i].equipBool) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.WING, true);
					break;
				} else {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.WING, false);
				}
			}
		}

		/**
		* 切换英雄
		*/
		private changeHero(curPos) {
			this.wingModel.wingInfo = this.wingModel.wingInfoObj[(HeroModel.getInstance() as HeroModel).heroInfo[curPos].id];
			this.wingModel.wingInfo.currentStar = this.wingModel.wingInfo.star || 0;
			this.wingModel.wingInfo.currentWingEquip = this.wingModel.wingInfo.wingEquip;
			if (this.wingModel.wingInfo.wingId) {
				this.rb_equip.visible = true;
				this.rb_develop.x = 216;
				// this.rb_transform.visible = true;
			} else {
				this.updateView(1);  //打开羽翼培养界面
				this.rb_develop.x = 291;
				this.rb_equip.visible = false;
				// this.rb_transform.visible = false;
			}
			this.updateWingbtnTips();
		}

		private initView() {

			var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
			radioGroup.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
				var radioGroup: eui.RadioButtonGroup = evt.target;
				this.updateView(radioGroup.selectedValue);
			}, this);
			this.rb_develop.group = radioGroup;
			this.rb_develop.value = 1;
			this.rb_develop.label = "羽翼培养";
			this.rb_develop.selected = true;
			this.rb_equip.group = radioGroup;
			this.rb_equip.label = "羽翼装备";
			this.rb_equip.value = 2;
			// this.rb_transform.group = radioGroup;
			// this.rb_transform.label = "羽翼转换";
			// this.rb_transform.value = 3;
			this.updateView(1);
		}

		private updateView(index: number): void {
			if (this._curSelIndex == index) {
				return;
			}
			if (this._curSelView) {
				this._curSelView.clear();
			}
			if (index == 1) {
				if (this.view_develop == null) {
					this.view_develop = new WingDevelopView("WingDevelopSkin")
				}
				this.addChild(this.view_develop);
				this.view_develop.readyOpen({ data: {} });
				this._curSelView = this.view_develop;
				// this.img_developSelector.visible = true;
				this.addChild(this.heroHead);
				this.addChild(this.img_back);
			} else if (index == 2) {
				if (this.view_equip == null) {
					this.view_equip = new WingEquipView("WingEquipSkin")
				}
				this.addChild(this.view_equip);
				this.view_equip.readyOpen({ data: {} });
				this._curSelView = this.view_equip;
				// this.img_equipSelector.visible = true;
				this.addChild(this.heroHead);
				this.addChild(this.img_back);
			} else if (index == 3) {
				if (this.view_transform == null) {
					this.view_transform = new WingTransformView("WingTransformSkin");
				}
				this.addChild(this.view_transform);
				this.view_transform.readyOpen({ data: {} });
				this._curSelView = this.view_transform;
				// this.img_transformSelector.visible = true;
			}
			this._curSelIndex = index;
		}

		private heroHeadUpdateView() {
			this.heroHead.updateView();
			this.checkNewHero();
		}

		/**检车能否开启新伙伴 */
		private checkNewHero() {
			let heroModel = HeroModel.getInstance();
			heroModel.checkNewPartner();
			if (heroModel.heroHeadFrame[0]) {
				this.heroHead.setNewPartnerTip(0, true);
			} else {
				this.heroHead.setNewPartnerTip(0, false);
			}
			if (heroModel.heroHeadFrame[1]) {
				this.heroHead.setNewPartnerTip(1, true);
			} else {
				this.heroHead.setNewPartnerTip(1, false);
			}
		}

		/**
	     * 打开窗口
	    */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			this.baseViewBg.winVo = this.winVo;
			this.updateView(this._curSelIndex);
			if (this.wingModel.wingInfo.wingId) {
				this.rb_equip.visible = true;
				this.rb_develop.x = 216;
				// this.rb_transform.visible = true;
			} else {
				this.updateView(1);  //打开羽翼培养界面
				this.rb_equip.visible = false;
				this.rb_develop.x = 291;
				// this.rb_transform.visible = false;
			}
			this.heroBtnTip();
			this.updateWingbtnTips();
			this.checkNewHero();
			if (this._changeHeroEventId == 0) {
				this._changeHeroEventId = App.EventSystem.addEventListener(PanelNotify.HERO_CHANGE, this.changeHero, this);
			}
			if (this._partnerHandleEventId == 0) {
                this._partnerHandleEventId = App.EventSystem.addEventListener(PanelNotify.HERO_NEW_PARTNER, this.heroHeadUpdateView, this);
            }
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

			super.clear();
			if (this._curSelView) {
				this._curSelView.clear();
			}
			if (this._wingInfoUpdateEventId == 0) {
				this._wingInfoUpdateEventId = App.EventSystem.addEventListener(PanelNotify.WING_INFO_UPDATE, this.heroBtnTip, this);
			}
			if (this._changeHeroEventId != 0) {
				App.EventSystem.removeEventListener(PanelNotify.HERO_CHANGE, this._changeHeroEventId);
				this._changeHeroEventId = 0;
			}
			if (this._partnerHandleEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_NEW_PARTNER, this._partnerHandleEventId);
                this._partnerHandleEventId = 0;
            }
			if (this.baseViewBg) {
				this.baseViewBg.destroy();
			}
			this.checkAllBtnTip();
			
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}
}