/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 福利公告界面 2017/06/20.
 */
module game {

    /**
     *  公告界面
     */
    export class WelfareNoteView extends BaseChildView {

        public lb_notecontent: eui.Label;
        public lb_notetitle: eui.Label;
        public scr_note: eui.Scroller;
        public vp_note: eui.Group;
        public btn_noteback: eui.Image;

        public constructor(skinName: string) {
            super("WelfareNoteSkin")
        }

        protected childrenCreated() {
            super.childrenCreated();
            //this.isCreated = true;

            this.btn_noteback.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.WinManager.closeWin(WinName.WELFARE);
            }, this);

            //公告
            this.scr_note.viewport = this.vp_note;
            this.scr_note.scrollPolicyH = eui.ScrollPolicy.OFF;


        }

        /**
         * 打开窗口
         */
        public open(openParam: any = null): void {
            super.open(openParam);
            let data = (LoginModel.getInstance() as LoginModel).getNotice();
            this.lb_notetitle.textFlow = (new egret.HtmlTextParser).parser(data.top);
            this.lb_notecontent.textFlow = (new egret.HtmlTextParser).parser(data.word);
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