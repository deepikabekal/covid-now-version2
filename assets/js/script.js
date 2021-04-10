// var countryName = "Canada"; //hard-coded country name 
// var countryCode = "ca"; //hard-coded country code

var newsAbout = "covid";//keywords for the search
var apiUrl = `https://covid-19-news.p.rapidapi.com/v1/covid?`;//covid news API URL
var searchHistory = [];
//covidDataArray = [];

//event listeners for button click

$("nav").on("click", "button", function(){
    var btnText = $(this).text();
    if (btnText==="World"){
        covidApiCall(btnText);
        worldNewsApiCall();
    } else {
        covidApiCall(btnText);
    }
    
    $("#nav-page-container").removeClass("hidden");
    
    
})


  // API fetch for the World Covid data  


function covidApiCall(btnText){
    if (btnText === "South America"){
        btnText = "southamerica";        
    } else if (btnText === "North America"){
        btnText = "northamerica";
    }
    fetch("https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/"+btnText, 
    {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "72215e9887msh7621f36b90d5395p12171cjsn8f1cf12ac355",
            "x-rapidapi-host": "vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com"
        }
    })
    .then(response => {
	    return response.json();
    })
    .then(data => {
        console.log("data = ", data);
        getCovidData(data);
    })
    .catch(err => {
	    console.error(err);
     });
}



function getCovidData(data){
    var totalCases = 0;
    var activeCases = 0;
    var totalDeaths = 0;
    var newCases = 0;
    var criticalCases = 0;
    var newDeaths = 0;
    for (var i = 0; i < data.length || i===0; i++){
        totalCases = totalCases + data[i].TotalCases;
        activeCases = activeCases + data[i].ActiveCases;
        totalDeaths = totalDeaths + data[i].TotalDeaths;
        newCases = newCases + data[i].NewCases;
        criticalCases = criticalCases + data[i].Serious_Critical;
        newDeaths = newDeaths + data[i].NewDeaths;
    }
    var covidDataArray = [totalCases,activeCases,totalDeaths,newCases,criticalCases,newDeaths];
    console.log("covid array", covidDataArray);
    covidDataArray = numberFormat(covidDataArray);  
    displayCovidData(covidDataArray);

}

function numberFormat(covidDataArray){
    for (var i=0; i<covidDataArray.length; i++){
        covidDataArray[i] = covidDataArray[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    }
    console.log(covidDataArray);
    return covidDataArray;
}

function displayCovidData(covidDataArray){
    $("#total-count").text(covidDataArray[0].toLocaleString());
    console.log(covidDataArray[0]);
    $("#active-count").text(covidDataArray[1].toLocaleString());
    $("#death-count").text(covidDataArray[2].toLocaleString());
    $("#new-count").text(covidDataArray[3].toLocaleString());
    $("#critical-count").text(covidDataArray[4].toLocaleString());
    $("#new-death-count").text(covidDataArray[5].toLocaleString());

}

function worldNewsApiCall(){
    fetch("https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/news/get-coronavirus-news/0", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "72215e9887msh7621f36b90d5395p12171cjsn8f1cf12ac355",
		"x-rapidapi-host": "vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com"
	}
})
.then(response => {
	return response.json();
})
.then(data => {
    console.log("world-news",data);
    displayWorldNews(data);
})
.catch(err => {
	console.error(err);
});
}
// MediaStack Starts
//function to make an API call to get the data 
function makeApiCall(countryCode){
    var queryPara = `q=${newsAbout}&country=${countryCode}&media=True`;
    fetch(apiUrl+queryPara, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "72215e9887msh7621f36b90d5395p12171cjsn8f1cf12ac355",
		"x-rapidapi-host": "covid-19-news.p.rapidapi.com"
	}
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log("data",data);
        getInformation(data); 
    })
    .catch(function(error){
        console.log("error",error);
        var errorMsg = "Sorry! There is no COVID-19 news related to this country."
        var divTag = $("<div></div>");
        divTag.attr("id", "error-div");
        var headingEl = $("<h2></h2>").text("Latest News");
        var errorPTag = $("<p></p>").text(errorMsg);
        $(".news-display").append(divTag);
        $(divTag).append(headingEl);
        $(divTag).append(errorPTag);

    })
}

// makeApiCall(countryCode);

function getInformation(info){
    var newsInformation = [];
    for (var i = 0; i < info.articles.length; i++){
        var newsData = {
            newsTitle: info.articles[i].title.trim(), 
            newsUrl: info.articles[i].link
        };
        newsInformation.push(newsData);
    }
    console.log("news information",newsInformation);
    if (newsInformation.length===0){

        var errorMsg = "Sorry! There is no COVID-19 news related to this country."
        var divTag = $("<div></div>");
        divTag.attr("id", "error-div");
        //var headingEl = $("<h2></h2>").text("Latest News:");
        var errorPTag = $("<p></p>").text(errorMsg);
        $(".news-display").append(divTag);
        $(divTag).append(headingEl);
        $(divTag).append(errorPTag);

    } else {
    covidNewsDisplay(newsInformation);
    }
    
}




//function to display news articles
function covidNewsDisplay(newsInformation){

    //display heading for the section
    $(".news-display").append(
        `
        <div>
        <h2>Latest News:</h2>
        </div>
        <div class="news-links"></div>
        `
    );
    //console.log(newsInformation.length)
    //display news links

    if (newsInformation.length<10){
        var count = newsInformation.length;
    } else {
        var count = 10;
    }
    for(var i=0;i<count ;i++){
        var divTag = $("<div></div>");
        var pTag = $("<p></p>")
        var aTag = $("<a></a>").attr("href",newsInformation[i].newsUrl);
        aTag.text(newsInformation[i].newsTitle);
        $(".news-links").append(divTag);
        $(divTag).append(pTag);
        $(pTag).after(aTag);
        
        // $(".news-links").append(
        //      `
        //      <div>
        //      <p>
        //      <a href=${newsInformation[i].newsUrl}>${newsInformation[i].newsTitle}</a>
        //      </p>
        //      </div>
        //      `
        //  )

    }
    
}

//button.addEventListener("click", countrySearch);

function saveSearchHistory(countryName,covidObject){
    searchHistory = JSON.parse(localStorage.getItem("covidNow")) || [];
    console.log(searchHistory);

    
    if (searchHistory!==[]){
        for (var i=0; i<searchHistory.length;i++){
            if(countryName.toLowerCase()===searchHistory[i].country.toLowerCase()){
                searchHistory.splice(i,1);
            }
        }
    }

    searchHistory.push(covidObject);
    console.log("coid object", covidObject);
    console.log("last search History", searchHistory);

    localStorage.setItem("covidNow",JSON.stringify(searchHistory));

    displaySearchHistory();

}

function displaySearchHistory(){
    $("#search-history").empty();
    $("#search-city").val("");
    var searchHistory = JSON.parse(localStorage.getItem("covidNow")) || [];
    console.log(searchHistory.length);
    for (var i=0; i<searchHistory.length; i++){
        var optionTag = $("<option></option>");
        optionTag.text(searchHistory[i].country);
        //console.log(optionTag);
        $("#search-history").append(optionTag);
    } 
}

