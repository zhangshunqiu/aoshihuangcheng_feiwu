/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 称号点亮属性界面 2017/06/20.
 */
module game {
    export class MustDoLightenView extends BaseView {
        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        public img_close: eui.Image;
        public lb_lightennum: eui.Label;
        public lb_hp: eui.Label;
        public lb_attack: eui.Label;
        public lb_def: eui.Label;
        public lb_sdef: eui.Label;
        private _mustdomodel: MustDoModel = MustDoModel.getInstance();

        protected childrenCreated() {
            super.childrenCreated();

            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.WinManager.closeWin(WinName.MUSTDO_LIGHTEN);
            }, this);
        }

		/**
		 * 打开窗口
		*/
        public openWin(openParam: any = null): void {
            super.openWin(openParam);


            this.lb_lightennum.text = "当前获得" + this._mustdomodel.activetitlenum + "个称号，获得点亮属性加成";

            this.lb_hp.textFlow = [{ text: ConstAttribute.hp + " " }, { text: "0", style: { textColor: 0x00f829 } }];
            this.lb_attack.textFlow = [{ text: "攻击 " }, { text: "0", style: { textColor: 0x00f829 } }];
            this.lb_def.textFlow = [{ text: ConstAttribute.def + " " }, { text: "0", style: { textColor: 0x00f829 } }];
            this.lb_sdef.textFlow = [{ text: ConstAttribute.sdef + " " }, { text: "0", style: { textColor: 0x00f829 } }];

            if (this._mustdomodel.activetitlenum > 0) {
                let att_id = (App.ConfigManager.getLightenPropertyByNum(this._mustdomodel.activetitlenum)).att_id;
                let info = App.ConfigManager.getTitleAttByAttId(att_id);
                if (info != null) {

                    this.lb_hp.textFlow = [{ text: ConstAttribute.hp + " " }, { text: info.hp, style: { textColor: 0x00f829 } }];
                    this.lb_attack.textFlow = [{ text: "攻击 " }, { text: info.ac, style: { textColor: 0x00f829 } }];
                    this.lb_def.textFlow = [{ text: ConstAttribute.def + " " }, { text: info.def, style: { textColor: 0x00f829 } }];
                    this.lb_sdef.textFlow = [{ text: ConstAttribute.sdef + " " }, { text: info.sdef, style: { textColor: 0x00f829 } }];
                }

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

        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
        }

    }
}