# **NEWS_READER**
Basically this is an _AUTOMATION_ as well as _SCRAPPING_ project , this project read 20 latest news headlines of specified topic out of 12 fixed topics. It also send those 20 news headlines into a whatsapp group of fixed name i.e. News. It has a feature of beep which indicates the user to open his/her whatsapp application on mobile to scan QR code within 20 seconds after beeping to open wahtsapp web on automated browser if user is unable to scan it with in 20 seconds it will only read news.
If user is succeeded to scan the QR code then it will type all those news into a group named News with date of current day so that user can later check for particular news of particular date.
It also creates JSON files of news with particular topicname e.g.  topicname.json into a directory named TodayNews and it lies in same directory in which our news.js is present 

## **Tech Stack Used**
1. **_HTML_**
2. **_CSS_**
3. **_JAVASCRIPT_**
4. **_NODE.JS FILE SYSTEM MODULE_**
5. **_NODE.JS REQUEST MODULE_**
6. **_CHEERIO_**
7. **_PUPPETEER_**

## **Features**

1. 20 Headlines Reading.
1. 20 Headlines WhatsApp Writing Stating With Date.
1. Save Json Files Of All 12 Topics  + 1 Json file named read.json containing important news from all 12 topics in a folder named TodayNews.
## Usage

```bash
 node news.js topicname
 ```

 ### Topics Of News Headlines
 `national`   `technology` `business`  `sports` `science`  `startup` `politics` `buisness` `world` `miscellaneous` `hatke` `entertainment`


 ### **Prerequisites For WhatsApp**

 * User must have a group in whatsapp chat named News
 * To avoid neglectance of  **_WhatsApp Write_** feature you have to open whatsapp on your smartphone and open whatsapp web QR code scanner before running the script  and  whenever beep sound will play scan the code displayed on screen of your pc 