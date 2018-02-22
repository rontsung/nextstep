var hello = [];
var output = [];

var myMap = L.map("map", {
center: [38.20, -95.71],
zoom: 4
});

var maxBounds = [
  [5.499550, -167.276413], //Southwest
  [83.162102, -52.233040]  //Northeast
];

myMap.setMaxBounds(maxBounds);

var mapBox = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
"T6YbdDixkOBWH_k9GbS8JQ";


L.tileLayer(mapBox).addTo(myMap);   


function SubmitData (form) {
    var PopSize = form.PopSize.value;
    var PopSize_S=form.PopSize_S.value;
    var SA = form.SA.value;
    var SA_S=form.SA_S.value;
    var O6 = form.O6.value;
    var O6_S=form.O6_S.value;
    var MHP = form.MHP.value;
    var MHP_S=form.MHP_S.value;
    var  MR= form.MR.value;
    var MR_S=form.MR_S.value;
   
    document.getElementById('processit').innerHTML="Processing please wait...";
    d3.json('/score/'+PopSize_S+","+O6_S+","+MR_S+","+MHP_S+","+SA_S+","+PopSize+","+O6+","+MR+","+MHP+","+SA, function(error, response) {
        
        var resp=[];
        resp=JSON.parse(response);
        hello = [];
        newCity = [];

        for (var i=0; i< resp.length; i++){
        
          newCity.City = resp[i].City;
          newCity.State = resp[i].State;
          newCity.URL = resp[i].URL;
          newCity.imgURL = resp[i].Img;
          newCity.crime = resp[i].CrimeRate;
          newCity.USNewsURL = resp[i].Link;
          newCity.RtrmtRank= resp[i].RtrmtRank;
          newCity.USNewsRank = resp[i].USNewsRank;
          newCity.cPopulation = resp[i].cPopulation;
          newCity.cOver_65 = resp[i].cOver_65;
          newCity.cRent = resp[i].cRent;
          newCity.cHome_Price = resp[i].cHome_Price;
          newCity.uAssistance= resp[i].cAssistance;
          newCity.Score= resp[i].Score;
          newCity.places = document.createElement('div');

          hello.push(newCity);            
        }  
        hello=resp;
        rendertop();
    });
    // setTimeout('delayscore()', 5000);

    d3.json('/usmap/', function(error, response) {
        
        var resp2=[];
        resp2=JSON.parse(response);
        output = [];
        
        output=resp2;
        myMap.remove();   
        myMap = L.map("map", {
        center: [38.20, -95.71],
        zoom: 4
        });
        mapit();
        Plotly.deleteTraces("bargraph", 0);
        barit();
        document.getElementById('processit').innerHTML="";
    });
}

