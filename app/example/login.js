$(function () {
    var _isDev = true;
<<<<<<< HEAD
    var _location = "localhost";
	
    $('[name="sysCode"]').val("oss-yishang");

    $("#passwordTemp").removeAttr('disabled');

    $("form").submit(function () {
        var v = $.md5($("#passwordTemp").val());
=======
    var _location = "127.0.0.1";
	
    $('[name="sysCode"]').val("dms");

    $("#passwordTemp").removeAttr('disabled');

    $("form").submit(function (e) {
        var v = $("#passwordTemp").val();
>>>>>>> 23016f9123aaf4a1d48f5064d474e528fb1c3cfd
        $("#password").val(v);
        return true;
    });

    //placeholder for ie9
    jQuery('input[placeholder]').placeholder();

    var options = {
        formId: "fm1",
        fkId: "fk",
        ltId: "lt",
        vcId: "capt",
        localDomain: 'http://' + _location,
        loginSuccessCall: function () {
            console.log('登陆成功:'+arguments[0]);
            $.cookie('acf_ticket', arguments[0]);
            $('#errorBox').hide();
            window.location.href = "/app/index.html";
        },
        loginFailCall: function (errorMsg) {
            console.log(errorMsg);
            $('#errorStr').text(errorMsg);
            $('#errorIcon').show();
            $('#errorBox').fadeOut().fadeIn();
            $('#password').val('');
            $('#validateCode').val('');
            $('#J-submit').attr("disabled", false);
            $("#passwordTemp").removeAttr('disabled'); 
        },
        beforeLoginCall: function () {
			 console.log('开始登陆');
            $('#passwordText').text("").fadeOut();
            $('#J-submit').attr("disabled", true);
            $("#passwordTemp").removeAttr('disabled');
            return true;
        }
    };

    window['sso'] = new xd_sso(options);
    
});