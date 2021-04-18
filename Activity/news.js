let request = require("request");

let cheerio = require("cheerio");

let fs = require("fs");

let path = require("path");

let puppeteer = require("puppeteer");

let textToSpeechCode = require("./code");

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


let dialogArr = [];
setTimeout(function () {

    let arr = require("./NewsToday/national.json")

    let arrayToString = JSON.stringify(Object.assign({}, arr));  // convert array to string

    let stringToJsonObject = JSON.parse(arrayToString);  // convert string to json object

    let sizeOfObj = Object.size(stringToJsonObject);

    for(let i = 0; i < 20; i++)
    {   //just a try
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

        await newPage.goto("http://127.0.0.1:5500/hackathon/Raw/poc/textToSpeech.html");


        await newPage.click("#text123");

        await newPage.type("#text123",textToSpeechCode.Code,{delay:10});

        function browserConsoleFn(dialog)
        {
            let ele = document.querySelector("input[type='text']");
            ele.value  = dialog;
            let ele2 = document.querySelector("button[onclick='textToAudio()']");
            ele2.click();
        }

        await newPage.evaluate(browserConsoleFn,"today's news are...............");
        
        for(let i = 0; i < 2; i++) //test purpose  -> 20
        {
            await newPage.evaluate(browserConsoleFn,i+1+"....."+dialogArr[i]);
        }

        console.log("Listen !!!");



        let secondBrowserInstancePromise = await puppeteer.launch({
             headless :false, //browser visible
             defaultViewport:null,
             slowMo: 250,
            //  args: ['--start-maximized'] 
        });
            
        let secondNewPage = await secondBrowserInstancePromise.newPage();

        // await secondNewPage.setViewport({ width: 1280, height: 800 });
            
        await secondNewPage.goto("https://web.whatsapp.com/");
        console.log("*****Scan Qr code to open whats app*****");

        await waitAndClick("div[data-tab='3']",secondNewPage);

        await secondNewPage.type("div[data-tab='3']","Dii");

        await waitAndClick("span[title='Dii']",secondNewPage);

        await waitAndClick("div[spellcheck='true']",secondNewPage);

        await secondNewPage.type("div[spellcheck='true']","Hi this is a dummy text",{delay:200});

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



async function waitAndClick(selector, Page) {
    await Page.waitForSelector(selector, { visible: true });
    // we didn't wait this promise because we want  the calling perspn to await this promise based async function 
    let selectorClickPromise = Page.click(selector);
    return selectorClickPromise;
}

