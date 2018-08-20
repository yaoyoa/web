/**
 * @author yaoyoa
 * Copyright 2014, YAOYOA
 * yao@yaoyoa.com
 * depends on jQuery Library v1.4+
 * Dual licensed under the MIT & GPL Version 2 licenses.
 */

/**
 * YY_dialog
 */
$.fn.YY_dialog=function(p){
	var o=$(this);
	var methods={
			caculate:function(o){
				var dO=$(document);
				var wO=$(window);
				var result={pT:parseFloat($('body').css('padding-top').replace(/px/)),sT:wO.scrollTop(),sL:wO.scrollLeft(),wH:wO.height(),wW:wO.width()};
				if (typeof o!='undefined'){
					result.dW=o.width();
					result.dH=o.height();
				}
				return result;
			},
			init:function(p){
				var sDefault={
					width:'auto',
					height:'auto',
					maxWidth:800,
					maxHeight:600,
					draggable:false,
					close:false,
					closable:true,
					title:false,
					dragger:false,
					pack:true,
					restrict:true,
					easyClose:false,
					autoClose:false,
					autoOpen:false,
					forceCenter:false,
					zIndex:10000,
					posX:0,
					posY:0,
					buttons:false,
					mask:{color:'#000',optical:0.5},
					hideScroll: false,
					showClose:false,
					'class':''
				};
				var s = $.extend(sDefault, p);
				o.data('YY_dialog_s',s);
				var dId=o.attr('id')?o.attr('id'):parseInt(Math.random()*1000000);
				//s.dialogId=dId;
				if ($('#YY_dialog_ctn_'+dId).length>0)$('#YY_dialog_ctn_'+dId).remove();
				var d=$('<div id="YY_dialog_ctn_'+dId+'" class="YY_dialog_ctn '+s['class']+'"></div>');
				//o.data('dialogId',dId);
				
				$('body').append(d);
				d.css({width:s.width,height:s.height,'position':'absolute','z-index':s.zIndex,'display':'none'});
				var c=$('<div class="YY_dialog"></div>');//dialog内容容器
				d.append(c);
				//o.css('position','absolute');
				var oS=methods.caculate(o);//对话框原始内容对象
				//console.log(oS);
				if (s.closable&&s.pack||s.showClose){
					if (s.showClose){
						c.append('<del></del>');
						c.children('del').click(methods.close).css({'z-index':s.zIndex+1});
					}
					//if (typeof (s.close) == 'function') c.children('b').get(0).close = s.close;
					if (s.autoClose){c.append('<s><a></a>秒后关闭</s>');}
				}
				if (s.pack){
					if (s.title&& s.title != ''){
						c.append('<h2>'+s.title+'</h2>');
						if (s.draggable) d.drage({handle:'h2'/*,drag:s.drag,dragStart:s.dragStart,dragStop:s.dragStop*/});
					}
					var cC=$('<div class="YY_dialog_content"></div>');
					c.append(cC);
					cC.css({/*'width':oS.dW,'height':oS.dH,*/});
					if (o.length==1)cC.append(o);
				}else{
					//c.width(oS.dW)/*.height(oS.dH)*/;
					c.append(o.addClass('YY_dialog_content'));
				}
				o.show();
				if (typeof (s.buttons) == "object") {
					var actCtn=$('<div class="YY_dialog_action border_top"></div>');
					c.append(actCtn);
					actCtn.addClass('button_'+s.buttons.length);
					for (n in s.buttons) {
						if (s.buttons[n].name != '' && s.buttons[n].action != null) {
							var btnAttr=' name="'+n+'"';
							if (s.buttons[n].enter_key)btnAttr=' focus="true"';
							var btnO=$('<button'+btnAttr+'>'+s.buttons[n].name+'</button>');
							if (typeof s.buttons[n].class!='undefined'){
								btnO.addClass(s.buttons[n].class);
							}
							if (s.buttons[n].action == 'close')
								btnO.click(methods.close);
							else
								btnO.click(s.buttons[n].action);
							actCtn.append(btnO);
						}
					}
				}
				/*
				if (s.posX != null) {
					c.css({'top':s.posX,'left':s.posY});
				} else {
					var dS=methods.caculate(d);
					var _top = Math.floor((dS.wH - dS.dH) / 2);
					var _left = Math.floor((dS.wW - dS.dW) / 2);
					_top=_top<0?0:_top;
					_left=_left<0?0:_top;
					d.css({'top':_top,'left':_left});
				}*/
				if (s.autoOpen)methods.open();
			},
			open:function(){
				var s = o.data('YY_dialog_s');
				//hide_select();
				//if (this.focus_btn != '') $('#'+s.focus_btn).focus();
				//if ($('#YY_mask').length>0)$('#YY_mask').attr('content_id',s.dialogId).attr('closable',this.closable);
				if (this.auto_close){
					$('#YY_dialog_ctn_'+s.dialogId).find('s').show().find('a').html(this.auto_close);
					setTimeout($.proxy(this.autoCloseCountDown,this),1000);
				}else{
					$('#YY_dialog_ctn_'+s.dialogId).find('s').hide();
				}
				if (s.restrict) {
					methods.showMask();
					$(window).bind('resize',methods.setMask);
					$(window).bind('scroll',methods.setMask);
				}
				if (s.forceCenter) {
					$(window).bind('resize',methods.centerDialog);
					$(window).bind('scroll',methods.centerDialog);
				}
				if (s.hideScroll){
					$('html').css({'position':'relative','height':$(window).height()});
					$('html,body').css({'overflow':'hidden'});
					$('body').css({'margin-top':-$('body').scrollTop(),height:$(window).height()+$('body').scrollTop()}).scrollTop(0);
				}
				$("#YY_dialog_ctn_" + s.dialogId).show();

				if (this.pos_x == null) methods.centerDialog();
			},
			close:function(type){
				var s = o.data('YY_dialog_s');
				if (s&&typeof (s.close) == 'function')s.close();
				type=(typeof type=='undefined')?'normal':type;
				if (s&&s.closable){
					//s.hideSelect(false);
						$('#YY_dialog_ctn_' + s.dialogId).hide();
						$('#YY_mask').hide();
						methods.afterClose();
					
					if (s.easyClose){
						$(document).unbind('keydown',methods.escClose);
						$('#YY_mask').unbind('click',methods.close);
					}
				}else{
					//alert('此对话框内的操作在完成之前对话框将无法关闭，请继续');
				}
			},
			afterClose:function(){
				var s = o.data('YY_dialog_s');
				if (s.hideScroll){
					$('html').css({'position':'','height':'auto'});
					var st=parseInt($('body').css('margin-top').replace('px',''));
					$('body').css({'margin-top':0,height:'auto'});
					$('html,body').css({'overflow':''});
					$('body').scrollTop(-st);
				}
				if (s.restrict) {
					$(window).unbind('resize',methods.setMask);
					$(window).unbind('scroll',methods.setMask);
				}
			},
			centerDialog:function(){
				var s = o.data('YY_dialog_s');
				if (typeof s=='undefined')return false;
				var _st=$(window).scrollTop();
				var _sl=$(window).scrollLeft();
				
				var dO=$('#YY_dialog_ctn_'+s.dialogId);
				if (dO.length==0||dO.css('display')=='none')return false;

				var dS=methods.caculate(dO),_top,_left;

				if (s.hideScroll){
					_top = Math.floor((dS.wH - dS.dH + dS.pT) / 2);
					_left = Math.floor((dS.wW - dS.dW) / 2);
					var mT=parseInt($('body').css('margin-top').replace(/px/,''));
					var mL=parseInt($('body').css('margin-left').replace(/px/,''));										
						_top-=mT;
					
						_left-=mL;
				}else{
					_top = Math.floor(_st + (dS.wH - dS.dH + dS.pT) / 2);
					_left = Math.floor(_sl + (dS.wW - dS.dW) / 2);
				}
				if (dS.wW<dS.dW){
					_left=0;
					_left+=_sl;
				}
				if (dS.wH<dS.dH){
					_top=0;
					_top+=_st;
				}

				dO.css({'top':_top,'left':_left});
			},
			escClose:function(e){
				if (e.keyCode);
			},
			//show mask layer
			showMask:function(){
				var mskO=$('#YY_mask'),s = o.data('YY_dialog_s');
				if (mskO.length==0) {
					mskO=$('<div id="YY_mask"></div>');
					$('body').append(mskO);
				}
				mskO.show().css({'cursor':'wait','top':0,'left':0,width:'100%',height:'100%','z-index':s.zIndex-1,'background':'#000','position':'fixed','opacity':'0.5'});
				//methods.setMask();
			},
			//fix mask width , height & position
			setMask:function(){
				var s = o.data('YY_dialog_s');
				if (typeof s=='undefined')return false;
				var wO=methods.caculate();
				var mskO=$('#YY_mask');
				//if (mskO.length==0||mskO.css('display')=='none')return false;
				if (s.easyClose){
					$(document).bind('keydown',methods.escClose);
					$('#YY_mask').attr('title','点击此处即可快速[关闭]对话框');$('#YY_mask').bind('click',methods.close);
				}
				//mskO.css({width:wO.sL+wO.wW,height:wO.sT+wO.wH});
				mskO.css({width:'100%',height:'100%'});
				if (s&&s.hideScroll){
					var mT=parseInt($('body').css('margin-top').replace(/px/,''));
					var mL=parseInt($('body').css('margin-left').replace(/px/,''));
					if (wO.sT==0&&mT<0){
						wO.sT=0-mT;
					}
					if (wO.sL==0&&mL<0){
						wO.sL=0-mL;
					}
					mskO.css({width:wO.sL+wO.wW-$('body').css('margin-left').replace('px',''),height:wO.sT+wO.wH});
				}
			},
		    autoCloseTimmer:function(){
				var s = o.data('YY_dialog_s');
		    	if (typeof this.auto_close_time=='undefined')this.auto_close_time=this.auto_close;
		    	this.auto_close_time--;
		    	if (this.auto_close_time>0){
		    		$('#YY_dialog_ctn_'+s.dialogId).find('s a').html(this.auto_close_time);
		    		setTimeout($.proxy(this.auto_close_count,this),1000);
		    	}
		    	else{
		    		this.close_dialog();
		    		this.auto_close_time=this.auto_close;
		    	}
		    },
		    getDialogCount:function(){
		    	var count=0;
		    	$('.YY_dialog_ctn').each(function(){
		    		if ($(this).css('display')=='block'){
		    			count++;
		    		}
		    	});
		    	return count;
		    }
	};
	var method = arguments[0];
	if(methods[method]) {
		method = methods[method];
		arguments = Array.prototype.slice.call(arguments, 1);
	} else if( typeof(method) == 'object' || !method ) {
		method = methods.init;
	} else {
		$.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );
		return this;
	}
	return method.apply(this, arguments);
};
$.fn.rotate=function(p){
	var s={
		cycle:1,//unit second
		interval:0,//unit millisecond
		FPS:20,//frames per second
		running:true,
		curFrame:0,
		autoStart:true
	};
	s = $.extend(s, p);
	var o=$(this);
	var rotateCounter;
	var methods={
		init:function(){
			o.data('rotate_options',s);
			methods.calc();
			if (s.autoStart)methods.start();
		},
		calc:function(){
			s.interval=parseInt(s.cycle*1000/s.FPS);
		},
		start:function(){
			rotateCounter=window.setInterval(methods.rotate,s.interval);
		},
		rotate:function(){
			var s=o.data('rotate_options');
			if (s&&s.running){
				var d=parseInt(360/s.FPS)*(s.curFrame+1);
				o.css('-webkit-transform','rotate('+d+'deg)');
				s.curFrame+=1;
				o.data('rotate_options',s);
			}else{
				window.clearInterval(rotateCounter);
			}
		},
		stop:function(){
			var s=o.data('rotate_options');
			window.clearInterval(rotateCounter);
			if (s&&s.running)s.running=false;
			o.data('rotate_options',s);
		}
	};
	var method = arguments[0];
	if(methods[method]) {
		method = methods[method];
		arguments = Array.prototype.slice.call(arguments, 1);
	} else if( typeof(method) == 'object' || !method ) {
		method = methods.init;
	} else {
		$.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );
		return this;
	}
	return method.apply(this, arguments);
}

