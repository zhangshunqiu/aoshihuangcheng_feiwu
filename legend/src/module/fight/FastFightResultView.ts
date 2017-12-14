/**
 * module : 快速战斗结算
 * author : zrj
*/
module game {
    export class FastFightResultView extends BaseView {
        public img_close : eui.Image;
        public lb_info : eui.Label;
        public lb_get : eui.Label;

        private _data : any;
        public constructor(info) {
            super();
            this.skinName = "FastFightResultSkin";
            this._data = info;
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
        }

        public initView() {
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
                PopUpManager.removePopUp(this);
            },this);
            let textArray = [];
            let sceneInfo = App.ConfigManager.getSceneConfigById(this._data.scene_id);
            textArray.push({text:"快速战斗时长：",style:{textColor:0xbfbfbf}},{text: GlobalUtil.getFormatBySecond1(this._data.time*60) + "\n",style:{textColor:0xbfbfbf}});
            textArray.push({text:"快速战斗地图：",style:{textColor:0xbfbfbf}},{text:sceneInfo.name+ "\n",style:{textColor:0xbfbfbf}});
            textArray.push({text:"快速战斗获得经验：",style:{textColor:0xbfbfbf}},{text:this._data.exp+ "\n",style:{textColor:0xbfbfbf}});
            textArray.push({text:"快速战斗获得金币：",style:{textColor:0xbfbfbf}},{text:this._data.coin+ "\n",style:{textColor:0xbfbfbf}});
            this.lb_info.lineSpacing = 14;
            this.lb_info.textFlow = textArray;

            let equipArray = [];
            let temp = {};
            equipArray.push({text:"快速战斗获得装备： ",style:{textColor:0xbfbfbf}});
            for(let k in this._data.list) {
                let data = this._data.list[k];
                let info = App.ConfigManager.equipConfig()[data.id];
                if (temp[info.limit_lvl]) {
                    if (temp[info.limit_lvl][info.quality]) {
                        temp[info.limit_lvl][info.quality] += data.num;
                    } else {
                        temp[info.limit_lvl][info.quality] = data.num;
                    }
                } else {
                    temp[info.limit_lvl] = {};
                    temp[info.limit_lvl][info.quality] = data.num;
                }
            }
            for(let k in temp) {
                for (let j in temp[k]){
                    equipArray.push({text:k+"级"+ConstColorName[j]+"装备*"+temp[k][j]+"\n",style:{textColor:ConstTextColor[j]}});
                    equipArray.push({text:"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"});
                }
            }
            this.lb_get.lineSpacing = 14;
            this.lb_get.textFlow = equipArray;
        }

        /**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(callback): void {
			super.closeWin(callback);
		}
        
        public clear() {
            super.clear();
        }

        public destroy() {
            super.destroy();
        }
    }
}