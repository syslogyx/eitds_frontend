app.controller('settingsCtrl', function ($scope,menuService,services,$cookieStore, $http, $location) {

	var set = this;

	set.fileData = [];
    $('input[type=file]').change(function () {
        set.fileData.push(this.files[0]);
    });

    var loggedInUser = JSON.parse(services.getIdentity());
    set.userName = loggedInUser.identity.name;

    set.colNames = [
    	{
	    	column_name : "a",
	    	column_display_name : "A"
	    },
	    {
	    	column_name : "b",
	    	column_display_name : "B"
	    },
	    {
	    	column_name : "c",
	    	column_display_name : "C"
	    },
	    {
	    	column_name : "d",
	    	column_display_name : "D"
	    },
	    {
	    	column_name : "e",
	    	column_display_name : "E"
	    },
	    {
	    	column_name : "f",
	    	column_display_name : "F"
	    },
	    {
	    	column_name : "g",
	    	column_display_name : "G"
	    },
	    {
	    	column_name : "h",
	    	column_display_name : "H"
	    },
	    {
	    	column_name : "i",
	    	column_display_name : "I"
	    },
    ];

    set.init = function () {
        var promise = services.getPdfSettingList();
        promise.success(function (result) {
        	if(result.status_code == 200){
        		Utility.stopAnimation();
            	set.pdfSettingList = result.data;
        	}else{
        		Utility.stopAnimation();
            	toastr.error(result.message, 'Sorry!');
        	}
        });
    }

    set.init();

    set.addPdfSetting = function(){
    	$location.path('/setting/pdf_setting');
    }

    set.clearForm = function(){
    	$("#pdf_settingForm")[0].reset();
    	set.display_col = [];
    	applySelect2();
    }

    var formdata = new FormData();
    $scope.getTheFiles = function ($files) {
        // angular.forEach($files, function (value, key) {
        //     formdata.append("logo", value);
        // });
    };

    set.savePDFSetting = function(){
    	if($("#pdf_settingForm").valid()){
    		var req	= {
    			"header_heading" : set.header_heading,
    			"footer_heading" : set.footer_heading,
    			"logo" : set.logo,
    			"display_columns" : set.display_col 
    		}
    		console.log(req);

    		var form = new FormData();
			form.append("logo", "23_Monica Jha.png");
			form.append("header_heading", "he");
			form.append("footer_heading", "fo");

			var settings = {
			  "async": true,
			  "crossDomain": true,
			  "url": "http://172.16.1.36:8000/api/add/pdfSetting",
			  "method": "POST",
			  "processData": false,
			  "contentType": false,
			  "mimeType": "multipart/form-data",
			  "data": form
			}

			$.ajax(settings).done(function (response) {
			  console.log(response);
			});
	        
    	}
    }

    // NOW UPLOAD THE FILES.
    $scope.uploadFiles = function () {

		// formdata.append("logo", "/root/Desktop/23_Monica Jha.png");
		formdata.append("header_heading", set.header_heading);
    	formdata.append("footer_heading", set.footer_heading);

    	console.log(formdata);
    	
		var settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": Utility.apiBaseUrl+"add/pdfSetting",
		  "method": "POST",
		  "headers": {
		    "Content-Type": "application/json"
		  },
		  "processData": false,
		  "contentType": false,
		  "mimeType": "multipart/form-data",
		  "data": formdata
		}

        // SEND THE FILES.
        $http(settings)
        .success(function (data) {
            console.log("SUCCESS : ", data);
        })
        .error(function (e) {
        	console.log("ERROR : ", e);
        });

        // $.ajax(settings).done(function (response) {
		  // console.log(response);
		// });

        // var form = $("#logo");
        // var formData = new FormData();
        // var formData = new FormData(form[0]);
        // formData.append("logo", form[0]);
		// formData.append("header_heading", set.header_heading);
    	// formData.append("footer_heading", set.footer_heading);
        // $.ajax({
        //     type: "POST",
        //     url: Utility.apiBaseUrl+"add/pdfSetting",
        //     data: formData,
        //     processData: false,
        //     contentType: false,
        //     cache: false,
        //     timeout: 600000,
        //     success: function (data) {
        //         console.log("SUCCESS : ", data);
                
        //         toastr.success('File Uploaded Successfully.');
        //     },
        //     error: function (e) {
        //         console.log("ERROR : ", e);
        //         toastr.error('No File Selected.');
        //     }
        // });
    }
});
