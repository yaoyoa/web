/**
 * m.xiaodao360.com
 * mobile lib
 * @author yaoyoa
 * @date 2015
 */
(function() {
	var XDWM = window.XDWM || {};
	window.XDWM = XDWM;
	
	XDWM.Config={
		Url:{
			test:{
				server:'http://sim.xiaodaowang.cn',
				host:'http://m.xiaodaowang.cn',
				domain:'xiaodaowang.cn',
				trgEvt:'click'
			},
			product:{
				server:'http://www.xiaodao360.com',
				host:'http://m.xiaodao360.com',
				domain:'xiaodao360.com',
				trgEvt:'tap'
			},
			local:{
				server:'http://test.xiaodaowang.cn',
				host:'http://m.xiaodaowang.cn',
				domain:'127.0.0.1',
				trgEvt:'click'
			},
			active:'test',
			qqLogin:'/api/qq/login.php',
			wxRedirect:'/mobile/index/callback/type/weixin/response_type/code/scope/snsapi_userinfo/state/STATE#wechat_redirect',
			download:'http://www.xiaodao360.com/index/android_ios.html?from=h5'
		},
		WX:{
			debug: false,
			appId: '',
			timestamp: '',
			nonceStr: '',
			signature: '',
			jsApiList: ''
		},
		UI:{
			dlBnr:true
		}
	};
	XDWM.State={
		WX:false,
		QQ:false,
		iPad:false,
		iPhone:false,
		iOS:false,
		android:false
	};
	window.XMUrl=XDWM.Config.Url[XDWM.Config.Url.active];
	XDWM.Utils={
		routeUrl:function(u,nl){
			if (typeof u=='undefined')return false;
			nl=typeof nl=='undefined'?0:nl;
			return XMUrl.server+'/mobile/route/index?nl='+nl+'&q='+encodeURIComponent(u);
		},
		genRnd:function(){

		},
		getStatus:function(){
			var ua=navigator.userAgent;
			if (/MicroMessenger/.test(ua)){
				XDWM.State.WX=true;
			}else if(/iPhone/.test(ua)){
				XDWM.State.iPhone=true;
				XDWM.State.iOS=true;
			}else if(/iPad/.test(ua)){
				XDWM.State.iPad=true;
				XDWM.State.iOS=true;
			}else if(/Android/.test(ua)){
				XDWM.State.android=true;
			}
		},
		request: function(item){
			var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
			return svalue ? svalue[1] : svalue;
		},
		urlDecode:function(str){
			if (typeof str=='undefined'||!str)return '';
			var ret="";
			for(var i=0;i<str.length;i++){
				var chr = str.charAt(i);
				if(chr == "+"){
					ret+=" "; 
				}else if(chr=="%"){
					var asc = str.substring(i+1,i+3);
					if(parseInt("0x"+asc)>0x7f){
						ret+=XDWM.utils.asc2str(parseInt("0x"+asc+str.substring(i+4,i+6)));
						i+=5;
					}else{
						ret+=XDWM.utils.asc2str(parseInt("0x"+asc));
						i+=2;
					}
				}else{
					ret+= chr;
				}
			}
			return ret;
		},
		asc2str:function(ascasc){
			return String.fromCharCode(ascasc);
		},
		genId:function(l) {
			l=typeof l=='undefined'?2:l;
			var S4 = function() {
				return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			},result='';
			for (var i=0;i<l;i++){
				result+=S4();
			}
			return result;
		},
		loadImage:function (url, callback) {  
			var img = new Image(); //创建一个Image对象，实现图片的预下载  
			img.src = url;  

			if(img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
				callback.call(img);  
				return; // 直接返回，不用再处理onload事件  
			}  
			img.onload = function () { //图片下载完毕时异步调用callback函数。  
				callback.call(img);//将回调函数的this替换为Image对象  
			};  
		},
		formatTimestamp:function(s,sH){
			sH=typeof sH=='undefined'?'00:00':sH;
			var time=new Date(s.substr(0,4),s.substr(5,2)-1,s.substr(8,2),sH.substr(0,2),sH.substr(3,2));
			return Math.round(time.getTime()/1000);
		},
		formatTime:function(s){
			var time=new Date(s*1000);
			var month=XMUtl.pad(time.getMonth()+1,2);
			var date=XMUtl.pad(time.getDate(),2);
			var hour=XMUtl.pad(time.getHours(),2);
			var min=XMUtl.pad(time.getMinutes(),2);

			return time.getFullYear()+'-'+month+'-'+date+' '+hour+':'+min;
		},
		WXCfg:function(a,t,s,n,j){
			//if (typeof wx!='object')return false;
			j=typeof j=='undefined'?['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'showMenuItems', 'hideMenuItems']:j;
			XDWM.Config.WX={
				debug: false,
				appId: a,
				timestamp: t,
				nonceStr: n,
				signature: s,
				jsApiList: j
			};
			wx.config(XDWM.Config.WX);
		},
		WXShare:function(t,d,l,i,s,c){
			s=typeof s=='undefined'?function(){}:s;
			c=typeof c=='undefined'?function(){}:c;
			wx.ready(function () {
				wx.hideMenuItems({
					menuList: ['menuItem:exposeArticle']
				});
				wx.showMenuItems({
					menuList: ['menuItem:share:weiboApp', 'menuItem:share:QZone']
				});
				var cfg={
					title: 		t,
					desc: 		d, 
					link: 		l,
					imgUrl: 	i,
					dataUrl: 	'', 
					type: 		'', 
					success: 	s,
					cancel: 	c
				};
				wx.onMenuShareAppMessage(cfg);
				delete cfg.type;
				delete cfg.dataUrl;
				wx.onMenuShareTimeline(cfg);
				wx.onMenuShareQQ(cfg);
				wx.onMenuShareWeibo(cfg);
				wx.onMenuShareQZone(cfg);
			});
		},
		setCookie:function (c_name,value,expiredays) { 
			var exdate=new Date();
			exdate.setDate(exdate.getDate()+expiredays); 
			document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+";path=/;domain=."+XMUrl.domain; 
		},
		getCookie:function (Name) {
			var search = Name + "=";
			var returnvalue = "";
			if (document.cookie.length > 0) {
				offset = document.cookie.indexOf(search);
				if (offset != -1) {
					offset += search.length;
					end = document.cookie.indexOf(";", offset);
					if (end == -1)end = document.cookie.length;
					returnvalue=(document.cookie.substring(offset, end));
				}
			}
			return returnvalue;
		},
		pad : function() {  
			var tbl = [];  
			return function(num, n) {  
				var len = n-num.toString().length;  
				if (len <= 0) return num;  
				if (!tbl[len]) tbl[len] = (new Array(len+1)).join('0');  
				return tbl[len] + num;  
			}
		}(),
		
	};
	window.XMUtl=XDWM.Utils;
	XDWM.UI={};
	XDWM.UI.init=function(){
		XDWM.UI.showDlBnr();
	};
	/**
	display or hide top download banner
	@author yao
	@param t[true] true:show,false:hide banner
	@param f[false] force to set the banner, rewrite the globe conf & url conf. when banner was displayed， the close method has the highest priority
	*/
	XDWM.UI.showDlBnr=function(t,f){
		f=typeof f=='undefined'?false:f;
		if (typeof t!='undefined'&&t==false){
			$('.top_download').remove();
			$('body').removeClass('top_event_3');
			return false;
		}
		if (!f&&(location.pathname=='/enroll.html'||location.pathname.indexOf('spec')>=0))return false;
		if (!f&& (XDWM.Utils.request('is_app')=='1'||!XDWM.Config.UI.dlBnr)){
			return false;
		}

		if ($('.top_download').length==0){
			var str='<section class="top_download top_event_3_cont border_bottom">'+
				'<img src="images/app_logo.png"/>'+
				'<b>发现更多热门的<span>校园活动</span></b>'+
				'<a href="'+XDWM.Config.Url.download+'">下载APP</a>'+
				'<del>×</del>'+
			'</section>';
			$('.page_ctn').before(str);
			$('.top_event_3_cont').on(XMUrl.trgEvt,'a',function(){
				location.href='xiaodao360://activity/detail?id='+XMUtl.request('id');
				setTimeout(function(){
					location.href=XDWM.Config.Url.download;
				},1000);
				return false;
			});
		}
		$('body').addClass('top_event_3');
	};
	/**
	reset the globe page scale value to fit all devide
	@author yao
	*/
	XDWM.UI.resizeWin=function (){
		var oHtml=document.getElementsByTagName('html')[0];
		var oBody=document.getElementsByTagName('body')[0];
		var winH=document.documentElement.clientWidth;
		var pageWidth=parseInt(oBody.getAttribute('pageWidth'));
		pageWidth=isNaN(pageWidth)?360:pageWidth;
		var w = document.body.clientWidth;
		w = (w >= 960) ? 960 : w;
		var sFontSize=parseInt((w / pageWidth) * 10000 / 100) + '%'; ;
		oHtml.style.fontSize=sFontSize;
	};
	/**
	show a notice on page buttom
	@author yao
	@param s msg to show
	*/
	XDWM.UI.notice=function(s){
		if ($('.YY_notice').length>0){
			$('.YY_notice').remove();
		}
		var o=$('<dialog class="YY_notice">'+s+'</dialog>');
		$('body').append(o);
		setTimeout(function(){o.remove();},3000);
	};
	/**
	show a loader animation on page
	@author yao
	@param p object. p.mask [true] show a mask to cover the page, p.str[...] text on the animation
	*/
	XDWM.UI.loader=function(p){
		var key;
		this.s={
			mask:true,
			str:'正在努力加载...'
		};
		this.s=$.extend(this.s, p);
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i]=='string'){
				key='str';
			}else if (typeof arguments[i]=='function'){
				key='cb';
			}else if (typeof arguments[i]=='boolean'){
				key='t';
			}
			this.s[key]=arguments[i];
		}
		this.s.prefix='YY_loader_';
		this.s.dialogId=this.s.prefix+XMUtl.genId();
		if ($('#'+this.s.dialogId).length==1){
			$('#'+this.s.dialogId).remove();
		}

		var c=$('<div class="loader_dialog" id="'+this.s.dialogId+'">'+this.s.str+'</div>');

		var pInfo={restrict:true,dialogId:this.s.dialogId,pack:false,closable:true,width:'6.25rem',height:'6.25rem',easyClose:false,showClose:false,forceCenter:true};
		if (typeof this.s.cb!='undefined')pInfo.close=b;
		if (typeof this.s.str!='undefined'&&this.s.str!=''){
			c.html('<b>'+this.s.str+'</b>');
		}
		if (!this.s.mask){
			pInfo.restrict=false;
			c.addClass('loader_bg');
		}
		$('body').append(c);
		c.YY_dialog(pInfo);
		this.openDialog=function () {
			$('#'+this.s.dialogId).YY_dialog('open');
		};
		this.open=function () {
			$('#'+this.s.dialogId).YY_dialog('open');
		};
		this.open();
		this.close=function(){
			$('#'+this.s.dialogId).YY_dialog('close');
		};
	};
	XDWM.UI.alert=function(p){
		var s={
			title:'您确定继续操作吗？',
			ok:'close'
		};
		s.prefix='YY_alert';
		s.dialogId=s.prefix;
		if ($('#'+s.dialogId).length==1){
			$('#'+s.dialogId).remove();
		}
		if (typeof p=='object')
			s=$.extend(s, p);
		else if (typeof p=='string')
			s.title=p;
		var c=$('<div id="'+s.dialogId+'"></div>');

		var pInfo={restrict:true,dialogId:s.dialogId,pack:false,'class':'alert_dialog',closable:true,easyClose:false,showClose:false,forceCenter:true};
		if (typeof s.cb!='undefined')pInfo.close=b;
		if (typeof s.title!='undefined'&&s.title!=''){
			c.html(s.title);
		}
		pInfo.buttons=[];
		if (s.cancel!=null)pInfo.buttons.push({name:'取消',action:'close'});
		pInfo.buttons.push({name:'确定',class:'green',action:s.ok});
		$('body').append(c);
		c.YY_dialog(pInfo);
		
		this.open=function () {
			$('#YY_alert').YY_dialog('open');
		};
		this.open();
		this.close=function(){
			$('#YY_alert').YY_dialog('close');
		};
	};
	XDWM.UI.wordCount=function(p,t){
		this.o=p.find('textarea');
		this.p=p;
		this.t=t;
		this.max=parseInt(t.find('b').text());
		this.count=function(){
			var len=this.o.val().length,s;
			if (this.o.val().length<=this.max){
				s='还可以输入<b>'+(this.max-len)+'</b>个字符';
				this.o.removeClass('error');
			}else{
				s='已经超出<b>'+(len-this.max)+'</b>个字符'
				this.p.addClass('error');
			}
			t.html(s);
			
		};
		p.on('keyup','textarea',$.proxy(this.count,this)).on('keyup','textarea',$.proxy(this.count,this));
	};
	XDWM.UI.initDatePicker=function(o){
		$("#dtBox").DateTimePicker({
			dateFormat : 'yyyy-MM-dd',
			shortDayNames : ['周日','周一','周二','周三','周四','周五','周六'],
			fullDayNames : ['周日','周一','周二','周三','周四','周五','周六'],
			shortMonthNames : ['1','2','3','4','5','6','7','8','9','10','11','12'],
			fullMonthNames : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
			titleContentDate : '选择日期',
			setButtonContent : '确定',
			clearButtonContent : '取消',
			addEventHandlers: function(){
				var dtPickerObj = this;
				o.bind('click',function(e){
					e.stopPropagation();
					dtPickerObj.showDateTimePicker(o);
				});	
			}
		});
	};
	XDWM.UI.selection=function(data,title,cb,bk){
		var s='<div class="opt_box"><h3><button type="button" class="back"></button><b>'+(title)+'</b></h3><ul>';
		for (var k in data){
			var attr=[];
			for (var j in data[k]){
				attr.push('XMData_'+j+'="'+data[k][j]+'"');
			}
			s+='<li '+attr.join(' ')+'>'+data[k].name+'</li>';
		}

		s+='</ul></div>';
		var box=$(s);
		$('body').append(box);
		this.open=function(){
			$('.page_ctn').hide();
			box.show()
		};
		box.find('.opt_box li').addClass('border_top');
		this.open();
		box.on('click','li',cb).on('click','h3 button.back',$.proxy(function(){
			box.hide();
			$('.page_ctn').show();
			bk();
		},this));
		this.close=function(){
			$('.page_ctn').show();
			box.hide();
		};
	};

	window.XMUI=XDWM.UI;
	XDWM.User={
		//request login
		Login:{
			login:function(cb){
				var e=typeof event=='undefined'?window.event:event;
				var o=$('.XDWM_login_dialog'),btn=o.find('.form button');
				btn.addClass('loading').prop('disabled',true);
				data={username:o.find('input').eq(0).val(),password:md5(o.find('input').eq(1).val())}
				$.ajax({
					url:XMUrl.server+'/mobile/route/login',
					data:data,
					type:'post',
					hrFields: {withCredentials: true},
			        crossDomain: true,
			        dataType:'json',
			        beforeSend:function(xhr,settings){
			        	xhr.withCredentials = true;
			        },
					success:function(resp){
						btn.removeClass('loading');
						if (resp.status==1){
							btn.html('登录成功');
							if (cb)cb();
							window.setTimeout(function(){btn.html('立即登录').prop('disabled',false);o.YY_dialog('close');},500);
						}else{
							btn.prop('disabled',false);
							if (resp.status=='-2'){
								var msg='密码错误',style='error';
								o.find('input').eq(1).attr('class',style).siblings('b').html(msg).parent().attr('class',style);
							}else if(resp.status=='-1'){
								var msg='帐号不存在',style='error';
								o.find('input').eq(0).attr('class',style).siblings('b').html(msg).parent().attr('class',style);
							}
						}
					}
				});
				return false;
			},
			//show login dialog
			show:function(p){
				this.s={
					redirectUrl:window.location.href,
					cb:function(){}
				};
				this.s=$.extend(this.s, p);
				this.s.dialogId='XDWM_login_dialog';
				var o=$('.'+this.s.dialogId);
				if (o.length==0){
					var lstr='<div class="'+this.s.dialogId+'" id="'+this.s.dialogId+'"><del></del>'+
						'<h3 class="border_bottom">登录</h3>'+
						'<section class="form">'+
							'<p><input type="tel" placeholder="请输入手机号" regtype="mobile"/><b></b></p>'+
							'<p><input type="password" placeholder="请输入密码" regtype="notNull"/><b></b></p>'+
							'<button type="button">立即登录</button>'+
						'</section>'+
						'<section class="link">'+
							'<h4 class="border_bottom">其他方式直接登录</h4>'+
							'<a href="" class="wx"></a><a href="" class="qq"></a>'+
						'</section></div>';
					$('body').append(lstr);
					o=$('.'+this.s.dialogId);
					var cb=this.s.cb;
					o.find('.form').YY_vali({dialogId:this.s.dialogId,submitObj:o.find('button'),autoSubmit:false,submitType:'manual',onSubmit:function(){XMUser.Login.login(cb);}});
					o.find('del').on('click',function(){
						o.YY_dialog('close');
					});
					var pInfo={restrict:true,autoOpen:true,dialogId:this.s.dialogId,pack:false,'class':'login_dialog',closable:true,easyClose:false,showClose:false,forceCenter:true};
					o.YY_dialog(pInfo);
					XMUtl.setCookie('get_url',this.s.redirectUrl);//define login success redirect url

					var WXCfg=XDWM.Config.WX;
					if (XDWM.State.WX){
						if (WXCfg.appId!=''){
							o.find('.link a.wx').show().attr('href','https://open.weixin.qq.com/connect/oauth2/authorize?appid='+WXCfg.appId+'&redirect_uri='+encodeURIComponent(XMUrl.server+XDWM.Config.Url.wxRedirect)+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect');
						}
					}else{
						o.find('.link a.wx').hide();
					}
					o.find('.link a.qq').attr('href',XMUrl.server+XDWM.Config.Url.qqLogin);
				}else{
					o.find('input').val('');
					o.find('.error').removeClass('error');
					o.find('b').html('');
					o.find('[vali]').removeAttr('vali');
					o.YY_dialog('open');
				}
			}
		}
	};
	window.XMUser=XDWM.User;

	XDWM.NAPI={Bridge:null};
	XDWM.NAPI.init=function(){
		(function(callback){
			if (window.WebViewJavascriptBridge) {
				callback(WebViewJavascriptBridge)
			} else {
				document.addEventListener('WebViewJavascriptBridgeReady', function() {
					callback(WebViewJavascriptBridge)
				}, false)
			}
		})(function(bridge) {
			bridge.init(function(data, responseCallback) {
				responseCallback(data);
			});
			XDWM.NAPI.Bridge=bridge;
			XDWM.NAPI.Bridge.registerHandler('getShareInfo', function(data, responseCallback) {
				var responseData = { "id":  "", "title":  "宅范李琦嗨翻校园", "thumb": "http://m.xiaodao360.com/spec/images/liqi.png", "targetUrl":  "http://m.xiaodao360.com/spec/", "content":  "给音乐一点时间，给自己一点时间，校导网携手腾讯娱乐、梦响强音开启2015年李琦校园行活动，歌手李琦空降全国七大高校，用音乐故事治愈你的负面情绪细菌。" }
				responseCallback(responseData);
			});
		});
	};
	XDWM.NAPI.send=function(m,p,c){
		XDWM.NAPI.Bridge.registerHandler(m, function(data, d) {
			d(p);
		});
	};
	//全局初始化方法
	XDWM.init=function(){
		//XDWM.NAPI.init();

		//scale page
		XMUI.resizeWin();
		window.onresize=XMUI.resizeWin;

		XMUtl.getStatus();

		XDWM.UI.init();
		//baidu statistics
		var _hmt = _hmt || [];
		(function() {
			var hm = document.createElement("script");
			hm.src = "//hm.baidu.com/hm.js?886dc2cb33813c282ce5be07990c9737";
			var s = document.getElementsByTagName("script")[0]; 
			s.parentNode.insertBefore(hm, s);
		})();


	};


	//本地域名不重写根域
	if (XDWM.Config.Url.active!='local')document.domain=XMUrl.domain;
	XDWM.Page={};
	window.XPG=XDWM.Page;

	//全局初始化
	XDWM.init();
})();

