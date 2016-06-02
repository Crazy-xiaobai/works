
var filterId = 0;
var len = filesData.length;
var operateFile;
var arrPath = {
	path:[],
	id:[]
};

$(function (){

	/* ====== 设置元素的高度 ====== */
	(function() {
		objHeight($(".main"));
		objHeight($(".contentVeiw"));
		objHeight($(".fileBox"));

		//窗口改变重新设置元素的高度
		$(window).resize(function(event) {
			objHeight($(".main"));
			objHeight($(".contentVeiw"));
			objHeight($(".fileBox"));
		});
		//设置元素的高度
		function objHeight(obj){
			var height = null;
			if(obj.parent().is("body")){
				height = $(window).height() - obj.prev().outerHeight();
			}else{
				height = obj.parent().outerHeight() - obj.prev().outerHeight();
			}
			obj.css('height', height);
		};
	})();

	/* ====== 展开闭合目录树 ====== */
	$(".directory").on('click',function (){
		var dirTree = $(".sideBar");
		var contentVeiw = $(".contentVeiw");
		if($(this).hasClass('cur')){
			$(this).removeClass('cur')
			dirTree.removeClass('cur');
			contentVeiw.css('paddingLeft', 0);
		}else{
			$(this).addClass('cur')
			dirTree.addClass('cur');
			contentVeiw.css('paddingLeft', dirTree.outerWidth());
		}
	});

	/* ====== 初始化用户数据，生成页面元素， ====== */

	//阻止右键默认菜单
	$(document).bind('click',function (event){
		$('#menushow').hide();
		$('#menuView').hide();

		event.preventDefault();
	});
	$(document).bind('contextmenu',function (){
		return false;
	});
	(function (){
		//渲染用户的文件和目录树
		listContent(getChid(0));
		dirContent(getChid(0));

		//根目录“乐视云”初始化
		var dir = $('.sideBar>.item');
		dir.data('fileId',filterId);
		//乐视云展开闭合
		dir.click(function (){
			dir.addClass('active');
			$('.nullFile').hide();
			listContent(getChid(0));
			dirContent(getChid(0));
			$('#pathShow').html('');
		});
		//乐视云三角展开闭合
		$('.ico').eq(0).click(function (event){
			if($(this).hasClass('cur')){
				$(this).removeClass('cur');
				dir.next().hide();
			}else{
				$(this).addClass('cur');
				dir.next().show();
			};
			event.stopPropagation();
		});
		//全部文件按钮
		$('.minAllFile').click(function (){
			dir.addClass('active')
			$('.nullFile').hide();
			listContent(getChid(0));
			dirContent(getChid(0));
			$('#pathShow').html('');
		});
	})();

	/* ====== 新建文件夹操作 ====== */
	operateFile = {
		/*确定新建文件夹*/
		sureBtn: function (obj){
			var that = this;
			obj.find('.sureBtn').on("click",function (event){
				that.sureFn(event);
			});
			$(".makeFold .editTxt").keydown(function(event){
				if(event.keyCode==13){
					that.sureFn(event);
				};
			});
		},
		/*取消新建文件夹*/
		cancelBtn: function (obj){
			obj.find('.cancelBtn').bind("click",function (event){
				$('.makeFold').remove();
				event.stopPropagation();
			});
		},
		/*新建文件夹函数*/
		newFolderFn: function() {
			var that = this;
			//自动选中input框中的内容
				$(".makeFold .editTxt").eq(0).focus();
				$(".makeFold .editTxt").eq(0).select();

			if($('.makeFold').length>0){
				$('#newtipbox').addClass('warning');
				$('#newtipbox .tipTxt').html('请完成或撤销本次操作');
				tip();
				return false;
			}else{
				if($('#fileList').children().length == 0){
					$('#fileList').html('');
					$('.nullFile').hide();
				}
				var file = NewFolder();
				$('#fileList').append(file);

				//自动选中input框中的内容
				$(".makeFold .editTxt").eq(0).focus();
				$(".makeFold .editTxt").eq(0).select();

				that.sureBtn(file);
				that.cancelBtn(file);
			};
		},
		/*确定函数*/
		sureFn: function (event){
			var filename = $('.makeFold .editTxt').val();
			for(var i=0;i<filesData.length;i++){
				if(filesData[i].pid == filterId ){
					if(filesData[i].name == filename ){
						$('#newtipbox').addClass('warning');
						$('#newtipbox .tipTxt').html('文件名有冲突，请重新命名');
						tip();
						return;
					};
				};
			};
			var objData = {
				id : ++len,//++数据的长度
		        pid : filterId,
		        name : filename,
		        type : 'floder'
			};
			filesData.push(objData);

		    listContent(getChid(filterId));

		    dirInsert(true);

		    $('#newtipbox').addClass('success');
			$('#newtipbox .tipTxt').html('新建文件夹成功');
			tip();

		    $(this).off();
		    event.stopPropagation();
		}
	};

	/* ====== 返回上一级事件 ====== */
	$('.prevPath ').on('click',function(){
		if($('#fileList').children().length == 0){
			$('#fileList').html('');
			$('.nullFile').hide();
		};
		if (filterId==0){
			$('#newtipbox').addClass('warning');
			$('#newtipbox .tipTxt').html('已在根目录下了')
			tip();
			return false;
		};
        var chil=getInfo(filterId);
        if(filterId){
            filterId=chil.pid;
        }
        listContent(getChid(filterId));
        dirInsert(false);
        listPath(filterId);
    });

	/* ====== 全选事件 ====== */
	$('.AllSelect').bind('click',function (){
		var that = $(this);
		$(this).toggleClass('cur');
		$('#fileList li').each(function(index, el) {
			if(that.hasClass('cur')){
				$(el).addClass('cur');
			}else{
				$(el).removeClass('cur');
			};
		});
	});

	/* ====== 重命名文件 ====== */
	$('#renameBtn').bind('click',renameFn);

	/* ====== 删除文件 ====== */
	$('#deletBtn').bind('click',deleteFn);

	/* ====== 右键重命名 ====== */
	$('#frename').on('click',renameFn);

	/* ====== 右键删除文件 ====== */
	$('#batchdel').on('click',deleteFn);

	/* ====== 右键打开文件 ====== */
	$('#open').on('click',function() {
		var obj = $('#fileList li.cur');
		fileClick(obj);
	});

	/* ====== 右键空白区阻止默认样式 ====== */
	$('.fileBox').on('contextmenu',function(event) {
		$('#menuView').show();
		$('#menushow').hide();

		$('#menuView').css({
			top: event.pageY+'px',
			left: event.pageX+'px'
		});
		event.stopPropagation();
		event.preventDefault();
	});

	/* ====== 右键新建文件夹 ====== */
	$('.createFolder').bind('click',function (){
		operateFile.newFolderFn();
	});

	/* ====== 右键新建文件夹 ====== */
	$('#newFile').on('click',function() {

		operateFile.newFolderFn();
	});
});

