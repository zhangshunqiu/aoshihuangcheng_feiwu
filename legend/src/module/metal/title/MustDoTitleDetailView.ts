/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 称号详细属性界面 2017/06/20.
 */
module game {
    export class MustDoTitleDetailView extends BaseView {
        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }
        public img_close: eui.Image;
        public img_icon: eui.Image;
        public img_forever: eui.Image;
        public lb_hp: eui.Label;
        public lb_attack: eui.Label;
        public lb_def: eui.Label;
        public lb_sdef: eui.Label;
        public lb_way: eui.Label;
        public lb_time: eui.Label;
        private _mustdomodel: MustDoModel = MustDoModel.getInstance();

        protected childrenCreated() {
            super.childrenCreated();
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.WinManager.closeWin(WinName.MUSTDO_TITLEDETAIL);
            }, this);

        }

		/**
				 * 打开窗口
				*/
        public openWin(openParam: any = null): void {
            super.openWin(openParam);


            let title = App.ConfigManager.getTitleInfoById(this._mustdomodel.selectTitleId);
            let info = App.ConfigManager.getTitleAttByAttId(title.att_id);
            if (this._mustdomodel.selectTitileVo.type == 2) {
                let newDate = new Date(this._mustdomodel.selectTitileVo.time * 1000);
                let hour: any = newDate.getHours();
                this.img_forever.visible = false;
                let str =  "有效时间：" ;
                if(newDate.getDay()>0)
                str+= newDate.getDay() + "天";
                if(newDate.getHours()>0)
                str+=newDate.getHours() + "小时";
                if(newDate.getMinutes()>0)
                str+= newDate.getMinutes() + "分钟" ;
                if(newDate.getSeconds()>0)
                str+= newDate.getSeconds() + "秒";
                this.lb_time.text = str;//"有效时间：" + newDate.getDay() + "天" + newDate.getHours() + "小时" + newDate.getMinutes() + "分钟" + newDate.getSeconds() + "秒";
            }
            else {
                this.img_forever.visible = true;
                this.lb_time.text = "";
            }
            this.lb_way.text = this._mustdomodel.selectTitileVo.des;

            if (info != null) {

                this.lb_hp.textFlow = [{ text: ConstAttribute.hp + " " }, { text: info.hp, style: { textColor: 0x00f829 } }];
                this.lb_attack.textFlow = [{ text: "攻击 " }, { text: info.ac, style: { textColor: 0x00f829 } }];
                this.lb_def.textFlow = [{ text: ConstAttribute.def + " " }, { text: info.def, style: { textColor: 0x00f829 } }];
                this.lb_sdef.textFlow = [{ text: ConstAttribute.sdef + " " }, { text: info.sdef, style: { textColor: 0x00f829 } }];
            }
            else {

                this.lb_hp.textFlow = [{ text: ConstAttribute.hp + " " }, { text: "0", style: { textColor: 0x00f829 } }];
                this.lb_attack.textFlow = [{ text: "攻击 " }, { text: "0", style: { textColor: 0x00f829 } }];
                this.lb_def.textFlow = [{ text: ConstAttribute.def + " " }, { text: "0", style: { textColor: 0x00f829 } }];
                this.lb_sdef.textFlow = [{ text: ConstAttribute.sdef + " " }, { text: "0", style: { textColor: 0x00f829 } }];

            }

            this.img_icon.source = this._mustdomodel.selectTitileVo.icon + "_png";
            // RES.getResAsync(title.icon+"_png", (texture) => {
            // 			this.img_icon.texture = texture;
            // 		}, this);

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