app.controller('generateStickerCtrl', function ($scope,menuService,services,$cookieStore,$location) {

		var ges = this;
		ges.productId=null;
		ges.generatedId=null;
    var loggedInUser = JSON.parse(services.getIdentity());


		ges.generateSticker = function () {
			return console.log({user_id:loggedInUser.id,productId:ges.productId});
				// var promise = services.generateSticker({user_id:loggedInUser.id,productId:ges.productId});
				// promise.success(function (result) {
				// 	if(result.status_code == 200){
				// 		Utility.stopAnimation();
				// 			ges.userList = result.data;
				// 			ges.userName=ges.userId!=undefined?ges.userId:loggedInUser.id.toString();
				// 	}else{
				// 		Utility.stopAnimation();
				// 			ges.userList = [];
				// 			toastr.error(result.message, 'Sorry!');
				// 	}
				// });
		}

		ges.clearForm=function(){
			ges.productId=null;
			ges.generatedId=null;
		}

});
