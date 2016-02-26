/**
 * Created by LeoPeng on 2015-5-13.
 */
;( function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [], factory );
    } else {
        // Browser globals
        factory();
    }
}( function() {
    /**
     * 通知提示
     * @class
     * @param {String} content
     * @param {String} type  通知类型：Action：动作提示   Error：错误提示   success：成功提示
     * @return {Object}
     *
     *
     * An embedded live example:
     *
     *     @example
     *     ZSNotice("Create template success!","Success");
     */
    var aeNotice = function(content,type){
        var jboxOption = {
            title: "Action",
            content: content,
            autoClose: 3000,// Notice closes after 5 Second
            attributes: {
                x: 'right',
                y: 'bottom'
            },
            Appearance:'NoticeBorder',
            color:'blue',
            audio:g_GlobalInfo.WebRoot+'oss/assets/audio/blop',
            volume: 60
        };
        if(type === 'Action'){
            jboxOption = {
                title: "Action",
                content: content,
                autoClose: 3000,// Notice closes after 5 Second
                attributes: {
                    x: 'right',
                    y: 'bottom'
                },
                Appearance:'NoticeBorder',
                color:'blue',
                audio:g_GlobalInfo.WebRoot+'oss/assets/audio/blop',
                volume: 60
            }
        }else if (type === 'Error'){
            jboxOption = {
                title: "Error",
                content: content,
                autoClose: 6000,// Notice closes after 5 Second
                attributes: {
                    x: 'right',
                    y: 'bottom'
                },
                Appearance:'NoticeBorder',
                color:'red',
                audio:g_GlobalInfo.WebRoot+'oss/assets/audio/bling1',
                volume: 60
            }
        }else if (type === 'Success'){
            jboxOption = {
                title: "Success",
                content: content,
                autoClose: 4000,// Notice closes after 5 Second
                attributes: {
                    x: 'right',
                    y: 'bottom'
                },
                Appearance:'NoticeBorder',
                color:'green',
                audio:g_GlobalInfo.WebRoot+'oss/assets/audio/beep1',
                volume: 60
            }
        }
        return new jBox('Notice', jboxOption);
    };
    window.aeNotice = aeNotice;

}))();