var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var MailVO = (function () {
        function MailVO(id, theme, time, isRead, content, reward, rewardState) {
            this.id = id;
            this.Theme = theme;
            this.Time = time;
            this.isRead = isRead;
            this.content = content;
            this.reward = reward;
            this.rewardState = rewardState;
        }
        MailVO.objToVo = function (dataObj) {
            if (dataObj.conf_id == 0) {
                var mailTitle = dataObj.title;
                var mailContent = dataObj.content;
                var rewardArr = new eui.ArrayCollection();
                var rewardList = dataObj.attachment_list;
                if (rewardList.length >= 0) {
                    for (var i = 0; i < rewardList.length; i++) {
                        var type = rewardList[i].type;
                        var good_id = rewardList[i].id;
                        var num = rewardList[i].num;
                        rewardArr.addItem(new MailRewardVO(type, good_id, num));
                    }
                }
                var mailVo = new MailVO(dataObj.id, mailTitle, game.MailModel.formatDate(dataObj.time), dataObj.state, mailContent, rewardArr, dataObj.attachment_state);
                return mailVo;
            }
            else {
                var mailConfig = ConfigManager.getInstance().getMailInfoById(dataObj.conf_id);
                var mailTitle = mailConfig.title;
                var mailContent = MailVO.getMailContent(mailConfig, dataObj.args);
                var rewardArr = new eui.ArrayCollection();
                var rewardList = dataObj.attachment_list;
                if (rewardList.length >= 0) {
                    for (var i = 0; i < rewardList.length; i++) {
                        var type = rewardList[i].type;
                        var good_id = rewardList[i].id;
                        var num = rewardList[i].num;
                        rewardArr.addItem(new MailRewardVO(type, good_id, num));
                    }
                }
                var mailVo = new MailVO(dataObj.id, mailTitle, game.MailModel.formatDate(dataObj.time), dataObj.state, mailContent, rewardArr, dataObj.attachment_state);
                return mailVo;
            }
        };
        /**
         * 读表配置
         */
        MailVO.getMailContent = function (mailConfig, args) {
            if (args.length <= 0) {
                return mailConfig["content"];
            }
            else {
                var _content1 = mailConfig["content"];
                var argsNum = 0;
                var _content2 = _content1.replace(/%s/g, function (word) {
                    return args[argsNum++];
                });
                var content = _content2.replace(/#[^#]+#/g, function (word) {
                    return "<font size=24 color=" + ConstMailColor[word.substring(1, 2)] + ">" + word.slice(2, -1) + "</font>";
                });
                return "<font size=24>" + content + "</font>";
            }
        };
        return MailVO;
    }());
    game.MailVO = MailVO;
    __reflect(MailVO.prototype, "game.MailVO");
    var MailRewardVO = (function () {
        function MailRewardVO(type, good_id, num) {
            this.type = type;
            this.good_id = good_id;
            this.num = num;
        }
        return MailRewardVO;
    }());
    game.MailRewardVO = MailRewardVO;
    __reflect(MailRewardVO.prototype, "game.MailRewardVO");
})(game || (game = {}));
//# sourceMappingURL=MailVO.js.map