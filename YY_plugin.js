/**
 * @author yaoyoa
 * Copyright 2014, YAOYOA
 * yao@yaoyoa.com
 * depends on jQuery Library v1.4+
 * Dual licensed under the MIT & GPL Version 2 licenses.
 */
/**
 * last modified 1307
 */
if (!jQuery.browser){
	
	var userAgent=navigator.userAgent;
	jQuery.browser = { 
			version: (userAgent.match( /.+(?:rv|it|ra|IE|ie)[\/: ]([\d.]+)/ ) || [])[1],
			msie:$.support.focusinBubbles&&!$.support.optSelected,
			msie10:$.support.focusinBubbles&&!$.support.optSelected&&$.support.cors,
			msie9:$.support.focusinBubbles&&!$.support.optSelected&&!$.support.cors, 
			safari:!($.support.focusinBubbles&&!$.support.optSelected)&&!$.support.checkClone,
			chrome:!($.support.focusinBubbles&&!$.support.optSelected)&&/Chrome/.test( userAgent ),
			firefox:!($.support.focusinBubbles&&!$.support.optSelected)&&/Firefox/.test( userAgent ),
			mChrome:!($.support.focusinBubbles&&!$.support.optSelected)&&/Chrome/.test( userAgent )&&/Android/.test( userAgent ),
			mIE:$.support.focusinBubbles&&!$.support.optSelected&&/IEMobile/.test( userAgent )
	};
}
/**
 * regular
 */
