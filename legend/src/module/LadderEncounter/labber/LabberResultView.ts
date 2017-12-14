/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 天梯争霸结算界面 2017/06/20.
 */
module game {
    export class LabberResultView extends BaseView {
        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        public gp_win: eui.Group;
        public gp_lose: eui.Group;
        public gp_content: eui.Group;
        public lb_lv: eui.BitmapLabel;
        public img_tier: eui.Image;
        public btn_take: eui.Button;
        public star_reward1: eui.Image;
        public star_reward2: eui.Image;
        public star_reward3: eui.Image;
        public star_tier1: eui.Image;
        public star_tier2: eui.Image;
        public star_tier3: eui.Image;
        public reward_stars: Array<eui.Image> = [];
        public tier_stars: Array<eui.Image> = [];
        public reward_items: Array<customui.BaseItem> = [];
        private _item_posi: number = 0;
        private _cur_tier: number;
        private _cur_lv: number;
        private _cur_star: number;
        private _result_timeId: number = 0;
        private _labbermodel: LabberHegemonyModel = LabberHegemonyModel.getInstance();

        protected childrenCreated() {
            super.childrenCreated();

            this.reward_stars.push(this.star_reward1);
            this.reward_stars.push(this.star_reward2);
            this.reward_stars.push(this.star_reward3);
            this.tier_stars.push(this.star_tier1);
            this.tier_stars.push(this.star_tier2);
            this.tier_stars.push(this.star_tier3);
            this.btn_take.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.WinManager.closeWin(WinName.HEGEMONY_LABBER_RESULT);
                
            }, this);
        }

		/**
		 * 打开窗口
		*/
        public openWin(openParam: any = null): void {
            super.openWin(openParam);

            App.WinManager.closeWin(WinName.COUNTERDOWN);
            if (this._labbermodel.result == 1) {

                this.gp_win.visible = true;
                this.gp_lose.visible = false;
            }
            else {

                this.gp_win.visible = false;
                this.gp_lose.visible = true;
            }
            for (let i = 0; i < this.reward_stars.length; i++) {
                if (i < this._labbermodel.star_res)
                    this.reward_stars[i].visible = true;
                else
                    this.reward_stars[i].visible = false;
            }
            //old tier
            this.showTierInfo(this._labbermodel.old_tier, this._labbermodel.old_lv, this._labbermodel.old_star);

            this._cur_tier = this._labbermodel.old_tier;
            this._cur_lv = this._labbermodel.old_lv;
            this._cur_star = this._labbermodel.old_star;
            if (this._result_timeId == 0) {
                this._result_timeId = App.GlobalTimer.addSchedule(1000, 0, this.showNewTier, this);
            }
            //egret.setTimeout(this.showNewTier, this, 500);

            for (let i = 0; i < this._labbermodel.surprise_list.length; i++) {
                let item = new customui.BaseItem();
                item.x = 52 + this._item_posi;
                item.y = 388;
                this._item_posi += (item.width + 10);
                item.updateBaseItem(ClientType.BASE_ITEM, this._labbermodel.surprise_list[i].id);
                item.lb_num.visible = true;
                item.lb_num.text = this._labbermodel.surprise_list[i].num + "";
                this.reward_items.push(item);
                this.gp_content.addChild(this.reward_items[this.reward_items.length - 1]);


            }


        }

        public showNewTier() {

            this.showTierInfo(this._cur_tier, this._cur_lv, this._cur_star);

            if (this._cur_lv == this._labbermodel.new_lv && this._cur_star == this._labbermodel.new_star && this._cur_tier == this._labbermodel.new_tier) {
                if (this._result_timeId != 0) {
                    App.GlobalTimer.remove(this._result_timeId);
                    this._result_timeId = 0;
                }
                return;
            }// return;


            if (this._labbermodel.result == 0) {

                if (this._cur_star == 0) {
                    this._cur_star = 2;
                    if (this._cur_lv == 5) {
                        this._cur_lv = 1;
                        this._cur_tier--;
                    }
                    else {
                        this._cur_lv++;
                    }
                }
                else {
                    this._cur_star--;
                }

            }

            if (this._labbermodel.result == 1) {

                if (this._cur_star == 3) {
                    this._cur_star = 1;
                    if (this._cur_lv == 1) {
                        this._cur_lv = 5;
                        this._cur_tier++;
                    }
                    else {
                        this._cur_lv--;
                    }
                }
                else {
                    this._cur_star++;
                }

            }

            //egret.setTimeout(this.showNewTier, this, 2000);

        }

        private showTierInfo(tier: number, lv: number, stars: number) {

            //new tier
            for (let i = 0; i < this.tier_stars.length; i++) {
                if (i < stars)
                    this.tier_stars[i].visible = true;
                else
                    this.tier_stars[i].visible = false;
            }

            RES.getResAsync(GlobalUtil.getTierIcon(tier), (texture) => {
                this.img_tier.source = texture;
            }, this);

            this.lb_lv.text = lv + "";

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

            for (let i = 0; i < this.reward_items.length; i++) {
                this.gp_content.removeChild(this.reward_items[i]);
            }
            this.reward_items.splice(0);
            if (this._result_timeId != 0) {
                App.GlobalTimer.remove(this._result_timeId);
                this._result_timeId = 0;
            }
            App.Socket.send(13001, null);
        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
        }

    }
}