app.controller('reportCtrl', function ($scope,menuService,services,$cookieStore,Excel,$timeout) {

	var rpc = this;
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

		console.log(loggedInUser);
		rpc.getReportList=function(){
			var req={
			        "date":rpc.filterDate,
			        "product_id":rpc.filterProductId,
			        "status" : rpc.filterStatusId
			}
			if(loggedInUser.identity.role!=1){
				req.user_id=loggedInUser.id;
			}
			var promise = services.getReportList(req);
			promise.success(function (result) {
				if(result.status_code == 200){
					Utility.stopAnimation();
					rpc.reportList = result.data;
					rpc.columnList = result.columnList;
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
											$.each( value3, function( key4, value4 ) {
												if(key4 == "Actual"){
													$.each( value4, function( key5, value5 ) {
														value5["created_at"] = Utility.formatDate(value5["created_at"]);
														value5["not_ok_columns"] = value5["not_ok_column"].split(",");
													});
												}
											});
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

		rpc.checkIfExist=function(key,arr,value=null){
			// debugger;
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

        $scope.exportToExcel=function(tableId,index,project_id){ // ex: '#my-table'
	        // var exportHref=Excel.tableToExcel(tableId,'WireWorkbenchDataExport');
	        // $timeout(function(){location.href=exportHref;},100); // trigger download
	        
	        tableId = tableId+"_"+index;
	        $scope.exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
			$timeout(function() {
				var link = document.createElement('a');
				link.download = "Report_"+project_id+".xls";
				link.href = $scope.exportHref;
				link.click();
			}, 100);
        }
            
        $scope.exportToPdf = function(){
        	html2canvas(document.getElementById('fixTable'), {
        		onpreloaded: function(){ /* set parent overflow to visible */
        			$('.table-data').css("overflow","visible");
        			$('.table-data').css("height","auto");
        		},
  				onparsed: function(){  /* reset parent overflow */ 
        			$('.table-data').css("overflow","scroll");
        			$('.table-data').css("height","400px");
  				},
            	onrendered: function (canvas) {
                	var data = canvas.toDataURL();
                	var docDefinition = {
                    	content: [{
	                        image: data,
	                        width: 500,
                    	}]
                	};
                	// pdfMake.createPdf(docDefinition).download("example.pdf");
                 	pdfMake.createPdf(docDefinition).download("test.pdf");
            	}
        	});
     	}

        $scope.exportData = function () {
          var blob = new Blob([document.getElementById('tableToExport').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          // FileSaver.saveAs(blob, "Leads "+new Date()+".xls");
          window.saveAs(blob, "Report.xls");
        };

});
