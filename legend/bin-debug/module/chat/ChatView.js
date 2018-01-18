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
    var ChatView = (function (_super) {
        __extends(ChatView, _super);
        function ChatView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.item_list = [];
            _this._nextposiy = 0;
            _this._chatModel = game.ChatModel.getInstance();
            _this._allchatlog = "";
            _this._worldchatlog = "";
            _this._guildchatlog = "";
            _this._eventid_onechat = 0;
            _this._show_id = 0;
            return _this;
        }
        ChatView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            RES.getResAsync("chat_liaotian_title_png", function (texture) {
                _this.commonWin.img_title.texture = texture;
            }, this);
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.CHAT);
            }, this);
            this.initView();
        };
        ChatView.prototype.initView = function () {
            var _this = this;
            this.img_emoji.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.loglh(" emoji！ ");
                // this.eff_newchat = new AMovieClip();
                // this.addChild(this.eff_newchat);
                // this.eff_newchat.x += 360;
                // this.eff_newchat.y+= 680;	
                // this.eff_newchat.playMCKey("effxxts");
                // egret.setTimeout(()=>{this.removeChild(this.eff_newchat);},this,3000);
            }, this);
            this.img_send.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.chatInputCheck(_this.inp_textf.text);
            }, this);
            this.inp_textf.maxChars = 41;
            this.inp_textf.text = "";
            var radioGroup = new eui.RadioButtonGroup();
            radioGroup.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var radioGroup = evt.target;
                _this.changedChatType(radioGroup.selectedValue);
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
        };
        /**
         * 发送消息
         */
        ChatView.prototype.chatInputCheck = function (sendtext) {
            if (this.inp_textf.text.length == 0 || (this.inp_textf.text.trim()).length == 0) {
                return;
            }
            ;
            if (Date.now() - this._sendtime < 3000) {
                //App.GlobalTips.showAlert({ style: AlertTipsStyle.ONLY_OK, content: "勇士您说话太快，喝口水再说吧" });
                var text = [{ text: "勇士您说话太快，喝口水再说吧", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                App.GlobalTips.showTips(text);
                return;
            }
            if (this.inp_textf.text == this._sendchat) {
                //App.GlobalTips.showAlert({ style: AlertTipsStyle.ONLY_OK, content: "禁止发送重复信息" });
                var text = [{ text: "禁止发送重复信息", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                App.GlobalTips.showTips(text);
                return;
            }
            var word = this.inp_textf.text;
            if (this._show_id > 0) {
                var equip = App.ConfigManager.getEquipById(this._show_id); //App.ConfigManager.itemConfig()[this._show_id];	
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
        };
        /**
         * 列表显示逻辑
         */
        //
        ChatView.prototype.updateChatList = function () {
            this.changedChatType(this._selecttype);
        };
        ChatView.prototype.changedChatType = function (index) {
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
        };
        ChatView.prototype.clearChatList = function () {
            for (var i = 0; i < this.item_list.length; i++) {
                this.scr_group.removeChild(this.item_list[i]);
            }
            this.item_list.splice(0);
        };
        ChatView.prototype.updateChatByList = function (chatinfolist) {
            //if()
            for (var i = 0; i < chatinfolist.length; i++) {
                if (chatinfolist[i].player_id == 0) {
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
        };
        //endregion	
        //region 新消息的加入
        /**
        * 刷新ui
        */
        ChatView.prototype.updateOneChat = function (data) {
            var _this = this;
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
                } //this.scroller.viewport.scrollV = this._nextposiy - this.scroller.height;
                else {
                    if (this.eff_newchat == null) {
                        this.eff_newchat = new AMovieClip();
                        this.addChild(this.eff_newchat);
                        this.eff_newchat.x += 360;
                        this.eff_newchat.y += 680;
                    }
                    this.eff_newchat.visible = true;
                    this.eff_newchat.playMCKey("effxxts", "", 30, null, function () {
                        _this.eff_newchat.frameRate = 8;
                    }, this);
                    if (this.eff_newchat.hasEventListener(egret.Event.LOOP_COMPLETE) == false) {
                        this.eff_newchat.addEventListener(egret.Event.LOOP_COMPLETE, this.playEffComplete, this);
                    }
                }
            }
        };
        ChatView.prototype.playEffComplete = function (e) {
            if (this.eff_newchat) {
                this.eff_newchat.removeEventListener(egret.Event.LOOP_COMPLETE, this.playEffComplete, this);
            }
            this.eff_newchat.visible = false;
        };
        ChatView.prototype.addOneNewChat = function (info) {
            var item = new ChatItem();
            item.updateInfo(info);
            this.scr_group.addChild(item);
            item.belong_scroller = this.scroller;
            item.$setY(this._nextposiy);
            this._nextposiy += item.item_height;
            this.item_list.unshift(item);
            if (this.item_list.length > 50) {
                for (var i = 0; i < this.item_list.length; i++) {
                    this.item_list[i].y -= this.item_list[this.item_list.length - 1].height;
                }
                this._nextposiy -= this.item_list[this.item_list.length - 1].height;
                this.scr_group.removeChild(this.item_list[this.item_list.length - 1]);
                this.item_list.pop();
            }
        };
        ChatView.prototype.addOneSystemInfo = function (info) {
            var item = new ChatTextItem();
            item.updateInfo(info);
            this.scr_group.addChild(item);
            item.$setY(this._nextposiy);
            this._nextposiy += item.item_height;
            this.item_list.unshift(item);
            if (this.item_list.length > 50) {
                for (var i = 0; i < this.item_list.length; i++) {
                    this.item_list[i].y -= this.item_list[this.item_list.length - 1];
                }
                this._nextposiy -= this.item_list[this.item_list.length - 1].height;
                this.scr_group.removeChild(this.item_list[this.item_list.length - 1]);
                this.item_list.pop();
            }
        };
        //endregion
        /**
         * 打开窗口
         */
        ChatView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
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
        };
        /**
         * 关闭窗口
         */
        ChatView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        ChatView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
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
        };
        /**
         * 销毁
         */
        ChatView.prototype.destroy = function () {
        };
        return ChatView;
    }(BaseView));
    game.ChatView = ChatView;
    __reflect(ChatView.prototype, "game.ChatView");
    var ChatItem = (function (_super) {
        __extends(ChatItem, _super);
        function ChatItem() {
            var _this = _super.call(this) || this;
            _this.item_height = 112;
            //private _iconTips: ChatIconTipsView;
            _this._chatModel = game.ChatModel.getInstance();
            _this.skinName = "ChatItemSkin";
            _this.lb_content = new RichTextField();
            _this.addChild(_this.lb_content);
            _this.lb_content.x = 122;
            _this.lb_content.y = 53;
            _this.lb_content.width = 420;
            _this.img_icon.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.viewIconTips, _this);
            return _this;
        }
        ChatItem.prototype.dataChanged = function () {
            this.updateInfo(this.data);
        };
        ChatItem.prototype.updateInfo = function (info) {
            var _this = this;
            this.info = info;
            this.chat_type = info.type;
            this.lb_name.text = info.player_name;
            this.lb_content.textHtml = "<font fontfamily=\"SimHei\" color=0xbfbfbf size = 24>" + info.content + "</font>";
            if (!info.is_monthcard) {
                this.gp_text.x -= 36; //没有月卡文字要左移
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
            var str = App.ConfigManager.getSmallHeroIconBySexAndJob(info.sex, info.career);
            RES.getResAsync(App.ConfigManager.getSmallHeroIconBySexAndJob(info.sex, info.career) + "_png", function (texture) {
                _this.img_icon.source = texture;
            }, this);
        };
        ChatItem.prototype.viewIconTips = function () {
            if (this.info.player_id != RoleManager.getInstance().roleInfo.playerId) {
                this._chatModel.selectPlayerName = this.info.player_name;
                this._chatModel.selectPlayerId = this.info.player_id;
                App.WinManager.openWin(WinName.CHAT_ICON_TIP, { x: 150, y: this.y + this.height - this.belong_scroller.viewport.scrollV });
            }
        };
        return ChatItem;
    }(eui.ItemRenderer));
    game.ChatItem = ChatItem;
    __reflect(ChatItem.prototype, "game.ChatItem");
    var ChatTextItem = (function (_super) {
        __extends(ChatTextItem, _super);
        function ChatTextItem() {
            var _this = _super.call(this) || this;
            _this.item_height = 66;
            _this.skinName = "ChatTextItemSkin";
            _this.lb_content = new RichTextField();
            _this.addChild(_this.lb_content);
            _this.lb_content.x = 125;
            _this.lb_content.y = 25;
            _this.lb_content.width = 420;
            _this.lb_content.size = 24;
            _this.lb_content.lineSpacing = 3;
            return _this;
        }
        ChatTextItem.prototype.dataChanged = function () {
            this.updateInfo(this.data);
        };
        ChatTextItem.prototype.updateInfo = function (info) {
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
            this.item_height = this.lb_content.height + 66; //30 * (this.lb_content.numLines) + 66;
            this.img_line.y += this.lb_content.height; //30 * (this.lb_content.numLines);
            this.height = this.lb_content.height + 66;
            //}
        };
        return ChatTextItem;
    }(eui.ItemRenderer));
    game.ChatTextItem = ChatTextItem;
    __reflect(ChatTextItem.prototype, "game.ChatTextItem");
})(game || (game = {}));
//# sourceMappingURL=ChatView.js.map