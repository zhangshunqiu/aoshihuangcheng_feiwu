var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var game;
(function (game) {
    var CombatTips = (function () {
        function CombatTips() {
            this._combatArr = [];
            this._attrToShow = ["hp", "ac", "def", "sdef", "hit", "dodge", "crit", "rcrit"];
            this._labelArr = [];
            App.EventSystem.addEventListener(PanelNotify.COMBAT_ATTR_FINISH, this.removeAttrLb, this);
            App.EventSystem.addEventListener(PanelNotify.COMBAT_INCREASE_FINISH, this.combatContinue, this);
            if (this._combatTipsItem == null) {
                this._combatTipsItem = new CombatTipsItem();
                this._combatTipsItem.x = 200;
                this._combatTipsItem.y = 230;
                this._combatTipsItem.touchEnabled = false;
                this._combatTipsItem.visible = false;
                GameRootLay.gameLayer()._effectLay.addChild(this._combatTipsItem);
            }
        }
        CombatTips.getInstance = function () {
            if (!this.instance) {
                this.instance = new CombatTips();
            }
            return this.instance;
        };
        /**
         * 战力播放完回调
         */
        CombatTips.prototype.combatContinue = function () {
            if (this._combatArr.length > 0) {
                for (var i = 0; i < this._combatArr.length; i++) {
                    if (this._combatTipsItem.canRun) {
                        var obj = this._combatArr.shift();
                        this.playAttr(obj["attrArr"]);
                        this.playCombat(obj["scoreBefore"], obj["scoreAfter"]);
                    }
                }
            }
            else {
                this._combatTipsItem.visible = false;
            }
        };
        /**
         * 属性播放完回调
         */
        CombatTips.prototype.removeAttrLb = function (item) {
            if (this._labelArr.indexOf(item) != -1) {
                var index = this._labelArr.indexOf(item);
                this._labelArr.splice(index, 1);
            }
        };
        CombatTips.prototype.showCombat = function (heroVosBefore, heroVosAfter) {
            //更新前的战力
            var combatBefore = 0;
            for (var i = 0; i < heroVosBefore.length; i++) {
                combatBefore += heroVosBefore[i].score;
            }
            // this._combatContentArr[0] = combatBefore;
            //更新英雄的id
            var updateHerosId = [];
            for (var j = 0; j < heroVosAfter.length; j++) {
                updateHerosId.push(heroVosAfter[j]["id"]);
            }
            //更新后的战力
            var combatAfter = 0;
            for (var k = 0; k < heroVosAfter.length; k++) {
                combatAfter += heroVosAfter[k]["score"];
            }
            for (var m = 0; m < heroVosBefore.length; m++) {
                var id = heroVosBefore[m].id;
                if (updateHerosId.indexOf(id) == -1) {
                    combatAfter += heroVosBefore[m].score;
                }
            }
            if (combatAfter > combatBefore) {
                var combatObj = {};
                combatObj["scoreBefore"] = combatBefore;
                combatObj["scoreAfter"] = combatAfter;
                // this._combatContentArr[1] = combatAfter;
                //更新后要显示的属性
                var attrArr = [];
                for (var n = 0; n < updateHerosId.length; n++) {
                    var heroVoBefore;
                    var scoreBefore;
                    var heroVoAfter;
                    var scoreAfter;
                    for (var i_1 = 0; i_1 < heroVosBefore.length; i_1++) {
                        if (heroVosBefore[i_1].id == updateHerosId[n]) {
                            heroVoBefore = heroVosBefore[i_1];
                            scoreBefore = heroVosBefore[i_1].score;
                            break;
                        }
                    }
                    for (var i_2 = 0; i_2 < heroVosAfter.length; i_2++) {
                        if (heroVosAfter[i_2].id == updateHerosId[n]) {
                            heroVoAfter = heroVosAfter[i_2];
                            scoreAfter = heroVosAfter[i_2]["score"];
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
                    this.playCombat(obj["scoreBefore"], obj["scoreAfter"]);
                }
            }
            else {
                return;
            }
        };
        /**
         * 播放增加属性
         */
        CombatTips.prototype.playAttr = function (arr) {
            for (var i = 0; i < arr.length; i++) {
                var attrItem = arr.pop();
                var tipsItem = new CombatTipsAttrItem(attrItem);
                tipsItem.y = 830;
                this._labelArr.unshift(tipsItem);
            }
            for (var j = 0; j < this._labelArr.length; j++) {
                var tipsItem = this._labelArr[j];
                egret.Tween.removeTweens(tipsItem);
                GameRootLay.gameLayer()._effectLay.addChild(tipsItem);
                egret.Tween.get(tipsItem).to({ y: 830 - j * 50 }, 230, egret.Ease.sineOut);
            }
        };
        /**
         * 播放战力
         */
        CombatTips.prototype.playCombat = function (before, after) {
            this._combatTipsItem.play(before, after);
        };
        /**
         * 返回增加的属性
         * @returns [{"属性名":增加值},{"属性名":增加值},{"属性名":增加值}]
         */
        CombatTips.prototype.compareHeroAttr = function (before, after) {
            var arr = [];
            var attrBef = before.attributeInfo;
            var attrAft = [];
            for (var i = 0; i < after["attribute"].length; i++) {
                attrAft.push(new game.HeroAttributeVO(after["attribute"][i]));
            }
            for (var j = 0; j < attrAft.length; j++) {
                var key = attrAft[j].key;
                if (this._attrToShow.indexOf(key) == -1) {
                    continue;
                }
                var valueBef = attrBef[j].value;
                var valueAft = attrAft[j].value;
                if (valueAft > valueBef) {
                    arr.push({ attr: key, value: valueAft - valueBef });
                }
            }
            return arr;
        };
        return CombatTips;
    }());
    game.CombatTips = CombatTips;
    __reflect(CombatTips.prototype, "game.CombatTips");
    var CombatTipsItem = (function (_super) {
        __extends(CombatTipsItem, _super);
        function CombatTipsItem() {
            var _this = _super.call(this) || this;
            _this._combatTimer = 0;
            _this._isRunning = false;
            _this._canRun = true;
            _this.skinName = CombatSkin;
            return _this;
        }
        Object.defineProperty(CombatTipsItem.prototype, "canRun", {
            get: function () {
                return this._canRun;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CombatTipsItem.prototype, "movieClip", {
            get: function () {
                return this._effectMovie;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 播放战力
         */
        CombatTipsItem.prototype.play = function (before, after) {
            // this.playMovieClip();
            if (this._combatTimer) {
                //关闭上一次的
                clearInterval(this._combatTimer);
            }
            this.alpha = 1;
            this.visible = true;
            var distance = this.countScore(before, after);
            var d = after; //跳动到最后的数字
            var s = before; //起始起始值 一般是 0 或其他
            var time = 800; //所用时间 1000毫秒（ 在1秒内 数值增加到d）;
            var outTime = 0; //所消耗的时间
            var interTime = 30;
            this.bitmap_combat.text = before + "";
            var that = this;
            this._combatTimer = setInterval(function () {
                outTime += interTime;
                if (outTime < time) {
                    that.bitmap_combat.text = (before + distance / time * outTime).toFixed(0) + "";
                }
                else {
                    that.bitmap_combat.text = d + "";
                }
                //滚动战斗力播放结束
                if (outTime >= time) {
                    clearInterval(that._combatTimer);
                    //播放增加战力
                    that.bitmap_combat_up.text = distance + "";
                    that.gp_increase.x = that.bitmap_combat.x + that.bitmap_combat.width + 10;
                    egret.Tween.get(that.gp_increase).to({ alpha: 1, y: 50 }, 500).call(function () { that._canRun = false; }, that).wait(500).call(function () {
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
        };
        CombatTipsItem.prototype.playMovieClip = function () {
            if (this._effectMovie == null) {
                this._effectMovie = new EffectMovieClip();
                this._effectMovie.playMCKey("effjspf", "", -1);
                this.addChildAt(this._effectMovie, 0);
                this._effectMovie.x = 135;
                this._effectMovie.y = 15;
                this._effectMovie.scaleX = 1.5;
                this._effectMovie.scaleY = 1.5;
            }
        };
        CombatTipsItem.prototype.stopMovieClip = function () {
            if (this._effectMovie) {
                this._effectMovie.destroy();
                if (this._effectMovie.parent) {
                    this._effectMovie.parent.removeChild(this._effectMovie);
                    this._effectMovie = null;
                }
            }
        };
        CombatTipsItem.prototype.countScore = function (before, after) {
            if (!this._isRunning) {
                this._isRunning = true;
                this._lastScore = before;
            }
            // console.log(after - this._lastScore,"~~~~~~~~~~~~~~~~~~~~~~~~~",before,after,this._lastScore)
            return after - this._lastScore;
        };
        return CombatTipsItem;
    }(eui.Component));
    game.CombatTipsItem = CombatTipsItem;
    __reflect(CombatTipsItem.prototype, "game.CombatTipsItem");
    var CombatTipsAttrItem = (function (_super) {
        __extends(CombatTipsAttrItem, _super);
        function CombatTipsAttrItem(attrItem) {
            var _this = _super.call(this) || this;
            _this._attrDesc = {
                hp: "words_shengming_png",
                def: "words_wufang_png",
                crit: "words_baoji_png",
                rcrit: "words_kangbao_png",
                sdef: "words_mofang_png",
                hit: "words_mongzhong_png",
                dodge: "words_shanbi_png",
                ac: "words_gongji_png",
                mac: "words_gongji_png",
            };
            _this.skinName = "CombatAttrSkin";
            _this.bitmap_attr_num.text = attrItem["value"];
            _this.img_attr.source = _this._attrDesc[attrItem["attr"]];
            _this.touchEnabled = false;
            _this.touchChildren = false;
            return _this;
        }
        CombatTipsAttrItem.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            egret.setTimeout(this.startAnim, this, 1000);
        };
        /**
         * 播放向左运动
         */
        CombatTipsAttrItem.prototype.startAnim = function () {
            var that = this;
            var speed = 0;
            var draw = function () {
                speed--;
                that.x = that.x + speed;
                if (that.x >= -150) {
                    this._requestAnimId = window.requestAnimationFrame(draw);
                }
                else {
                    window.cancelAnimationFrame(that._requestAnimId);
                    that._requestAnimId = null;
                    if (that.parent) {
                        that.parent.removeChild(that);
                    }
                    App.EventSystem.dispatchEvent(PanelNotify.COMBAT_ATTR_FINISH, that);
                }
            };
            this._requestAnimId = window.requestAnimationFrame(draw);
        };
        return CombatTipsAttrItem;
    }(eui.Component));
    game.CombatTipsAttrItem = CombatTipsAttrItem;
    __reflect(CombatTipsAttrItem.prototype, "game.CombatTipsAttrItem");
})(game || (game = {}));
//# sourceMappingURL=CombatTips.js.map