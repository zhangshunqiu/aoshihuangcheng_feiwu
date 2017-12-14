/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 称号界面 2017/06/20.
 */
module game {

    /**
     *  活跃度任务界面
     */
    export class MustDoTitleView extends BaseChildView {

        public lb_totalactivity: eui.Label;
        public btn_lighten: eui.Image;
        public scr_title: eui.Scroller;
        private _listtitle: eui.List = new eui.List();
        private _eventid_Title: number = 0;
        private _mustdomodel: MustDoModel = MustDoModel.getInstance();

        public constructor(skinName: string) {
            super("MustDoTitleSkin")
        }

        protected childrenCreated() {
            super.childrenCreated();
            //this.isCreated = true;

            this.scr_title.viewport = this._listtitle;
            this.scr_title.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._listtitle.itemRenderer = TitleItem;
            this.btn_lighten.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lightenProperty, this);

        }

        /**
         * 打开窗口
         */
        public open(openParam: any = null): void {
            super.open(openParam);
            if (this._eventid_Title == 0)
                this._eventid_Title = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATETITLE, this.updateTitle, this);
            App.Socket.send(32001, null);

        }

        /**
         * 清理
         */
        public clear(data: any = null): void {
            super.clear();

            if (this._eventid_Title != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATETITLE, this._eventid_Title);
                this._eventid_Title = 0;
            }

        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();

        }


        public updateTitle() {
            this._listtitle.dataProvider = new eui.ArrayCollection(this._mustdomodel.titleList);
            this.lb_totalactivity.text = this._mustdomodel.totalactivity + "";
        }

        public lightenProperty() {
            App.WinManager.openWin(WinName.MUSTDO_LIGHTEN);
        }
    }


    export class TitleItem extends eui.ItemRenderer {

        public img_icon: eui.Image;
        public img_alive: eui.Image;
        public img_notactive: eui.Image;
        public lb_condition: eui.Label;
        public gp_use:eui.Group;
        public gp_show:eui.Group;
        public cbx_use: eui.CheckBox;
        public cbx_show: eui.RadioButton;
        public tivo: TitleVo;
        private _mustdomodel: MustDoModel = MustDoModel.getInstance();
        public constructor() {
            super();
            this.skinName = "MustDoTitleItemSkin";
            this.cbx_use.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                this.useTitle();//egret.log(evt.target.selected);
            }, this
            );

            this.cbx_show.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                this.showTitle();//egret.log(evt.target.selected);
            }, this
            );
            this.cbx_show.groupName = "title";

            this.img_icon.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.viewTitleDetail();
            }, this);


        }

        public viewTitleDetail() {
            this._mustdomodel.selectTitleId = this.tivo.title_id;
            App.WinManager.openWin(WinName.MUSTDO_TITLEDETAIL);
        }

        public useTitle() {
            this._mustdomodel.selectTitleId = this.tivo.title_id;
            App.Socket.send(32002, { id: this.tivo.title_id });
        }

        public showTitle() {
            this._mustdomodel.selectTitleId = this.tivo.title_id;
            App.Socket.send(32003, { id: this.tivo.title_id });
        }

        public dataChanged() {

            let tv = this.data as TitleVo;
            this.tivo = tv;
            if (tv.is_alive) {
                this.img_alive.visible = true;
                this.img_notactive.visible = false;
                this.lb_condition.text = " ";
                this.cbx_show.visible = true;
                this.cbx_use.visible = true;
                this.cbx_show.selected = tv.is_show;
                this.cbx_use.selected = tv.is_use;


            } else {
                this.img_alive.visible = false;
                this.img_notactive.visible = true;
                this.lb_condition.text = "累积" + tv.active + "点活跃可激活";
                this.gp_show.visible = false;
                this.gp_use.visible = false;

            }

            // RES.getResAsync(tv.icon, (texture) => {
            //     this.img_icon.texture = texture;
            // }, this);




        }
    }

}