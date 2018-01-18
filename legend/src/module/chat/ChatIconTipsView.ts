/**
 * Author: lihe
 * Email： hersletter@qq.com
 *  2017/06/20.
 * 聊天查看屏蔽界面
 */
module game {

    /**
     *  
     */
	export class ChatIconTipsView extends BaseView {
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}
		public btn_view;
		public btn_deny;
		public gp_item;
		public rect_bg;
		private _chatModel: ChatModel = ChatModel.getInstance();

		protected childrenCreated() {
			super.childrenCreated();

			this.rect_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

				(ChatModel.getInstance() as ChatModel).selectPlayerName = "";
				(ChatModel.getInstance() as ChatModel).selectPlayerId = 0;
				App.WinManager.closeWin(WinName.CHAT_ICON_TIP);
			}, this);

			this.btn_view.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                 App.WinManager.openPopWin(WinName.POP_PLAYER_MSG, this._chatModel.selectPlayerId);
			}, this);

			this.btn_deny.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

				let okCB = function (selected) {
					App.Socket.send(17004, { player_id: this._chatModel.selectPlayerId });
				}
				let textFlow = [{ text: "是否屏蔽玩家", style: { textColor: 0xee3b01, size: 20 } },
				{ text: this._chatModel.selectPlayerName + "\n", style: { underline: true, textColor: 0x01acfe, size: 20 } },
				{ text: "提示：屏蔽只对此次登陆有效", style: { textColor: 0xf87500, size: 18 } }];
				App.GlobalTips.showAlert({ style: AlertTipsStyle.COMMON, textFlow: textFlow, okCB: okCB, context: this, needCheckBox: false });
			}, this);


		}

		/**
				 * 打开窗口
				*/
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (openParam && openParam.x) {
				this.gp_item.x = openParam.x;
			}
			if (openParam && openParam.y) {
				this.gp_item.y = openParam.y;
			}
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

		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}

	}


}