/**
 * regular expression for YY_vali
 */
regex={
	count:/^[0-9]*[1-9][0-9]*$/,
	email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	mobile:/^1[3,4,5,7,8]{1}[0-9]{9}$/,
	nameCn:/^[\u4E00-\u9FA5]{2,4}$/,
	id:/^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/,
	phone:/^\d{3}-\d{8}$|^\d{4}-\d{7}$/,
	pass:/^.{6,20}$/,
	notNull:/\S+/,
	qqno:/^[1-9][0-9]{4,11}$/,
	qq:/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)|(^[1-9][0-9]{4,11}$)/,
	tel:/(^\d{3}-\d{8}$|^\d{4}-\d{7}$)|(^1[3,4,5,7,8]{1}[0-9]{9}$)/,
	numeric:/^\s*\d+\s*$/,/*/^\d+$/,*/
	account:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$|^1[3,4,5,7,8]{1}[0-9]{9}$/,
	url:new RegExp("(http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?", "gi"),
	price:function(_keyword){
		if(_keyword == "0" || _keyword == "0." || _keyword == "0.0" || _keyword == "0.00"|| _keyword == ""){
			_keyword = "0";
			return false;
		}else{
			var index = _keyword.indexOf("0");
			var length = _keyword.length;
			if(index == 0 && length>1){/*0开头的数字串*/
				var reg = /^[0]{1}[.]{1}[0-9]{1,2}$/;
				if(!reg.test(_keyword)){
					return false;
				}else{
					return true;
				}
			}else{/*非0开头的数字*/
				var reg = /^[1-9]{1}[0-9]{0,10}[.]{0,1}[0-9]{0,2}$/;
				if(!reg.test(_keyword)){
					return false;
				}else{
					return true;
				}
			}
			return false;
		}
	}
};

