/**
* Author: lihe
* Email： hersletter@qq.com
* 登陆公告UI界面逻辑 2017/06/20.
*/
module game {
    export class LoginNoticeView extends BaseView {
        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }


        public lb_content: eui.Label;
        public lb_title: eui.Label;
        public btn_back: eui.Image;
        public scroller:eui.Scroller;
        public vp_scr:eui.Group;

        protected childrenCreated() {
            super.childrenCreated();

            this.initView();

            this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.WinManager.closeWin(WinName.LOGIN_NOTICE);
            }, this);

            this.scroller.viewport = this.vp_scr;
			this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        }


        private initView() {

        }

        
		/**
	     * 打开窗口
	    */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            // App.Socket.send(16001,{});
           	let data = (LoginModel.getInstance() as LoginModel).getNotice();
            this.lb_title.textFlow =  (new egret.HtmlTextParser).parser(data.top );
            this.lb_content.textFlow = (new egret.HtmlTextParser).parser(data.word);

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
            

        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
        }

        

    }



}