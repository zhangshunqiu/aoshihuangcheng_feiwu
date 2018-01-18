module game {
	export class CombatTips {

		private static instance: CombatTips;

		private _combatArr:Array<any> = [];
		private _attrToShow: Array<string> = ["hp", "ac","mac","sc", "def", "sdef", "hit", "dodge", "crit", "rcrit"];

		private _combatTipsItem: CombatTipsItem;
		private _labelArr:Array<CombatTipsAttrItem> = [];

		public constructor() {
			App.EventSystem.addEventListener(PanelNotify.COMBAT_ATTR_FINISH, this.removeAttrLb, this);
			App.EventSystem.addEventListener(PanelNotify.COMBAT_INCREASE_FINISH, this.combatContinue, this);
			if (this._combatTipsItem == null) {
				this._combatTipsItem = new CombatTipsItem();
				this._combatTipsItem.x = 200;
				this._combatTipsItem.y = 230;
				this._combatTipsItem.touchEnabled= false;
				this._combatTipsItem.visible = false;
				GameRootLay.gameLayer()._effectLay.addChild(this._combatTipsItem);
			}
		}

		public static getInstance(): CombatTips {
			if (!this.instance) {
				this.instance = new CombatTips();
			}
			return this.instance;
		}

		/**
		 * 战力播放完回调
		 */
		private combatContinue(): void {
			if (this._combatArr.length > 0) {
				for(var i:number=0;i<this._combatArr.length;i++) {
					if (this._combatTipsItem.canRun) {
						var obj = this._combatArr.shift();
						this.playAttr(obj["attrArr"]);
						this.playCombat(obj["scoreBefore"],obj["scoreAfter"]);
					}
				}
			} else {
				this._combatTipsItem.visible = false;
			}
		}

		/**
		 * 属性播放完回调
		 */
		private removeAttrLb(item): void {
			if (this._labelArr.indexOf(item) != -1) {
				var index = this._labelArr.indexOf(item);
				this._labelArr.splice(index, 1);
				ObjectPool.push(item);
			}
		}

		public showCombat(heroVosBefore: Array<HeroVO>, heroVosAfter: Array<any>): void {

			//更新前的战力
			var combatBefore: number = 0;
			for (var i: number = 0; i < heroVosBefore.length; i++) {
				combatBefore += heroVosBefore[i].score;
			}
			// this._combatContentArr[0] = combatBefore;

			//更新英雄的id
			var updateHerosId: Array<number> = [];
			for (var j: number = 0; j < heroVosAfter.length; j++) {
				updateHerosId.push(heroVosAfter[j]["id"]);
			}
			//更新后的战力
			var combatAfter: number = 0;
			for (var k: number = 0; k < heroVosAfter.length; k++) {
				combatAfter += heroVosAfter[k]["score"];
			}

			for (var m: number = 0; m < heroVosBefore.length; m++) {
				var id: number = heroVosBefore[m].id;
				if (updateHerosId.indexOf(id) == -1) {
					combatAfter += heroVosBefore[m].score;
				}
			}
			if(combatAfter > combatBefore) {
				var combatObj = {};
				combatObj["scoreBefore"] = combatBefore;
				combatObj["scoreAfter"] = combatAfter;
				// this._combatContentArr[1] = combatAfter;
				//更新后要显示的属性
				var attrArr = [];
				for (var n: number = 0; n < updateHerosId.length; n++) {
					var heroVoBefore: HeroVO;
					var scoreBefore: number;
					var heroVoAfter: HeroVO;
					var scoreAfter: number;
					for (let i: number = 0; i < heroVosBefore.length; i++) {
						if (heroVosBefore[i].id == updateHerosId[n]) {
							heroVoBefore = heroVosBefore[i];
							scoreBefore = heroVosBefore[i].score;
							break;
						}
					}
					for (let i: number = 0; i < heroVosAfter.length; i++) {
						if (heroVosAfter[i].id == updateHerosId[n]) {
							heroVoAfter = heroVosAfter[i];
							scoreAfter = heroVosAfter[i]["score"];
							break;
						}
					}
					//之后比之前战力高才显示
					if (scoreAfter > scoreBefore) {
						var arr = this.compareHeroAttr(heroVoBefore, heroVoAfter);
						attrArr = attrArr.concat(arr);
						// this._attrContentArr = this._attrContentArr.concat(arr);
					}
				}	
				combatObj["attrArr"] = attrArr;
				this._combatArr.push(combatObj);
				// console.log(this._combatArr,"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
				//显示动画
				if (this._combatTipsItem.canRun) {
					var obj = this._combatArr.shift();
					this.playAttr(obj["attrArr"]);
					this.playCombat(obj["scoreBefore"],obj["scoreAfter"]);
				}
			}else {
				return;
			}
		
		}

		/**
		 * 播放增加属性
		 */
		private playAttr(arr): void {
			for (var i: number = 0; i < arr.length; i++) {
				var attrItem = arr.pop();
				// var tipsItem: CombatTipsAttrItem = new CombatTipsAttrItem(attrItem);
				var tipsItem: CombatTipsAttrItem = ObjectPool.pop("game.CombatTipsAttrItem");
				tipsItem.setAttr(attrItem);
				tipsItem.y = 830;
				tipsItem.x = 0;
				GameRootLay.gameLayer()._effectLay.addChild(tipsItem);
				this._labelArr.unshift(tipsItem);
				
			}
		
			for (var j: number = 0; j < this._labelArr.length; j++) {
				var tipsItem: CombatTipsAttrItem = this._labelArr[j];
				egret.Tween.removeTweens(tipsItem);
				egret.Tween.get(tipsItem).to({ y: 830 - j * 50 }, 230, egret.Ease.sineOut);
			}
		}

		/**
		 * 播放战力
		 */
		private playCombat(before: number, after: number): void {
			this._combatTipsItem.play(before, after);
		}


		/**
		 * 返回增加的属性 
		 * @returns [{"属性名":增加值},{"属性名":增加值},{"属性名":增加值}]
		 */
		private compareHeroAttr(before: HeroVO, after): Array<any> {
			var arr = [];
			var attrBef: Array<HeroAttributeVO> = before.attributeInfo;
			var attrAft: Array<HeroAttributeVO> = [];
			for (var i: number = 0; i < after["attribute"].length; i++) {
				attrAft.push(new HeroAttributeVO(after["attribute"][i]));
			}
			for (var j: number = 0; j < attrAft.length; j++) {
				var key: string = attrAft[j].key;
				if(this._attrToShow.indexOf(key) == -1) {
					continue;
				}
				var valueBef: number = attrBef[j].value;
				var valueAft: number = attrAft[j].value;
				if (valueAft > valueBef) {
					arr.push({ attr: key, value: valueAft - valueBef });
				}
			}
			return arr;
		}
	}

	export class CombatTipsItem extends eui.Component {

		public bitmap_combat: eui.BitmapLabel;//滚动的战力
		public gp_increase: eui.Group;
		public bitmap_combat_up: eui.BitmapLabel;//增加的战力

		private _combatTimer: number = 0;
		private _isRunning: boolean = false;
		private _canRun: boolean = true;
		private _lastScore: number;
		private _effectMovie:EffectMovieClip;

		public get canRun() {
			return this._canRun;
		}
		public get movieClip() {
			return this._effectMovie;
		}

		public constructor() {
			super();
			this.skinName = CombatSkin;
			
		}
	
		/**
		 * 播放战力
		 */
		public play(before: number, after: number): void {
			// this.playMovieClip();
			if (this._combatTimer) {
				//关闭上一次的
				clearInterval(this._combatTimer);
			}
			this.alpha = 1;
			this.visible = true;
			var distance: number = this.countScore(before, after);
			var d = after;//跳动到最后的数字
			var s = before;//起始起始值 一般是 0 或其他
			var time = 800;  //所用时间 1000毫秒（ 在1秒内 数值增加到d）;
			var outTime = 0;  //所消耗的时间
			var interTime = 30;
			this.bitmap_combat.text = before + "";

			var that = this;
			this._combatTimer = setInterval(function () {
				outTime += interTime;
				if (outTime < time) {
					that.bitmap_combat.text = (before + distance / time * outTime).toFixed(0) + "";
				} else {
					that.bitmap_combat.text = d + "";
				}
				//滚动战斗力播放结束
				if (outTime >= time) {
					clearInterval(that._combatTimer);
					//播放增加战力
					that.bitmap_combat_up.text = distance + "";
					that.gp_increase.x = that.bitmap_combat.x + that.bitmap_combat.width + 10;
					egret.Tween.get(that.gp_increase).to({ alpha: 1, y: 50 }, 500).call(() => { that._canRun = false }, that).wait(500).call(() => {
						//增加战力播放结束
						that.alpha = 0;
						that.gp_increase.alpha = 0;
						that.gp_increase.y = 82;
						that._isRunning = false;
						that._canRun = true;
						// that.stopMovieClip();
						App.EventSystem.dispatchEvent(PanelNotify.COMBAT_INCREASE_FINISH);
					});
				}
				
			}, interTime);
		}

		private playMovieClip():void {
			if(this._effectMovie == null) {
				this._effectMovie = new EffectMovieClip();
				this._effectMovie.playMCKey("effjspf","",-1)
				this.addChildAt(this._effectMovie,0);
				this._effectMovie .x = 135;
				this._effectMovie.y = 15;
				this._effectMovie.scaleX = 1.5;
				this._effectMovie.scaleY = 1.5;
			}
		}

		public stopMovieClip():void {
			if(this._effectMovie) {
				this._effectMovie.destroy();
				if(this._effectMovie.parent) {
					this._effectMovie.parent.removeChild(this._effectMovie);
					this._effectMovie =null;
				}
			}
		}

		public countScore(before, after): number {
			if (!this._isRunning) {
				this._isRunning = true;
				this._lastScore = before;
			}
			// console.log(after - this._lastScore,"~~~~~~~~~~~~~~~~~~~~~~~~~",before,after,this._lastScore)
			return after - this._lastScore;
		}

	}

	export class CombatTipsAttrItem extends eui.Component {

		public img_attr: eui.Image;
		public bitmap_attr_num: eui.BitmapLabel;
		private _attrDesc = {
			hp: "words_shengming_png",
			def: "words_wufang_png",
			crit: "words_baoji_png",
			rcrit: "words_kangbao_png",
			sdef: "words_mofang_png",
			hit: "words_mongzhong_png",
			dodge: "words_shanbi_png",
			ac: "words_gongji_png",
			mac: "words_gongji_png",
			sc:"words_gongji_png",
		}
		private _requestAnimId: number;
		public constructor() {
			super();
			this.skinName = "CombatAttrSkin";
			// this.bitmap_attr_num.text = attrItem["value"];
			// this.img_attr.source = this._attrDesc[attrItem["attr"]];
			this.touchEnabled = false;
			this.touchChildren = false;
		}

		public setAttr(attrObj:Object):void {
			this.bitmap_attr_num.text = attrObj["value"];
			this.img_attr.source = this._attrDesc[attrObj["attr"]];
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.addEventListener(egret.Event.ADDED_TO_STAGE,()=>{
				egret.setTimeout(this.startAnim, this, 1000);
			},this)
		}

		/**
		 * 播放向左运动
		 */
		private startAnim(): void {
			var that = this;
			var speed: number = 0;
			var draw = function () {
				speed--;
				that.x = that.x + speed;
				if (that.x >= -150) {
					this._requestAnimId = window.requestAnimationFrame(draw);
				} else {
					window.cancelAnimationFrame(that._requestAnimId);
					that._requestAnimId = null;
					if (that.parent) {
						that.parent.removeChild(that);
					}
					App.EventSystem.dispatchEvent(PanelNotify.COMBAT_ATTR_FINISH, that);
				}
			}
			this._requestAnimId = window.requestAnimationFrame(draw);
		}


	}
}