regex={
	count:/^[0-9]*[1-9][0-9]*$/,
	email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	mobile:/^1[3,4,5,7,8]{1}[0-9]{9}$/,
	nameCn:/^[\u4E00-\u9FA5]{2,4}$/,
	id:/^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/,
	phone:/^\d{3}-\d{8}$|^\d{4}-\d{7}$/,
	pass:/^.{6,20}$/,
	notNull:/^.{1,200}$/,
	qq:/^[1-9][0-9]{5-11}$/,
	tel:/(^\d{3}-\d{8}$|^\d{4}-\d{7}$)|(^1[3,4,5,7,8]{1}[0-9]{9}$)/,
	numeric:/^\d{n}$/,
	account:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$|^1[3,4,5,7,8]{1}[0-9]{9}$/,
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
 * bind events
 */
$(function(){
	/**
	 * placeholder
	 */
	if ($.browser.msie&&$.browser.version<9)
		$('input[placeholder][type!="password"]').each(function(){
			if ($(this).val()==''&&$(this).attr('placeholder')!=''){
				$(this).val($(this).attr('placeholder')).addClass('placehoder_active');
			}
			$(this).focus(function(){
				if ($(this).attr('placeholder')==$(this).val())
					$(this).val('').removeClass('placehoder_active');
				$(this).blur(function(){
					if ($(this).val()=='')
						$(this).val($(this).attr('placeholder')).addClass('placehoder_active');
				});
			}).keydown(function(){
				$(this).removeClass('placehoder_active');
			});
		});
	$("input.numeric,input.money").css({'ime-mode':'disabled'});
	$("input.numeric").bind('keydown',function(e){
		var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		sk = e.shiftKey?e.shiftKey:((keyCode == 16)?true:false);
		if (sk)return false;
		if(!(keyCode==46)&&!(keyCode==8)&&!(keyCode==9)&&!(keyCode==37)&&!(keyCode==39))
			if(!((keyCode>=48&&keyCode<=57)||(keyCode>=96&&keyCode<=105)))
			 return false;
	}).bind('blur',function(event){
		$(this).val(Math.round(this.value));
		if ($(this).val()<1)$(this).val(1);
		if ($(this).val()>99999)$(this).val(99999);
	}).bind('keyup',function(){
		if ($(this).val()<1)$(this).val(1);
		if ($(this).val()>99999)$(this).val(99999);
	});
	if ($('.allcat').length==1&&$('.sub-nav').length==1){
		$('.allcat').hover(function(){$('.sub-nav').show().find('.slide-nav>li').removeClass('select');});
		$('.sub-nav').hover(function(){},function(){$('.sub-nav').hide();});
		$('.sub-nav>.slide-nav>li').mouseover(function(){$(this).addClass('select').siblings('li').removeClass('select');});
	}
	$('.back_top>a.top').click(function(){
		$('body,html').animate({scrollTop:0},500);
	});
	$('.gird-col-4').menu();
});
$.fn.checkAll=function(c){
	var o=$(this);
	c.click(function(){
		if (c.length==c.filter(':checked').length){
			o.prop('checked',true);
		}else{
			o.prop('checked',false);
		}
	});
	o.click(function(){
		if (o.prop('checked'))
			c.prop('checked',true);
		else
			c.prop('checked',false);
	});
};
$.fn.menu=function(){
	var o=$(this);
	o.find('ul>li:first-child').css('cursor','pointer').click(function(){
		var l=$(this);
		if (l.parent('ul').height()>l.outerHeight()){
			l.parent('ul').addClass('fold').css('overflow','hidden').animate({height:l.outerHeight()},l.siblings().length*50);
		}else{
			l.parent('ul').removeClass('fold').animate({height:l.outerHeight()+l.siblings().length*l.siblings().outerHeight()},l.siblings().length*50);
		}
	});
};
/**
 * YY_vali验证插件
 * @author yaoyoa
 * @date 130116
 */
$.fn.YY_vali=function(options){
	var obj=$(this);
	var fObj=obj.find('input:enabled[func],input:enabled[regtype],input:enabled[reg],select[reg],select[regtype],select:enabled[func],textarea:enabled[reg],textarea:enabled[regtype],textarea:enabled[func]');
	var settings = jQuery.extend({
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
		submitObj		: null
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
			fObj.filter(':visible').each(function(){
				//只要有一项验证失败则验证结果为失败
				if (selfValidate($(this))===false){
					result=false;
					settings.onValiFailed();
				}
			});
			return result;
		}
	};
	/**
	 * 调用正则进行验证
	 */
	var selfValidate=function (o){
		var tagName=o.attr('name');
		if(typeof o.attr('vali') == 'undefined' || o.attr('vali') == 'no'){
			if (typeof o.attr('func')!='undefined'&&o.attr('func')!=''){
				eval('var fun='+o.attr('func'));
				return funCheck(o,fun);
			}else if (typeof o.attr('reg')!='undefined'&&o.attr('reg')!=''){
				eval('var reg='+o.attr('reg'));
				return regCheck(o,reg);
			}else if (typeof o.attr('regtype')!='undefined'&&o.attr('regtype')!=''){
				if (typeof regex[o.attr('regtype')]=='object'){
					return regCheck(o,regex[o.attr('regtype')]);
				}else if (typeof regex[o.attr('regtype')]=='function'){
					return funCheck(o,regex[o.attr('regtype')]);
				}
			}else{
				//console.log(null);
				//无验证条件跳过验证
				return null;
			}
		}else{
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
		pObj=o.parents('.form-group');
		var tObj=pObj.find('.text-tip,.help-block,.error-block');
		if (typeof o.attr('tipObj')!='undefined'&&o.attr('tipObj')!='')tObj=$(o.attr('tipObj'));
		//if (t=='ok'){tObj.filter(':visible').html('输入正确');return false;}
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
		var tipTargetName=tipTarget.text().replace(':','');
		pObj.removeClass('error notice ok');//取消验证的class，避免之前的验证产生遗留
		o.removeClass('error notice ok');
		var tipStr=o.attr(t);
		if (typeof tipStr=='undefined'||tipStr==''){
			var act='input ';
			if (o[0].tagName=='SELECT')act='select ';
			switch (t){
			case 'error':
				if (!tipStr||tipStr=='')tipStr='输入出错';
				settings.onError();
				break;
			case 'notice':
				if (!tipStr||tipStr=='')tipStr='正在输入';
				break;
			case 'ok':
				if (!tipStr||tipStr=='')tipStr='输入正确';
				break;
			}
		}
		pObj.addClass(t);
		o.addClass(t);
		tObj.html(tipStr);
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
		settings.onValiSuccess();
		if (settings.submitType=='ajax'){
			var formData = obj.serialize();
			$.ajax({
				type : "POST",
				url  : obj.attr('action'),
				cache : false,
				data : formData,
				success : settings.onAjaxSuccess,
				error : settings.onAjaxError
			});
			return false;
		//自定义函数
		}else if (settings.submitType=='manual'){
			settings.onSubmit();
			return false;
		//原始表单提交方式
		}else if (settings.submitType=='form'){
			//do nothing
		}
	};
	if (settings.autoSubmit){
		obj.bind('submit',autoSubmit);
	}else{
		$(settings.submitObj).click(function(){
			if (!checkForm(obj))return false;
			settings.onSubmit();
			return false;
		});
	}
};
/**
 * count down lib
 */
$.fn.countDown=function(p){
	var s = jQuery.extend({type:'en',callBack:function(){}},p);
    $(this).each(function(){
        var autoCountDown;
        var bind=function(object, func) {  
            return function() {  
                return func.apply(object, arguments); 
            };
        }; 
        var timeCalc=function(){
            var o=$(this);
            var timeObj={};
            if (s.type=='cn'){
            	if (o.find('.day').html()==''||o.find('.hour').html()==''||o.find('.minute').html()==''||o.find('.second').html()=='')return false;
            	timeObj= {day:parseInt(o.find('.day').html()),hour:parseInt(o.find('.hour').html()),minute:parseInt(o.find('.minute').html()),second:parseInt(o.find('.second').html())};
            }else if (s.type=='second'){
            	timeObj= {day:0,hour:0,minute:0,second:parseInt(o.find('span').html())};
            }else{
            	if (o.html()=='')return false;
            	var timeArr= o.html().split(':');
            	timeObj= {day:0,hour:parseInt(timeArr[0]),minute:parseInt(timeArr[1]),second:parseInt(timeArr[2])};
            }
            var second=timeObj.day*3600*24+timeObj.hour*3600+timeObj.minute*60+timeObj.second;
            second--;
            if (second>0)
            	autoCountDown=window.setTimeout(bind(this,timeCalc),1000);
            else
            	s.callBack();
            var timeResult=new Array();
            timeResult[0]=Math.floor(second/3600/24);
            timeResult[1]=Math.floor((second-timeResult[0]*3600*24)/3600);
            timeResult[2]=Math.floor((second-timeResult[0]*3600*24-timeResult[1]*3600)/60);
            timeResult[3]=second-timeResult[0]*3600*24-timeResult[1]*3600-timeResult[2]*60;
            for (var i=1;i<timeResult.length;i++){
            	if (timeResult[i]<10){
            		timeResult[i]=(Array(2).join(0) + timeResult[i]).slice(-2);
            	}
            }
            if (s.type=='cn'){
                o.find('.day').html(timeResult[0]);
                o.find('.hour').html(timeResult[1]);
                o.find('.minute').html(timeResult[2]);
                o.find('.second').html(timeResult[3]);
            }else if (s.type=='second'){
            	o.find('span').html(parseInt(timeResult[3]));
            }else{
            	o.html(timeResult[1]+':'+timeResult[2]+':'+timeResult[3]);
            }
        };
        autoCountDown=window.setTimeout(bind(this,timeCalc),1000);
    });
};
/**
 * main ad slide
 */
$.fn.slideImg=function(){
 	var o=$(this);
 	o.find('.btn-pre').click(function(){
 		chgImg('pre');
 	});
 	o.find('.btn-next').click(function(){
 		chgImg('next');
 	});
 	
 	var listCtn=o.find('ul'),list=o.find('ul>li');
 	var listCount=list.length;
 	var objW=list.eq(0).outerWidth(true);
 	var countObj=o.find('.btn-count');
 	countObj.html('<span class="color7">1</span>/'+listCount);
 	listCtn.width(listCount*objW);
 	var chgImg=function(w){
 		var cur=parseInt(countObj.find('span').html());
 		if (typeof w=='undefined')w='next';
 		if (w=='next'){
 			cur++;
 		}else{
 			cur--;
 		}
 		cur=cur<1?(listCount):(cur>listCount?1:cur);
 		tarPos=-(cur-1)*objW;
 		countObj.find('span').html(cur);
 		listCtn.stop().animate({
			marginLeft: tarPos
			}, 300, function () {
				$(this).css({marginLeft: '-'+tarPos+"px"});
		});
 	};
};
$.fn.scrollImg=function(p){
	var o=$(this);
	var s = jQuery.extend({pageSize:5,btnNext:o.find('.btn-next'),btnPre:o.find('.btn-pre')},p);
	s.btnPre.click(function(){
		chgImg('pre');
	});
	s.btnNext.click(function(){
		chgImg('next');
	});
	var listCtn=o.find('ul'),list=o.find('ul>li');
	var listCount=list.length;
	var objW=list.eq(0).outerWidth(true);
	listCtn.width(listCount*objW);
	var chgImg=function(w){
		if (listCount<s.pageSize)return false;
		console.log(w);
		var cur=1;
		if (typeof o.data('curImg')!=='undefined')cur=parseInt(o.data('curImg'));
		if (typeof w=='undefined')w='next';
		if (w=='next'){
			cur++;
		}else{
			cur--;
		}
		cur=cur<1?(listCount-s.pageSize+1):(cur>listCount-s.pageSize+1?1:cur);
		tarPos=-(cur-1)*objW;
		o.data('curImg',cur);
//		list.removeClass('select').eq(cur).addClass('select');
		listCtn.stop().animate({
		marginLeft: tarPos
		}, 300, function () {
			$(this).css({marginLeft: '-'+tarPos+"px"});
		});
	};
};
/**
 * switch tabs content
 * @param c objs contains
 * @param [s] objs object for add style
 */
$.fn.tabs=function(c,s,d){
	var b=$(this);
	if (typeof s=='undefined'||s==''||s==null){
		s=b;
	}
	d=typeof d=='undefined'?'select':d;
	b.click(function(){
		var o=$(this);
		var idx=b.index(o);
		s.removeClass(d);
		s.eq(idx).addClass(d);
		c.hide().eq(idx).show();
		return false;
	});
};
/**
 * 
 * @date 1401
 */
$.fn.selege=function(option){
	var s=$.extend({
		width:'auto',
		height:80,
		optWidth:'inherit',
		editable:false,
		sly:false,
		hover:false,
		onSelect:function(){},
		onOpen:function(){},
		onClose:function(){},
		multiple:false
	},option);
	$(this).each(function(){
		var obj=$(this);
		if (obj.next('.selege').length==0){
			var str='';
			if (obj.attr('multiple')=='multiple'){
				s.multiple=true;
			}
			obj.find('option').each(function(){
				var opt=$(this);
				str+='<li val="'+opt.val()+'">'+opt.html()+'</li>';
			});
			obj.hide().after('<div class="selege"><div class="value"><input type="text"/></div><div class="options"><ul>'+str+'</ul></div></div>');
		}
		var sObj=obj.next('.selege');
		var tObj=sObj.find('input');
		var oObj=sObj.find('.options');
		var uObj=oObj.find('ul');
		var lObj=uObj.find('li');
		//初始化大小
		
		if (s.width=='auto'){
			sObj.width(obj.outerWidth());
			t_width=obj.width()-10;
			oObj.width(obj.outerWidth()-2);
		}else if (s.width>0){
			sObj.width(s.width);
			t_width=s.width-35;
			oObj.width(s.width-2);
		}
		//自动宽度
		if (s.optWidth=='auto'){
			oObj.width(2000).show();
			lObj.css({width:'auto','float':'left','display':'block','clear':'both'});
			var maxWidth=0;
			lObj.each(function(){
				if ($(this).outerWidth()>maxWidth)maxWidth=$(this).outerWidth();
			});
			var sWidth=((sObj.width()-2)>maxWidth+20)?(sObj.width()-2):(maxWidth+20);
			oObj.css({'min-width':sWidth,width:'auto'}).hide();
			lObj.css({'float':'none','clear':'both'});
		}
		tObj.width(t_width);
		tObj.val(obj.find('option[selected]').html());
		if (s.height!='auto'){
			//原生滚动条
			oObj.css({'overflow-y':'auto','height':s.height+'px'});
		}
		s.onOpen();
		var showOpt=function(){
			sObj.css('z-index','101').find('.options').fadeIn(50,function(){$(document).bind('click',clickClose);});
			tObj.focus();
		};
/**
 * use up or down to generate a event to select a option
 */
		var keyScroll=function(e){
			var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
			if (/*(keyCode==40||keyCode==38)&&*/!oObj.is(':visible')){
				showOpt();
				return false;
			}
			var t;
			if (keyCode==40){
				t='next';
			}else if (keyCode==38){
				t='prev';
			}else if (keyCode==13){
				t='ok';
			}else{
				return;
			}
			selectOpt(t);
		};
/**
 * automatic select a option
 */
		var selectOpt=function(t){
			if (typeof t=='undefined')t='next';
			var cur=lObj.index(uObj.find('li.sel'));
			var tar,len=lObj.length;
			if (t=='next'){
				tar=cur+1;
				tar=tar>=len?0:tar;
			}else if (t=='prev'){
				tar=cur-1;
				if (cur<=0)
					tar=len-1;
			}else if (t=='ok'){
				if (oObj.is(':visible')&&cur!=-1){
					lObj.eq(cur).click();
				}else{
					tObj.blur();
					hideOpt();
				}
				return false;
			}
			lObj.removeClass('sel').eq(tar).addClass('sel');
			setInSight(tar);
		};
/**
 * set the option in sight
 */
		var setInSight=function(n){
			var lst=lObj.eq(0);
			var oH=oObj.height();
			var lH=lst.height()+parseInt(lst.css('padding-top').replace(/px/,''))+parseInt(lst.css('padding-bottom').replace(/px/,''))+1;
			oObj.scrollTop(n*lH-oH+lH);
		};
		var hideOpt=function(){
			oObj.hide();
			$(document).unbind('click',clickClose);
			if (s.sly){
				sObj.find('.scrollbar').hide();
			}
		};
		var clickClose=function(){hideOpt();$(document).unbind('click',clickClose);};
		if (s.hover){
			sObj.find('.value').hover(function(event){
				$('.selege').css('z-index','100').find('.options').hide();
				showOpt();
				$(document).bind('click',clickClose);
			},function(){});
		}
		var checkVal=function(){
			var same=false;
			obj.find('option').each(function(){
				if ($(this).val()==tObj.val()){
					same=true;
					obj.find('option').removeAttr('selected');
					$(this).attr('selected','selected');
					return false;
				}
			});
			if (same===false){
				obj.find('option').removeAttr('selected');
				obj.append('<option selected="selected" auto="true" value="'+tObj.val()+'">'+tObj.val()+'</option>');
			}else{
				
			}
			obj.change();
		};
		if (s.editable)
			tObj.css('cursor','text').blur(function(){
				checkVal();
			}).click(function(){
				if (typeof tObj.attr('sel')!='undefined'&&tObj.attr('sel')=='true')
					tObj.removeAttr('sel');
				else
					tObj.select().attr('sel','true');
			});
		else{
			tObj.attr('readonly','readonly');
			sObj.find('.value').css('cursor','pointer');
		}
		sObj.find('.value').click(function(){
			if (oObj.is(":hidden")){
				$('.selege').css('z-index','100').find('.options').hide();
				showOpt();
			}
			else{
				hideOpt();
			}
		}).keydown(keyScroll);
		var selectOption=function(o,e){
			if (!s.multiple){
				hideOpt();
				$(document).unbind('click',clickClose);
				tObj.val(o.html());
				tObj.blur();
				if (typeof o.attr('val')!='undefined')
					obj.val(o.attr('val'));
				else
					obj.val(o.html());
				obj.change();
			}else{
				o.toggleClass('sel');
				e.stopPropagation();
				var val_arr=new Array();
				lObj.each(function(){
					var s_opt=$(this);
					if (s_opt.hasClass('sel')){
						val_arr.push(s_opt.html());
						obj.find('option').eq(lObj.index(s_opt)).attr('selected','selected');
					}
				});
				tObj.val(val_arr.join(','));
			}
		};
		sObj.click(function(e){
			if (e.target.tagName=="LI"){
				selectOption($(e.target),e);
				s.onSelect($(e.target));
			}
		}).hover(function(){$(this).addClass('over');},function(){$(this).removeClass('over');});
	});
};
/**
 * YY_dialog
 */
$.fn.YY_dialog=function(p){
	var s={
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
		hideScroll: true,
		showClose:false
	};
	var o=$(this);
	var methods={
			caculate:function(o){
				var dO=$(document);
				var wO=$(window);
				var result={sT:dO.scrollTop(),sL:dO.scrollLeft(),wH:wO.height(),wW:wO.width()};
				if (typeof o!='undefined'){
					result.dW=o.outerWidth(true);
					result.dH=o.outerHeight(true);
				}
				return result;
			},
			init:function(p){
				s = $.extend(s, p);
				o.data('options',s);
				var dId=o.attr('id')?o.attr('id'):parseInt(Math.random()*1000000);
				if ($('#YY_dialog_ctn_'+dId).length>0)$('#YY_dialog_ctn_'+dId).remove();
				var d=$('<div id="YY_dialog_ctn_'+dId+'" class="YY_dialog_ctn"></div>');
				o.data('dialogId',dId);
				
				$('body').append(d);
				d.css({'overflow':'hidden',width:s.width,height:s.height,'position':'absolute','z-index':s.zIndex,'display':'none','overflow':'hidden'});
				if (s.pack)d.css({'background':'#fff',border:'3px solid #ddd','border-radius':'10px'});
				if (s.forceCenter) d.attr('position', 'center');
				var c=$('<div class="YY_dialog"></div>');//dialog内容容器
				d.append(c);
				//o.css('position','absolute');
				var oS=methods.caculate(o);//对话框原始内容对象
				//console.log(oS);
				if (s.closable&&s.pack||s.showClose){
					if (s.showClose){
						c.append('<b>×</b>');
						c.children('b').click(methods.hide).css({'color':'#000','position':'absolute','cursor':'pointer','text-align':'center','width':'16px','height':'16px','line-height':'16px','top':'7px','right':'7px','overflow':'hidden'});
					}
					//if (typeof (s.close) == 'function') c.children('b').get(0).close = s.close;
					if (s.autoClose){c.append('<s style="font-size:9px;position:absolute;right:3px;color:#bbb;bottom:0;text-decoration:none;"><a style="color:#bbb;"></a>秒后关闭</s>');}
				}
				if (s.pack){
					if (s.title&& s.title != ''){
						c.append('<h2>'+s.title+'</h2>');
						if (s.draggable) d.drage({handle:'h2'/*,drag:s.drag,dragStart:s.dragStart,dragStop:s.dragStop*/});
						c.children('h2').css({'padding':'0 25px 0 0',margin:0,'color':'#666','background':'#efefef','padding-left':'10px','line-height':'30px','height':'30px','font-size':'14px'}).get(0).onselectstart = new Function("return false");
					}
					var cC=$('<div class="YY_dialog_content" style="white-space:normal;padding:10px; word-break:break-all;"></div>');
					c.append(cC);
					cC.css({'width':oS.dW,'height':oS.dH,'background':'#fff'});
					if (o.length==1)cC.append(o);
				}else{
					//c.width(oS.dW)/*.height(oS.dH)*/;
					c.append(o);
				}
				o.show();
				if (typeof (s.buttons) == "object") {
					var actCtn=$('<div class="action" style="text-align:center;padding:5px 10px;background:#fefefe;border-top:1px solid #eee;"></div>');
					c.append(actCtn);
					for (n in s.buttons) {
						if (s.buttons[n].name != '' && s.buttons[n].action != null) {
							var btnAttr=' name="'+n+'"';
							if (s.buttons[n].enter_key)btnAttr=' focus="true"';
							var btnO=$('<button'+btnAttr+'>'+s.buttons[n].name+'</button>');
							btnO.css({display:'inline-block'});
							if (s.buttons[n].action == 'close')
								btnO.click(methods.hide);
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
				var s=o.data('options');
				$('#YY_dialog_ctn_'+o.data('dialogId')).show();
				if (this.pos_x == null) methods.centerDialog();
				$("#YY_dialog_ctn_" + this.content_id).show().css('opacity',0).stop().animate({opacity:1},500);
				//hide_select();
				//if (this.focus_btn != '') $('#'+s.focus_btn).focus();
				//if ($('#YY_mask').length>0)$('#YY_mask').attr('content_id',this.content_id).attr('closable',this.closable);
				if (s.easyClose){
					$(document).bind('keydown',methods.escClose);
					$('#YY_mask').attr('title','点击此处即可快速[关闭]对话框').bind('click',this.close_dialog);
				}
				if (this.auto_close){
					$('#YY_dialog_ctn_'+this.content_id).find('s').show().find('a').html(this.auto_close);
					setTimeout($.proxy(this.autoCloseCountDown,this),1000);
				}else{
					$('#YY_dialog_ctn_'+this.content_id).find('s').hide();
				}
				if (s.hideScroll){
					$('html').css({'position':'relative','height':$(window).height()});
					$('html,body').css({'overflow':'hidden'});
					$('body').css({'margin-top':-$('body').scrollTop(),height:$(window).height()+$('body').scrollTop()}).scrollTop(0);
				}
				if (s.restrict) {
					methods.showMask();
					$(window).bind('resize',methods.setMask);
					$(window).bind('scroll',methods.setMask);
				}
			},
			hide:function(){
				console.log('close');
				var s=o.data('options');
				if (typeof (s.close) == 'function')s.close();
				if (s.closable||s.closable=='true'){
					//s.hideSelect(false);
					$('#YY_dialog_ctn_' + o.data('dialogId')).stop().fadeOut();
					$('#YY_mask').stop().fadeOut(methods.afterClose);
					if (s.easyClose){
						$(document).unbind('keydown',methods.escClose);
						$('#YY_mask').unbind('click',methods.close);
					}
				}else{
					alert('此对话框内的操作在完成之前对话框将无法关闭，请继续');
				}
			},
			afterClose:function(){
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
				var s=o.data('options');
				var _st=$(document).scrollTop();
				var _sl=$(document).scrollLeft();
				var dO=$('#YY_dialog_ctn_'+o.data('dialogId'));
				var dS=methods.caculate(dO),_top,_left;
				if (s.hideScroll){
					_top = Math.floor((dS.wH - dS.dH) / 2);
					_left = Math.floor((dS.wW - dS.dW) / 2);
				}else{
					_top = Math.floor(_st + (dS.wH - dS.dH) / 2);
					_left = Math.floor(_sl + (dS.wW - dS.dW) / 2);
				}
				if (dS.wW<dS.dW)_left=0;
				if (dS.wH<dS.dH)_top=0;
				dO.css({'top':_top,'left':_left});
			},
			escClose:function(e){
				if (e.keyCode);
			},
			//show mask layer
			showMask:function(){
				var s=o.data('options');
				var mskO=$('#YY_mask');
				if (mskO.length==0) {
					mskO=$('<div id="YY_mask"></div>');
					$('body').append(mskO);
				}
				mskO.show().css({'cursor':'wait','top':0,'left':0,'z-index':s.zIndex-1,'background':'#000','position':'absolute','opacity':'0.5'});
				methods.setMask();
			},
			//fix mask width , height & position
			setMask:function(){
				var s=o.data('options');
				var wO=methods.caculate();
				var mskO=$('#YY_mask');
				mskO.css({width:wO.sL+wO.wW,height:wO.sT+wO.wH});
				if (s.hideScroll){
					mskO.css({width:wO.sL+wO.wW-$('body').css('margin-left').replace('px',''),height:wO.sT+wO.wH});
				}
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
function showMsg(s,callBack){
	if (typeof s=='undefined')return false;
	if (typeof d=='undefined')d=false;
	if ($('#YY_dialog_ctn_info_dialog').length==0){
		$('body').append('<div id="info_dialog"><p></p></div>');
	}
	$('#info_dialog p').html(s);
	var c=$('#info_dialog');
	if (typeof t!='undefined'&&t!=''){
		c.find('p').attr('class',t);
	}
	c.find('p').html(s);
	if ($('#YY_dialog_ctn_info_dialog').length==0){
		var p_info={restrict:true,content_id:"info_dialog",width:200,easyClose:true,closable:true,showClose:true,close:callBack,force_center:true};
		$('#info_dialog').YY_dialog(p_info);
	}else{
//		info_dialog.auto_close=d;
//		info_dialog.render_dialog();
	}
	$('#info_dialog').YY_dialog('open');
}