/**
 * 
 */
//var CWM = window.CWM || {};
//window.CWM = CWM;

window.CWPla = CWM.CWPla = window.CWPla || {};//教材预览功能
CWPla.player=$('#previewPlayer');
CWPla.playStage=$('#playStage');
CWPla.pageCtn=$('#playPageCtn');
CWPla.bgMusicCtn=$('#backgroundMusic');
CWPla.voiceCtn = $(".pageContentCtn .voice");
CWPla.bgMusicBtn=$('.btnMusic');
CWPla.bottomCtn=$('#playPaginatorCtn');
CWPla.paginator=$('#playPaginatorCtn>.playPaginator');
CWPla.pages=[]; // 预览页面的pages
CWPla.nextPage=function(){};
CWPla.prevPage=function(){};
CWPla.nextPage=function(){};
CWPla.scaleStage=function(){
	var oW=800*CWM.scale,oH=500*CWM.scale,aspectRatio=oH/oW;
	var wW=$(window).width();
	var wH=$(window).height();
	var tW,tH,tL,tH,tS;
	if (wH/wW>aspectRatio){//height is longer
		tW=wW;
		tH=wW*aspectRatio;
		tL=0;
		tT=(wH-tH)/2;
	}else{//width is longer
		tW=wH/aspectRatio;
		tH=wH;
		tL=(wW-tW)/2;
		tT=0;
	}
	tS=tW/oW;
	CWPla.playStage.css({left:tL,top:tT,width:tW,height:tH});
	CWPla.pageCtn.css({width:oW,height:oH,transform:'scale('+tS+')'});
	
	$(".swf").each(function(){
		if($(this).parent().hasClass("pageContentCtn"))
		$(this).css({transform:'scale('+1/tS+')'});
	});
	//CWPla.pageCtn.css({width:oW,height:oH});
	//
};
CWPla.show=function(){
	var curPage=CWM.CW.curPage-1;
	CWPla.getContent();
	CWPla.initPaginator();
	CWPla.chgPage(curPage);
	CWPla.player.fadeIn(100);
	$('body').css('overflow','hidden');
	CWPla.scaleStage();
	$(window).bind({resize:CWPla.scaleStage,scroll:CWPla.scaleStage});
	if (CWM.CW.bgMusicUrl==''){
		CWPla.bottomCtn.addClass('noBgMusic');
	}else{
		CWPla.bottomCtn.removeClass('noBgMusic');
		CWPla.bgMusicCtn.attr('src',CWM.CW.bgMusicUrl);
		CWPla.bgMusicCtn[0].play();
		CWPla.bgMusicBtn.removeClass('btnMusicNo').show();
	}
	CWPla.player.find("del").css("display","block");
};
//汇出前得到预览html by gaolei
CWPla.showExport=function(){
	var curPage=CWM.CW.curPage-1;
	CWPla.getContent();
	CWPla.initPaginator();
	CWPla.chgPage(curPage);
	$('body').css('overflow','hidden');
	CWPla.scaleStage();
	$(window).bind({resize:CWPla.scaleStage,scroll:CWPla.scaleStage});
	if (CWM.CW.bgMusicUrl==''){
		CWPla.bottomCtn.addClass('noBgMusic');
	}else{
		CWPla.bottomCtn.removeClass('noBgMusic');
		CWPla.bgMusicCtn.attr('src',CWM.CW.bgMusicUrl);
		CWPla.bgMusicCtn[0].play();
		CWPla.bgMusicBtn.removeClass('btnMusicNo').show();
	}
};
CWPla.getContent=function(){
	var s='';
	for (var i=0;i<CWM.CW.pages.length;i++){
		var curPage=$('<div>'+CWM.CW.pages[i]+'</div>');
		curPage.find('.segmentCtn[placeholder]').each(function(){
			var o=$(this);
			if (o.text()==$(o.attr('placeholder')).text()){
				o.remove();
			}
		});
		curPage.find('.mediaCtn').each(function(){
			var o=$(this);
			if (o.find('p').length>0){
				o.remove();
			}
		});
		curPage=curPage.find('.segmentCtn').removeClass('active editing').end().html();		
		s+='<div class="pageContentCtn">'+curPage+'</div>';
	}
	CWPla.pageCtn.html(s);
	CWPla.pageCtn.find('input').attr('disabled','disabled');
	CWPla.pageCtn.find('img').removeAttr('oriWidth').removeAttr('oriHeight').removeAttr('oriLeft').removeAttr('oriTop');
	
	//预览隐藏注解数字统计
	CWPla.pageCtn.find('p[class="t_top"]').find('b').css("visibility","hidden");
	CWPla.pageCtn.find('audio').click(function(e){e.stopPropagation();});
	CWPla.pageCtn.find('.voice').toggle(function(){
		o = $(this);
		var fileId = o.find("audio").attr("id");
		var fileUrl = o.find("audio").get(0).src;
		var media = o.find("audio").get(0);
		localStorage[fileId]?fileUrl = o.find("audio").attr("data-url"):fileUrl = o.find("audio").attr("src");
		
		media.removeEventListener("error",function(ev){console.log("load voice error!");},false);
		media.removeEventListener("loadstart",function(e){o.find(".voice_wait").show();console.log("loadstart from:" + media.currentSrc);},false);
		media.removeEventListener("canplay",function(e){o.find(".voice_wait").hide();o.find("audio").fadeIn(500*CWM.scale);console.log("canplay");},false);
		
		media.addEventListener("error",function(ev){console.log("load voice error!");},false);
		media.addEventListener("loadstart",function(e){o.find(".voice_wait").show();console.log("loadstart from:" + media.currentSrc);},false);
		media.addEventListener("canplay",function(e){o.find(".voice_wait").hide();o.find("audio").fadeIn(500*CWM.scale);console.log("canplay");},false);
		
		media.src = fileUrl;
		media.load();
		
		if(o.css('left').replace('px','')>(800*CWM.scale-300-30) && o.css('top').replace('px','')>(500*CWM.scale-60)){
			o.find('audio').removeClass('audiobg').addClass('audiobg_top')
		}else if(o.css('left').replace('px','')>(800*CWM.scale-300-30)){
			o.find('audio').removeClass('audiobg').addClass('audiobg_')
		}else if(o.css('top').replace('px','')>(500*CWM.scale-60)){
			o.find('audio').removeClass('audiobg').addClass('audiobg_top_')
		}
		
		
	},function(){
		o = $(this);
		var media = o.find("audio").get(0);
		o.removeClass("active").find("audio").fadeOut(500*CWM.scale);
	});
};
//by gaolei 预览的时候对原来页面进行clean:去掉空的模板，去掉选择状态,等等
CWPla.clean=function(){
	for (var i=0;i<CWM.CW.pages.length;i++){
		var curPage=$('<div>'+CWM.CW.pages[i]+'</div>');
		curPage.find('.segmentCtn[placeholder]').each(function(){
			var o=$(this);
			console.log(o.text()+'===='+$(o.attr('placeholder')).text());
			if (o.text()==$(o.attr('placeholder')).text()){
				o.remove();
			}
		});
		curPage.find('.mediaCtn').each(function(){
			var o=$(this);
			if (o.find('p').length>0){
				o.remove();
			}
		});
		curPage=curPage.find('.segmentCtn').removeClass('active editing').end().html();		
		CWPla.pages[i]=curPage;
	}
};	
CWPla.exit=function(){
	CWPla.player.fadeOut();
	$('body').css('overflow','hidden');
	$(window).unbind({resize:CWPla.scaleStage,scroll:CWPla.scaleStage,keydown:CWPla.keyAction});
	$('body').css('overflow','auto');
	CWPla.bgMusicCtn[0].pause();
	CWPla.paginator.removeClass('thumbMode').addClass("numMode");
	$('.imgTool').hide();
	CWPla.Voice.destory();
	CWPla.Media.exit();
};

