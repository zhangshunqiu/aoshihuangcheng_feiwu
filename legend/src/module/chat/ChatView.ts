module game {
	export class ChatView extends BaseView {
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		// public img_close: eui.Image;
		public commonWin: customui.CommonWin;
		public img_emoji: eui.Image;
		public img_send: eui.Image;
		//public tabbar: eui.TabBar;
		public rb_all: eui.RadioButton;
		public rb_world: eui.RadioButton;
		public rb_system: eui.RadioButton;
		public scroller: eui.Scroller;
		public scr_group: eui.Group;
		public inp_textf: eui.TextInput;
		public lb_notalk: eui.Label;
		public eff_newchat: AMovieClip;
		public item_list: Array<any> = [];
		private _nextposiy: number = 0;
		private _chatModel: ChatModel = ChatModel.getInstance();
		private _sendchat: string;
		private _sendtime: number;
		private _selecttype: ChatType;
		private _allchatlog: string = "";
		private _worldchatlog: string = "";
		private _guildchatlog: string = "";
		private _eventid_onechat: number = 0;
		private _show_id: number = 0;

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

			var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
			radioGroup.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
				var radioGroup: eui.RadioButtonGroup = evt.target;
				this.changedChatType(radioGroup.selectedValue);
			}, this);
			this.rb_all.group = radioGroup;
			this.rb_all.value = 0;
			this.rb_all.label = "全部";
			this.rb_all.selected = true;
			this.rb_world.group = radioGroup;
			this.rb_world.label = "世界";
			this.rb_world.value = 1;
			this.rb_system.group = radioGroup;
			this.rb_system.label = "系统";
			this.rb_system.value = 3;
			// let data = ["全部", "世界", /*"公会",*/ "系统"];
			// this.tabbar.dataProvider = new eui.ArrayCollection(data);
			// this.tabbar.addEventListener(eui.ItemTapEvent.ITEM_TAP, (event: eui.ItemTapEvent) => {
			// 	this.changedChatType(event.itemIndex);
			// }, this);
			// this.tabbar.selectedIndex = 0;

			this.scroller.viewport = this.scr_group;
			this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

		}


        /**
		 * 发送消息
		 */
		private chatInputCheck(sendtext: string) {
			if (this.inp_textf.text.length == 0 || (this.inp_textf.text.trim()).length == 0) {
				return;
			}
			;

			if (Date.now() - this._sendtime < 3000) {
				//App.GlobalTips.showAlert({ style: AlertTipsStyle.ONLY_OK, content: "勇士您说话太快，喝口水再说吧" });
				let text = [{ text: "勇士您说话太快，喝口水再说吧", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }]
				App.GlobalTips.showTips(text);

				return;
			}
			if (this.inp_textf.text == this._sendchat) {

				//App.GlobalTips.showAlert({ style: AlertTipsStyle.ONLY_OK, content: "禁止发送重复信息" });
				let text = [{ text: "禁止发送重复信息", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }]
				App.GlobalTips.showTips(text);
				return;
			}
			let word = this.inp_textf.text;
			if (this._show_id > 0) {

				let equip = App.ConfigManager.getEquipById(this._show_id);//App.ConfigManager.itemConfig()[this._show_id];	
				word = this.inp_textf.text.replace("[" + equip.name + "]", "<font href = \"event:equip_" + this._show_id + "\">[" + equip.name + "]</font>");
			}

			if (this._selecttype == ChatType.GUILD) {
				App.Socket.send(17002, { channel: ChatType.GUILD + 1, content: App.ConfigManager.getSensitiveWordCheck(word) });
			}
			else {

				App.Socket.send(17002, { channel: ChatType.WORLD + 1, content: App.ConfigManager.getSensitiveWordCheck(word) });

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
					this.addOneSystemInfo(chatinfolist[i]);
				}
				else {
					this.addOneNewChat(chatinfolist[i]);
				}

			}
			if (this._nextposiy <= this.scroller.height)
				this.scroller.viewport.scrollV = 0;
			else
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
				if (data.player_id == RoleManager.getInstance().roleInfo.playerId) {
					if (this._nextposiy <= this.scroller.height)
						this.scroller.viewport.scrollV = 0;
					else
						this.scroller.viewport.scrollV = this._nextposiy - this.scroller.height;
				}//this.scroller.viewport.scrollV = this._nextposiy - this.scroller.height;
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
			item.belong_scroller = this.scroller;
			item.$setY(this._nextposiy);
			this._nextposiy += item.item_height;

			this.item_list.unshift(item);

			if (this.item_list.length > 50) {
				for (let i = 0; i < this.item_list.length; i++) {
					this.item_list[i].y -= this.item_list[this.item_list.length - 1].height;
				}
				this._nextposiy -= this.item_list[this.item_list.length - 1].height;
				this.scr_group.removeChild(this.item_list[this.item_list.length - 1]);
				this.item_list.pop();
			}

		}
		 private addOneSystemInfo(info) {
			var item = new ChatTextItem();
			item.updateInfo(info);
			this.scr_group.addChild(item);
			item.$setY(this._nextposiy);
			this._nextposiy += item.item_height;

			this.item_list.unshift(item);

			if (this.item_list.length > 50) {
				for (let i = 0; i < this.item_list.length; i++) {
					this.item_list[i].y -= this.item_list[this.item_list.length - 1];
				}
				this._nextposiy -= this.item_list[this.item_list.length - 1].height;
				this.scr_group.removeChild(this.item_list[this.item_list.length - 1]);
				this.item_list.pop();
			}
		}
		//endregion

        /**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
		
			if (this._eventid_onechat == 0) {
				this._eventid_onechat = App.EventSystem.addEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this.updateOneChat, this);
			}

			this._selecttype = -1;
			this.changedChatType(ChatType.ALLCHAT);

			App.BtnTipManager.setTypeValue(ConstBtnTipType.CHAT, false);

			//装备展示
			// if (openParam && openParam.show_id) {
			// 	this._show_id = openParam.show_id;
			// 	let equip = App.ConfigManager.getEquipById(this._show_id);//App.ConfigManager.itemConfig()[this._show_id];
			// 	this.inp_textf.text = "[" + equip.name + "]";

			// } else {
			// 	this._show_id = 0;
			// }


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
				this.eff_newchat.stop();
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
		public lb_content: RichTextField;
		public lb_vip: eui.BitmapLabel;
		public img_icon: eui.Image;
		public img_vip: eui.Image;
		public chat_type: ChatType;
		public chat_id: number;
		public item_height: number = 112;
		public gp_text: eui.Group;
		public img_monthcard: eui.Image;
		public belong_scroller: eui.Scroller;
		//private _iconTips: ChatIconTipsView;
		private _chatModel: ChatModel = ChatModel.getInstance();
		public info: ChatVo;

		public constructor() {
			super();
			this.skinName = "ChatItemSkin";
			this.lb_content = new RichTextField();
			this.addChild(this.lb_content);
			this.lb_content.x = 122;
			this.lb_content.y = 53;
			this.lb_content.width = 420;
			this.img_icon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.viewIconTips, this);

		}

		public dataChanged() {

			this.updateInfo(this.data);
		}

		public updateInfo(info: ChatVo) {

			this.info = info;
			this.chat_type = info.type;
			this.lb_name.text = info.player_name;
			this.lb_content.textHtml = "<font fontfamily=\"SimHei\" color=0xbfbfbf size = 24>" + info.content + "</font>";
			if (!info.is_monthcard) {
				this.gp_text.x -= 36;//没有月卡文字要左移
				this.img_monthcard.visible = false;

			}
			else {
				this.img_monthcard.visible = true;
			}

			if (info.vip_id > 0) {
				this.img_vip.visible = true;
				this.lb_vip.visible = true;
				this.lb_vip.text = info.vip_id + "";
			}
			else {
				this.lb_name.x -= 105;
				this.img_vip.visible = false;
				this.lb_vip.visible = false;
			}

			let str: string = App.ConfigManager.getSmallHeroIconBySexAndJob(info.sex, info.career);

			RES.getResAsync(App.ConfigManager.getSmallHeroIconBySexAndJob(info.sex, info.career) + "_png", (texture) => {
				this.img_icon.source = texture;
			}, this);
		}

		public viewIconTips() {

			if (this.info.player_id != RoleManager.getInstance().roleInfo.playerId) {
				this._chatModel.selectPlayerName = this.info.player_name;
				this._chatModel.selectPlayerId = this.info.player_id;
				App.WinManager.openWin(WinName.CHAT_ICON_TIP, { x: 150, y: this.y + this.height - this.belong_scroller.viewport.scrollV });
			}


		}

	}

	export class ChatTextItem extends eui.ItemRenderer {
		public lb_content: RichTextField;
		public img_system: eui.Image;
		public img_notice: eui.Image;
		public img_line: eui.Image;
		public item_height: number = 66;
		public constructor() {
			super();
			this.skinName = "ChatTextItemSkin";
			this.lb_content = new RichTextField();
			this.addChild(this.lb_content);
			this.lb_content.x = 125;
			this.lb_content.y = 25;
			this.lb_content.width = 420;
			this.lb_content.size = 24;
			this.lb_content.lineSpacing = 3;
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

			if (info.config_id > 0) {

				this.lb_content.textHtml = ChatUtil.getSystemEventText(info.config_id, info.args);
			}
			else
				this.lb_content.textHtml = "<font fontfamily=\"SimHei\" color=0xbfbfbf size = 20>" + info.content + "</font>";

			//保证两行的位置
			// if(this.lb_content.numLines>0)   //防止出现负数
			// {
			this.item_height = this.lb_content.height + 66;//30 * (this.lb_content.numLines) + 66;
			this.img_line.y += this.lb_content.height;//30 * (this.lb_content.numLines);
			this.height = this.lb_content.height + 66;
			//}

		}


	}




}
