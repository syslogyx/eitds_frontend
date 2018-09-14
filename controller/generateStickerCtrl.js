app.controller('generateStickerCtrl', function ($scope,menuService,services,$cookieStore,$location) {

		var ges = this;
		ges.productId=null;
		ges.generatedId=null;
    var loggedInUser = JSON.parse(services.getIdentity());


		ges.generateSticker = function () {
			// return console.log({user_id:loggedInUser.id,productId:ges.productId});
			if($("#deviceForm").valid()){
				var promise = services.generateSticker({product_id:ges.productId});
				promise.success(function (result) {
					debugger;
					if(result.status_code == 200){
						Utility.stopAnimation();
							ges.finalId = result.data[0].finalId;
							ges.seriesName = result.data[0].seriesName;
							
					}else{
						Utility.stopAnimation();
							ges.finalId = '';
							ges.seriesName = "";
							toastr.error(result.message, 'Sorry!');
					}
				});
			}
			
		}

		ges.clearForm=function(){
			ges.productId=null;
			ges.generatedId=null;
			ges.finalId = '';
			ges.seriesName = "";
		}

});
