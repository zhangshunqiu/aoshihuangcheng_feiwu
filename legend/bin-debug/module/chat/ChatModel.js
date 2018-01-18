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
    var ChatModel = (function (_super) {
        __extends(ChatModel, _super);
        function ChatModel() {
            var _this = _super.call(this) || this;
            _this.chatAllList = []; //
            _this.chatGuildList = []; //
            _this.chatWorldList = []; //
            _this.chatSystemList = []; //
            _this.EquipInfo = {};
            _this.selectPlayerId = 0;
            _this.selectPlayerName = "";
            return _this;
        }
        ChatModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        ChatModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        ChatModel.prototype.getChatList = function (data) {
            switch (data.channel - 1) {
                case ChatType.ALLCHAT:
                    for (var i = 0; i < data.msg_list.length; i++) {
                        var cv = this.getChatVo(data.channel, data.msg_list[i]);
                        this.chatAllList.push(cv);
                    }
                    break;
                case ChatType.WORLD:
                    for (var i = 0; i < data.msg_list.length; i++) {
                        var cv = this.getChatVo(data.channel, data.msg_list[i]);
                        this.chatWorldList.push(cv);
                    }
                    break;
                case ChatType.GUILD:
                    for (var i = 0; i < data.msg_list.length; i++) {
                        var cv = this.getChatVo(data.channel, data.msg_list[i]);
                        this.chatGuildList.push(cv);
                    }
                    break;
                case ChatType.SYSTEM:
                    for (var i = 0; i < data.msg_list.length; i++) {
                        var cv = this.getChatVo(data.channel, data.msg_list[i]);
                        this.chatSystemList.push(cv);
                    }
                    for (var i = this.chatSystemList.length - 1; i >= 0; i--) {
                        GlobalTips.getInstance().showBroadcastTips(this.chatSystemList[i].content);
                    }
                    break;
            }
        };
        ChatModel.prototype.getOneChat = function (data) {
            var cv = this.getChatVo(data.channel, data.msg);
            //this.chatAllList.unshift(cv);
            this.chatAllList.push(cv);
            if (this.chatAllList.length > 50) {
                this.chatAllList.shift();
            }
            switch (cv.type) {
                case ChatType.WORLD:
                    //this.chatWorldList.unshift(cv);最后改的新bug
                    this.chatWorldList.push(cv);
                    if (this.chatWorldList.length > 50) {
                        this.chatWorldList.shift();
                    }
                    break;
                case ChatType.GUILD:
                    //this.chatGuildList.unshift(cv);
                    this.chatGuildList.push(cv);
                    if (this.chatGuildList.length > 50) {
                        this.chatGuildList.shift();
                    }
                    break;
                case ChatType.SYSTEM:
                    this.chatSystemList.push(cv);
                    if (this.chatSystemList.length > 20) {
                        this.chatSystemList.shift();
                    }
                    GlobalTips.getInstance().showBroadcastTips(cv.content);
                    break;
            }
        };
        ChatModel.prototype.getChatVo = function (channel, msg) {
            var cv = new game.ChatVo();
            cv.type = msg.channel - 1;
            cv.channel = channel;
            cv.player_id = msg.player_id;
            cv.player_name = msg.player_name;
            cv.sex = msg.sex;
            cv.career = msg.career;
            cv.position_id = msg.position_id;
            cv.vip_id = msg.vip_id;
            cv.is_monthcard = (msg.month_card == 1);
            cv.time = msg.time;
            cv.content = msg.content;
            cv.config_id = msg.config_id;
            cv.args = msg.args;
            return cv;
            //cv.player_id
        };
        ChatModel.prototype.getEquipInfo = function (data) {
            this.EquipInfo = data;
        };
        return ChatModel;
    }(BaseModel));
    game.ChatModel = ChatModel;
    __reflect(ChatModel.prototype, "game.ChatModel");
})(game || (game = {}));
//# sourceMappingURL=ChatModel.js.map