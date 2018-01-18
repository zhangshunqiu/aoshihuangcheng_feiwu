/**
 * module : 广播视图
 * author : zrj
*/
module game {
	export class BroadcastView extends BaseView {
		public gp_main: eui.Group;
		public img_bg: eui.Image;
		public lb_content: RichTextField;
		public rect_mask: eui.Rect;
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
			this.y = App.stageHeight/4-30;
		}
		protected childrenCreated() {
			super.childrenCreated();
			this.gp_main.mask = this.rect_mask;
			this.lb_content = new RichTextField();
			this.addChild(this.lb_content);
			this.lb_content.size = 24;
			this.lb_content.x = this.gp_main.x + 10;
			this.lb_content.y = 9;

		}

		private play(data:any) {
			this.lb_content.x = this.gp_main.width + 10;
			if(typeof(data) == "string"){
				this.lb_content.textHtml = "<font fontfamily=\"SimHei\" color=0xbfbfbf >"+data+"</font>";
			}else if(typeof(data) == "object"){
				this.lb_content.textFlow = data;
			}
			let speed = App.ConfigManager.getConstConfigByType("CHAT_ROLL_SPEED").value;
			egret.Tween.removeTweens(this);
			egret.Tween.get(this.lb_content).to({ x: -this.lb_content.width },(this.lb_content.width+520)*speed/3000).call(function () {
				this.playComplete();
			}, this);
		}

		private playComplete() {
			GlobalTips.getInstance().removeBroadcastTips();
		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			this.play(openParam);
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
			super.clear()
			egret.Tween.removeTweens(this);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}
}