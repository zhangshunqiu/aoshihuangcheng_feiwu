/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 成就界面 2017/06/20.
 */
module game {


    export class MustDoAchieveView extends BaseChildView {

        public lb_achievepercent: eui.Label;
        public lb_achievevalue: eui.Label;
        public scr_achieve: eui.Scroller;
        public bt_takeall: eui.Image;
        private _listachieve: eui.List = new eui.List();
        private _eventid_achieve: number = 0;
        private _mustdomodel: MustDoModel = MustDoModel.getInstance();
        private _btnTakeAllMc: AMovieClip;//一键领取特效

        public constructor(skinName: string) {
            super("MustDoAchieveSkin")
        }

        protected childrenCreated() {
            super.childrenCreated();
            //this.isCreated = true;
            this.scr_achieve.viewport = this._listachieve;
            this.scr_achieve.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._listachieve.itemRenderer = TaskItem;
            this.bt_takeall.addEventListener(egret.TouchEvent.TOUCH_TAP, this.takeAll, this);

            if (this._btnTakeAllMc == null) {                     //一键领取特效
                this._btnTakeAllMc = new AMovieClip();
                this.addChild(this._btnTakeAllMc);
                this._btnTakeAllMc.touchEnabled = false;
                this._btnTakeAllMc.x = this.bt_takeall.x + 151 / 2;
                this._btnTakeAllMc.y = this.bt_takeall.y + 53 / 2;

            }
            this._btnTakeAllMc.visible = false;

        }

        /**
         * 打开窗口
         */
        public open(openParam: any = null): void {
            super.open(openParam);

            if (this._btnTakeAllMc == null) {                     //一键领取特效
                this._btnTakeAllMc = new AMovieClip();
                this.addChild(this._btnTakeAllMc);
                this._btnTakeAllMc.touchEnabled = false;
                this._btnTakeAllMc.x = this.bt_takeall.x + 151 / 2;
                this._btnTakeAllMc.y = this.bt_takeall.y + 53 / 2;

            }
            this._btnTakeAllMc.visible = false;
            if (this._eventid_achieve == 0)
                this._eventid_achieve = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATESACHIEVE, this.updateAchieve, this);

            App.Socket.send(19001, null);

        }

        /**
         * 清理
         */
        public clear(data: any = null): void {
            super.clear();
            if (this._eventid_achieve != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATESACHIEVE, this._eventid_achieve);
                this._eventid_achieve = 0;
            }
            if (this._btnTakeAllMc) {
                this._btnTakeAllMc.stop();
                this._btnTakeAllMc.destroy();
                this._btnTakeAllMc = null;
            }
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();

        }

        private takeAll() {
            App.Socket.send(19003, null);
        }

        public updateAchieve() {

            this._listachieve.dataProvider = new eui.ArrayCollection(this._mustdomodel.achievelist);
            this.lb_achievepercent.text = this._mustdomodel.achievepercent + "%";
            this.lb_achievevalue.text = this._mustdomodel.achievevalue + "";
            if (this._mustdomodel.has_can_get) {

                this._btnTakeAllMc.visible = true;
                this._btnTakeAllMc.playMCKey("effanniu");
            }
            else {
                this._btnTakeAllMc.stop();
                this._btnTakeAllMc.visible = false;
            }

        }

    }



}