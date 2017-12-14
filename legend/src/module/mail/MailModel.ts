/**
* Author: yangyipeng
* Email： hersletter@qq.com
* 邮件数据层 2017/06/20.
*/
module game {
	export class MailModel extends BaseModel{

		private _mailArr:Array<MailVO> = [];


		public constructor() {
			super();
		}
		/**
		 * 收到所有邮件
		 */
		public receiveMails(mailsData):void
		{
			this._mailArr = [];
			for(var i:number=0;i<mailsData.mail_list.length;i++)
			{
				this._mailArr.push(MailVO.objToVo(mailsData.mail_list[i]));
			}
		}


		public hasNoReadMail():Boolean{
			for(var i:number=0;i<this._mailArr.length;i++){
				var vo:MailVO = this._mailArr[i];
				if(vo.isRead == false){
					return true;
				}
			}
			return false;
		}

		/**
		 * 收到单条邮件
		 */
		public receiveSingleMail(mailData):void
		{	
			// *  message pbMail{
			// 	optional int32 id			= 1;	// 邮件id
			// 	optional string title		= 2;	// 标题
			// 	optional int32 content		= 3;	// 内容
			// 	repeated pbGood attachment_list = 4;	// 附件
			// 	optional int32 				= 5;	// 附件状态 （0未领取， 1已领取）
			// 	optional int32 time			= 6;	// 时间（时间戳）
			// }

			var mailVo:MailVO = MailVO.objToVo(mailData);
			this._mailArr.unshift(mailVo);
			
			// this._mailArr.addItemAt(mailVo,0);
			// this._mailArr.itemUpdated(mailVo);
			// this._mailArr.refresh();
		}

		/**
		 * 改变某条邮件的状态（未读=>已读）
		 */
		public readMail(id):void
		{	
			for(var i:number=0;i<this._mailArr.length;i++)
			{
				var mailArrItem:MailVO = this._mailArr[i];
				if(id == mailArrItem.id)
				{
					mailArrItem.isRead = true;
					break;
				}
			}
			App.EventSystem.dispatchEvent(PanelNotify.MAIL_INFO_UPDATE);
			
		}
		
		/**
		 * 处理一键领取
		 */
		public mailAttachBundle(data):void
		{
		
			
			for(var i:number=0;i<data.id_list.length;i++)
			{
				this.mailAttachSingle(data.id_list[i].id);
			}

		}


		/**
		 * 改变某条邮件的状态(未领取=>已领取)
		 */
		public mailAttachSingle(id):void
		{	
			for(var i:number=0;i<this._mailArr.length;i++)
			{
				var mailArrItem:MailVO = this._mailArr[i];
				if(id == mailArrItem.id)
				{
					mailArrItem.isRead = true;
					break;
				}
			}
			
		}

		public get mailArr():Array<any>
		{	
			var count = Math.floor(this._mailArr.length /6);
			var arr = [];
            for (var i = 0; i < count; i++) 
			{
                arr.push(this._mailArr.slice(i * 6, (i + 1) * 6));
            }
            if (count * 6 != this._mailArr.length) {
                arr.push(this._mailArr.slice(count *6, this._mailArr.length));
            }
			return arr;
		}

		public mailDataLength():number
		{
			return this._mailArr.length;
		}
		// public get mailArr():eui.ArrayCollection
		// {
		// 	return this._mailArr;
		// }

		// public set mailArr(mailArr:eui.ArrayCollection)
		// {
		// 	this._mailArr = mailArr;
		// }
	

		public clear(){
			super.clear();
		}

		public destroy(){
			super.clear();
		}

		/**
		 * 时间戳转换成日期时间格式
		 */
		public static formatDate(Num):any
		{
//        return new Date(parseInt(Num) * 1000).toLocaleString().replace("/", "-").replace("/", "-");
//        new Date(parseInt(Num) * 1000).toLocaleString().replace(/\//gi, '-');
        var Day=new Date(parseInt(Num) * 1000).toLocaleTimeString().replace("上午", '').replace("下午", '').replace(":", '').replace(":", '');
        var DayBy=new Date(parseInt(Num) * 1000).toLocaleTimeString().replace("上午", '').replace("下午", '');
        var DayDal=new Date(parseInt(Num) * 1000).toLocaleTimeString();
        var Text=DayDal.substr(0,1);
        var DayA=Day;
        var DayB=Day;
        var DayC=Day;
        var DayH;
        var DayM;
        var DayS;
        var DateDal=new Date(parseInt(Num) * 1000).toLocaleDateString().replace(/\//gi, '-');


        if(Text=="下"){
            for(var i=0;i<4;i++){
                DayA = DayA.substring(0, DayA.length - 1);
            }

            if(Number(DayA)>=1&&Number(DayA)<=9){
                DayB=DayB.substring(1);
                for(var ic=0;ic<3;ic++){
                    DayC = DayC.substring(1);
                }
            }else{
                for(var ib=0;ib<2;ib++){
                    DayB=DayB.substring(1);
                }
                for(var ia=0;ia<4;ia++){
                    DayC = DayC.substring(1);
                }
            }
            for(var id=0;id<2;id++){
                DayB=DayB.substring(0, DayB.length - 1)
            }

            if(Number(DayA)==12){
                DayH="12";
            }else{
                DayH=12+Number(DayA);
            }
        }else {
            for (var i = 0; i < 4; i++) {
                DayA = DayA.substring(0, DayA.length - 1);
            }

            if (Number(DayA) >= 0 && Number(DayA) <= 9) {
                DayB = DayB.substring(1);
                for (var ic = 0; ic < 3; ic++) {
                    DayC = DayC.substring(1);
                }
            } else {
                for (var ib = 0; ib < 2; ib++) {
                    DayB = DayB.substring(1);
                }
                for (var ia = 0; ia < 4; ia++) {
                    DayC = DayC.substring(1);
                }
            }
            for (var id = 0; id < 2; id++) {
                DayB = DayB.substring(0, DayB.length - 1)
            }
            if (Number(DayA) == 12) {
                DayH = "00";
            } else if (Number(DayA) >= 10 && Number(DayA) <= 11) {
                DayH = "0" + Number(DayA);
            } else {
                DayH = Number(DayA);
            }
        }
        DayM = DayB;
        DayS = DayC;
        DayBy = DateDal + " " + DayH + ":" + DayM + ":" + DayS;
        return DayBy;
    }
	}
}