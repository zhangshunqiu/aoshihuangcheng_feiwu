module game {
	export class MailVO {
		public id:string;
		public Theme:string;
		public Time:string;
		public isRead:boolean;
		public content:string;
		public reward:eui.ArrayCollection;

		public constructor(id,theme,time,isRead,content,reward:eui.ArrayCollection) {
			this.id = id;
			this.Theme = theme;
			this.Time = time;
			this.isRead = isRead;
			this.content = content;
			this.reward = reward;
		}

		/**
		 * 收到邮件
		 *  message pbMail{
				optional int32 id			= 1;	// 邮件id
				optional int32 conf_id		= 2;	// 配置id
				repeated string	args		= 3;	// 参数
				repeated pbGood attachment_list = 4;	// 附件
				optional int32 attachment_state	= 5;	// 附件状态 （0未领取， 1已领取）
				optional int32 time			= 6;	// 时间（时间戳）
			}

			// 附件结构
			message attachment{
				optional int32 type	= 1;	// 类型（1物品 2装备）
				optional int32 id	= 2;	// 物品id/装备id
				optional int32 num	= 3;	// 数量
			}
		 */
		public static objToVo(dataObj):MailVO
		{	
			var mailConfig = ConfigManager.getInstance().getMailInfoById(dataObj.conf_id);
			var mailTitle:string = mailConfig.title;
			var mailContent:string = MailVO.getMailContent(mailConfig,dataObj.args);
			// var mailContent:string = mailConfig.content;
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
			var mailVo:MailVO = new MailVO(dataObj.id,mailTitle,MailModel.formatDate(dataObj.time),dataObj.attachment_state,mailContent,rewardArr);
			return mailVo;
		}

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
					//  console.log(mailColor[word.substring(1,2)]);
					 return "<font size=24 color="+ ConstMailColor[word.substring(1,2)] +">" + word.slice(2,-1) + "</font>";
				})
				//  console.log("<font size=24>" + content + "</font>");
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