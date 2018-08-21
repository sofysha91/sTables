# sTables
Table Plugin

A lightning & powerful jQuery plugin and HTML 5 to process Tables easy by receiving a JSON Data Structure.
sTables uses Date Range Picker plugin to send date parameters and process the data easily.

2018 Sofy Hernandez - sofy.hernandeza@gmail.com

## How to use
Download the plugin, unzip it and copy files to your website/application directory. Load files in the HTML document. Jquery is required

    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" /> 
    <link href="./src/jquery.stables.css" rel="Stylesheet" />
    <!-- Include jQuery, Moment.js and Date Range Picker's files along with stables in your webpage: -->    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <script src="./src/jquery.stables.js"></script>   
   
Add the HTML in the page (section tag is optional):
    <section> <!-- Optional  -->
      <div class="s-tables">
          <div class="row s-controls"> <!-- if Bootstrap, use row class otherwise remove it -->
            <div class="col-md-6 s-search"> <!-- if Bootstrap, use col-* class otherwise remove it -->
                <input class="form-control s-searchbox input-control"  type="text" placeholder="Search" />                
            </div> 
            <div class="col-md-3 s-calendar">
                <input class="form-control s-calendar input-control"  type="text" name="daterange" />                
            </div>
            <div class="col-md-3 s-buttons">
                <button class="btn btn-default stables-btn-export btn-export-excel">Export to Excel</button> 
                <button class="btn btn-default stables-btn-export btn-export-csv">Export to CSV</button>             
            </div>  
          </div>
          <div class="row">
            <!-- Here goes the table with the rendered data -->
            <div class="s-table-data">
              
            </div> 
          </div>  
          <div class="row">
            <div class="col-md-10 s-navigation">

            </div>
            <div class="col-md-1 s-navigation-control">
               <select class="form-control">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                  <option>100</option>
              </select>
            </div>
          </div>
      </div>
    </section>