/* ====== 通过id找元素 ====== */
function getInfo(id){
    for(var i=0;i<filesData.length;i++){
        if(filesData[i].id==id){
            return filesData[i];
        }
    }
};

/* ====== 重命名文件函数 ====== */
function renameFn(){
	if($('#fileList li').length == 0) {
		return false;
	};
	var renameObj = $('#fileList li.cur');
	if(renameObj.length > 1){
		$('#newtipbox').addClass('warning');
		$('#newtipbox .tipTxt').html('只能对单个文件重命名')
		tip();
		return false;
	}else if(renameObj.length == 0){
		$('#newtipbox').addClass('warning');
		$('#newtipbox .tipTxt').html('请选择文件');
		tip();
		return false;
	}
	renameObj.find('.editBox').show();
};

/* ====== 删除文件夹事件函数 ====== */
function deleteFn(event){
	event.stopPropagation();
	if($('#fileList li').length == 0) {
		return false;
	};
	var dataDel = [];
	var delObj = $('#fileList li.cur');
	if(delObj.length == 0) {
		$('#newtipbox').addClass('warning');
		$('#newtipbox .tipTxt').html('请选择文件');
		tip();
		return false;
	};
	delObj.each(function(index, el) {
		dataDel.push($(el).data('fileId'))
	});
	delObj.remove();

	for(var i=0;i<dataDel.length;i++){
		delData(dataDel[i]);
	};
	for(var i=0;i<dataDel.length;i++){
		for(var j=0;j<filesData.length;j++){
			if(filesData[j].id == dataDel[i]) {
				filesData.splice(j,1);
				delTree(dataDel[i]);
				--j;
			}
		};
	};
	if($('#fileList li').length == 0) {
		$('.item.active .leftIcoBtn').removeClass('ico yunpan_icon');
	};

	$('#newtipbox').addClass('success');
	$('#newtipbox .tipTxt').html('删除成功');
	tip();
};