CWPla.initPaginator=function(){
	CWPla.clean();
	var pageCount=CWPla.pageCtn.find('.pageContentCtn').length;
	var str='';
	for (var i=0;i<pageCount;i++){
		str += '<li  name="CWNote"';
		var j=parseInt(i)+1;
		str += '>'+'<div class="prevCtn">'+CWPla.pages[i]+'</div>'
				+ '<button type="button" class="lt_num">' + j
				+ '</button></li>';
	}
	CWPla.paginator.find('.pageThumb ul').html(str);
	CWPla.paginator.find('ul').width(pageCount<6?562:(142+106*(pageCount-1)));
};
CWPla.tools={};
CWPla.tools['img']=function(){
	$('.imgTool').show();
};

CWPla.Media={};
CWPla.Media.playerCtn=$('#mediaPlayer');
CWPla.Media.mediaCtn=CWPla.Media.playerCtn.find('.contentCtn');
CWPla.Media.imgTool=CWPla.Media.playerCtn.find('.imgTool');
CWPla.Media.showImg=function(o){
	var img=o.clone();
	img.removeAttr('style').css("-webkit-transform",o.css("-webkit-transform"));
	CWPla.Media.imgTool.show();
	// 重置缩放按钮位置
	CWPla.Media.imgTool.find(".zoom_area").find(".btnZoom_dot").css("left","");
	CWPla.Media.mediaCtn.html(img);
	CWPla.Media.playerCtn.fadeIn();
	var w=CWPla.Media.playerCtn.width(),h=CWPla.Media.playerCtn.height();
	console.log(w,h);
	CWM.Img.selfadaption(w,h,img[0]);
};
CWPla.Media.exit=function(o){
	CWPla.Media.imgTool.hide();
	CWPla.Media.playerCtn.fadeOut();
};