function delayscore(){
    // hello = [{"City":"New Haven","State":"CT","Latitude":41.3052226,"Longitude":-72.9268626,"URL":"https://www.census.gov/quickfacts/fact/table/newhavencityconnecticut,US/PST045216","uPopulation":10000,"uOver_65":15.0,"uRent":1200.0,"uHome_Price":130000.0,"uAssistance":143456.0,"zuPopulaton":-0.5571986901,"zuOver_65":-0.4555333433,"zuRent":1.1672829099,"zuHome_Price":-0.463681485,"zuAssistance":-0.6434261331,"cPopulation":129890,"cOver_65":9.2,"cRent":1121.0,"cHome_Price":190700.0,"cAssistance":2797865.0,"zcPopulation":-0.4172689859,"zcOver_65":-0.6616416553,"zcRent":0.8277071233,"zcHome_Price":-0.0075094634,"zcAssistance":-0.3304833417,"Score":0.4166943268,"ZipCode":"6510","USNewsRank":81,"RtrmtRank":1,"Img":"https://realestate.usnews.com/dims4/USNEWS/1a7893e/2147483647/resize/1024x280/crop/420x280+302+0/quality/85/?url=https://realestate.usnews.com/static-assets/cms/img/bestplaces/41452/CT_New_Haven_superhero_image.jpg","Link":"https://realestate.usnews.com/places/rankings/best-places-to-retire","CrimeRate":476.0},{"City":"Virginia Beach","State":"VA","Latitude":36.8643566,"Longitude":-75.9985693,"URL":"https://www.census.gov/quickfacts/fact/table/virginiabeachcityvirginia,US/PST045216","uPopulation":1234,"uOver_65":10.0,"uRent":1200.0,"uHome_Price":120000.0,"uAssistance":123456.0,"zuPopulaton":-0.5571986901,"zuOver_65":-0.4555333433,"zuRent":1.1672829099,"zuHome_Price":-0.463681485,"zuAssistance":-0.6434261331,"cPopulation":437907,"cOver_65":10.6,"cRent":1258.0,"cHome_Price":262200.0,"cAssistance":1959395.0,"zcPopulation":-0.0822614643,"zcOver_65":-0.3009521094,"zcRent":1.4165917153,"zcHome_Price":0.4538243349,"zcAssistance":-0.4285959125,"Score":0.5741958975,"ZipCode":"23451","USNewsRank":69,"RtrmtRank":2,"Img":"https://realestate.usnews.com/dims4/USNEWS/5fc4fb2/2147483647/resize/1024x280/crop/420x280+302+0/quality/85/?url=https://realestate.usnews.com/static-assets/cms/img/bestplaces/42005/VA_Virginia_Beach_superhero_image.jpg","Link":"https://realestate.usnews.com/places/rankings/best-places-to-retire","CrimeRate":159.3},{"City":"Orlando","State":"FL","Latitude":28.5416658,"Longitude":-81.3756862,"URL":"https://www.census.gov/quickfacts/fact/table/orlandocityflorida,US/PST045216","uPopulation":1234,"uOver_65":10.0,"uRent":1200.0,"uHome_Price":120000.0,"uAssistance":123456.0,"zuPopulaton":-0.5571986901,"zuOver_65":-0.4555333433,"zuRent":1.1672829099,"zuHome_Price":-0.463681485,"zuAssistance":-0.6434261331,"cPopulation":239057,"cOver_65":9.4,"cRent":1040.0,"cHome_Price":172100.0,"cAssistance":5000971.0,"zcPopulation":-0.298536039,"zcOver_65":-0.6101145773,"zcRent":0.4795344813,"zcHome_Price":-0.1275207732,"zcAssistance":-0.0726895109,"Score":0.722130082,"ZipCode":"32801","USNewsRank":40,"RtrmtRank":3,"Img":"https://realestate.usnews.com/dims4/USNEWS/e729fbd/2147483647/resize/1024x280/crop/420x280+302+0/quality/85/?url=https://realestate.usnews.com/static-assets/cms/img/bestplaces/41872/FL_Orlando_superhero_image.jpg","Link":"https://realestate.usnews.com/places/rankings/best-places-to-retire","CrimeRate":551.8},{"City":"Austin","State":"TX","Latitude":30.2729209,"Longitude":-97.7443863,"URL":"https://www.census.gov/quickfacts/fact/table/austincitytexas,US/PST045216","uPopulation":1234,"uOver_65":10.0,"uRent":1200.0,"uHome_Price":120000.0,"uAssistance":123456.0,"zuPopulaton":-0.5571986901,"zuOver_65":-0.4555333433,"zuRent":1.1672829099,"zuHome_Price":-0.463681485,"zuAssistance":-0.6434261331,"cPopulation":811045,"cOver_65":7.0,"cRent":1106.0,"cHome_Price":257800.0,"cAssistance":6609254.0,"zcPopulation":0.3235733974,"zcOver_65":-1.2284395132,"zcRent":0.7632307081,"zcHome_Price":0.4254345627,"zcAssistance":0.1155018133,"Score":0.7527040864,"ZipCode":"78701","USNewsRank":9,"RtrmtRank":4,"Img":"https://realestate.usnews.com/dims4/USNEWS/df3f300/2147483647/resize/1024x280/crop/420x280+302+0/quality/85/?url=https://realestate.usnews.com/static-assets/cms/img/bestplaces/41481/TX_Austin_superhero_image.jpg","Link":"https://realestate.usnews.com/places/rankings/best-places-to-retire","CrimeRate":312.7},{"City":"Modesto","State":"CA","Latitude":37.6697463,"Longitude":-120.9991032,"URL":"https://www.census.gov/quickfacts/fact/table/modestocitycalifornia,US/PST045216","uPopulation":1234,"uOver_65":10.0,"uRent":1200.0,"uHome_Price":120000.0,"uAssistance":123456.0,"zuPopulaton":-0.5571986901,"zuOver_65":-0.4555333433,"zuRent":1.1672829099,"zuHome_Price":-0.463681485,"zuAssistance":-0.6434261331,"cPopulation":203119,"cOver_65":11.7,"cRent":1034.0,"cHome_Price":208000.0,"cAssistance":2641840.0,"zcPopulation":-0.3376231683,"zcOver_65":-0.0175531804,"zcRent":0.4537439152,"zcHome_Price":0.1041139591,"zcAssistance":-0.3487404217,"Score":0.777544744,"ZipCode":"95350","USNewsRank":99,"RtrmtRank":5,"Img":"https://realestate.usnews.com/dims4/USNEWS/279c375/2147483647/resize/1024x280/crop/420x280+302+0/quality/85/?url=https://realestate.usnews.com/static-assets/cms/img/bestplaces/42031/CA_Modesto_superhero_image.jpg","Link":"https://realestate.usnews.com/places/rankings/best-places-to-retire","CrimeRate":484.7}]
    alert("Update Top5")
    rendertop();
}

