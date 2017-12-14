/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 每日必做UI界面逻辑 2017/06/20.
 */
module game {
	export class MustDoUnTakeView extends BaseView {
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		public lb_untakevalue: eui.Label;
		public btn_opennow: eui.Button;
		public bt_back: eui.Image;
		public img_close: eui.Image;
		public img_achieveframe:eui.Image;
		private _btnTakeMc:AMovieClip;//
		private _mustdomodel: MustDoModel = MustDoModel.getInstance();

		protected childrenCreated() {
			super.childrenCreated();
			this.btn_opennow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getUnTakeAchieve, this);
			this.bt_back.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
				this.closeWin(null);
			}, this);
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
				this.closeWin(null);
			}, this);

			if(this._btnTakeMc == null){
				this._btnTakeMc = new AMovieClip();
				this._btnTakeMc.x = this.img_achieveframe.x+this.img_achieveframe.width/2;
				this._btnTakeMc.y = this.img_achieveframe.y+this.img_achieveframe.height/2;
				this._btnTakeMc.touchEnabled = false;
				this.addChild(this._btnTakeMc);
			}
			this._btnTakeMc.visible = false;
			//this
		}

		public getUnTakeAchieve() {
			
			this.closeWin(null);
			App.WinManager.openWin(WinName.MONTHCARD);
		}
		/**
				 * 打开窗口
				*/
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			
			this.lb_untakevalue.textFlow = [ { text: this._mustdomodel.achieve_not_get + "", style: { textColor: 0x6ee902 } },{ text:  "/"+8000 }];
			// = this._mustdomodel.achieve_not_get+"/"+8000;

           let value =   this._mustdomodel.achieve_not_get*100/8000;
		    this._btnTakeMc.visible = true;
			if(value>=0&&value<25)
			this._btnTakeMc.visible = false;
			if(value>=25&&value<50)
			this._btnTakeMc.playMCKey("effcjz01");
			if(value>=50&&value<75)
			this._btnTakeMc.playMCKey("effcjz02");
			if(value>=75&&value<25)
			this._btnTakeMc.playMCKey("effcjz03");
			if(value>=100)
			this._btnTakeMc.playMCKey("effcjz04")
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
            
		     if(this._btnTakeMc){
				this._btnTakeMc.stop();
				this._btnTakeMc.destroy();
				this._btnTakeMc = null;
		}
	}
		/**
		 * 销毁
		 */
		public destroy(): void {

		}

	}
}