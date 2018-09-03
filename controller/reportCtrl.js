app.controller('reportCtrl', function ($scope,menuService,services,$cookieStore) {

	var rpc = this;



    var loggedInUser = JSON.parse(services.getIdentity());
    rpc.userName = loggedInUser.identity.name;
		rpc.filterDate='';
		rpc.filterProductId='';

console.log(loggedInUser);
		rpc.getReportList=function(){
			var req={
			        "date":rpc.filterDate,
			        "product_id":rpc.filterProductId
			}
			if(loggedInUser.identity.role!=1){
				req.user_id=loggedInUser.id;
			}
			var promise = services.getReportList(req);
			promise.success(function (result) {
				if(result.status_code == 200){
					Utility.stopAnimation();
						rpc.reportList = result.data;

				}else{
					Utility.stopAnimation();
					rpc.reportList=[];
						toastr.error(result.message, 'Sorry!');
				}

			});
		}
		rpc.getReportList();

		rpc.download=function(type){
			var req={
			        "date":rpc.filterDate !=''?rpc.filterDate:-1,
			        "product_id":rpc.filterProductId!=''?rpc.filterProductId:-1,
							"user_id":loggedInUser.identity.role!=1?loggedInUser.id:-1,
							"type":type
			}

			var promise = services.download(req);
			// promise.success(function (result) {
					// Utility.stopAnimation();
				// if(result.status_code == 200){
				// 	Utility.stopAnimation();
				// }else{
				// 	Utility.stopAnimation();
				// 		toastr.error(result.message, 'Sorry!');
				// }

			// });
		}

		rpc.getProductList=function(){
			var req={
							id:0
			}
			if(loggedInUser.identity.role!=1){
				req.id=loggedInUser.id;
			}
			var promise = services.getProductList(req);
			promise.success(function (result) {
				if(result.status_code == 200){
					Utility.stopAnimation();
						rpc.productList = result.data.product_ids;

				}else{
					Utility.stopAnimation();
						toastr.error(result.message, 'Sorry!');
				}

			});
		}
		rpc.getProductList();


		rpc.clearForm=function(){
			rpc.deviceId='';
		}

});
