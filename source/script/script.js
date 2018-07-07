$( document ).ready(function() {

	//запрос в бек
	$.ajax({
		url: "/php/getmaindb.php",
		type: "POST",
		success: function (res) {
			var obj = JSON.parse(res);
			total_perc = (obj.totalnow * 100) / obj.totalneed;
			total_perc = total_perc + '%';
			$('#finishProgress').css('width', total_perc);
		}
	});
	//конец запроса в бек

	//registration
	$(document).on('click', '#reg-btn', function() {

		var emailReg = $("#reg-email").val();
		var passwordReg = $("#reg-password").val();
		var repasswordReg = $("#reg-repass").val();

		//same pass check
		if (passwordReg != repasswordReg) {
			new Noty({
			    type: 'error',
			    layout: 'topRight',
			    text: 'Passwords must be same!'
			}).show();
		}
		
	
		// regexp email check
		else if (!/([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(emailReg)){
			new Noty({
			    type: 'error',
			    layout: 'topRight',
			    text: 'You entered an incorrect email!'
			}).show();		
		}
		// regexp pass check
		// else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!-@#\$%\^&]{8,}$/.test(passwordReg)){
		else if (!/^(.){8,50}$/.test(passwordReg)){
			new Noty({
			    type: 'error',
			    layout: 'topRight',
			    text: 'Password must be 8 or more characters!'
			}).show();
		}
		//terms checkbox cheked check
		else if (!$("#accept-terms-chbx").prop('checked')){
			new Noty({
			    type: 'error',
			    layout: 'topRight',
			    text: 'You must accept the Terms of Use!'
			}).show();
		}
	

		//ajax request to registration backend
		else{
			$.ajax({
				url: "/php/registration.php",
				type: "POST",
				data: {
					emailReg:emailReg,
					passwordReg:passwordReg
				},
				success: function (res){
					console.log(res);
				    var obj = JSON.parse(res);
				    if (obj.ans == "user exits") {
				    	new Noty({
				    	    type: 'error',
				    	    layout: 'topRight',
				    	    text: 'Your email has already been registered!'
				    	}).show();
				    }
				    else if (obj.ans == "ok") {
				    	window.location = 'dashboard';
				    }
				}
			});
		}
	});
	//end registration

	//todo: 

	/*
		логин только разрешенные символы, буквы цифры
	*/

	//login
	$(document).on('click', '#login-btn', function() {
		var emailLog = $("#login-email").val();
		var passLog = $("#login-password").val();
		// var codeLog = $("#login-code").val(); //not use now

		$.ajax({
			url: "/php/login.php",
			type: "POST",
			data: {
				emailLog:emailLog,
				passLog:passLog
			},
			success: function (res){
				console.log(res);
			    var obj = JSON.parse(res);
			    if (obj.ans == "login") {
			    	window.location = 'dashboard';
			    }
			    else if (obj.ans == "2fa") {
			    	localStorage.setItem('user', emailLog);
			    	localStorage.setItem('at', obj.at);
					window.location = 'index?show2fa';
			    }
			}
		});
	});

	$(document).on('click', '#login-2fa-btn', function() {
		var emailLog = localStorage.getItem('user');
		var at = localStorage.getItem('at');
		var twofaInput = $("#twofaInput").val();

		$.ajax({
			url: "/php/twofactorcheckwhenlogin.php",
			type: "POST",
			data: {
				emailLog:emailLog,
				at:at,
				twofaInput:twofaInput
			},
			success: function (res){
				console.log(res);
			    var obj = JSON.parse(res);
			    if (obj.ans == "login") {
			    	window.location = 'dashboard';
			    }
			    else {
			     	new Noty({
				   	    type: 'error',
				   	    layout: 'topRight',
				   	    text: 'The entered code or password is not correct!'
				   	}).show();
				   	$("#twofamodal").modal('hide');
				   	localStorage.clear();
			    }
			}
		});




	});


	//login end


	if (document.location.href.indexOf('show2fa') != -1) {
	  $("#twofamodal").modal('show');
	}

	$('.carousel').carousel({
	  interval: 10000
	})

});