/* ====== 删除数据 ====== */
function delData(id){
	for(var j=0;j<filesData.length;j++){
		if(id == filesData[j].pid){
			delData(filesData[j].id)
			filesData.splice(j,1);
			j--;
		}
	};
	return false;
};

/* ====== 删除左侧目录树结构 ====== */
function delTree(id){
	$('.item').each(function(i) {
		var itemId = $(this).data('fileId');
		if(itemId == id) {
			$(this).next().remove();
			$(this).remove();
			if($('#fileList li').length == 0) {
				$('.AllSelect').removeClass('cur');
				$('.nullFile').show();
			}
			return false;
		}
	});
};

/* ====== 重命名确定事件 ====== */
function renameSure(event){
	event.stopPropagation();
	var renameObj = $(this).parents('.fold');
	var editTxt = renameObj.find('.editTxt');
	renameObj.find('.foldName').html(editTxt.val());
	renameObj.find('.editBox').hide();
	for(var i=0;i<filesData.length;i++){
		if(filesData[i].id == renameObj.data('fileId')){
			filesData[i].name = editTxt.val();
		}
	};
	var leftFile = $('.sideBar .active').next().find('.item');
	leftFile.each(function(index, el) {
		if($(el).data('fileId') == renameObj.data('fileId')){
			$(el).find('.text').html(editTxt.val());
		}
	});
	$('#newtipbox').addClass('success');
	$('#newtipbox .tipTxt').html('更名成功')
	tip();
};

/* ====== 选中文件事件 ====== */
function fileSelected (obj){
	obj.parent().toggleClass('cur');
	//所有的文件是否都已被选择
	if($('#fileList li.cur').length===$('#fileList li').length){
		$('.AllSelect').addClass('cur');
	}else{
		$('.AllSelect').removeClass('cur');
	};
};

/* ====== 渲染右侧文件列表 ====== */
function listContent(data){
	var contentBox = $('#fileList');
	contentBox.html('');
	var li = null;
	if(data.length == 0){
		contentBox.html('');
		$('.nullFile').show();
	}else{
		$.each(data, function(index, val) {
			if(data[index].type == 'floder'){
				li = createFolder(data[index],false);
			}else{
				//内容待定
			};

			li.data('fileType', data[index].type);
			li.data('fileId', data[index].id);

			//绑定文件选中事件。
			li.find('.checked').bind('click',function(event) {
				fileSelected($(this));
				event.stopPropagation();
			});

			//绑定文件点击事件。
			li.bind('click',function() {
				fileClick($(this));
			});

			//绑定右键事件。
			li.bind('contextmenu',function (event){

				$('#fileList li').each(function(index, el) {
					$(this).removeClass('cur');
				});
				fileSelected($(this).find('.checked'));
				$(this).addClass('cur')
				$('#menushow').show();
				$('#menuView').hide();
				$('#menushow').css({
					top: event.pageY+'px',
					left: event.pageX+'px'
				});
				event.stopPropagation();
				event.preventDefault();

			});

			//确定按钮
			li.find('.sureBtn').bind('click',renameSure);

			//取消按钮
			li.find('.cancelBtn').click(function(event) {
				li.find('.editBox').hide();
				event.stopPropagation();
			});

			//input按钮
			li.find('.editTxt').click(function(event) {
				event.stopPropagation();
			});

			//右侧文件Box
			contentBox.append(li);
		});
	};
};