CWPla.Voice = {};
CWPla.Voice.destory = function(){
	$('.voice_wait').hide();
	$("audio").each(function(){
		$(this).get(0).pause();
	});
};

CWPla.Media.showMovie=function(o){
	CWPla.Media.playerCtn.html(o);
};
CWPla.chgPage=function(n){
	if (typeof n=='undefined')n='next';
	var tarPage,curPage=CWPla.paginator.find('ul>li[name="CWNote"]').index(CWPla.paginator.find('ul>li.c'));
	if (n=='prev'){
		tarPage=curPage-1;
	}else if(n=='next'){
		tarPage=curPage+1;
	}else{
		tarPage=n;
	}
	tarPage=tarPage<0?0:(tarPage>=CWPla.paginator.find('ul>li[name="CWNote"]').length?CWPla.paginator.find('ul>li[name="CWNote"]').length-1:tarPage);
	CWPla.pageCtn.find('.pageContentCtn').hide().eq(tarPage).show();
	var list=CWPla.paginator.find('ul>li[name="CWNote"]');
	list.removeClass('c').eq(tarPage).addClass('c');
	
	//控制滚动条的移动
	var tl = CWPla.paginator.find('.thumbList');
	if (tarPage+1 <= 3) {
		tl.scrollLeft(0);
	}else {
		tl.scrollLeft(((tarPage+1-3)/list.length)*CWPla.paginator.find('ul').width());
	}
	
	CWPla.paginator.find('.pageNum>p').html((tarPage+1)+' / '+list.length);
};
CWPla.keyAction=function(e){
	var key=e.keyCode;
	if (key=='37'||key=='33'){
		CWPla.chgPage('prev');
	}else if (key=='39'||key=='34'){
		CWPla.chgPage();
	}else if (key=='27'){
		CWPla.exit();
	}
};
CWPla.bgMusic=function(){
	
};
CWPla.int=function(){
	CWPla.paginator.click(function(e){
		e.stopPropagation();
		var o=$(e.target);
		//点击li,进行页面切换
		if (o.parents('[name="CWNote"]').length>0){
			o=o.parents('[name="CWNote"]');
			var pageNum = o.parent('ul').children('li').index(o);
			CWPla.chgPage(pageNum);
			return false;
		}
		if (o[0].tagName=='BUTTON'){
			var tar='next';
			if (o.hasClass('prevBtn')){
				tar='prev';
			}
			CWPla.chgPage(tar);
			
			return false;
		}
		if ($(this).hasClass('numMode')){
			$(this).removeClass('numMode').addClass('thumbMode');
		}else{
			$(this).removeClass('thumbMode').addClass('numMode');
		}
	});
	CWPla.player.find('del').click(CWPla.exit);
	CWPla.bgMusicBtn.click(function(){
		var o=$(this);
		if (o.hasClass('btnMusicNo')){
			console.log(CWPla.bgMusicCtn.length);
			CWPla.bgMusicCtn[0].play();
		}else{
			CWPla.bgMusicCtn[0].pause();
		}
		o.toggleClass("btnMusicNo");
	});
	CWPla.Media.imgTool.find('button.btn_exit').click(CWPla.Media.exit);

	$(document).bind('keydown',CWPla.keyAction);
	
	//点击事件
	CWPla.pageCtn.mousedown(function(e){
		e.stopPropagation();
		var o=$(e.target);
		if (!o.hasClass('segmentCtn')&&o.parents('.segmentCtn').length>0)o=o.parents('.segmentCtn');
		CWEdt.curMover=o;
		if (o.hasClass('mediaCtn')||o.hasClass('dragImg')){
			CWPla.Media.showImg(o.find('img'));
			return false;
		}
		//网站连接
		else if(o.hasClass('urlLink')){
			var url=o.find(".url_hide").html();
			if (url!="") {
				if (url.indexOf("http://")==-1) {
					url ="http://"+url;
				}
			}
			window.open(url,"");
		}
		//注解
		else if(o.hasClass('noteTag')&&o.hasClass('active')){
			o.removeClass("active");
		}
		//注解
		else if(o.hasClass('maskBoard')){
			if (o.css("opacity")==1) {
				o.css("opacity",0.3);
			}else{
				o.css("opacity",1);
			}
		}
		//页面连接
		else if(o.hasClass('pageLink')){
			if (o.attr("name")) {
				CWPla.chgPage(o.attr("name")-1);
			}
		}
		else{
			CWEdt.setActive(true);
		}
		
	});
	// 汇出后预览用到 by gaolei
	CWPla.scaleStage();
	$(window).bind({resize:CWPla.scaleStage,scroll:CWPla.scaleStage});
	
	$('.zoom_area').progre({drag:function(o,p){CWM.Img.resize(CWPla.Media.mediaCtn.find('img')[0],p.position.ratio);}});
	
};
CWPla.int();
