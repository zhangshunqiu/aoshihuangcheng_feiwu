/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 勋章界面 2017/06/20.
 */
module game {

    
    export class MustDoMedalView extends BaseChildView {

        public pgbar_medalvalue: eui.ProgressBar;
        public bt_view: eui.Image;
        public btn_lvup: eui.Image;
        public bt_untake: eui.Image;
        public bt_getachieve: eui.Label;
        public lb_pgtext: eui.Label;
        public lb_rank: eui.Label;
        public lb_lv: eui.Label;
        public lb_honor: eui.Label;
        public lb_power: eui.BitmapLabel;
        public lb_untake: eui.Label;
        public lb_hp: eui.Label;
        public lb_attak: eui.Label;
        public lb_dfphydic: eui.Label;
        public lb_dfmagic: eui.Label;
        public lb_nexthp: eui.Label;
        public lb_nextak: eui.Label;
        public lb_nextdfp: eui.Label;
        public lb_nextdfm: eui.Label;
        private _eventid_medal: number = 0;
        private _mustdomodel: MustDoModel = MustDoModel.getInstance();
        private _btnTakeMc: AMovieClip;//成就值多少的特效

        public constructor(skinName: string) {
            super("MustDoMedalSkin")
        }

        protected childrenCreated() {
            super.childrenCreated();
            //this.isCreated = true;
            this.bt_getachieve.textFlow = [{ text: "获得活跃", style: { "underline": true } }]
            this.btn_lvup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.medalLvUp, this);
            this.bt_view.addEventListener(egret.TouchEvent.TOUCH_TAP, this.viewMedalRank, this);
            this.bt_getachieve.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getAchieveWay, this);
            this.bt_untake.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getUnTakeAchieve, this);

            if (this._btnTakeMc == null) {                     //未领取成就值特效
                this._btnTakeMc = new AMovieClip();
                this.addChild(this._btnTakeMc);
                this._btnTakeMc.x = this.bt_untake.x + 55;
                this._btnTakeMc.y = this.bt_untake.y + 52;
                this._btnTakeMc.touchEnabled = false;

            }
            this._btnTakeMc.visible = false;
        }

        /**
         * 打开窗口
         */
        public open(openParam: any = null): void {
            super.open(openParam);

            if (this._btnTakeMc == null) {                     //未领取成就值特效
                this._btnTakeMc = new AMovieClip();
                this.addChild(this._btnTakeMc);
                this._btnTakeMc.x = this.bt_untake.x + 55;
                this._btnTakeMc.y = this.bt_untake.y + 52;
                this._btnTakeMc.touchEnabled = false;

            }
            this._btnTakeMc.visible = false;

            if (this._eventid_medal == 0)
                this._eventid_medal = App.EventSystem.addEventListener(PanelNotify.MUSTDO_UPDATEMEDAL, this.updateMedal, this);

            App.Socket.send(19005, null);

        }

        /**
         * 清理
         */
        public clear(data: any = null): void {
            super.clear();

            if (this._eventid_medal != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATEMEDAL, this._eventid_medal);
                this._eventid_medal = 0;
            }

            if (this._btnTakeMc) {
                this._btnTakeMc.stop();
                this._btnTakeMc.destroy();
                this._btnTakeMc = null;
            }

        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();

        }

        public updateMedal() {

            this.lb_power.text = this._mustdomodel.achieve_power + "";
            this.lb_untake.text = this._mustdomodel.achieve_not_get + "";
            this.lb_lv.text = "Lv." + this._mustdomodel.achieve_lv;
            this.pgbar_medalvalue.maximum = this._mustdomodel.achieve_upgrade;
            this.pgbar_medalvalue.value = this._mustdomodel.achieve_own;// * 100 / this._mustdomodel.achieve_upgrade;
            this.lb_pgtext.text = this._mustdomodel.achieve_own + "/" + this._mustdomodel.achieve_upgrade;
            let value = this._mustdomodel.achieve_not_get * 100 / 8000;
            this._btnTakeMc.visible = true;
            if (value >= 0 && value < 25)
                this._btnTakeMc.visible = false;
            if (value >= 25 && value < 50)
                this._btnTakeMc.playMCKey("effcjz01");
            if (value >= 50 && value < 75)
                this._btnTakeMc.playMCKey("effcjz02");
            if (value >= 75 && value < 25)
                this._btnTakeMc.playMCKey("effcjz03");
            if (value >= 100)
                this._btnTakeMc.playMCKey("effcjz04")
            
            let rankstr: string = "";
            for (let i = 0; i < this._mustdomodel.achieveranklist.length; i++) {
                rankstr += this._mustdomodel.achieveranklist[i].rank_num + "." + this._mustdomodel.achieveranklist[i].name + "  Lv."
                    + this._mustdomodel.achieveranklist[i].lv + "\n";
            }
            this.lb_rank.text = rankstr;

            let curlv_info = App.ConfigManager.getMedalAttrInfoByLv(this._mustdomodel.achieve_lv);
            if (curlv_info != null) {
                this.lb_hp.text = ConstAttribute.hp + "：" + curlv_info.hp;
                this.lb_attak.text = "攻击：" + curlv_info.ac;
                this.lb_dfphydic.text = ConstAttribute.def + "：" + curlv_info.def;
                this.lb_dfmagic.text = ConstAttribute.sdef + "：" + curlv_info.sdef;
            }

            let nextlv_info = App.ConfigManager.getMedalAttrInfoByLv(this._mustdomodel.achieve_lv + 1);
            if (nextlv_info != null) {

                this.lb_nexthp.text = ConstAttribute.hp + "：" + nextlv_info.hp;
                this.lb_nextak.text = "攻击：" + nextlv_info.ac;
                this.lb_nextdfp.text = ConstAttribute.def + "：" + nextlv_info.def;
                this.lb_nextdfm.text = ConstAttribute.sdef + "：" + nextlv_info.sdef;
            } else {

               
                this.lb_nexthp.text = "已满级";
                this.lb_nextak.text = "已满级";
                this.lb_nextdfp.text = "已满级";
                this.lb_nextdfm.text = "已满级";
            }
        }

        public medalLvUp() {

            if (this._mustdomodel.achieve_own >= this._mustdomodel.achieve_upgrade)
                App.Socket.send(19006, null);
        }

        public viewMedalRank() {
             App.WinManager.openWin(WinName.RANK,ConstRankName.MEMAL);
        }
        public getUnTakeAchieve() {
            
            if(this._mustdomodel.month_card==1)
            App.Socket.send(19004, null);
            else
            App.WinManager.openWin(WinName.MUSTDO_UNTAKE);
        }
        public getAchieveWay() {
            // let view = new ItemWay(ClientType.BASE_ITEM, 104);
            // PopUpManager.addPopUp({ obj: view });
            App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, 103);
        }

    }

}