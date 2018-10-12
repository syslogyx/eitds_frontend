app.controller('stickerCtrl', function ($scope,menuService,services,$cookieStore,$location) {

	var sti = this;

    var loggedInUser = JSON.parse(services.getIdentity());

	// sti.init = function () {

	// }

	// sti.init();

    sti.getSeriesList = function(){
        var promise = services.getSeriesList();
        promise.success(function (result) {
            Utility.stopAnimation();
            if(result.series){
                sti.seriesList = result.series;
            }
        });
    }
    sti.getSeriesList();

	sti.clearForm=function(){
		sti.deviceId='';
	}
    sti.findWithFilter = function(){
        if($("#filterSeriesForm").valid()){

        request = {
            "seriesName": sti.series_month_year,
            "limit":sti.records,
            "startIndex":sti.from_start
        }

        var promise = services.getStickerList(request);
        promise.success(function (result) {
            Utility.stopAnimation();
            if(result.status_code == 200){
                sti.stickerList = result.data;

            }else{
                sti.stickerList=[];
                toastr.error(result.message, 'Sorry!');
            }
        });

        }

    }

		sti.pdf = function(){
				if($("#filterSeriesForm").valid()){

				request = {
						"seriesName": sti.series_month_year,
						"limit":sti.records,
						"startIndex":sti.from_start
				}

  			services.pdf( sti.series_month_year,sti.records,sti.from_start);

				}

		}

    sti.download = function(){
        if($("#filterSeriesForm").valid()){

        request = {
            "seriesName": sti.series_month_year,
            "limit":sti.records,
            "startIndex":sti.from_start
        }

        var promise = services.downloadSticker(request);


        }
    }

});
