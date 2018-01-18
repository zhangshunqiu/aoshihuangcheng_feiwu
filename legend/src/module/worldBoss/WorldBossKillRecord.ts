/**
 * Author: liuyonggen
 * 世界boss击杀记录弹窗 2017/12/5
 */
module game {
    export class WorldBossKillRecord extends BaseView {
        public img_close: eui.Image;
        public lb_time0: eui.Label;
        public lb_kill0: eui.Label;
        public lb_score0: eui.Label;
        public lb_time1: eui.Label;
        public lb_kill1: eui.Label;
        public lb_score1: eui.Label;
        public lb_time2: eui.Label;
        public lb_kill2: eui.Label;
        public lb_score2: eui.Label;
        public lb_time3: eui.Label;
        public lb_kill3: eui.Label;
        public lb_score3: eui.Label;
        public lb_time4: eui.Label;
        public lb_kill4: eui.Label;
        public lb_score4: eui.Label;

        private _worldBossModel: WorldBossModel = WorldBossModel.getInstance();

        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
        }

        private updateView() {
            for(let i:number=0; i<5; i++) {
                if(i<this._worldBossModel.killRecord.length) {
                    let newDate = new Date(this._worldBossModel.killRecord[i].time * 1000);
                    let hour:any = newDate.getHours();
                    if(hour < 10) {
                        hour = "0" + hour;
                    }
                    let min: any = newDate.getMinutes();
                    if(min < 10) {
                        min = "0" + min;
                    }
                    this["lb_time"+i].text = hour + ":" + min ;
                    this["lb_kill"+i].text = this._worldBossModel.killRecord[i].nick;
                    this["lb_score"+i].text = this._worldBossModel.killRecord[i].score;
                } else {
                    this["lb_time"+i].visible = false;
                    this["lb_kill"+i].visible = false;
                    this["lb_score"+i].visible = false;
                } 
            } 
        }


        /**
		 * 打开窗口
		 */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            App.Socket.send(36003, {scene_id:openParam});
            App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_KILLRECORD_UPDATE, this.updateView, this);
        }

		/**
		 * 关闭窗口
		 */
        public closeWin(): void {
            super.closeWin();
        }

		/**
		 * 清理
		 */
        public clear(data: any = null): void {
            super.clear(data);
            App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_KILLRECORD_UPDATE);
        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
        }
    }
}