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

let dialog = [];
setTimeout(function () {

    let arr = require("./NewsToday/national.json")

    let arrayToString = JSON.stringify(Object.assign({}, arr));  // convert array to string

    let stringToJsonObject = JSON.parse(arrayToString);  // convert string to json object

    // console.log(stringToJsonObject);
    for(let i = 0; i < 20; i++)
    {
        dialog.push(stringToJsonObject[0][i]);
    }
    // dialog = stringToJsonObject[0][5];
    // console.log(dialog);
}, 12000);  //intentionally slowed by 12 seconds
// let arr = require("./NewsToday/automobile.json")

// let arrayToString = JSON.stringify(Object.assign({}, arr));  // convert array to string

// let stringToJsonObject = JSON.parse(arrayToString);  // convert string to json object

// console.log(stringToJsonObject);
// dialog = stringToJsonObject[0][5];
// console.log(dialog);
////==========================array to json ends here===================================================




(async function()
{
    try
    {
        let browserInstancePromise = await puppeteer.launch({
            headless :true,
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
        
        for(let i = 0; i < 20; i++)
        {
            await newPage.evaluate(browserConsoleFn,i+1+"....."+dialog[i]);
        }

        console.log("Listen !!!");

        // await browserInstancePromise.close();


        // await newPage.click(".box.box-html .CodeMirror-lines");

        // await newPage.type(".box.box-html .CodeMirror-lines",textToSpeechCode.Code);

        // setTimeout(()=>{return; },6000);

        // function browserConsoleFn()
        // {
        //     clear();
        //     let ele = document.querySelector("input[type='text']");
        //     ele.value  = "Harshit Sharma";
        //     let ele2 = document.querySelector("button[onclick='textToAudio()']");
        //     console.log(ele2.innerText);
        //     ele2.click();
        // }

        // await newPage.evaluate(browserConsoleFn);

        // await waitAndClick("input[id='text-to-speech']",newPage);

        // await newPage.type("input[id='text-to-speech']","harshit");

        // await newPage.click("button[onclick='textToAudio()']");

    }
    catch(error)
    {
        console.log(error);
    }
})()


async function waitAndClick(selector, newPage) {
    await newPage.waitForSelector(selector, { visible: true });

    let selectorClickPromise = newPage.click(selector);

    return selectorClickPromise;
}

// console.log(textToSpeechCode.Code);  //jsut loged to check that it is working or not

//====================run in console of browser=======
// let ele = document.querySelector("input[type='text']");
// ele.value = "Harshit Sharma";
// let ele2 = document.querySelector("button[onclick='textToAudio()']");
// ele2.click();

