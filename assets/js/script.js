// var countryName = "Canada"; //hard-coded country name 
// var countryCode = "ca"; //hard-coded country code

var newsAbout = "covid";//keywords for the search
var apiUrl = `https://covid-19-news.p.rapidapi.com/v1/covid?`;//covid news API URL
//var threeLetterCode = "";
var searchHistory = [];
var countryCodeList = [];
var formSubmit = document.querySelector (".search-bar");

$(window).on("load",function(){
    displaySearchHistory();
    });

//get the country code list on page load.
fetch("https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/countries-name-ordered",
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
.then( data => {
    console.log(data.length);
    countryCodeList = data;
    console.log("country data", data);
})
// .catch(err => {
// 	console.error(err);
// });

                            //beginning of code for event listeners

//event listener for search button
//$("#search-btn").submit(function(event){
     function formSearch(event){
        var threeLetterCode = "";
        event.preventDefault();
        var found = false;
    //$("#nav-page-container").empty();
    $("#main-page-content").removeClass("hidden");
    $("#nav-page-container").attr("class","hidden");
    $(".news-display").empty();
    console.log(countryCodeList);
    var countryName = $("#search-city").val().trim();
    countryName = countryName[0].toUpperCase() + countryName.slice(1,countryName.length).toLowerCase();

    for (var i=0;i<countryCodeList.length; i++){
        if (countryName===countryCodeList[i].Country){
            threeLetterCode = countryCodeList[i].ThreeLetterSymbol;
                console.log("threeLetterCode",threeLetterCode);
                found = true;
            break;
        }
    }
    if (!found)
    {
        $("#search-city").val("");
        displayErrorMsg(countryName);
    } else {

        saveSearchHistory(countryName);
        $("#country-name").text(countryName);
        
        $("#search-city").val("");
        console.log("threeLetterCode",threeLetterCode);
        //$("#news-content").removeClass("hidden");
        countryCovidApiCall(countryName,threeLetterCode);
    }
    
}



$("nav").on("click", "button", function(){
    //$("#main-page-content").empty();
    $("#main-page-content").addClass("hidden");
    $("#nav-page-container").removeClass("hidden");
    var btnText = $(this).text();
    if (btnText==="World"){
        covidApiCall(btnText);
        worldNewsApiCall();
    } else {
        covidApiCall(btnText);
    }   
    
})
                        //end of code for event listener 


                        //code for the navigation buttons begins

// API fetch for the World and continent Covid data  


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
    // .catch(err => {
	//     console.error(err);
    //  });
}


//get the covid data for the respective continents and world
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

//function to format the numbers
function numberFormat(covidDataArray){
    for (var i=0; i<covidDataArray.length; i++){
        covidDataArray[i] = covidDataArray[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    }
    console.log(covidDataArray);
    return covidDataArray;
}

function displayCovidData(covidDataArray){
    $("#total-count").text(covidDataArray[0]);
    console.log(covidDataArray[0]);
    $("#active-count").text(covidDataArray[1]);
    $("#death-count").text(covidDataArray[2]);
    $("#new-count").text(covidDataArray[3]);
    $("#critical-count").text(covidDataArray[4]);
    $("#new-death-count").text(covidDataArray[5]);

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
// .catch(err => {
// 	console.error(err);
// });
}

function displayWorldNews(data){
       
    for(var i=0; i<3; i++){
        var divTag = $("<div></div>");
        divTag.attr("class", "world-news-1 col-sm-3");
        var pTag = $("<p></p>");
        var imgTag = $("<img>").attr("src", data.news[i].urlToImage);
        var aTag = $("<a></a>").attr("href",data.news[i].link);
        aTag.attr("target", "_blank");
        aTag.text(data.news[i].title);
        $("#world-news").append(divTag);
        $(divTag).append(imgTag);
        $(divTag).append(pTag);
        $(pTag).after(aTag);
    }

}

                            //end of code for navigation buttons


                            //beginning of code for main page logic

//function for countrycovid api call
function countryCovidApiCall(countryName, threeLetterCode){

    console.log("countryName", countryName);
    console.log("threeLetterCode", threeLetterCode);
    fetch(`https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/country-report-iso-based/${countryName}/${threeLetterCode}`, 
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
    .then( data => {
        console.log("country data", data);
        getCovidCountry(data);
    })
    .catch(err => {
	    displayErrorMsg(countryName);
    });
    
}

function getCovidCountry(data) {
    var actCase = data[0].ActiveCases;
    console.log(actCase);
    var testPer = data[0].Test_Percentage;
    var recPro = data[0].Recovery_Proporation;
    var recCase = data[0].TotalRecovered; 
    var totDeath = data[0].TotalDeaths;
    var infectionRisk = data[0].Infection_Risk;
 
     
 $("#active-case").text(actCase);
 $("#test-percentage").text(`${testPer}%`);
 $("#recovery-pro").text(`${recPro}%`);
 $("#tot-recov").text(recCase);
 $("#death-total").text(totDeath);
 $("#infection-risk").text(`${infectionRisk}%`);
 
 var countryCode = data[0].TwoLetterSymbol;
     makeApiCall(countryCode);

}    



//country-wise news api starts here
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
            newsImage: info.articles[i].media,
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
    
    if (newsInformation.length<10){
        var count = newsInformation.length;
    } else {
        var count = 9;
    }
    for(var i=0;i<count ;i++){
        var divTag = $("<div></div>");
        divTag.attr("class", "news col-sm-3");
        var pTag = $("<p></p>")
        var imgTag = $("<img>").attr("src", newsInformation[i].newsImage);
        var aTag = $("<a></a>").attr("href",newsInformation[i].newsUrl);
        aTag.attr("target", "_blank");
        aTag.text(newsInformation[i].newsTitle);
        $(".news-display").append(divTag);
        $(divTag).append(imgTag);
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

                                //end of code for main page logic


                                //beginning of code for search history

//button.addEventListener("click", countrySearch);

function saveSearchHistory(countryName){
    searchHistory = JSON.parse(localStorage.getItem("covidNow")) || [];
    console.log(searchHistory);

    var searchObject  = {country:countryName};
    console.log("searchobject", searchObject);
    
    if (searchHistory!==[]){
        for (var i=0; i<searchHistory.length;i++){
            if(countryName.toLowerCase()===searchHistory[i].country.toLowerCase()){
                searchHistory.splice(i,1);
            }
        }
    }

    searchHistory.push(searchObject);
    console.log("last search History", searchHistory);

    localStorage.setItem("covidNow",JSON.stringify(searchHistory));

    displaySearchHistory();

}

function displaySearchHistory(){
    $("#search-history").empty();
    //$("#search-city").val("");
    var searchHistory = JSON.parse(localStorage.getItem("covidNow")) || [];
    console.log(searchHistory.length);
    for (var i=0; i<searchHistory.length; i++){
        var optionTag = $("<option></option>");
        optionTag.text(searchHistory[i].country);
        //console.log(optionTag);
        $("#search-history").append(optionTag);
    } 
}

function displayErrorMsg(countryName){
    console.log(countryName);
    $("#main-page-content").addClass("hidden");
    var errorMsg = `${countryName} is not a valid country. Please enter correct Country Name`;
    var pTag = $("<p></p>");
    pTag.text(errorMsg);
    $("#incorrect-country").append(pTag);  

}

formSubmit.addEventListener("submit", formSearch);


                            //end of code for search history