//***********************This script can only show news on specific topic**************************
//Those topics are as follows :-
//  1 ---> national
//  2 ---> business
//  3 ---> sports
//  4 ---> world
//  5 ---> politics
//  6 ---> technology
//  7 ---> startup
//  8 ---> entertainment
//  9 ---> miscellaneous
//  10 ---> hatke
//  11 ---> science
//  12 ---> automobile
//  13 ---> read
//just a test 

///********* For Input run this file on integrated terminal and then type input as given below(square braces excluded):-
// [node fileName.js topicName]
// and also read line number 170 of this code before running it on your system
//***********when you hear a beep sound you have to scan a QR code from your whatsapp mobile to open whatsapp web in chromium browser******************** 
//******************************* To open QR code scanner into your mobile goto whatsapp->click on three dots on top right corner-> tap on whatsapp web -> tap on green button i.e. (Link a Device)


let request = require("request");

let cheerio = require("cheerio");

let fs = require("fs");

let path = require("path");

let puppeteer = require("puppeteer");

let textToSpeechCode = require("./code");

let newsTopic = process.argv[2];

//mainWebsite url from which news were fetched
let url = "https://inshorts.com";


//topics of news
let topicArr = ["/en/read","/en/read/national","/en/read/business","/en/read/sports","/en/read/world","/en/read/politics","/en/read/technology","/en/read/startup","/en/read/entertainment","/en/read/miscellaneous","/en/read/hatke","/en/read/science","/en/read/automobile"]


serialNews(0); //function to fetch news serially


function serialNews(n)
{
    if(n == topicArr.length)
    {
        return;
    }

    let splitArr = topicArr[n].split("/");
    
    let fileName = splitArr[splitArr.length - 1];
    
    request(url+topicArr[n],function(error,response,html)
    {
        if(error)
        {
            console.log("Error->"+error);
        }
        else
        {
            getNews(html,fileName);
            serialNews(n+1);
        }
    })
    
}

function getNews(html,filename)
{
    let selectorTool = cheerio.load(html);

    let newsArr = selectorTool("span[itemprop='headline']");

    // make folder of todaynews
    makeFolderOfNews();

    //make file of particular topic
    let pathOfFile = path.join(__dirname,"NewsToday",filename+".json");


    let headlineArr = [];

    for(let i = 0; i < newsArr.length; i++)
    {
        let singlenews = selectorTool(newsArr[i]).text();

        headlineArr.push(singlenews+"..........");
        
    }
    let headlineObj = {};

    for(let i = 0; i < headlineArr.length; i++)
    {
        headlineObj[i] = headlineArr[i];
    }
    writeInFile(headlineObj,pathOfFile);
    
    console.log("*****ATMANIRBHAR BHARAT*****");
    console.log("*****RUNNING SCRIPT*****");

}


function makeFolderOfNews()
{
    let dir = path.join(__dirname,"NewsToday");

    if (!fs.existsSync(dir)) 
    {
        fs.mkdirSync(dir);
    }
}


function writeInFile(news,pathofFile)
{
    
    if (fs.existsSync(pathofFile)) 
    {
        let olddata = fs.readFileSync(pathofFile);
        olddata = JSON.parse(olddata);
        olddata.push(news);
        fs.writeFileSync(pathofFile,JSON.stringify(olddata));
    }
    else
    {
        let arr = [];
        arr.push(news);
        fs.writeFileSync(pathofFile,JSON.stringify(arr));
    }
}


let dialogArr = []; //array from which news will be read and written
setTimeout(function () {

    let arr = require("./NewsToday/"+newsTopic+".json")

    let arrayToString = JSON.stringify(Object.assign({}, arr));  // convert array to string

    let stringToJsonObject = JSON.parse(arrayToString);  // convert string to json object

    let sizeOfObj = Object.size(stringToJsonObject);

    for(let i = 0; i < 20; i++)
    { 
        dialogArr.push(stringToJsonObject[sizeOfObj - 1][i]);
    }
}, 12000);  //intentionally slowed by 12 seconds 



(async function()
{
    try
    {
        let browserInstancePromise = await puppeteer.launch({
            headless :true, //browser invisible
            defaultViewport:null,
            args: ['--start-maximized'] 
        });

        let newPage = await browserInstancePromise.newPage();

        await newPage.goto("http://127.0.0.1:5500/hackathon/Activity/textToSpeech.html"); //this is the url of running textToSpeech.html which is in current directory so before runnning this code please run textToSpeech.html and then copy the url of that page in above line of code


        await newPage.click("#text123");

        await newPage.type("#text123",textToSpeechCode.Code,{delay:10});

        function browserConsoleFn(dialog) //function to be run on hidden browser console
        {
            let ele = document.querySelector("input[type='text']");
            ele.value  = dialog;
            let ele2 = document.querySelector("button[onclick='textToAudio()']");
            ele2.click();
        }

        await newPage.evaluate(browserConsoleFn,"today's news are...............");
        
        for(let i = 0; i < 20; i++) //test purpose  -> 20
        {
            await newPage.evaluate(browserConsoleFn,i+1+"....."+dialogArr[i]);
        }

        console.log("Listen !!!");


        let secondBrowserInstancePromise = await puppeteer.launch({
             headless :false, //browser visible
             defaultViewport:null,
             args: ['--start-maximized'] 
        });


        //this is for a beep reminds us to scan QR for whatsapp
        let thirdPage = await secondBrowserInstancePromise.newPage();
        await thirdPage.goto("https://odino.org/emit-a-beeping-sound-with-javascript/");
        await thirdPage.click("button[onclick='beep(999, 210, 800); beep(999, 500, 800);']");

            
        let secondNewPage = await secondBrowserInstancePromise.newPage();
            
        await secondNewPage.goto("https://web.whatsapp.com/");

        console.log("*****Scan Qr code to open whatsapp*****");


        await waitAndClick("div[data-tab='3']",secondNewPage);

        await secondNewPage.type("div[data-tab='3']","News");

        await waitAndClick("span[title='News']",secondNewPage);

        await waitAndClick("div[spellcheck='true']",secondNewPage);


        await secondNewPage.type("div[spellcheck='true']","     "+"*"+today+"*"+"     ",{delay:10});

        await waitAndClick("span[data-testid='send']",secondNewPage);

        for(let i = 0; i < 20; i++)
        {
           await secondNewPage.type("div[spellcheck='true']",dialogArr[i],{delay:10});

           await waitAndClick("span[data-testid='send']",secondNewPage);
        }


        await secondNewPage.type("div[spellcheck='true']","._________________________________________.",{delay:10});

        await waitAndClick("span[data-testid='send']",secondNewPage);
    }
    catch(error)
    {
        console.log("Error->"+error);
    }
})()

//custom function to find size of an object
Object.size = function (obj) {

    var size = 0, key;

    for (key in obj) {

        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

//this function is used for selectors waiting
async function waitAndClick(selector, Page) {

    await Page.waitForSelector(selector, { visible: true });

    let selectorClickPromise = Page.click(selector);

    return selectorClickPromise;
}

//code to get only today's date
var today = new Date();

var dd = String(today.getDate()).padStart(2, '0');

var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!

var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
