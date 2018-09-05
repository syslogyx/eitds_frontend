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
				debugger
				if(result.status_code == 200){
					Utility.stopAnimation();
					rpc.reportList = result.data;
					rpc.data = [];
					for(var i=0; i<rpc.reportList.length; i++){
						arr = {};
						$.each( rpc.reportList[i], function( key, value ) {
							
							arr["project_id"] = key;
							arr["test_cases"] = [];
							var test_case_length = Object.keys(value).length;
							arr["test_case_length"] = test_case_length;
						  	$.each( value, function( key1, value1 ) {
						  		value1["Mode_data"] = [];
						  		$.each( value1, function( key2, value2 ) {
						  			if(key2 == "Mode"){
						  				var mode_length = Object.keys(value2).length;
										value1["mode_length"] = mode_length;
										$.each( value2, function( key3, value3 ) {
											value3["mode_name"] = key3;
											value1["Mode_data"].push(value3);
										});
										
						  			}
						  		});
						  		arr["test_cases"].push(value1);

						  	});
						  	
						  	
						});
						
						rpc.data.push(arr);

					}
					console.log(rpc.data);
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
