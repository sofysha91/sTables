/*!
* stables - jQuery Plugin
* version: 1.1.0 (Tuesday, July 24 2018)
* @requires jQuery v1.7 or later
*
* License: Under Creative Commons Attribution-NonCommercial 3.0 license. 
*		   You are free to use sTables for your personal or non-profit website projects. 
*		   You can get the author's permission to use stables for commercial websites. 
*
* Copyright 2018 Sofia Hernandez - sofy.hernandeza@gmail.com
*
*/

(function ($) {
    //Global var
	var table = "<table class='s-table'></table>";
    var sTable = null;
    var bool_modal = false;
	
    $.stable = function (element, options) {
    	//Create table
        $(element).append(table);
        sTable = $(".s-table");
        this.options = {};
        element.data('stables', this);
        this.init = function (element, options) {
            this.options = $.extend({}, $.stable.defaultOptions, options);                             
            //Add calendar before call the data
            if(this.options.calendar.show == true)    	
                addCalendar(this.options);
            retrieveData(this.options);
            
        };

        this.init(element, options);
    };

    $.fn.stable = function (options) {
        return this.each(function () {
            (new $.stable($(this), options));
        });
    };
    /*Add Calendar */
    function addCalendar(options){

    	  $('input[name="daterange"]').daterangepicker({
            opens: 'left',
	        startDate: options.calendar.startDate , 
	        endDate: options.calendar.endDate
	      }, function(start, end, label) {
	      	//When we change the date, we set the new values and call the report again
	        options.calendar.startDate = start.format('YYYY-MM-DD');
	        options.calendar.endDate = end.format('YYYY-MM-DD');

	     });

    }

    /*Function to get the Data
    //Conect to your WebApi, WebService etc*/
    function retrieveData(options) {
        if (options.url == '') return false;
        $.ajax({
            type: "POST",
            url: options.url,
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {                            
                //Add Header and sort
    			addHeaders(options);
    			//Draw Rows
    			rows(data,options);
    			//Add pagination if exist
                if($(".s-navigation-control select").length > 0)
    			 pagination();
                addModal();

            },
            error: function (jqXHR, exception) {
                error(exception);
                if(exception == 'parsererror')
                    $(element).after("<div class='stables-no-records-text'>No records to show</div>");
            }
        });
    }
   
    /*Add Headers with sort property */
    function addHeaders(options){          
        sTable.append("<thead><tr>");

    	if (options.sort == true)
    	{
            $.each(options.columns, function(i,item){
                sTable.find("thead tr").append("<th class='col-lg-1 col-md-1'><div class='stables_th'><div class='stables_header_sort'><span class='glyphicon glyphicon-triangle-top' aria-hidden='true'></span><span class='glyphicon glyphicon-triangle-bottom' aria-hidden='true'></span></div><div class='stables_header'>" + item + "</div></div></th>");
            });    	 	
    	}
    	else
    	{	
            $.each(options.columns, function(i,item){
                thVal = ($.inArray(i, options.sort) !== -1)? "<th class='col-lg-1 col-md-1'><div class='stables_th'><div class='stables_header_sort'><span class='glyphicon glyphicon-triangle-top' aria-hidden='true'></span><span class='glyphicon glyphicon-triangle-bottom' aria-hidden='true'></span></div><div class='stables_header'>" + item + "</div></div></th>" : "<th class='col-lg-1 col-md-1'>"+item+"</th>";
                sTable.find("thead tr").append(thVal);
            });
    	}
    	sTable.append("</tr></thead>");
    }

    function rows(data,options) {
    	//Add Rows to table
    	$.each(data, function (i,item) {
    		row = createRow(data[i], options);
    		sTable.append(row);
    	});
    }

    function createRow(data_row, options)
    {
    	var row="<tr>";
        var index= 0; 
    	$.each(data_row, function (i,item){
            if($.inArray(index, options.columnTypes.booleanToggle.column) !== -1)
                {   checked= (data_row[i] == true)?'checked':'';
                    row+="<td><label class='switch'><input type='checkbox' "+checked+"><span class='slider round'></span></label><div class='div-hidden-text'>"+data_row[i]+"</div></td>";
                }
            else if($.inArray(index, options.columnTypes.longTextNote.column) !== -1)
                {   bool_modal = true;
                    var glyphicon_class = (data_row[i] == null)? "" : "glyphicon-file";
                    row+="<td><a class='a-note'><span class='glyphicon "+glyphicon_class+"' aria-hidden='true'></span></a><div class='div-hidden-text'>"+data_row[i]+"</div></td>";
                }
            else
    		 {row+="<td>"+data_row[i]+"</td>";}
            index++;
    	});
    	row += "</tr>";        
    	return row;
    }

    function addModal()
    {        
        //Create and add modal
        modal='<div class="modal right fade" id="modal-note" tabindex="-1" role="dialog">';
        modal+='<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header">';
        modal+='<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        modal+='<h4 class="modal-title">Note</h4></div>';
        modal+='<div class="modal-body"></p></div></div></div></div>';
        sTable.after(modal);               
        
    }

    function pagination(){        
        
        //Add pagination function       	
        var rows_shown = $(".s-navigation-control select").val();
        var rows_total = sTable.find('tbody tr').length;
        var num_pages = rows_total/rows_shown;
        $('.s-navigation').append("<span class='stables-span-records'></span>");
        for(i = 0;i < num_pages;i++) {
            var page_num = i + 1;
            $('.s-navigation').append('<a class="btn btn-default" href="#" rel="'+i+'">'+page_num+'</a> ');
            
        }
        sTable.find('tbody tr').hide();
        sTable.find('tbody tr').slice(0, rows_shown).show();
        var end_item_show = (rows_shown>rows_total)? rows_total : rows_shown;
        $('.stables-span-records').empty().append('Showing 1 to '+end_item_show+' of '+rows_total+' records ');
        $('.s-navigation a:first').addClass('active');
        $('.s-navigation a').bind('click', function(){

            $('.s-navigation a').removeClass('active');
            $(this).addClass('active');
            var curr_page = $(this).attr('rel');
            var start_item = curr_page * rows_shown;
            var end_item = start_item + rows_shown;
            var end_item_show = (end_item>rows_total)? rows_total : end_item;
            $('.stables-span-records').empty().append('Showing '+(start_item+1)+' to '+end_item_show+' of '+rows_total+' records ');
            sTable.find('tbody tr').animate({opacity:1}, 100);
            sTable.find('tbody tr').css('opacity','0.0').hide().slice(start_item, end_item).show();
        });        
    }

    function repaginate(rows_shown)
    {
        var rows_shown = rows_shown;
        var rows_total = sTable.find('tbody tr').length;
        var num_pages = rows_total/rows_shown;
        $(".s-navigation").empty().append("<span class='stables-span-records'></span>");
        for(i = 0;i < num_pages;i++) {
            var page_num = i + 1;
            $('.s-navigation').append('<a class="btn btn-default" href="#" rel="'+i+'">'+page_num+'</a> ');
            
        }
        sTable.find('tbody tr').hide();
        sTable.find('tbody tr').slice(0, rows_shown).show();
        var end_item_show = (rows_shown>rows_total)? rows_total : rows_shown;
        $('.stables-span-records').empty().append('Showing 1 to '+end_item_show+' of '+rows_total+' records ');
        $('.s-navigationa:first').addClass('active');
        $('.s-navigation a').bind('click', function(){

            $('.s-navigation a').removeClass('active');
            $(this).addClass('active');
            var curr_page = $(this).attr('rel');
            var start_item = curr_page * rows_shown;
            var end_item = start_item + rows_shown;
            var end_item_show = (end_item>rows_total)? rows_total : end_item;
            $('.stables-span-records').empty().append('Showing '+(start_item+1)+' to '+end_item_show+' of '+rows_total+' records ');
            sTable.find('tbody tr').animate({opacity:1}, 100);
            sTable.find('tbody tr').css('opacity','0.0').hide().slice(start_item, end_item).show();
        });

    }

    function sortTable(th_value, order) {
        var asc = order === 'asc';
        var tbody = sTable.find('tbody');
        /* Get position of column to sort */
        $.each(sTable.find("TH"), function (i,item){
             if($(item).text() == th_value )
                 column = i;                
        });
        // Sort the table using a custom sorting function by switching 
        // the rows order, then append them to the table body
        tbody.find('tr').sort(function (a, b) {           
            if (asc) {
                return $('td:eq(' + column + ')', a).text()
                    .localeCompare($('td:eq(' + column + ')', b).text());
            } else {
                return $('td:eq(' + column + ')', b).text()
                    .localeCompare($('td:eq(' + column + ')', a).text());
            }
                     
        }).appendTo(tbody);
        sTable.find('tbody tr').hide().slice(0, $(".s-navigation-control select").val()).show(); 
    }   
    function search() {
        $(".s-navigation").empty().append("<span class='stables-span-records'></span>");
        var filter, tr, td, x=0;
        if($('.s-searchbox').val() == "")
        {
            repaginate($(".s-navigation-control select").val())
            return;
        }

        filter = $('.s-searchbox').val().toUpperCase();
        $.each(sTable.find("tbody tr"), function(i,item){
            td = $(item).children('td:eq("3")').text();
            if (td.toUpperCase().indexOf(filter) > -1) {
                    $(item).css("display","table-row");
                    x++;
                } else {
                    $(item).css("display","none");
                }
        });
        $('.stables-span-records').empty().append('Showing '+x+' results');
        
    }
    function error(exception) {
        console.log(exception);
    }    

    //DOM Functions   
    /* Change pagination */
    $(document).on("change", ".s-navigation-control select", function(){
        repaginate($(this).val());
    });
    /* Search */
    $(document).on("keyup", ".s-searchbox", function(){
        search();
    });
     /*Sort Functions */
    $(document).on("click",".glyphicon-triangle-top", function(){
    	//Sort
   	    th_value = $(this).parent(".stables_header_sort").siblings(".stables_header").text();   	    
   	    sortTable(th_value, 'asc');
   	    //Set as active
   	    $(".glyphicon").removeClass("sort_active");
   	    $(this).addClass("sort_active");

   	    
	});
    $(document).on("click",".glyphicon-triangle-bottom", function(){
    	  //Set
   	      th_value = $(this).parent(".stables_header_sort").siblings(".stables_header").text();
   	      sortTable(th_value, 'desc');
   	      //Set as active
   	      $(".glyphicon").removeClass("sort_active");
   	      $(this).addClass("sort_active");

	});

    
    /*Open Modal */
    $(document).on("click", ".a-note", function(){
        //Get hidden text and add to the modal                
        $("#modal-note .modal-body p").empty().append($(this).siblings().text());
        $("#modal-note").modal();
    });
    /*Export Buttons */
    /*Excel Button */
    $(document).on("click", ".btn-export-excel", function(e){
        e.preventDefault();
        excelExport();
    });
    /*CSV Buttton */
    $(document).on("click", ".btn-export-csv", function(e){
        e.preventDefault();
        csvExport();
    }); 
    

    //Export buttons section
    function excelExport() {     
        
        var ReportTitle = 'EMS Report';    
        //Set Report title in first row or line
        var report = '';
        report += ReportTitle + '\r\n\n';
        report +="<table><thead><tr>";
        //Headers
        $.each(sTable.find("TH"), function (i,item){
             report += "<th>"+ $(item).text() + "</th>";
        });
        report +="</tr></thead>";
        //loop is to extract each row
        $.each(sTable.find("tbody TR"), function (i,itemtr){
            $.each($(itemtr).find("TD"), function (i,itemtd){
                report += "<td>" + $(itemtd).text() + "</td>";
            });
            report += "</tr>"; 
        }); 
         report +="</tbody></table>";               
        //Generate a file name
        var fileName = "MyReport_";    
        fileName += ReportTitle.replace(/ /g,"_");   
        
        //Initialize file format you want csv or xls
        var uri = 'data:text/xls;charset=utf-8,' + report;    
        
        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");    
        link.href = uri;
        
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".xls";    
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }
    function csvExport() {
        
        var CSV = '';
        var row = "";  
        //Headers
        $.each(sTable.find("TH"), function (i,item){
             CSV += $(item).text() + ",";
        });         
        CSV.slice(0, CSV.length - 1);
        CSV += row + '\r\n';
        //loop is to extract each row
        $.each(sTable.find("tbody TR"), function (i,itemtr){
            $.each($(itemtr).find("TD"), function (i,itemtd){
                row += $(itemtd).text() + ",";
            });
            row.slice(0, row.length - 1);
            row += '\r\n';
        }); 

        CSV += row;
        //Generate a file name
        var fileName = "MyReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += fileName.replace(/ /g, "_");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

	 //Default Options
    $.stable.defaultOptions = {
        url: '',
        data: '',
        sort: true,
        columns:[],
        calendar: {
        	show:true,
        	startDate: moment().subtract(7, 'days'),
        	endData: moment()
        },
        columnTypes:{
        	booleanToggle:
            {
                column:[0]
            },
        	longTextNote:
            {
                column:[1]
            }
        }       
    }   

})(jQuery);

