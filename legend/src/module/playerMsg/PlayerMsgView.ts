/**
 * Author: yangyipeng                                     
 * 查看玩家信息模块视图窗口 
 */
module game{
	export class PlayerMsgWin extends BaseView {

		public img_return:eui.Image;
		public img_close:eui.Image;
		public baseItem1:customui.BaseItem;
		public baseItem2:customui.BaseItem;
		public baseItem3:customui.BaseItem;
		public baseItem4:customui.BaseItem;
		public baseItem5:customui.BaseItem;
		public baseItem6:customui.BaseItem;
		public baseItem7:customui.BaseItem;
		public baseItem8:customui.BaseItem;
		public baseItem9:customui.BaseItem;
		public baseItem10:customui.BaseItem;
		// public baseItem11:customui.BaseItem;
		// public baseItem12:customui.BaseItem;
		public img_wing:eui.Image;
		public img_body:eui.Image;
		public img_weapon:eui.Image;
		public special_item0:customui.BaseItem;
		public special_item1:customui.BaseItem;
		public special_item2:customui.BaseItem;
		public special_item3:customui.BaseItem;
		public special_item4:customui.BaseItem;
		public special_item5:customui.BaseItem;
		public img_player:eui.Image;
		public img_medal_lv:eui.Image;
		public lb_player_name:eui.Label;
		public lb_player_level:eui.Label;
		public tab_head:eui.TabBar;
		public img_detail:eui.Image;
		public bitmap_score:eui.BitmapLabel;


		private _effectArr:Array<EffectMovieClip> = [];
		private _playerMsgModel:PlayerMsgModel;
		private _eventId:number =0;
		private _eventId1:number =0;

		public constructor(viewConf:WinManagerVO = null) {
			super(viewConf);
			this._playerMsgModel = PlayerMsgModel.getInstance();
		}

