/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 天梯争霸界面 2017/06/20.
 */
module game {


    export class LabberView extends BaseChildView {

        public lb_name: eui.Label;
        public lb_tier: eui.Label;
        public lb_tierdetail: eui.Label;
        public lb_rank: eui.Label;
        public lb_winmatch: eui.Label;
        public lb_leftcount: eui.Label;
        public lb_winingrate: eui.Label;
        public btn_tips: eui.Button;
        public btn_reward: eui.Button;
        public btn_match: eui.Button;
        public btn_buytimes: eui.Button;
        public btn_rank:eui.Button;
        public img_winingstreak: eui.Image;
        public img_career: eui.Image;
        public scr_match: eui.Scroller;
        public img_default: eui.Image;
        public img_star1: eui.Image;
        public img_star2: eui.Image;
        public img_star3: eui.Image;
        public img_tier: eui.Image;
        private _list_match: eui.List = new eui.List();
        private _labber_eventId: number = 0;
        private _match_eventId: number = 0;
        private _match_timeId: number = 0;
        private img_stars: Array<eui.Image> = [];
        private _labbermodel: LabberHegemonyModel = LabberHegemonyModel.getInstance();
        private _match_time: number;

        public constructor(skinName: string) {
            super("LabberSkin")
        }

        protected childrenCreated() {
            super.childrenCreated();

            this.btn_tips.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHegemonyTips, this);
            this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHegemonyReward, this);
            this.btn_match.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHegemonyMatch, this);
            this.btn_buytimes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyHegemonyMatchTimes, this);
            this.btn_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openRanking, this);
            this.scr_match.viewport = this._list_match;
            this.scr_match.scrollPolicyH = eui.ScrollPolicy.OFF;
            this._list_match.itemRenderer = LabberMatchItem;
            this.img_stars.push(this.img_star1);
            this.img_stars.push(this.img_star2);
            this.img_stars.push(this.img_star3);
        }

        /**
         * 打开窗口
         */
        public open(openParam: any = null): void {
            super.open(openParam);
            if (this._labber_eventId == 0) {
                this._labber_eventId = App.EventSystem.addEventListener(PanelNotify.HEGEMONY_INFO_UPDATE, this.updateHegemonyInfo, this);
            }

            if (this._match_eventId == 0) {
                this._match_eventId = App.EventSystem.addEventListener(PanelNotify.HEGEMONY_MATCH_UPDATE, this.updataMatchInfo, this);
            }

            this.img_default.visible = true;
            App.Socket.send(37001, null);
        }

        /**
         * 清理
         */
        public clear(data: any = null): void {
            super.clear();

            if (this._labber_eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HEGEMONY_INFO_UPDATE, this._labber_eventId);
                this._labber_eventId = 0;
            }

            if (this._match_eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HEGEMONY_MATCH_UPDATE, this._match_eventId);
                this._match_eventId = 0;
            }

        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();

        }


        public openHegemonyTips() {

            App.WinManager.openWin(WinName.HEGEMONY_LABBER_TIPS);
        }

        public openHegemonyReward() {

            App.WinManager.openWin(WinName.HEGEMONY_LABBER_REWARD);
        }

        public openHegemonyMatch() {

            App.Socket.send(37002, null);
        }

        public openRanking() {

            App.WinManager.openWin(WinName.RANK,ConstRankName.KING);
        }

        public buyHegemonyMatchTimes() {


            let info = (App.ConfigManager.getLabberBuyTimeInfo());
           
            let okCB = function (selected) {
                App.Socket.send(37003, null);
            }

            let textFlow = [{ text: "确定花费", style: { textColor: 0xff8500 } }, { text: info.buy_gold + "元宝", style: { textColor: 0xffea01 } }, { text: "购买一次天梯挑战次数吗？", style: { textColor: 0xff8500 } }, { text: "\n今日已购买次数：" }, { text: (info.buy_num - this._labbermodel.left_buy_times) + "/" + info.buy_num, style: { textColor: 0x22a322 } }]
            App.GlobalTips.showAlert({ style: BaseTipsStyle.COMMON, textFlow: textFlow, okCB: okCB, context: this, needCheckBox: false });


        }

        public updateHegemonyInfo() {

            this.lb_name.text = this._labbermodel.hegemony_name;

            this.lb_tier.text = GlobalUtil.getTierName(this._labbermodel.tier);
            this.lb_tierdetail.text = GlobalUtil.getTierName(this._labbermodel.tier) + GlobalUtil.getTierLvName(this._labbermodel.lv);
            this.lb_winmatch.text = this._labbermodel.win_match + "";
            this.lb_rank.text = this._labbermodel.my_rank + "";
            this.lb_leftcount.text = this._labbermodel.left_num + "/" + this._labbermodel.left_total;
            this.lb_winingrate.text = this._labbermodel.wining_rate + "%";
            this.img_winingstreak.visible = this._labbermodel.is_winingstreak;
            for (let i = 0; i < this.img_stars.length; i++) {
                if (i < this._labbermodel.star)
                    this.img_stars[i].visible = true;
                else
                    this.img_stars[i].visible = false;
            }
            RES.getResAsync(GlobalUtil.getTierIcon(this._labbermodel.tier), (texture) => {
                this.img_tier.source = texture;
                this.img_tier.width = texture.textureWidth;
                this.img_tier.height = texture.textureHeight;
            }, this);

            let str: string = GlobalUtil.getCareerPic(RoleManager.getInstance().roleInfo.sex, RoleManager.getInstance().roleInfo.career);
            RES.getResAsync(str, (texture) => {
                this.img_career.source = texture;
                this.img_career.width = texture.textureWidth / 2;
                this.img_career.height = texture.textureHeight / 2;
            }, this);

        }

        public updataMatchInfo() {

            this.img_default.visible = true;
            this._match_time = 0;
            this._list_match.dataProvider = new eui.ArrayCollection(this._labbermodel.match_list);
            if (this._match_timeId == 0) {
                this._match_timeId = App.GlobalTimer.addSchedule(200, 0, this.matchTimerHandler, this);
            }

        }

        public matchTimerHandler() {

            this._match_time += 0.2;
            if (this.scr_match.viewport.scrollV >= this._list_match.height) {
                if (this._match_timeId != 0 && this._match_time >= 5) {
                    App.GlobalTimer.remove(this._match_timeId);
                    this._match_timeId = 0;
                    App.WinManager.closeWin(WinName.HEGEMONY);
                    App.WinManager.openWin(WinName.COUNTERDOWN);
                }
                //this.enterHegemony();
            }
            else {
                this.scr_match.viewport.scrollV += 50;
            }
        }


    }



    export class LabberMatchItem extends eui.ItemRenderer {

        public lb_name: eui.Label;
        public lb_tier: eui.Label;
        public lb_pwin: eui.Label;
        public img_career: eui.Image;
        public lmv: LabberMatchVo;


        public constructor() {
            super();
            this.skinName = "LabberMatchItemSkin";


        }

        public dataChanged() {

            let lv = this.data as LabberMatchVo;
            this.lmv = lv;
            this.lb_tier.text = lv.getTierName();
            this.lb_name.text = lv.name;
            this.lb_pwin.text = lv.getWiningRateText();
            RES.getResAsync(lv.getCareerIcon(), (texture) => {
                this.img_career.source = texture;
                this.img_career.width = texture.textureWidth / 2;
                this.img_career.height = texture.textureHeight / 2;
            }, this);

        }



    }

}