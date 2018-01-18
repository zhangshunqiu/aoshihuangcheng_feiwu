var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var ChatVo = (function () {
        function ChatVo() {
            this.args = [];
        }
        return ChatVo;
    }());
    game.ChatVo = ChatVo;
    __reflect(ChatVo.prototype, "game.ChatVo");
    var TextItemVO = (function () {
        function TextItemVO() {
            this.color = 0;
            this.tap = "";
        }
        return TextItemVO;
    }());
    game.TextItemVO = TextItemVO;
    __reflect(TextItemVO.prototype, "game.TextItemVO");
})(game || (game = {}));
//# sourceMappingURL=ChatVO.js.map