function rendertop(){
    // console.log(hello[0]["RtrmtRank"])
    console.log("Updating Page....")
    document.getElementById('dynamic_elements').innerHTML="";

    for (var i = 0; i < 5; i++) {

        var City = hello[i].City;
        var State = hello[i].State;
        var URL = hello[i].URL;
        var imgURL = hello[i].Img;
        var crime = hello[i].CrimeRate;
        var USNewsURL = hello[i].Link;
        var RtrmtRank= hello[i].RtrmtRank;
        var USNewsRank = hello[i].USNewsRank;
        var uPopulation = hello[i].cPopulation;
        var uPopulation = hello[i].cPopulation.toLocaleString();
        var uOver_65 = hello[i].cOver_65;
        var uRent = hello[i].cRent;
        var uRent = hello[i].cRent.toLocaleString();
        var uHome_Price = hello[i].cHome_Price;
        var uHome_Price = hello[i].cHome_Price.toLocaleString();
        var uAssistance= hello[i].cAssistance;
        var Score= hello[i].Score;
        var places = document.createElement('div');
        places.className = 'places';
        places.innerHTML = 

        '<div class="container mainborder" style="padding-bottom:5px;"><div class="row bottomborder"> <div class="col-md-3 numberheader">' +RtrmtRank+
        '</div><div class="col-md-9 cityheader"> ' + City + ', ' + State + 
        '</div></div><div class="row"><div class="col-md-4 imgbox">' + '<img src="' + imgURL + '">' + 
        '</div><div class="col-md-4"><div class="row t_0"><div class="col-md-9 t_1">Crime:</div><div class="col-md-3 t_2 bottomborder_1">' + crime +
        '</div></div><div class="row"><div class="col-md-9 t_1">US News URL:</div><div class="col-md-3 t_2 bottomborder_1">' + '<a href="'+ USNewsURL + '">Link</a>' +
        '</div></div><div class="row"><div class="col-md-9 t_1">Census URL:</div><div class="col-md-3 t_2 bottomborder_1">' + '<a href="'+URL+'">Link</a>' +
        '</div></div><div class="row"><div class="col-md-9 score_1">US News Rank</div><div class="col-md-3 rank">' + USNewsRank +
        '</div> </div></div><div class="col-md-4"><div class="row t_0a"><div class="col-md-9 t_1">Mean Rent:</div><div class="col-md-3 t_2 bottomborder_1"> $' + uRent +
        '</div></div><div class="row"><div class="col-md-9 t_1">Mean Home Price:</div><div class="col-md-3 t_2 bottomborder_1"> $' + uHome_Price +
        '</div></div><div class="row"><div class="col-md-9 t_1">Population:</div><div class="col-md-3 t_2 bottomborder_1">' + uPopulation +

        '</div></div><div class="row"><div class="col-md-9 t_1">% Over 65:</div><div class="col-md-3 t_2 bottomborder_1">' + uOver_65 +
        // '</div></div><div class="row"><div class="col-md-9 score_1">Match</div><div class="col-md-3 score">' + Math.floor(((1-Score) * 100)) +
        '</div></div><div class="row"><div class="col-md-9 score_1">Closeness to Preference</div><div class="col-md-3 score bottomborder_1">' + Score.toFixed(3) +
        '</div> </div> </div> </div></div>   <br><br>';

        // document.getElementById('dynamic_elements').innerHTML("");
        document.getElementById('dynamic_elements').appendChild(places);
        document.getElementById("dynamic_elements").style.color = "#FFFFFF";        
    }
}

