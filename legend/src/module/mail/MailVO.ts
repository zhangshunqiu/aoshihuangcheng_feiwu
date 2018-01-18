module game {
	export class MailVO {
		public id:string;
		public Theme:string;
		public Time:string;
		public isRead:boolean;//1已读 0未读
		public content:string;
		public reward:eui.ArrayCollection;//邮件附件
		public rewardState:boolean;//1已领 0未领

		public constructor(id,theme,time,isRead,content,reward:eui.ArrayCollection,rewardState) {
			this.id = id;
			this.Theme = theme;
			this.Time = time;
			this.isRead = isRead;
			this.content = content;
			this.reward = reward;
			this.rewardState = rewardState;
		}

		
		public static objToVo(dataObj):MailVO
		{	
			if(dataObj.conf_id == 0) {
				var mailTitle:string = dataObj.title;
				var mailContent:string = dataObj.content;
				var rewardArr:eui.ArrayCollection = new eui.ArrayCollection();
				var rewardList = dataObj.attachment_list;
				if(rewardList.length >=0)
				{
					for(var i:number=0;i<rewardList.length;i++)
					{	
						var type = rewardList[i].type;
						var good_id = rewardList[i].id;
						var num = rewardList[i].num;
						rewardArr.addItem(new MailRewardVO(type,good_id,num));
					}
				}
				var mailVo:MailVO = new MailVO(dataObj.id,mailTitle,MailModel.formatDate(dataObj.time),dataObj.state,mailContent,rewardArr,dataObj.attachment_state);
				return mailVo;
			}else {
				var mailConfig = ConfigManager.getInstance().getMailInfoById(dataObj.conf_id);
				var mailTitle:string = mailConfig.title;
				var mailContent:string = MailVO.getMailContent(mailConfig,dataObj.args);
				var rewardArr:eui.ArrayCollection = new eui.ArrayCollection();
				var rewardList = dataObj.attachment_list;
				if(rewardList.length >=0)
				{
					for(var i:number=0;i<rewardList.length;i++)
					{	
						var type = rewardList[i].type;
						var good_id = rewardList[i].id;
						var num = rewardList[i].num;
						rewardArr.addItem(new MailRewardVO(type,good_id,num));
					}
				}
				var mailVo:MailVO = new MailVO(dataObj.id,mailTitle,MailModel.formatDate(dataObj.time),dataObj.state,mailContent,rewardArr,dataObj.attachment_state);
				return mailVo;
			}
		}

		/**
		 * 读表配置
		 */
		private static getMailContent(mailConfig:Object,args:Array<any>):string
		{	
			if(args.length <= 0)
			{
				return mailConfig["content"];
			}else{
				var _content1:string = mailConfig["content"];
				var argsNum:number =0
				var _content2:string = _content1.replace(/%s/g,function(word){
					  return args[argsNum++];
				})
				var content:string = _content2.replace(/#[^#]+#/g,function(word){
					 return "<font size=24 color="+ ConstMailColor[word.substring(1,2)] +">" + word.slice(2,-1) + "</font>";
				})
				return "<font size=24>" + content + "</font>";
			}
		}
	}

	export class MailRewardVO {
		public type : number; //类型 
        public good_id : number; //物品id
        public num : number; //数量

        public constructor(type,good_id,num) {
			this.type = type;
			this.good_id = good_id;
			this.num = num;
        }
	}

}