/* ====== 渲染左侧目录树列表 ====== */
function dirContent(data,dirBox){
	var box = $('.sideBar>.itemBox');
	dirBox = dirBox || box;
	dirBox.html('');
	var div = null;
	var paddL = parseFloat(dirBox.prev().css("paddingLeft")) + 14;

	$.each(data, function(index, val) {

		div = createDir(data[index]);
		div.eq(0).css('paddingLeft',paddL)

		div.eq(0).data('fileId', data[index].id);

		//调用三角点击事件和目录点击事件。
		dirAddEvent(div.eq(0),data[index]);

		//左侧目录dirBox
		dirBox.append(div);
	});
};

/* ====== 获取文件的数据用于右侧渲染 ====== */
function getChid(pid){
	var data = [];
    for(var i=0;i<filesData.length;i++){
        if(filesData[i].pid == pid){
            data.push(filesData[i]);
        }
    };
    return data;
};

/* ====== 文件点击事件 ====== */
function fileClick(obj){
	if(obj.data('fileType') == 'floder'){
        filterId = obj.data('fileId');
        if(getChid(filterId).length>0){

        	listContent(getChid(filterId));
        }else{
        	$('#fileList').html('')
        	$('.nullFile').show();
        }
        dirInsert(false);
    	listPath(filterId);
    };
};

/* ====== 在目录树对应位置插入目录 ====== */
function dirInsert(onOff){
	//大清洗
	$('.sideBar .item').removeClass('active');

    $('.sideBar .item').each(function (index,val){
    	var tri = $(this).find('.leftIcoBtn')
    	if($(val).data('fileId') == filterId){
    		if(onOff && !tri.hasClass('ico')){
    			tri.addClass('ico yunpan_icon cur')
    		}
    		$(this).addClass('active');
    		dirContent(getChid(filterId),$(this).next());
    	}
    	return;
    });
};

/* ====== 三角点击事件和目录点击事件 ====== */
function dirAddEvent(obj,data){

	var oItemBox = obj.next();
	//var id = obj.data('fileId');
	var paddL = parseFloat(obj.css("paddingLeft")) + 14;
	var triBtn = obj.find('.leftIcoBtn');
	//三角展开事件
	triBtn.bind('click',function (event){

		if($(this).hasClass('cur')) {
			oItemBox.hide();
		}else {
			if(oItemBox.children().length>0){
				oItemBox.show();
			}else{
				for(var i=0;i<filesData.length;i++){

					if(filesData[i].pid == data.id){

						var div = createDir(filesData[i]);
						//div.data('fileId', filesData[i].id);
						oItemBox.append(div);
						div.eq(0).css('paddingLeft',paddL);

						dirAddEvent(div.eq(0),filesData[i]);
					}
				};
			}
		};
		$(this).toggleClass('cur');
		event.stopPropagation();
	});

	//目录列表事件，打开右边对应的文件夹
	obj.bind('click',function() {
		$('.nullFile').hide();
		//被点击的目录加上active
		$('.sideBar .item').removeClass('active');
		$(this).addClass('active');
		//展开对应的目录
		if(!$(this).find('.leftIcoBtn').hasClass('cur')) {

			if(oItemBox.children().length>0){
				oItemBox.show();
			}else{

				for(var i=0;i<filesData.length;i++){

					if(filesData[i].pid == data.id){

						var div = createDir(filesData[i]);
						div.data('fileId', filesData[i].id);
						oItemBox.append(div);
						div.eq(0).css('paddingLeft',paddL);

						dirAddEvent(div.eq(0),filesData[i]);
					}
				};
			}
			$(this).find('.leftIcoBtn').addClass('cur')
		};

		//列出右侧对应的文件
		var id = $(this).data('fileId');
		filterId = id;
		listContent(getChid(id));

		listPath(id);
	});
};