function mapit()
{
    console.log("Mapping IT");
    // var mapBox = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    // "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    // "T6YbdDixkOBWH_k9GbS8JQ";

    // Create a map object    
    // myMap = L.map("map", {
    // center: [38.20, -95.71],
    // zoom: 5
    // });

   
    // Add a tile layer
    L.tileLayer(mapBox).addTo(myMap); 

    var xmax=0;
    // var xmin=0;
    for (var x = 0; x < output.length; x++) {
        // if (x==0){xmin=output[x].Score}
        xmax=output[x].Score
    }   

    // Define a markerSize function that will give each city a different radius based on its population
    function markerSize(score) {
    // return 60000 / score;
    // return score*115000;    
    return (xmax-score)*150000;
    }

    // Each city object contains the city's name, location and population
    // var output = [{"City":"Sarasota","State":"FL","Latitude":27.2612782,"Longitude":-82.5131717,"Score":0.7978757897},{"City":"Lancaster","State":"PA","Latitude":40.0720931,"Longitude":-76.3058328,"Score":1.6946731821},{"City":"San Antonio","State":"TX","Latitude":29.46357,"Longitude":-98.5226706,"Score":1.5512716293},{"City":"Grand Rapids","State":"MI","Latitude":42.9616689,"Longitude":-85.6588999,"Score":1.6973593678},{"City":"El Paso","State":"TX","Latitude":31.7597373,"Longitude":-106.4788714,"Score":1.8865930861},{"City":"McAllen","State":"TX","Latitude":26.2188442,"Longitude":-98.2322355,"Score":1.9830350182},{"City":"Daytona Beach","State":"FL","Latitude":29.1987957,"Longitude":-81.0423429,"Score":1.7720147464},{"City":"Pittsburgh","State":"PA","Latitude":40.4737114,"Longitude":-79.9612368,"Score":1.5455392612},{"City":"Austin","State":"TX","Latitude":30.2729209,"Longitude":-97.7443863,"Score":0.7527040864},{"City":"Washington","State":"DC","Latitude":38.912068,"Longitude":-77.0190228,"Score":1.4680170673},{"City":"Colorado Springs","State":"CO","Latitude":38.72728,"Longitude":-104.8075245,"Score":3.3381088745},{"City":"Boise","State":"ID","Latitude":43.6624385,"Longitude":-116.1630431,"Score":1.5943375108},{"City":"Nashville","State":"TN","Latitude":36.1724885,"Longitude":-86.7805961,"Score":1.3373932833},{"City":"Charlotte","State":"NC","Latitude":35.2326781,"Longitude":-80.8460822,"Score":1.1019210831},{"City":"Dallas-Fort Worth","State":"TX","Latitude":32.7863301,"Longitude":-96.7962528,"Score":1.5029727138},{"City":"San Francisco","State":"CA","Latitude":37.7786871,"Longitude":-122.4212424,"Score":3.0565627674},{"City":"Minneapolis-St. Paul","State":"MN","Latitude":44.9836543,"Longitude":-93.2693572,"Score":1.3513226398},{"City":"Madison","State":"WI","Latitude":43.0833196,"Longitude":-89.3724769,"Score":1.0904945227},{"City":"Houston","State":"TX","Latitude":29.752554,"Longitude":-95.3704009,"Score":1.751296209},{"City":"Sarasota","State":"FL","Latitude":27.2612782,"Longitude":-82.5131717,"Score":0.7978757897},{"City":"San Diego","State":"CA","Latitude":32.7269669,"Longitude":-117.1647094,"Score":1.7002464231},{"City":"Richmond","State":"VA","Latitude":37.5410261,"Longitude":-77.4386429,"Score":1.2531908808},{"City":"Omaha","State":"NE","Latitude":41.2661075,"Longitude":-95.9330455,"Score":1.6571804992},{"City":"Portland","State":"ME","Latitude":43.6629964,"Longitude":-70.2568775,"Score":1.0782430357},{"City":"Charleston","State":"SC","Latitude":32.7791432,"Longitude":-79.9248669,"Score":0.803283496},{"City":"Syracuse","State":"NY","Latitude":43.0481645,"Longitude":-76.1473156,"Score":1.9944110298},{"City":"Greenville","State":"SC","Latitude":34.8505552,"Longitude":-82.394,"Score":1.6287579663},{"City":"Albany","State":"NY","Latitude":42.6322463,"Longitude":-73.7654367,"Score":1.4088318197},{"City":"Hartford","State":"CT","Latitude":41.7665502,"Longitude":-72.6757236,"Score":1.2385065394},{"City":"Buffalo","State":"NY","Latitude":42.8967674,"Longitude":-78.8863847,"Score":2.117361282},{"City":"Harrisburg","State":"PA","Latitude":40.2584515,"Longitude":-76.8865085,"Score":1.783738153},{"City":"Tampa","State":"FL","Latitude":27.9552692,"Longitude":-82.4563199,"Score":0.9675856019},{"City":"Oklahoma City","State":"OK","Latitude":35.4711808,"Longitude":-97.516602,"Score":1.7811972874},{"City":"Winston-Salem","State":"NC","Latitude":36.105232,"Longitude":-80.2042436,"Score":2.0011156848},{"City":"Little Rock","State":"AR","Latitude":34.7499657,"Longitude":-92.2852014,"Score":1.7143365923},{"City":"Rochester","State":"NY","Latitude":43.1581207,"Longitude":-77.6063541,"Score":1.8188253571},{"City":"Orlando","State":"FL","Latitude":28.5416658,"Longitude":-81.3756862,"Score":0.722130082},{"City":"Chattanooga","State":"TN","Latitude":35.0449767,"Longitude":-85.3162066,"Score":1.8791050069},{"City":"Louisville","State":"KY","Latitude":38.2556928,"Longitude":-85.751283,"Score":1.9732035137},{"City":"Phoenix","State":"AZ","Latitude":33.4495511,"Longitude":-112.0789355,"Score":1.4775118573},{"City":"Jacksonville","State":"FL","Latitude":30.3276337,"Longitude":-81.6555607,"Score":1.1486392171},{"City":"Honolulu","State":"HI","Latitude":21.3136151,"Longitude":-157.8480364,"Score":1.716077884},{"City":"Milwaukee","State":"WI","Latitude":43.0439776,"Longitude":-87.8991514,"Score":1.759264613},{"City":"Kansas City","State":"MO","Latitude":39.1041725,"Longitude":-94.5998517,"Score":1.6288871966},{"City":"Melbourne","State":"FL","Latitude":28.0600145,"Longitude":-80.621591,"Score":1.4720661097},{"City":"Atlanta","State":"GA","Latitude":33.755711,"Longitude":-84.3883717,"Score":0.9584454879},{"City":"Greensboro","State":"NC","Latitude":36.0676041,"Longitude":-79.7568107,"Score":1.7842054843},{"City":"Santa Rosa","State":"CA","Latitude":38.4409697,"Longitude":-122.7971649,"Score":1.2089901546},{"City":"Cincinnati","State":"OH","Latitude":39.1031971,"Longitude":-84.5064881,"Score":2.3194748834},{"City":"Worcester","State":"MA","Latitude":42.2704584,"Longitude":-71.8512036,"Score":1.0132360006},{"City":"Indianapolis","State":"IN","Latitude":39.7774501,"Longitude":-86.1090119,"Score":1.734358928},{"City":"Columbia","State":"SC","Latitude":33.9873389,"Longitude":-81.0368211,"Score":1.3717265168},{"City":"Columbus","State":"OH","Latitude":40.103832,"Longitude":-83.0200245,"Score":1.5437785023},{"City":"Tulsa","State":"OK","Latitude":36.1592882,"Longitude":-95.9964783,"Score":1.9181567281},{"City":"Spokane","State":"WA","Latitude":47.6600716,"Longitude":-117.4316272,"Score":1.8582189152},{"City":"Knoxville","State":"TN","Latitude":35.9641189,"Longitude":-83.9201656,"Score":1.8696787797},{"City":"Tucson","State":"AZ","Latitude":32.2147915,"Longitude":-110.9715269,"Score":1.8632282118},{"City":"Baton Rouge","State":"LA","Latitude":30.4483779,"Longitude":-91.188708,"Score":1.741685694},{"City":"Lakeland","State":"FL","Latitude":28.0486111,"Longitude":-81.898908,"Score":1.8420410551},{"City":"St. Louis","State":"MO","Latitude":38.786556,"Longitude":-90.7818089,"Score":2.948864609},{"City":"Sacramento","State":"CA","Latitude":38.5967128,"Longitude":-121.4941738,"Score":0.8067546724},{"City":"Springfield","State":"MA","Latitude":42.105218,"Longitude":-72.5929401,"Score":1.5566702798},{"City":"Wichita","State":"KS","Latitude":37.6843628,"Longitude":-97.332753,"Score":2.0059352464},{"City":"Virginia Beach","State":"VA","Latitude":36.8643566,"Longitude":-75.9985693,"Score":0.5741958975},{"City":"Fort Myers","State":"FL","Latitude":26.6235485,"Longitude":-81.8770671,"Score":1.5106090267},{"City":"Toledo","State":"OH","Latitude":41.6541814,"Longitude":-83.5443287,"Score":2.3696831558},{"City":"Augusta","State":"GA","Latitude":33.4577032,"Longitude":-81.9643913,"Score":1.7502036471},{"City":"Baltimore","State":"MD","Latitude":39.2963369,"Longitude":-76.6210539,"Score":1.0430035875},{"City":"Albuquerque","State":"NM","Latitude":35.0848894,"Longitude":-106.6468148,"Score":1.6921068157},{"City":"Dayton","State":"OH","Latitude":39.7574433,"Longitude":-84.2094347,"Score":2.4323143228},{"City":"Philadelphia","State":"PA","Latitude":39.9556241,"Longitude":-75.1647529,"Score":1.4007918431},{"City":"Las Vegas","State":"NV","Latitude":36.1697096,"Longitude":-115.1236952,"Score":1.0015971372},{"City":"Allentown","State":"PA","Latitude":40.6027182,"Longitude":-75.4708848,"Score":1.2621860918},{"City":"New York City","State":"NY","Latitude":40.7536854,"Longitude":-73.9991637,"Score":4.7212182646},{"City":"New Haven","State":"CT","Latitude":41.3052226,"Longitude":-72.9268626,"Score":0.4166943268},{"City":"Chicago","State":"IL","Latitude":41.8839927,"Longitude":-87.6197056,"Score":1.7762005408},{"City":"Cleveland","State":"OH","Latitude":41.4789363,"Longitude":-81.7404134,"Score":2.2617443506},{"City":"Providence","State":"RI","Latitude":41.816736,"Longitude":-71.4091563,"Score":1.2336603407},{"City":"Scranton","State":"PA","Latitude":41.4108493,"Longitude":-75.6659016,"Score":2.083707193},{"City":"Youngstown","State":"OH","Latitude":41.0753993,"Longitude":-80.6382413,"Score":2.5143280357},{"City":"Los Angeles","State":"CA","Latitude":33.9697897,"Longitude":-118.2468148,"Score":0.9100320305},{"City":"Detroit","State":"MI","Latitude":42.348495,"Longitude":-83.0602998,"Score":1.9743232769},{"City":"Birmingham","State":"AL","Latitude":33.5178769,"Longitude":-86.8094808,"Score":1.9683101079},{"City":"Jackson","State":"MS","Latitude":32.2907734,"Longitude":-90.1846217,"Score":1.8664907476},{"City":"Miami","State":"FL","Latitude":25.8035656,"Longitude":-80.3185252,"Score":2.6924564032},{"City":"Memphis","State":"TN","Latitude":35.1543632,"Longitude":-90.0606637,"Score":1.5831119305},{"City":"New Orleans","State":"LA","Latitude":29.9595769,"Longitude":-90.0770127,"Score":1.2061398435},{"City":"Fresno","State":"CA","Latitude":36.8420172,"Longitude":-119.8019498,"Score":1.3321312982},{"City":"Bakersfield","State":"CA","Latitude":35.3873576,"Longitude":-119.0168962,"Score":0.9132804622},{"City":"Stockton","State":"CA","Latitude":37.9573836,"Longitude":-121.2883857,"Score":1.0396787491},{"City":"Modesto","State":"CA","Latitude":37.6697463,"Longitude":-120.9991032,"Score":0.777544744}];

    // Loop through the output array and create one marker for each city object
    for (var i = 0; i < output.length; i++) {
    L.circle([output[i].Latitude,output[i].Longitude], {
    fillOpacity: 0.75,
    color: "white",
    fillColor: "purple",
    // Setting our circle's radius equal to the output of our markerSize function
    // This will make our marker's size proportionate to its population
    radius: markerSize(output[i].Score)
    }).bindPopup("<h1>" + output[i].City + "</h1> <hr> <h3>State: " + output[i].State + "</h3> <h4>Score: " + output[i].Score + "</h4>").addTo(myMap);
    }


}


function barit()
{

var xl = [];
var yl = [];
var wd = [];
var cl = [];

for (var i=0; i< output.length; i++){
 xl.push(output[i]["City"]);
 yl.push(output[i]["Score"]);
 wd.push(output[i]["Score"]);

 if (output[i]["RtrmtRank"]<=5){
    cl.push('rgba(222,45,38,0.8)');
 }
 if (output[i]["RtrmtRank"]>5 && output[i]["RtrmtRank"]<=50){
    cl.push('rgb(55, 83, 109)');
 }
 if (output[i]["RtrmtRank"]>50){
    cl.push('rgba(204,204,204,1)');
 }
    
}
 var trace = {
 x: xl,
 y: yl,
 marker:{color:cl},
 type:"bar"}

 var layout = {
  title: 'Score Distribution by City'
    };

 Plotly.plot(document.getElementById("bargraph"), [trace],layout);
}

function initplt()
{
var trace = {
 x: [0],
 y: [0]}
Plotly.plot(document.getElementById("bargraph"), [trace]);
}

initplt()
// rendertop();
// mapit();