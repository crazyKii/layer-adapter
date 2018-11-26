/*********************************************************************************************************************/
/*********************************************************************************************************************/
/* 引入方法：                                                                               **************************/
/*   将当前js，直接加入到3.1的layer.js                                                      **************************/
/*  【或者】                                                                                **************************/
/*   将当前js，在3.1的layer.js引入后，进行引入页面                                          **************************/
/*                                                                                          **************************/
/* 使用方法：                                                                               ***************************/
/*   使用layer1.8内置方法：使用alayer对象 如：alayer.alert('加了个图标',30,'标题');         ***************************/
/*   使用layer1.8的初始方法： $.layer({type:1,....})                                        **************************/
/*                                                                                          **************************/
/*********************************************************************************************************************/
layer.config({resize:false});
;!function(window){

    var alayer = {} , _$ = window.$;
    var options = {};

    // tool工具类，
    var tool = {
        isArray : function (o){
            return Object.prototype.toString.call(o)=='[object Array]';
        },
        isString : function (o){
            return o != '' && typeof o == 'string'
        },

        isNumber : function (o){
            return isNaN(o);
        },

        isBoolean : function (o){
            return typeof o == 'boolean';
        },

        isUndefined : function (o){
            return o == null || o == undefined;
        },

        // 判断包含某字符串   包含为true
        isContainStr : function (o,str){
            return o.indexOf(str) > -1;
        },

        headUpperCase : function (str){
            return str.substring(0,1).toUpperCase()+str.substring(1);
        }
    };
    // 动态加载layer.css代码
    var url = window.location.href;
    var baseUrl = window.location.protocol + '//'+window.location.host+":"+window.location.port
    var appName = url.replace(baseUrl,'').substring(0,'/');
    var cssURL = baseUrl+appName + 'js/layer/theme/default/layer.css';
    var linkTag = $('<link href="' + cssURL + '" rel="stylesheet" type="text/css" charset="utf-8" />');
    // 动态将link标签添加到head里
    $($('head')[0]).append(linkTag);


    /**
     * [adapter 适配器]
     * @object {Object}
     *
     * old18Params 旧的参数池
     * iArgs 适配后参数
     * fullTag 默认不全屏
     * containInOld 判断是否存在对应的适配方法
     * adapt 适配参数
     */
    var Adapter = function(){
        var old18Params = ['type','title','maxmin','offset','area','border','shade','shadeClose','closeBtn','time','fix','move','moveOut','moveType','bgcolor','zIndex','maxWidth','fadeIn','btns','btn','shift','dialog','page','iframe','loading','tips','success','yes','no','close','end','moveEnd','min','full','restore'];
        // var old18Params = ['type','title','offset','area','border','shade','closeBtn','time','fix','moveType','bgcolor','fadeIn','btns','btn','dialog','success','page','iframe','loading','tips','no','close'];
        this.iArgs = {};
        this.fullTag = false;
        this.containInOld =  function(param){
            var flag = false;
            for(var i = 0 ; i < old18Params.length; i ++){
                if(param == old18Params[i]){
                    flag = true;
                    break;
                }
            }
            return flag;
        };
        this.adapt = function(args){
            options = args;
            // 解决信息框有滚动条问题
            if(!(tool.isUndefined(options.area)) && !(tool.isUndefined(options.dialog))){
                delete options.area;
            }

            for(var p in options){
                if(!this.containInOld(p))
                    continue;

                // 进行适配方法调用
                var aMethod = 'this.adapt' + tool.headUpperCase(p)+'('+"this.iArgs"+', '+"options"+')';
                if(p == 'success'){
                    var resStr = options[p].toString();
                    // console.log(resStr)
                    // 删除注释
                    var str = resStr.replace(/(\/\/.*)|(\/\*(.|\s)*?\*\/)/g,'');
                    //console.log(str)
                    // 执行shift方法
                    var arr = str.match(/\s*function\s*.*/g);
                    var reg = /layer.shift\('([a-z])*'\)/g;
                    if(!tool.isUndefined(arr)){
                        var s1 = arr[0];
                        var arr2 = str.match(reg);
                        if(!tool.isUndefined(arr2)){
                            for(var i = 0; i < arr2.length; i ++){
                                s1 = s1+" a"+ arr2[i]+";";
                            }
                            s1 = s1+" }";
                            // console.log(s1);
                            eval("("+s1+")()");

                            // 重新更新success方法
                            successMethod = str.replace(reg,'');
                            options[p] = eval("("+successMethod+")");
                            // console.log(successMethod)
                        }
                    }
                    this.iArgs.success = options[p];
                }
                else if(p == 'area'){
                    this.fullTag = eval(aMethod);
                }else{
                    try {
                        //适配
                        eval(aMethod);
                    }catch(err){ // 如果没有适配方法，则属性正常，不用适配
                        //console.log(err)
                        this.iArgs[p] = options[p];
                    }

                }

            }
        }
    };

    /**
     * [adaptTitle 适配title]
     * @param  {[type]} options
     * eg:  title : ["标题",true]
     *      title : false
     */
    Adapter.prototype.adaptTitle = function(){
        var that = this;
        var title = options.title;
        if(!tool.isUndefined(title) ){
            if(tool.isArray(title)){
                if(title.length == 2){
                    if(tool.isBoolean(title[1]) && !title[1])
                        that.iArgs.title = false;
                    else
                        that.iArgs.title = title[0];
                }
            }else{
                that.iArgs.title = title;
            }
        }
    };

    /**
     * [adaptOffset 适配offset]
     * @param {[object]} options
     *
     * eg:
     *   offset: '150px'
     *   offset: ['150px', '50%']
     *   offset : ['10px', '']
     *   offset: ['50%', '50%']
     *   offset: ['', ''] ==> offset:'auto'
     */
    Adapter.prototype.adaptOffset = function(){
        var that = this;
        var offset = options.offset;
        if(!tool.isUndefined(offset)){
            if(tool.isString(offset)){
                that.iArgs.offset = offset;
            }else if(tool.isArray(offset)){
                if((offset[0] == '' && offset[1] == '') || (offset[0] == '50%' && offset[1] == '50%'))
                    that.iArgs.offset = 'auto';
                else if(offset[0] != '' && offset[1] == '')
                    that.iArgs.offset = offset[0];
                else if(offset[0] != '' && offset[1] == '50%')
                    that.iArgs.offset = offset[0];
                else
                    that.iArgs.offset = offset;
            }
        }
    };

    /**
     * [adaptArea 适配area]
     *
     *
     * eg:area:['auto','auto'] 自适应  == > area:'auto'
     *    area:['350','130']
     *    area:['350px','130px']
     *    area : ['100%' , '100%']
     *    iframe不能设置auto 不生效
     *
     */
    Adapter.prototype.adaptArea = function(){
        var that = this;
        var area = options.area;
        if(!tool.isUndefined(area)){
            var fullTag = false;
            if(tool.isArray(area)){
                if(area.length == 2){
                    area[0] = area[0] + '';
                    area[1] = area[1] + '';
                    if(tool.isContainStr(area[0],'auto') && tool.isContainStr(area[1],'auto')){
                        that.iArgs.area = 'auto';
                    }else if(tool.isContainStr(area[0],'100%') && tool.isContainStr(area[1],'100%')){
                        that.iArgs.area = 'auto';
                        fullTag = true;
                    }else{
                        that.iArgs.area = area;
                        if(!tool.isContainStr(area[0],'px'))
                            that.iArgs.area[0] = area[0]+'px';

                        if(!tool.isContainStr(area[1],'px'))
                            that.iArgs.area[1] = area[1]+'px';
                    }
                }
            }
            return fullTag;
        }
    };

    /**
     * [adaptBorder description]
     *
     * CNMS使用场景：border: [0, 0, '#000']
     *               border: [0],
     * 3.1废弃
     */
    Adapter.prototype.adaptBorder = function(){
        return;
    };

    /**
     * [adaptShade 适配shade]
     *
     *
     *  eg:shade : [0.5 , '#000']
     *     1.8前为shade : [0.5 , '#000',true]
     *     shade:[2]
     */
    Adapter.prototype.adaptShade = function(){
        // 3.1 默认设置
        var that = this;
        that.iArgs.shade = [0.3,'#000'];
        var shade = options.shade;
        if(!tool.isUndefined(shade)){
            if(tool.isArray(shade)){
                if(shade.length == 2)
                    that.iArgs.shade = shade;
                if(shade.length == 1){
                    if(shade[0] > 1) // 若大于1,则将设置为0.05，无遮罩层
                        that.iArgs.shade = 0.05;
                    else{
                        that.iArgs.shade = shade[0];
                    }
                }
            }
        }
    };

    /**
     * [adaptShade 适配FadeIn]
     *
     *
     *  eg:shade : [0.5 , '#000']
     *     1.8前为shade : [0.5 , '#000',true]
     *     shade:[2]
     */
    Adapter.prototype.adaptFadeIn = function(){
        var that = this;
        var shade = options.shade;
        if(!tool.isUndefined(shade)){
            if(tool.isArray(shade)){
                if(shade.length == 2)
                    that.iArgs.shade = shade;
                if(shade.length == 1)
                    that.iArgs.shade = shade[0];
            }
        }
    };

    /**
     * [adaptCloseBtn 适配closeBtn]
     *
     *
     * eg：
     *     closeBtn : false
     *     closeBtn: [0, false]
     *
     */
    Adapter.prototype.adaptCloseBtn = function(){
        var that = this;
        var closeBtn = options.closeBtn;
        if(!tool.isUndefined(closeBtn)){
            var flag = 1;
            if(tool.isBoolean(closeBtn) && !closeBtn){
                flag = 0;
            }else if(tool.isArray(closeBtn)){
                if(closeBtn.length > 1)
                    if(!(closeBtn[1]))
                        flag = 0;
                //Add by zfp,页面多数使用CloseBtn:[0,true]
                /*else
                    flag = closeBtn[0];*/
            }
            that.iArgs.closeBtn = flag;
        }
    };

    /**
     * [adaptTime 适配time]
     *
     * 1.8单位s ，3.1单位ms
     */
    Adapter.prototype.adaptTime = function(){
        var that = this;
        if(!tool.isUndefined(options.time))
            that.iArgs.time = options.time * 1000;
    };

    /**
     * [adaptFix 适配fix]
     *
     * 1.8fix ，3.1fixed
     */
    Adapter.prototype.adaptFix = function(){
        var that = this;
        if(!tool.isUndefined(options.fix))
            that.iArgs.fixed = options.fix;
    };

    /**
     * [adaptMoveType 适配moveType]
     *
     * 1.8 属性，3.1废弃；这里将不做处理，使用3.1的拖拽方式
     */
    Adapter.prototype.adaptMoveType = function(){
        return;
    };

    /**
     * [adaptMoveType 适配 bgcolor]
     *
     * 1.8 属性，3.1废弃；这里将不做处理，使用3.1的拖拽方式
     */
    Adapter.prototype.adaptBgColor = function(){
        return;
    };

    /**
     * [adaptFadeIn 适配fadeIn]
     *
     * 【说明】：渐显的时间不可控，默认3.1的时间
     */
    Adapter.prototype.adaptFadeIn = function(){
        var that = this;
        var fadeIn = options.fadeIn;
        if(!tool.isUndefined(fadeIn))
            that.iArgs.anim = 5;
    };

    /**
     * [adaperLoading 适配loading]
     *
     * 1.8 属性，3.1废弃；这里将不做处理
     */
    Adapter.prototype.adaperLoading = function(){
        return;
    };

    /**
     * [adaperTips 适配tips]
     *
     * 1.8 属性，3.1废弃；这里将不做处理
     */
    Adapter.prototype.adaperTips = function(){
        return;
    };

    /**
     * [adaptBtns 适配btns]
     *
     *
     * eg:
     *  btns:2,
     *	btn:['确认','取消'],
     *	btn2:function(){
	 *	   alert('no')
	 *	},
     *	yes:function(){
	 *	   alert('yes')
	 *	},
     */
    Adapter.prototype.adaptBtns = function(){
        var that = this;
        var btns = options.btns;
        var btn = options.btn;
        if(!tool.isUndefined(btns) && !tool.isUndefined(btn)){
            that.iArgs.btn = btn;
            if(btns == 2){
                that.iArgs.yes = options.yes;
                that.iArgs.btn2 = options.no;
            }else{
                that.iArgs.yes = options.yes;
            }
        }
    };

    /**
     * [adaptButton 适配btn]
     *
     *
     * eg:
     *  btns:2,
     *	btn:['确认','取消'],
     *	no:function(){
	 *	   alert('no')
	 *	},
     *	yes:function(){
	 *	   alert('yes')
	 *	},
     */
    Adapter.prototype.adaptBtn = function(){
        this.adaptBtns(options);
    };

    /**
     * [adaptDialog 适配dialog]
     *      待适配传入对象
     *
     *
     * dialog:{
	 *		    type:1,
	 *			msg:"内容",
	 *			btns:2,
	 *			btn:['取消','确定'],
	 *			yes:function(index){
	 *				alert('yes')
	 *			},
	 *			no:function(index){
	 *				alert('no')
	 *			}
	 *	}
     *
     */
    Adapter.prototype.adaptDialog = function(){
        var that = this;
        var dialog = options.dialog;
        // 适配特殊dialog
        if(!tool.isUndefined(dialog)){
            that.iArgs.type = 0;   //信息框

            // 样式
            if(!tool.isUndefined(dialog.type)){
                that.iArgs.icon = adaptIcon(dialog.type);
            }

            if(!tool.isUndefined(dialog.msg)){
                that.iArgs.content = dialog.msg;
            }

            if(!tool.isUndefined(dialog.btn)){
                that.iArgs.btn = dialog.btn;
            }

            if(!tool.isUndefined(dialog.btns)){
                if(dialog.btns = 2){
                    that.iArgs.yes = dialog.yes;
                    that.iArgs.btn2 = dialog.no;
                }
            }

            that.iArgs.scrollbar=false;
        }
    };

    /**
     * [adaptPage 适配page]
     *
     *
     * eg:
     *  page:{dom: '#rule'}
     *
     *  page:{html: '<p style="backgroundColor:red">内容</p>'}
     *
     *
     *  page{
	 *  	dom: '#id',
	 * 		html: '',
	 *  	url: '',
	 *	    ok: function(datas){}
	 *  }
     *  【说明】ok属性没有进行适配，3.1没有相应的，同时CNMS没有用到
     */
    Adapter.prototype.adaptPage = function(){
        var that = this;
        var page = options.page;
        if(!tool.isUndefined(page)){
            // 先解析dom
            if(!tool.isUndefined(page.dom)){
                that.iArgs.content = _$(page.dom);
                that.iArgs.type = 1;
            }
            else if(!tool.isUndefined(page.html))
                that.iArgs.content = page.html;
            else if(!tool.isUndefined(page.url))
                that.iArgs.content = page.url;
        }
    };

    /**
     * [adaptIframe 适配inframe]
     *
     *
     * eg:
     * 		iframe : {src : 'http://www.biframeaidu.com'}
     *
     * 		iframe : {
	 *			src : "http://www.baidu.com",
	 *        	scrolling : 'auto',
	 *        	frameborder : '0'
	 *      }
     */
    Adapter.prototype.adaptIframe = function(){
        var that = this;
        var iframe = options.iframe;
        that.iArgs.scrollbar = false;
        if(!tool.isUndefined(iframe)){
            // 设置type为2
            that.iArgs.type = 2;
            if(!tool.isUndefined(iframe.src)){
                if(!tool.isUndefined(iframe.scrolling)){
                    if(iframe.scrolling == 'no'){
                        that.iArgs.content = [iframe.src,'no'];
                    }else{
                        that.iArgs.content = iframe.src;
                    }
                }else{
                    that.iArgs.content = iframe.src;
                }

            }
        }
    };

    /**
     * [adaptNo 适配no方法]
     *
     */
    Adapter.prototype.adaptNo = function(){
        var that = this;
        var no = options.no;
        if(!tool.isUndefined(no)){
            that.iArgs.no = no;
        }
    };

    /**
     * [adaptClose 适配close方法]
     *
     *
     * eg: eg:close : function(index){}
     */
    Adapter.prototype.adaptClose = function(){
        var that = this;
        var close = options.close;
        if(!tool.isUndefined(options.close)){
            that.iArgs.cancel = options.close;
        }
    };


    var adapter = new Adapter();

    /**
     * [adaptAlert 适配内置方法alert]
     * @return {[object]}
     *
     *
     * eg:layer.alert(alertMsg , alertType, alertTit , alertYes)
     * alertMsg：信息内容（文本），
     * alertType：提示图标（整数，0-10的选择），
     * alertTit：标题（文本），
     * alertYes：按钮的回调
     *
     * 3.1
     * layer.alert(content, options, yes)
     *
     * TODO 图标
     */
    alayer.alert = function(alertMsg , alertType, alertTit , alertYes){
        var content = '';
        var config = {};
        var yes = null;
        for(var i = 0 ;i < arguments.length; i ++){
            var typeOf = typeof arguments[i];
            switch(typeOf){
                case 'string':
                    if(i == 0)
                        content = arguments[i];
                    else
                        config.title = arguments[i];
                    break;
                case 'number':
                    config.icon = adaptIcon(arguments[i]);
                    break;
                case 'function':
                    yes = arguments[i];
                    break;
            }
        }
        return layer.alert(content,config,yes);
    };

    /**
     * [adaptConfirm 适配内置方法confirm]
     * @return {[object]}
     *
     * eg:layer.confirm(conMsg , conYes , conTit , conNo)
     * conMsg：信息内容（文本），
     * conYes：按钮一回调，
     * conTit：标题（文本），
     * conNo：按钮二的回调
     *
     * 3.1
     * layer.confirm(content, options, yes, cancel)
     *
     */
    alayer.confirm = function(conMsg , conYes , conTit , conNo){

        var content, config = {icon: 3}, yes = null, cancel = null;

        for(var i = 0 ;i < arguments.length; i ++){
            var typeOf = typeof arguments[i];
            switch(typeOf){
                case 'string':
                    if(i == 0)
                        content = arguments[i];
                    else
                        config.title = arguments[i];
                    break;
                case 'function':
                    if(i == 1){
                        yes = arguments[i];
                    }else{
                        cancel = arguments[i];
                    }
                    break;
            }
        }
        return layer.confirm(content, config, yes, cancel)
    };

    /**
     * [adaptMsg 适配内置方法msg]
     * @return {[object]}
     *
     * eg:layer.msg(msgText , msgTime , msgType , maxWidth)
     * msgText：信息内容（文本），
     * msgTime：自动关闭所需等待秒数（默认2秒,单位s），
     * msgType：提示图标（整数，0-10的选择），
     * maxWidth：最大宽度
     *
     * 3.1
     * layer.msg(content, options, end)
     * 默认3秒(单位ms)
     * TODO 图标
     */
    alayer.msg = function(msgText , msgTime , msgType , maxWidth){
        var content = '';
        var config = {};
        var end = null;
        for(var i = 0 ;i < arguments.length; i ++){
            var typeOf = typeof arguments[i];
            switch(typeOf){
                case 'string':
                    if(i == 0)
                        content = arguments[i];
                    else
                        config.title = arguments[i];
                    break;
                case 'number':
                    if(i == 2){
                        config.time = arguments[i]*1000
                    }
                    else if(i == 3){
                        config.icon = adaptIcon(arguments[i]);
                    }
                    else if(i = arguments.length -1){
                        config.maxWidth = maxWidth;
                    }

                    break;
                case 'function':
                    yes = arguments[i];
                    break;
            }
        }
        return layer.msg(content, config,end);
    };

    /**
     * [adaptTips 适配内置方法tips]
     * @return {[object]}
     *
     * eg:layer.tips(html , follow , time , maxWidth)
     * html：信息内容（文本），
     * follow：触发事件对应的选择器，
     * time：自动关闭所需等待秒数，
     * maxWidth：最大宽度
     *
     * 3.1
     * layer.tips(content, follow, options)
     *
     */
    alayer.tips = function(html , follow , time , maxWidth){

        var content;
        var config = {};
        var afollow = null;

        for(var i = 0 ;i < arguments.length; i ++){
            var typeOf = typeof arguments[i];
            switch(typeOf){
                case 'string':
                    if(i == 0)
                        content = arguments[i];
                    else
                        config.title = arguments[i];
                    break;
                case 'number':
                    config.time = arguments[i]*1000
                    break;
                case 'function':
                    afollow = arguments[i];
                    break;
            }
        }
        return layer.tips(content, afollow,config);
    };

    /**
     * [adaptLoad description]
     * @param  {[type]} loadTime  [description]
     * @param  {[type]} loadgif   [description]
     * @param  {[type]} loadShade [description]
     * @return {[type]}           [description]
     *
     * eg:layer.load(loadTime , loadgif , loadShade)
     * loadTime：自动关闭所需等待秒数[单位秒]
     * loadgif：加载图标（整数，0-3的选择）
     * loadShade：是否遮罩（true 或 false）
     *
     *
     * 3.1
     * layer.load(icon, options)
     */
    alayer.load = function(loadTime , loadgif , loadShade){
        var icon, config = {shade:[0.3,'#000']};

        for(var i = 0 ;i < arguments.length; i ++){
            var typeOf = typeof arguments[i];
            switch(typeOf){
                case 'string':
                    config.content = arguments[i];
                    break;
                case 'number':
                    if(i == 0){
                        config.time = arguments[i]*1000
                    }
                    else if(i == 1){
                        config.icon = arguments[i] > 2 ? 0 : arguments[i];
                    }
                    break;
                default :
                    if(i == 2){
                        config.shade = arguments[i];
                    }
            }


        }
        config.success = function (layero){
            layero.find('.layui-layer-content').css('padding-left', '34px').css('line-height', '30px');
        }
        return layer.load(icon, config)
    };

    /**
     * [getIndex 用于获取layer的当前索引，从而协助通过非layer元素触发事件所执行的关闭方法]
     * @param  {[type]} obj layer对象
     * @return {[number]}
     */
    alayer.getIndex = function(obj){
        if(obj instanceof layer)
            return obj.index;
    };

    /**
     * [loadClose 关闭加载层]
     */
    alayer.loadClose = function(){
        layer.close(this.index);
    };

    /**
     * [shift 针对success 调用shift方法进行封装]
     *
     * LAYER.shift(type , rate)
     *
     * 左上：'left-top',右上：'right-top',左下：'left-bottom',右下：'right-bottom' 。 rate:动画频率，毫秒
     *
     * [说明]：只适配了相同的
     * 3.1
     * 	anim: 0	平滑放大。默认
     *	anim: 1	从上掉落
     *	anim: 2	从最底部往上滑入
     *	anim: 3	从左滑入
     *	anim: 4	从左翻滚
     *	anim: 5	渐显
     *	anim: 6	抖动
     */
    alayer.shift = function(animType){
        //关闭当前层
        var type = 0;
        switch(animType){
            case 'left-top':
                type = 0;
                break;
            case 'top':
                type = 1;
                break;
            case 'right-top':
                type = 0;
                break;
            case 'right-bottom':
                type = 0;
                break;
            case 'left-bottom':
                type = 0;
                break;
            case 'bottom':
                type = 0;
                break;
            case 'left':
                type = 3;
                break;
        }
        adapter.iArgs.anim = type;
    };

    function adaptIcon(alertType){
        var iconType = -1;
        switch (alertType){
            case -1:
                iconType = -1; break;
            case 0:
                iconType = 0; break;
            case 1:
                iconType = 1; break;
            case 2:
                iconType = 5; break;
            case 4:
                iconType = 3; break;
            case 5:
                iconType = 2; break;
            case 6:
                iconType = 6; break;
            case 7:
                iconType = 4; break;
            case 8:
                iconType = 0; break;
            case 9:
                iconType = 0; break;
            case 10:
                iconType = 6; break;
            case 16:
                iconType = 16; break;
        }
        return iconType;
    }

    _$.extend({ // 挂载jquery
        layer: function (args) {
            // 初始化adapter
            adapter = new Adapter();
            // 适配
            adapter.adapt(args);
            //console.log(adapter.iArgs)
            var index = layer.open(adapter.iArgs);

            if(!tool.isUndefined(adapter.fullTag) && adapter.fullTag){
                layer.full(index);
            }
            return index;
        }
    });

    window.$ = _$;
    window.alayer = alayer;
}(window);