/* ====== 渲染路径列表 ====== */
function listPath(id){

	$('#pathShow').html('');
	arrPath.path.length = arrPath.id.length = 0;
	findPath(id);
	for(var i=0;i<arrPath.path.length;i++){
		var li = createPath(arrPath.path[i]);

		li.data('fileId',arrPath.id[i])
		//绑定路径点击事件。
		li.bind('click',pathClick);

		$('#pathShow').append(li);

	};
	$('#pathShow li a').removeClass('active');
	$('#pathShow li a:last').addClass('active');
};

/* ====== 路径点击事件 ====== */
function pathClick(){
    filterId = $(this).data('fileId');
    if(getChid(filterId).length>0){
    	$('.nullFile').hide();
    	listContent(getChid(filterId));
    }else{
    	$('#fileList').html('')
    	$('.nullFile').show();
    }
    dirInsert(false);
    listPath(filterId);
};

/* ====== 获取路径数据 ====== */
function findPath(pid) {
	for(var i=0; i<filesData.length; i++) {
		if(pid == filesData[i].id) {
			arrPath.path.unshift(filesData[i].name);
			arrPath.id.unshift(filesData[i].id);
			findPath(filesData[i].pid);
		}
	};
	return false;
};

/* ====== 生成用户文件夹结构 ====== */
function createFolder(data,editBoxShow){
	var name = '';
	if(data.name){
		name = data.name
	}else{
		name = '新建文件夹'
	}
	var str = '<div class="checked yunpan_icon"></div>'
				+'<div class="foldBg doc_icon_big"></div>'
				+'<p class="foldName ellipsis">'+name+'</p>'
				+'<div class="editBox NewfoldName">'
				+	'<input type="text" class="editTxt" value="'+name+'" maxlength="100">'
				+	'<p class="editBtn">'
				+		'<span class="sureBtn yunpan_icon">确定</span>'
				+		'<span class="cancelBtn yunpan_icon">取消</span>'
				+	'</p>'
				+'</div>';
	var li = null;
	if(editBoxShow){
		li = $('<li id="'+data.id+'" pid="'+data.pid+'" class="makeFold"></li>').html(str)
	}else{
		li = $('<li id="'+data.id+'" pid="'+data.pid+'" class="fold"></li>').html(str);
	}
	return li;
};

/* ====== 新建文件夹结构 ====== */
function NewFolder(){
	var str = '<div class="checked yunpan_icon"></div>'
				+'<div class="foldBg doc_icon_big"></div>'
				+'<p class="foldName ellipsis">'+"新建文件夹"+'</p>'
				+'<div class="editBox NewfoldName">'
				+	'<input type="text" class="editTxt" value="新建文件夹" maxlength="100">'
				+	'<p class="editBtn">'
				+		'<span gue-role="editsure" class="sureBtn yunpan_icon">确定</span>'
				+		'<span gue-role="editcancel" class="cancelBtn yunpan_icon">取消</span>'
				+	'</p>'
				+'</div>';
	var li = null;
	li = $('<li class="makeFold" name="no"></li>').html(str);
	return li;
};

/* ====== 生成目录树结构 ====== */
function createDir(data){
	var mark = '';
	for(var i=0;i<filesData.length;i++){
		if(filesData[i].pid == data.id) {
			mark = ' ico yunpan_icon';
			break;
		}else{
			mark = '';
		};
	};
	var div = $('<div class="item">'
				+	'<a class="link yunpan_icon" href="#">'
				+		'<span class="text ellipsis">'+data.name+'</span>'
				+		'<span class="leftIcoBtn'+mark+'"></span>'
				+	'</a>'
			+'</div>'
			+'<div class="itemBox"></div>');
	return div;
};

/* ====== 生成路径结构 ====== */
function createPath(name){
	var li = $('<li>'
			+	'<a href="javascript:;">'
			+		'<span class="ellipsis">'+name+'</span>'
			+	'</a>'
		+'</li>');
	return li;
};

/* ====== 提示 ====== */
var timer = 0;
function tip(){

	$('#newtipbox').css('top', 61);
	clearTimeout(timer);
	timer = setTimeout(function (){
		$('#newtipbox').css('top', -61);
	},2000)
};