		/**
		 * 创建皮肤（初始化调用一次）
		 */
		public childrenCreated() {
			super.childrenCreated();
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				WinManager.getInstance().closePopWin(WinName.POP_PLAYER_MSG);
			},this);
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				WinManager.getInstance().closePopWin(WinName.POP_PLAYER_MSG);
			},this);
			this.tab_head.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.tabItemHandler,this);
			this.tab_head.itemRenderer = PlayerMsgTabItem;

			this.img_detail.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				WinManager.getInstance().openPopWin(WinName.POP_PLAYER_HERO_ATTR);
			},this);
		}

		/**
		 * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if(this.openData) {
				// console.log(this.openData);
				App.Socket.send(15030,{id:this.openData});
			}
			if(this._eventId == 0) {
				this._eventId = App.EventSystem.addEventListener(PanelNotify.PLAYER_MSG_INQUIRE,this.playerMsgData,this);
			}
			if(this._eventId1 == 0) {
				//英雄属性页面可以切换英雄
				this._eventId1 = App.EventSystem.addEventListener(PanelNotify.PLAYER_HERO_ATTRIBUTE_INDEX_CHANGE,this.changeHero,this);
			}

		}

		private playerMsgData():void {
			this._playerMsgModel.curPos = 0;//默认选中第一个英雄
			this.updateTabhead();
			this.changeHero();
			this.updatePlayerMsg();
		}


		private updateTabhead():void {
			var headPicArr = this._playerMsgModel.herosHeadPic();
			this.tab_head.dataProvider =  new eui.ArrayCollection(headPicArr);
		}

		/**
		 * 选项卡切换英雄
		 */
		private tabItemHandler(event: eui.ItemTapEvent):void {
			if(event.itemIndex <= this._playerMsgModel.heroNum) {
				this._playerMsgModel.curPos = event.itemIndex;
				this.changeHero();
			}
		}

		/**
		 * 改变切换卡选中状态
		 */
		private tabSelectIndex():void {
			var index:number = this._playerMsgModel.curPos;
			var items = this.tab_head.$children;
			for(var i:number=0;i<items.length;i++) {
				if(i == index) {
					(items[i] as PlayerMsgTabItem).img_select.visible = true;
				}else {
					(items[i] as PlayerMsgTabItem).img_select.visible = false;
				}
			}
		}

		/**
		 * 显示英雄信息
		 */
		private changeHero():void {
			this.tabSelectIndex();
			var index:number = this._playerMsgModel.curPos;
			var heroList = this._playerMsgModel.heroList;
			if(heroList.length < 0) {
				return;
			}
			var heroData = heroList[index];
			this.updateEquip(heroData["equip_info"]);
			this.updateModel(heroData);
			this.updateScore(heroData["score"]);
			this.updateSpecialEquip(heroData["sp_equip"]);
		}

		/**
		 * 显示玩家信息
		 */
		private updatePlayerMsg():void {
			var playerVo:PlayerVo = this._playerMsgModel.playVo;
			//名字
			this.lb_player_name.text = playerVo.name;
			//等级
			if(playerVo.turn) {
				this.lb_player_level.text = playerVo.turn + "转" + playerVo.lv + "级";
			}else {
				this.lb_player_level.text = playerVo.lv + "级";
			}
			//头像(玩家头像和主角英雄头像是一样的)
			var headPicObj = this._playerMsgModel.herosHeadPic()[0];
			if(headPicObj) {
				var sex = headPicObj["sex"];
				var job = headPicObj["job"];
				let headKey = //value.job + "0000" + value.sex;
                    App.ConfigManager.getSmallHeroIconBySexAndJob(sex, job, 2);
                RES.getResAsync(headKey + "_png", (texture) => {
                   	this.img_player.source = texture;
                }, this);
			}
			
			//勋章图片
			var medalLv:number = playerVo.medal_lv;
			var medalConfig = ConfigManager.getInstance().getMedalAttrInfoByLv(medalLv);
			if(medalConfig["model"]) {
				this.img_medal_lv.source = medalConfig["model"] + "_png";
			}
		}

		/**
		 * 显示特殊装备
		 */
		private updateSpecialEquip(special_equips:Array<any>):void {
			for(var i:number=0;i<special_equips.length;i++) {
				//特效
				var effect = new EffectMovieClip();
				effect.scaleX = effect.scaleY = 0.4;
				effect.x = 45;
				effect.y = 50;
				effect.touchEnabled = false;
				effect.playMCKey(ConstSpecialEquipEffect[i+1], "", -1, null, () => {
					effect.frameRate = 8;
				}, null, this);
				this._effectArr.push(effect);
				this["special_item" + i].addChild(effect);
				//更新信息
				(this["special_item" + i] as customui.BaseItem).updateBaseItem(ClientType.EQUIP, 0, null);

				//没有装备显灰 有不显灰
				if(special_equips[i]["id"]) {
					UIActionManager.setGrey(this["special_item" + i], false);
				}else {
					UIActionManager.setGrey(this["special_item" + i], true);

				}
			}
		}
		/**
		 * 显示装备
		 */
		private updateEquip(equipData:Array<any>):void {
			// for(var i:number =0;i<equipData.length;i++) {
			// 	(this["baseItem"+ (i+1)] as customui.BaseItem).updateBaseItem(ClientType.EQUIP,equipData[i]["good_id"],null,equipData[i]);
			// }
			for(var i:number =0;i<10;i++) {
				if(equipData[i]["good_id"]) {
					(this["baseItem"+ (i+1)] as customui.BaseItem).updateBaseItem(ClientType.EQUIP,equipData[i]["good_id"],null,equipData[i]);
					var equipInfo = (EquipModel.getInstance() as EquipModel).getEquipInfoById(equipData[i]["good_id"]);
					(this["baseItem"+ (i+1)] as customui.BaseItem).setItemName(equipInfo.limit_lvl + "级");
					(this["baseItem"+ (i+1)] as customui.BaseItem).setItemNameVisible(true);
					// (this["baseItem"+ (i+1)] as customui.BaseItem).lb_type.visible = false;
				}else {
					(this["baseItem"+ (i+1)] as customui.BaseItem).updateBaseItem(ClientType.EQUIP,null);
					var type = this._playerMsgModel.getTypeByPos(i+1);
					// (this["baseItem"+ (i+1)] as customui.BaseItem).lb_type.text = ConstEquipType[type];
					// (this["baseItem"+ (i+1)] as customui.BaseItem).lb_type.visible = true;
				}
			}
		}

		/**
		 * 显示英雄模型
		 */
		private updateModel(heroData):void {
			var equipInfo = heroData["equip_info"];
			var wingInfo = heroData["wing_info"];
			//显示武器
			for(let i:number=0;i<equipInfo.length;i++) {
				if(equipInfo[i]["part"] == ConstEquipPart.WEAPON && equipInfo[i]["good_id"]) {
					var info = App.ConfigManager.getEquipConfigById(equipInfo[i]["good_id"]);
					RES.getResAsync(info["model"] + "_png",(texture)=>{
						this.img_weapon.source = texture;
					},this);
					break;
				}
			}
			//显示衣服
			for(let i:number=0;i<equipInfo.length;i++) {
				if(equipInfo[i]["part"] == ConstEquipPart.CLOTH && equipInfo[i]["good_id"]) {
					var info = App.ConfigManager.getEquipConfigById(equipInfo[i]["good_id"]);
					RES.getResAsync(info["model"] + "_png",(texture)=>{
						this.img_body.source = texture;
					},this);
					break;
				}
			}
			//显示翅膀
			if(wingInfo["wing_id"]) {
				var photo:string =(WingModel.getInstance() as WingModel).getWingPhoto(wingInfo["wing_id"]);
				RES.getResAsync(photo + "_png",(texture)=>{
					this.img_wing.source = texture;
				},this);
			}
		}
		
		private updateScore(score:number):void {
			this.bitmap_score.text = score + "";
		}
		/**
		 * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
		 */
		public clear(data: any = null): void {
			super.clear(data);
			if(this._eventId != 0) {
				App.EventSystem.removeEventListener(PanelNotify.PLAYER_MSG_INQUIRE,this._eventId);
				this._eventId = 0;
			}
			this._effectArr.forEach((value, index, array) => {
				value.destroy();
			}, this);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		
		}


	}
}