/**
 * YY_vali验证插件
 * @author yaoyoa
 * @date 130116
 */
$.fn.YY_vali=function(options){
	var obj=$(this);
	var fObj=obj.find('input[func],input[regtype],input[reg],select[reg],select[regtype],select[func],textarea[reg],textarea[regtype],textarea[func]');
	var s = $.extend({
		submitType		: 'form',//
		onInit		 	: function() {}, // Function to run when validator is initialized
		onError			: function() {}, // Function to run when an error is output
		onFocus			: function() {}, // Function to run each time the element is focused
		onBlur			: function() {}, // Function to run each time the element is blurred
		onValiStart		: function() {}, // Function to run when the form is being validated
		onValiComplete	: function() {}, // Function to run when the form elements are validated completed
		onValiFailed	: function() {},
		onValiSuccess	: function() {}, // Function to run when the form elements are validated succeed
		onSubmit		: function() {}, // Function to run when the form is ready to submit
		onAjaxSuccess	: function() {}, // Function to run when the Ajax request is successed
		onAjaxError		: function() {}, // Function to run when the Ajax request is error
		autoSubmit		: true,
		hideScroll		: true,
		submitObj		: null,
		visible			: false,
		autoFocus		: false
	}, options);
	var checkForm=function(o){
		if (typeof o=='undefined'&&o.find('form').length==1)
			o=$('form');
		else if (typeof o=='undefined'&&o.find('form').length!=1)
			return false;
		if (o.get(0).tagName=='INPUT'||o.get(0).tagName=='SELECT'||o.get(0).tagName=='TEXTAREA'){
			selfValidate(o);
		}else{
			var result=true;
			var errorObjs=[];
			if (s.visible){
				//fObj=fObj.filter(':visible');
			}
			fObj.each(function(){
				var o=$(this);
				if(!o.is(':enabled'))return true;
				//只要有一项验证失败则验证结果为失败
				if (selfValidate($(this))===false){
					result=false;
					errorObjs.push($(this));
					s.onValiFailed();
				}
			});
			if (errorObjs.length>0&&s.autoFocus){
				$(window).scrollTop($(errorObjs[0]).focus().parents('dl').offset().top);
				var err=$(errorObjs[0]).attr('error');
				if (err==null||err==''){
					err=$(errorObjs[0]).parents('dl').find('dt').text();
					err='请'+(errorObjs[0][0].tagName=='SELECT'?'选择':'填写')+err;
				}
				XMUI.notice(err);

			}else{
				//$(errorObjs[0]).focus();
			}
			return result;
		}

	};
	/**
	 * 调用正则进行验证
	 */
	var selfValidate=function (o){
		var tagName=o.attr('name');
		if(o.attr('vali')==null||typeof o.attr('vali') == 'undefined' || o.attr('vali') == 'no'|| o.attr('valiCache') =='no'){
			if (o.attr('func')!=null&&typeof o.attr('func')!='undefined'&&o.attr('func')!=''){
				eval('var fun='+o.attr('func'));
				return funCheck(o,fun);
			}else if (o.attr('reg')!=null&&typeof o.attr('reg')!='undefined'&&o.attr('reg')!=''){
				eval('var reg='+o.attr('reg'));
				return regCheck(o,reg);
			}else if (o.attr('regtype')!=null&&typeof o.attr('regtype')!='undefined'&&o.attr('regtype')!=''){
				var regtype=o.attr('regtype');
				if (typeof (regex[regtype])=='function'){
					return funCheck(o,regex[regtype]);
				}else{
					return regCheck(o,regex[regtype]);
				}
			}else{
				//console.log(null);
				//无验证条件跳过验证
				return null;
			}
		}else if (o.attr('vali')=='ok'){
			induceAction(o,'ok');
			return true;
		}
	};
	var regCheck=function(o,r){
		if (!r.test(o.val())){
			induceAction(o);
			return false;
			//console.log(false);
		}else{
			induceAction(o,'ok');
			o.attr('vali', 'ok');
			return true;
		}
	};
	var funCheck=function(o,f){
		func_result=f.call(null,o.val());
		if (!func_result){
			induceAction(o);
			return false;
		}else{
			induceAction(o,'ok');
			o.attr('vali', 'ok');
			return true;
		}
	};
	/**
	 * 显示验证结果
	 */
	var induceAction=function (o,t){
		if (typeof o=='undefined')return false;
		if (typeof t=='undefined')t='error';
		var pNode=o[0].parentNode,pObj;
		pObj=o.parent();
		lObj=o.parents('li');
		if (lObj.length==0)lObj=o.parents('dl');
		var tObj=pObj.find('b');
		if (typeof o.attr('tipObj')!='undefined'&&o.attr('tipObj')!=null&&o.attr('tipObj')!='')tObj=$(o.attr('tipObj'));
		if (tObj.length==0){
			//pObj.append('<label class="text-tip"></label>');
			//var tObj=pObj.find('.text-tip');
		}
		if (pNode.tagName=='TD'){
			pObj=$(pNode).parent('tr');
		}
		var tipTarget;
		tipTarget=pObj.find('label');
		
		if (tipTarget.length==0)tipTarget=pObj.find('th');
		if (tipTarget.length==0)tipTarget=pObj.find('td').eq(0);
		if (tipTarget.length==0)tipTarget=pObj.find('dt');

		//var tipTargetName=tipTarget.text().replace(':','');
		pObj.removeClass('notice ok');//取消验证的class，避免之前的验证产生遗留
		//lObj.find('.error').removeClass('error');
		o.removeClass('notice ok');
		lObj.removeClass('notice ok');
		if (t=='ok'){
			pObj.removeClass('error');//取消验证的class，避免之前的验证产生遗留
			o.removeClass('error');
			lObj.removeClass('error');
		}
		var tipStr=o.attr(t);
		if (typeof tipStr=='undefined'||tipStr==null||tipStr==''){
			var act='input ';
			if (o[0].tagName=='SELECT')act='select ';
			switch (t){
			case 'error':
				if (!tipStr||tipStr=='')tipStr='输入出错';
				s.onError();
				break;
			case 'notice':
				if (!tipStr||tipStr=='')tipStr='';
				break;
			case 'ok':
				if (!tipStr||tipStr=='')tipStr='';
				break;
			}
		}
	
		pObj.addClass(t);
		o.addClass(t);
		lObj.addClass(t);
		//if(tObj.length==1)tObj.html(tipStr);
		//tObj.html(tipStr);
	};
	//绑定事件
	fObj.bind('blur',function(){
		checkForm($(this));
	}).bind('focus',function(){
		induceAction($(this),'notice');
	}).bind('change',function(){
		$(this).attr('vali','no');
	});
	var autoSubmit=function(){
		if (!checkForm(obj))return false;
		//默认ajax调用方法
		s.onValiSuccess();
		if (s.submitType=='ajax'){
			var formData = obj.serialize();
			$.ajax({
				type : "POST",
				url  : obj.attr('action'),
				cache : false,
				data : formData,
				success : s.onAjaxSuccess,
				error : s.onAjaxError
			});
			return false;
		//自定义函数
		}else if (s.submitType=='manual'){
			s.onSubmit();
			return false;
		//原始表单提交方式
		}else if (s.submitType=='form'){
			//do nothing
		}
		return false;
	};
	if (s.autoSubmit){
		obj.submit(autoSubmit);
	}else{
		$(s.submitObj).click(function(){
			if (!checkForm(obj))return false;
			s.onSubmit();
			return false;
		});
	}
};
