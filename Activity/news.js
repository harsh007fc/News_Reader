let request = require("request");

let cheerio = require("cheerio");

let fs = require("fs");

let path = require("path");

let puppeteer = require("puppeteer");

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
            console.log(error);
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

    // make folder of today's news
    makeFolderOfNews();

    //make file of particular topic
    let pathOfFile = path.join(__dirname,"NewsToday",filename+".json");


    let arr = [];

    for(let i = 0; i < newsArr.length; i++)
    {
        let singlenews = selectorTool(newsArr[i]).text();

        arr.push(singlenews+"..........");
        
    }
    let obj = {};

    for(let i = 0; i < arr.length; i++)
    {
        obj[i] = arr[i];
    }
    writeInFile(obj,pathOfFile);
    
    console.log("--------running---------")

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

//======================this piece of code is used to convert array to json object=====================


setTimeout(function () {

    let arr = require("./NewsToday/automobile.json")

    let arrayToString = JSON.stringify(Object.assign({}, arr));  // convert array to string

    let stringToJsonObject = JSON.parse(arrayToString);  // convert string to json object

    console.log(stringToJsonObject);
    let newsLine = stringToJsonObject[0][5];
    console.log(newsLine);
}, 15000);  //intentionally slowed by 15 seconds
// let arr = require("./NewsToday/automobile.json")

// let arrayToString = JSON.stringify(Object.assign({}, arr));  // convert array to string

// let stringToJsonObject = JSON.parse(arrayToString);  // convert string to json object

// console.log(stringToJsonObject);
// let newsLine = stringToJsonObject[0][5];
// console.log(newsLine);
////==========================array to json ends here===================================================




(async function()
{
    try
    {
        let browserInstancePromise = await puppeteer.launch({
            headless :false,
            defaultViewport:null,
            args: ['--start-maximized'] 
        });

        let newPage = await browserInstancePromise.newPage();

        await newPage.goto("https://codepen.io/pen/");
    }
    catch(error)
    {
        console.log(error);
    }
})()


