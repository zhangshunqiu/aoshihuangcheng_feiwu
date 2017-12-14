module game {
	export class ChatModel extends BaseModel {

		public chatAllList: Array<any> = [];  //
		public chatGuildList: Array<any> = [];  //
		public chatWorldList: Array<any> = [];  //
		public chatSystemList: Array<any> = [];  //
		public EquipInfo:any = {};



		public constructor() {
			super();
		
		}

		public clear() {
			super.clear();
		}

		public destroy() {
			super.destroy();
		}

		public getChatList(data) {

			switch (data.channel-1) {

				case ChatType.ALLCHAT:

					for (let i = 0; i < data.msg_list.length; i++) {
						let cv = this.getChatVo(data.channel, data.msg_list[i]);
						this.chatAllList.push(cv);
					}
					break;
				case ChatType.WORLD:

					for (let i = 0; i < data.msg_list.length; i++) {
						let cv = this.getChatVo(data.channel, data.msg_list[i]);
						this.chatWorldList.push(cv);
					}
					break;
				case ChatType.GUILD:

					for (let i = 0; i < data.msg_list.length; i++) {
						let cv = this.getChatVo(data.channel, data.msg_list[i]);
						this.chatGuildList.push(cv);
					}
					break;
				case ChatType.SYSTEM:

					for (let i = 0; i < data.msg_list.length; i++) {
						let cv = this.getChatVo(data.channel, data.msg_list[i]);
						this.chatSystemList.push(cv);
					}
					for (let i = this.chatSystemList.length - 1; i >= 0; i--) {
						GlobalTips.getInstance().showBroadcastTips(this.chatSystemList[i].content);
					}
					break;
			}

			
		}
		public getOneChat(data) {

			let cv = this.getChatVo(data.channel, data.msg);
			//this.chatAllList.unshift(cv);
			this.chatAllList.push(cv);
			if (this.chatAllList.length > 50) {
				this.chatAllList.pop();
			}
			switch (cv.type) {
				case ChatType.WORLD:
					//this.chatWorldList.unshift(cv);最后改的新bug
					this.chatWorldList.push(cv);
					if (this.chatWorldList.length > 50) {
						this.chatWorldList.pop();
					}
					break;
				case ChatType.GUILD:
					//this.chatGuildList.unshift(cv);
					this.chatGuildList.push(cv);
					if (this.chatGuildList.length > 50) {
						this.chatGuildList.pop();
					}
					break;
				case ChatType.SYSTEM:
				    //this.chatGuildList.unshift(cv);
					this.chatSystemList.push(cv);
					if (this.chatSystemList.length > 20) {
						this.chatSystemList.pop();
					}
					GlobalTips.getInstance().showBroadcastTips(cv.content);
					break;
			}

		}

		public getChatVo(channel, msg): ChatVo {

			let cv: ChatVo = new ChatVo();
			cv.type = msg.channel - 1;
			cv.channel = channel;
			cv.player_id = msg.player_id;
			cv.player_name = msg.player_name;
			cv.sex = msg.sex;
            cv.career = msg.career;
			cv.position_id = msg.position_id;
			cv.vip_id = msg.vip_id;
			cv.is_monthcard = (msg.month_card==1);
			cv.time = msg.time;
			cv.content = msg.content;
			cv.config_id = msg.config_id;
			cv.args = msg.args;
			return cv;
			//cv.player_id
		}


		public getEquipInfo(data){
            this.EquipInfo = data;

		}
	}
}