module game {
	export class ChatView extends BaseView {
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		// public img_close: eui.Image;
		public commonWin: customui.CommonWin;
		public img_emoji: eui.Image;
		public img_send: eui.Image;
		public tabbar: eui.TabBar;
		public scroller: eui.Scroller;
		public scr_group: eui.Group;
		public inp_textf: eui.TextInput;
		public lb_notalk: eui.Label;
		public eff_newchat: AMovieClip;
		public item_list: Array<any> = [];
		private _nextposiy: number = 0;
		private _lastitemheight: number;
		private _chatModel: ChatModel = ChatModel.getInstance();
		private _sendchat: string;
		private _sendtime: number;
		private _selecttype: ChatType;
		private _allchatlog: string = "";
		private _worldchatlog: string = "";
		private _guildchatlog: string = "";
		private _eventid_onechat: number = 0;

		protected childrenCreated() {
			super.childrenCreated();
			RES.getResAsync("chat_liaotian_title_png", (texture) => {
				this.commonWin.img_title.texture = texture;
			}, this);

			this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.CHAT);
			}, this);

			this.initView();
		}

		private initView() {
			this.img_emoji.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.loglh(" emoji！ ")
				// this.eff_newchat = new AMovieClip();
				// this.addChild(this.eff_newchat);
				// this.eff_newchat.x += 360;
				// this.eff_newchat.y+= 680;	
				// this.eff_newchat.playMCKey("effxxts");
				// egret.setTimeout(()=>{this.removeChild(this.eff_newchat);},this,3000);

			}, this);

			this.img_send.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this.chatInputCheck(this.inp_textf.text)
			}, this);
			this.inp_textf.maxChars = 41;
			this.inp_textf.text = "";

			let data = ["全部", "世界", /*"公会",*/ "系统"];
			this.tabbar.dataProvider = new eui.ArrayCollection(data);
			this.tabbar.addEventListener(eui.ItemTapEvent.ITEM_TAP, (event: eui.ItemTapEvent) => {
				this.changedChatType(event.itemIndex);
			}, this);
			this.tabbar.selectedIndex = 0;
			this._selecttype = ChatType.ALLCHAT;
			this.scroller.viewport = this.scr_group;
			this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
			this.updateChatList();
		}


        /**
		 * 发送消息
		 */
		private chatInputCheck(sendtext: string) {
			if (this.inp_textf.text.length == 0) {
				return;
			}
			;

			if (Date.now() - this._sendtime < 3000) {
				App.GlobalTips.showAlert({ style: BaseTipsStyle.ONLY_OK, content: "勇士您说话太快，喝口水再说吧" });
				return;
			}
			if (this.inp_textf.text == this._sendchat) {

				App.GlobalTips.showAlert({ style: BaseTipsStyle.ONLY_OK, content: "禁止发送重复信息" });
				return;
			}

			if (this._selecttype == ChatType.GUILD) {
				App.Socket.send(17002, { channel: ChatType.GUILD + 1, content: App.ConfigManager.getSensitiveWordCheck(this.inp_textf.text) });
			}
			else {

				App.Socket.send(17002, { channel: ChatType.WORLD + 1, content: App.ConfigManager.getSensitiveWordCheck(this.inp_textf.text) });

			}
			this._sendtime = Date.now();
			//setTimeout(() => { this._sendingFlag = false }, 3000);
			this._sendchat = this.inp_textf.text;
			this.inp_textf.text = "";

		}


		/**
		 * 列表显示逻辑
		 */
		//
		public updateChatList() {
			this.changedChatType(this._selecttype);
		}
		private changedChatType(index) {


			if (index != this._selecttype) {
				//清理scroll 
				this._nextposiy = 0;
				this.scroller.viewport.scrollV = 0;
				this.clearChatList();
				//保留输入文字

				switch (this._selecttype) {
					case ChatType.ALLCHAT:
						this._allchatlog = this.inp_textf.text;
						break;
					case ChatType.WORLD:
						this._worldchatlog = this.inp_textf.text;
						break;
					case ChatType.GUILD:
						this._guildchatlog = this.inp_textf.text;
						break;
				}

			}

			switch (index) {
				case ChatType.WORLD:
					this.inp_textf.text = this._worldchatlog;
					this.updateChatByList(this._chatModel.chatWorldList);
					break;
				case ChatType.GUILD:
					this.inp_textf.text = this._guildchatlog;
					this.updateChatByList(this._chatModel.chatGuildList);
					break;
				case ChatType.SYSTEM:

					this.updateChatByList(this._chatModel.chatSystemList);
					break;
				default:
					this.inp_textf.text = this._allchatlog;
					this.updateChatByList(this._chatModel.chatAllList);
			}
			if (index == ChatType.SYSTEM) {
				this.inp_textf.visible = false;
				this.lb_notalk.visible = true;
				//this.inp_textf.prompt = "<color=#EE3B01FF>           系统频道禁止发言</color>";
			}
			else {
				this.inp_textf.visible = true;
				this.lb_notalk.visible = false;
				//this.inp_textf.prompt = "<color=#BFBFBFFF>           请输入聊天内容</color>";
			}
			this._selecttype = index;
		}
		private clearChatList() {

			for (let i = 0; i < this.item_list.length; i++) {
				this.scr_group.removeChild(this.item_list[i]);
			}

			this.item_list.splice(0);
		}
		private updateChatByList(chatinfolist: Array<any>) {

			//if()
			for (let i = 0; i < chatinfolist.length; i++) {
				if ((chatinfolist[i] as ChatVo).player_id == 0) {
					let item = new ChatTextItem();
					item.updateInfo(chatinfolist[i]);
					this.scr_group.addChild(item);
					item.$setY(this._nextposiy);
					this._nextposiy += item.item_height;
					this._lastitemheight = item.item_height;
					this.item_list.push(item);
				}
				else {
					let item = new ChatItem();
					item.updateInfo(chatinfolist[i]);
					this.scr_group.addChild(item);
					item.$setY(this._nextposiy);
					this._nextposiy += item.item_height;
					this.item_list.push(item);
					this._lastitemheight = item.item_height;

				}

			}
			this.scroller.viewport.scrollV = this._nextposiy - this.scroller.height;
		}
		//endregion	


		//region 新消息的加入

		/**
		* 刷新ui
		*/
		public updateOneChat(data) {
			if ((data.channel - 1) == this._selecttype || this._selecttype == ChatType.ALLCHAT) {
				if (data.player_id == 0) {
					this.addOneSystemInfo(data);
				}
				else {
					this.addOneNewChat(data);
				}
				if (data.player_id == RoleManager.getInstance().roleInfo.playerId)
					this.scroller.viewport.scrollV = this._nextposiy - this.scroller.height;
				else {
					if (this.eff_newchat == null) {
						this.eff_newchat = new AMovieClip();
						this.addChild(this.eff_newchat);
						this.eff_newchat.x += 360;
						this.eff_newchat.y += 680;
					}
					this.eff_newchat.visible = true;
					this.eff_newchat.playMCKey("effxxts", "", 30, null, () => {
						this.eff_newchat.frameRate = 8;

					}
						, this);
					if (this.eff_newchat.hasEventListener(egret.Event.LOOP_COMPLETE) == false) {
						this.eff_newchat.addEventListener(egret.Event.LOOP_COMPLETE, this.playEffComplete, this);
					}
				}
			}
		}

		private playEffComplete(e: egret.Event) {
			if (this.eff_newchat) {
				this.eff_newchat.removeEventListener(egret.Event.LOOP_COMPLETE, this.playEffComplete, this);
			}
			this.eff_newchat.visible = false;
		}

		private addOneNewChat(info: ChatVo) {
			var item = new ChatItem();
			item.updateInfo(info);
			this.scr_group.addChild(item);
			item.$setY(this._nextposiy);
			this._nextposiy += item.item_height;

			this.item_list.unshift(item);


		}
		private addOneSystemInfo(info) {
			var item = new ChatTextItem();
			item.updateInfo(info);
			this.scr_group.addChild(item);
			item.$setY(this._nextposiy);
			this._nextposiy += item.item_height;
			//  for(let i= 0;i<this.item_list.length;i++)
			//  {
			//    (this.item_list[i] as ChatTextItem).y+=item.item_height;
			//  }
			this.item_list.unshift(item);

		}
		//endregion

        /**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			// App.Socket.send(16001,{});
			if (this._eventid_onechat == 0) {
				this._eventid_onechat = App.EventSystem.addEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this.updateOneChat, this);
			}
			App.BtnTipManager.setTypeValue(ConstBtnTipType.CHAT, false);
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
			if (this._eventid_onechat != 0) {
				App.EventSystem.removeEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this._eventid_onechat);
				this._eventid_onechat = 0;
			}
			if (this.eff_newchat) {
				this.eff_newchat.destroy();
				this.removeChild(this.eff_newchat);
				this.eff_newchat = null;
			}
			if (this.eff_newchat) {
				this.eff_newchat.removeEventListener(egret.Event.LOOP_COMPLETE, this.playEffComplete, this);
			}
		}
		/**
		 * 销毁
		 */
		public destroy(): void {

		}
	}

	export class ChatItem extends eui.ItemRenderer {

		public lb_name: eui.Label;
		public lb_content: eui.Label;
		public lb_vip: eui.BitmapLabel;
		public img_icon: eui.Image;
		public img_vip: eui.Image;
		public chat_type: ChatType;
		public chat_id: number;
		public item_height: number = 112;
		public gp_text: eui.Group;
		public img_monthcard: eui.Image;
		//private _chatModel: ChatModel = ChatModel.getInstance();

		public constructor() {
			super();
			this.skinName = "ChatItemSkin";
		}

		public dataChanged() {

			this.updateInfo(this.data);
		}

		public updateInfo(info: ChatVo) {

			this.chat_type = info.type;
			this.lb_name.text = info.player_name;
			this.lb_content.text = info.content;
			if (!info.is_monthcard) {
				this.gp_text.x -= 25;//没有月卡文字要左移
				this.img_vip.visible = false;

			}
			else {
				this.img_vip.visible = true;
			}

			if (info.vip_id > 0) {
				this.img_vip.visible = true;
				this.lb_vip.visible = true;
				this.lb_vip.text = info.vip_id + "";
			}
			else {
				this.img_vip.visible = false;
				this.lb_vip.visible = false;
			}
			RES.getResAsync(App.ConfigManager.getSmallHeroIconBySexAndJob(info.sex, info.career), (texture) => {
				this.img_icon.source = texture;
			}, this);
		}
	}

	export class ChatTextItem extends eui.ItemRenderer {
		public lb_content: eui.Label;
		public img_system: eui.Image;
		public img_notice: eui.Image;
		public img_line: eui.Image;
		public item_height: number = 66;
		public constructor() {
			super();
			this.skinName = "ChatTextItemSkin";
		}
		public dataChanged() {

			this.updateInfo(this.data);
		}

		public updateInfo(info) {

			if (info.type == ChatType.GUILD) {
				this.img_system.visible = false;
			}
			else {
				this.img_notice.visible = false;
			}
			// if()//}
			// {
              //  this.lb_content.textFlow = GlobalUtil.getChatPortText
			// }
			// else
			// this.lb_content.text = info.content;
             
			//保证两行的位置
			// if(this.lb_content.numLines>0)   //防止出现负数
			// {
			this.item_height = 30 * (this.lb_content.numLines) + 66;
			this.img_line.y += 30 * (this.lb_content.numLines);
			//}

		}


		  public static getChatSystemText(config_id:number,args:Array<any>){
           
         let info =   App.ConfigManager.getSystemChatByID(config_id);

         return <Array<egret.ITextElement>>[ ];
    }


	}


}
