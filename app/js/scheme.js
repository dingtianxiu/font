//(function(){
	schemeData = [];
	currentSchemeId = 0;
	scheme = {
		validate : function(id){
			var isValid = true;
			$(id + " input").each(function(){
				if($(this).val() == ""){
					$(id + " .errorTip").text("不能为空");
					$(this).addClass("error");
					isValid =  false;
					return false;
				}else if($(this).val().length > 8){
					$(id + " .errorTip").text($(this).parent().prev().text()  + "长度不能超过8个字符");
					$(this).addClass("error");
					isValid =  false;
					return false;
				}else{
					$(id + " .errorTip").text("");
					$(this).removeClass("error");
				}
			});
			return isValid;
		},
		initScheme : function(){
			var that = this;
			if(this.validate("#add-scheme-popup")){
				var param = {};
				param["userId"] = that.custId;
				$("#add-scheme-popup input:text").each(function(i){
					var name = "";
					if(i == 0){
						name = $(this).attr("name");
						param[name] = $(this).val();
					}else if(i > 0){
						name = "modules[" + (i-1) + "].modName";
						param[name] = $(this).val();
					}
				});
				$.ajaxJSON({
					name: '新建方案',
					url: URL.CREATE_SCHEME,
					data: param,
					success: function (r) {
						schemeData.push({
							"sltId" : r.data.id,
							"sltName" : r.data.sltName,
							"userId" : r.data.userId,
							"status" : r.data.status
						});
						window.currentSchemeId = r.data.id;

						that._renderPage();

					}
				});
			}
		},
		addScheme : function () {
			var that = this;
			var param = {
				"userId" : that.custId,
				"sltName" : "方案"+(schemeData.length+1),
				"modules[0].modName" : "模块一"
			};
			$.ajaxJSON({
				name: '新建方案',
				url: URL.CREATE_SCHEME,
				data: param,
				success: function (r) {
					schemeData.push({
						"sltId" : r.data.id,
						"sltName" : r.data.sltName,
						"userId" : r.data.userId,
						"status" : r.data.status
					});
					window.currentSchemeId = r.data.id;
					$(".container").removeClass("hide");
					$(".customerListContainer").addClass("hide");
					that._renderPage();

				}
			});
		},
		getCustomerList : function (param) {
			if(param){

			}else {
				param={
					"pageSize" : 30
				}
			}
			$.ajaxJSON({
				name: '客户列表',
				url: URL.GET_CUSTOMER_LIST,
				data: param,
				success: function (data) {
					console.log(data)
					var customerList = data.data.customers;
					$.each(data.data.customers,function (i) {
						var dom = "<li id="+data.data.customers[i].id+">"+data.data.customers[i].custName+"</li>"
						$(".customerList").append(dom);
					})
				}
			});
		},
		updateSchemeName : function(){
			var that = this;
			if(this.validate("#edit-scheme-popup")) {
				var param = {};
				param["sltId"] = this.currentEditScheme.sltId;
				param["sltName"] = $("#edit-scheme-popup input:text").val();
				$.ajaxJSON({
					name: '修改方案名称',
					url: URL.UPDATE_SCHEME,
					data: param,
					success: function (r) {
						for (var i = 0; i < schemeData.length; i++) {
							if (schemeData[i].sltId == r.data.id) {
								schemeData[i].sltName = r.data.sltName;
								break;
							}
						}
						$("#edit-scheme-popup").dialog("close");
						that._renderPage();
					}
				});
			}
		},
		_renderPage : function(){
			var template = "",
				schemeData = window.schemeData,
				isActive;
			$("#add-scheme-popup").addClass("hide");
			$(".side a").removeClass("active");
			for(var i = 0; i < schemeData.length;i++){
				isActive = window.currentSchemeId ==schemeData[i]["sltId"] ? 'class="active"' : '';
				template += '<li><a '+ isActive +' href="views/scheme.html?id='+ schemeData[i]["sltId"] +'" target="mainIframe"><i class="icon iconfont icon-iconproject'+ (i+1) +'"></i><p>'+ schemeData[i]["sltName"] +'</p></a></li>';
			}
			$(".menu").html(template);
			document.getElementById("mainIframe").contentWindow.schemeDetail.getModuleList();
		},
		addModuleItem : function(){
			if($("input.moduleName").length >= 8){
				$.msg({
					modal:true,
					msg : "单个方案最多支持8个模块"
				});
				return;
			}
			$("#addModuleBtn").parent().parent().append('<div class="fm-ipt"><input class="moduleName" type="text"></div>');
		},
		bindEvent : function(){
			var that = this;
			$("#addSchemeBtn").on("click",function(){
				// $('#add-scheme-popup').removeClass("hide");
				// var h = document.documentElement.clientHeight - $(".head").height();
				// $("#add-scheme-popup").height(h);
				// $("#add-scheme-popup .title").text(that.userInfo.realName);
				that.addScheme();
			});
			$("#addModuleBtn").on("click",function(){
				that.addModuleItem();
			});
			$("#confirm-btn").on("click",function(){
				that.initScheme();
			});
			$(".side").delegate("a","click",function(){
				$(".side a").removeClass("active");
				$(this).addClass("active");
				currentSchemeId = $(this).attr("href").split("=")[1];
				if($("#add-scheme-popup").is(":visible") && $(this).attr("id") != "addSchemeBtn"){
					$('#add-scheme-popup').addClass("hide");
				}
			});
			$(".customerList").delegate("li","click",function () {
				that.custId = $(this).attr("id");
				localStorage.setItem("custId",that.custId);
				document.getElementById("mainIframe").contentWindow.location.reload(true);
			});
			$(".prevBtn").on("click",function(){
				var menuTop = parseInt($(".menu").css("top"));
				var menuBoxHeight = $(".menuBox").height() + 2;
				var menuHeight = $(".menu").height();
				var itemHeight = $(".side a")[0].clientHeight;

				if(menuTop >= 0){
					$(".prevBtn").hide();
					return;
				}else {
					if(menuTop*-1 - menuBoxHeight <= 0) {
						var h = 0;
					}else{
						var h = (menuTop + menuBoxHeight) + "px";
					}
				}
			});
			$(".side").delegate("a","mouseover",function(){
				if($(this).parent()[0].tagName.toUpperCase() != "LI"){
					return;
				}
				var offset = $(this).parents("li").offset();
				if(offset) {
					$(".editSchemeName").removeClass("hide").css("top", (offset.top + 36) + "px");
				}
				that.currentEditScheme = {
					"sltId" : $(this).parents("li").find("a").attr("href").replace("views/scheme.html?id=",""),
					"sltName" :$(this).parents("li").find("p").text()
				};
			});
			$(".side").delegate("a","mouseleave",function(){
				$(".editSchemeName").addClass("hide");
			});
			$(".editSchemeName").on("mouseover",function(){
				$(".editSchemeName").removeClass("hide");
			});
			$(".editSchemeName").on("mouseleave",function(){
				$(".editSchemeName").addClass("hide");
			});
			$(".editSchemeName").on("click",function(){
				//$("#edit-scheme-popup").removeClass("hide");
				$("#edit-scheme-popup").dialog("open");
				$("#edit-scheme-popup input:text").val(that.currentEditScheme.sltName);
			});
			$("#edit-scheme-popup .btn").on("click",function(){
				that.updateSchemeName();
			});
			$('#logout').on('click', function() {
				that.logout();
			});
		},
		logout : function(){
			localStorage.removeItem('userInfo');
			$.cookie("acf_ticket",null);
			window.location.href = logoutUrl;


		},
		setLayout : function(){
			var h = document.documentElement.clientHeight - $(".head").height();
			var menuBoxH = h - $(".componentBtn")[0].clientHeight - $(".logo").height();
			var menuH = $(".menu").height();
			var itemHeight = $(".side a")[0].clientHeight;
			$(".side").height(h);
			$("iframe").height(h-3);
			$(".menuBox").css("height",(menuBoxH + "px"));
			$(".menuBox").css("box-shadow","0 5px 5px 0 #333");
		},
		init : function(){
			var that = this;
			if(localStorage.userInfo){
				this.userInfo = JSON.parse(localStorage.userInfo);
				$(".realName").html(this.userInfo.realName);
				$(".email").html(this.userInfo.email);
			}
			if(localStorage.custId){
				$('.customerListContainer').addClass("hide");
				$('.container').removeClass("hide");
				$('#add-scheme-popup').addClass("hide");
				this.custId = localStorage.custId;
			}else{
				this.getCustomerList();
			}
			this.bindEvent();
			this.setLayout();
			$(window).resize(function(){
				that.setLayout();
			});
			$("#edit-scheme-popup").dialog({
				autoOpen:false,
				modal:true,
				title : "修改方案名称"
			})
		}
	}.init();

//})(window);