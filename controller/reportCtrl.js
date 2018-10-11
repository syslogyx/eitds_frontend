app.controller('reportCtrl', function ($scope,menuService,services,$cookieStore,Excel,$timeout,pagination) {

	var rpc = this;
	// var rstatus = false;
	rpc.currentDate=Utility.formatDate(new Date());
	rpc.statusList = [{
		"id" : 1,
		"value" : "OK"
	},
	{
		"id" : 2,
		"value" : "NOT OK"
	}]


    var loggedInUser = JSON.parse(services.getIdentity());
    rpc.userName = loggedInUser.identity.name;
		rpc.filterDate='';
		rpc.filterProductId='';
		rpc.filterStatusId ='';
		rpc.sequece=false;
		console.log(loggedInUser);
		$scope.isChecked=function(status){
				rpc.sequece=status;
		}

	Utility.startAnimation();

		rpc.fetchList = function(page){

	        rpc.limit = 10;
	        if(rpc.limit == undefined){
	            rpc.limit = -1;
	        }
	        if(page == -1){
	            rpc.pageno = 1;
	            console.log($('#pagination-sec').data("twbs-pagination"));
	            if($('#pagination-sec').data("twbs-pagination")){
	                    $('#pagination-sec').twbsPagination('destroy');
	            }
	        }
	        else{
	            rpc.pageno = page;
	        }
	        var requestParam = {
	            page:rpc.pageno,
	            // limit:pagination.getpaginationLimit(),
	            limit:rpc.limit,
	        }

	        var req={};
			if(rpc.filterDate != ''){
				req.date=rpc.filterDate;
			}
			if(rpc.filterProductId != ''){
				req.product_id=rpc.filterProductId;
			}
			if(rpc.filterStatusId != ''){
				req.status=rpc.filterStatusId;
			}
			if(loggedInUser.identity.role!=1){
				req.user_id=loggedInUser.id;
			}

	        var promise = services.getReportList(req,requestParam);
			promise.success(function (result) {
				rpc.reportList = result.data;
				rpc.reportTotalCount = result.total;
				rpc.columnList = result.columnList;
				rpc.data = [];

				if(result.status_code == 200){

					pagination.applyPagination(result, rpc);

					for(var i=0; i<rpc.reportList.length; i++){
						arr = {};
						$.each( rpc.reportList[i], function( key, value ) {
							arr["project_id"] = key;
							arr["test_cases"] = [];
							var test_case_length = Object.keys(value).length;
							arr["test_case_length"] = test_case_length;
						  	$.each( value, function( key1, value1 ) {
						  		value1["Mode_data"] = [];
									if(key1!='username'){
								  		$.each( value1, function( key2, value2 ) {
								  			if(key2 == "Mode"){
								  				var mode_length = Object.keys(value2).length;
												value1["mode_length"] = mode_length;
												$.each( value2, function( key3, value3 ) {
													value3["mode_name"] = key3;
													value1["Mode_data"].push(value3);
													$.each( value3, function( key4, value4 ) {
														if(key4 == "Actual"){
															$.each( value4, function( key5, value5 ) {
																value5["created_at"] = Utility.formatDate(value5["created_at"]);
																value5["not_ok_columns"] = value5["not_ok_column"].split(",");
																if(value4.length == (key5 + 1)){
																	// value1["Mode_data"] = value5;
																	var k = value1["Mode_data"].length - 1;
																	// value1["Mode_data"][0].merge(value5);

																	  value1["Mode_data"][k]["user_id"]=value5["user_id"];
													                  value1["Mode_data"][k]["device_id"]=value5["device_id"];
													                  value1["Mode_data"][k]["product_id"]=value5["product_id"];
													                  value1["Mode_data"][k]["mode"]=value5["mode"];
													                  value1["Mode_data"][k]["test_case"]=value5["test_case"];
													                  value1["Mode_data"][k]["test_point_3_voltage"]=value5["test_point_3_voltage"];
													                  value1["Mode_data"][k]["test_point_3_time"]=value5["test_point_3_time"];
													                  value1["Mode_data"][k]["test_point_4_voltage"]=value5["test_point_4_voltage"];
													                  value1["Mode_data"][k]["test_point_4_time"]=value5["test_point_4_time"];
													                  value1["Mode_data"][k]["test_point_4_pulse_low"]=value5["test_point_4_pulse_low"];
													                  value1["Mode_data"][k]["test_point_4_pulse_high"]=value5["test_point_4_pulse_high"];
													                  value1["Mode_data"][k]["status"]=value5["status"];
													                  value1["Mode_data"][k]["date"]=value5["date"];
													                  value1["Mode_data"][k]["created_at"]=value5["created_at"];
													                  value1["Mode_data"][k]["updated_at"]=value5["updated_at"];
													                  value1["Mode_data"][k]["test_point_1_voltage"]=value5["test_point_1_voltage"];
													                  value1["Mode_data"][k]["test_point_2"]=value5["test_point_2"];
													                  value1["Mode_data"][k]["test_point_5"]=value5["test_point_5"];
													                  value1["Mode_data"][k]["test_point_6"]=value5["test_point_6"];
													                  value1["Mode_data"][k]["test_point_7_V"]=value5["test_point_7_V"];
													                  value1["Mode_data"][k]["test_point_7_V2"]=value5["test_point_7_V2"];
													                  value1["Mode_data"][k]["number_of_pulse"]=value5["number_of_pulse"];
													                  value1["Mode_data"][k]["not_ok_column"]=value5["not_ok_column"];
													                  value1["Mode_data"][k]["not_ok_columns"]=value5["not_ok_columns"];
													                  value1["Mode_data"][k]["token"]=value5["token"];
													                  value1["Mode_data"][k]["username"]=value5["username"];
													                  value1["Mode_data"][k]["test_case_name"]=value5["test_case_name"];
																}
															});
														}
													});
												});
								  			}
								  		});
								  		arr["test_cases"].push(value1);
									}
						  	});
						});

						rpc.data.push(arr);

					}
					if( navigator.userAgent.match(/Android/i)
						 || navigator.userAgent.match(/webOS/i)
						 || navigator.userAgent.match(/iPhone/i)
						 || navigator.userAgent.match(/iPad/i)
						 || navigator.userAgent.match(/iPod/i)
						 || navigator.userAgent.match(/BlackBerry/i)
						 || navigator.userAgent.match(/Windows Phone/i)){

							 console.log('U R USING MOBILE');
					}else{
							 setTimeout(function(){
											 $(".fixTable").tableHeadFixer({
											 head: true,
											 foot: false,
											 left: 6,
											 right: 0,
											 'z-index': 0
									 });},500);
					}
				}else{

					rpc.reportList=[];
						// toastr.error(result.message, 'Sorry!');
				}
				Utility.stopAnimation();
				//setTimeout(function(){
					//rpc.getReportList();
				//},5000);

			});
	    }

		rpc.getReportList=function(){
			rpc.fetchList(-1);

		}
		rpc.getReportList();

		rpc.download=function(type,projectId){
			if(rpc.reportList.length > 0){
				var req={
								"date":rpc.filterDate !=''?rpc.filterDate:-1,
								"product_id":rpc.filterProductId!=''?rpc.filterProductId:-1,
								"user_id":loggedInUser.identity.role!=1?loggedInUser.id:-1,
								"type":type
				}

				var promise = services.download(req,projectId);
				// promise.success(function (result) {
						// Utility.stopAnimation();
					// if(result.status_code == 200){
					// 	Utility.stopAnimation();
					// }else{
					// 	Utility.stopAnimation();
					// 		toastr.error(result.message, 'Sorry!');
					// }

				// });
			}else{
					toastr.error('Record not found', 'Sorry!');
			}
		}

		rpc.getProductList=function(){
			Utility.startAnimation();
			var req={
				id:0
			}
			if(loggedInUser.identity.role!=1){
				req.id=loggedInUser.id;
			}
			var promise = services.getProductList(req);
			promise.success(function (result) {
				if(result.status_code == 200){

						rpc.productList = result.data.product_ids;

				}else{

						toastr.error(result.message, 'Sorry!');
				}
					Utility.stopAnimation();

			});
		}
		rpc.getProductList();

		rpc.clearForm=function(){
			rpc.deviceId='';
		}

		rpc.checkIfExist=function(key,arr,value=null){
			// debugger;
			if(arr.length > 0){
				if(arr.indexOf(key) !== -1) {
				  	// console.log('key exists!');
				  	return false;
				}else if(key == "status"){
					if(value == "NOT OK"){
						return false;
					}else{
						return true;
					}
					// ng-class="{ok: value.status == 'OK', not_ok: value.status != 'OK'}"
				}else{
					// console.log('key not exists!');
					return true;
				}
			}

		}

        $scope.exportToExcel=function(tableId,index,project_id){ // ex: '#my-table'
	        // var exportHref=Excel.tableToExcel(tableId,'WireWorkbenchDataExport');
	        // $timeout(function(){location.href=exportHref;},100); // trigger download

	        tableId = tableId+"_"+index;
	        $scope.exportHref = Excel.tableToExcel(tableId, 'Report_'+project_id);
						$timeout(function() {
							var link = document.createElement('a');
							link.download = "Report_"+project_id+".xls";
							link.href = $scope.exportHref;
							link.click();
						}, 100);
        }


});
