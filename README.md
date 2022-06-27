## Features

Fast and easy scraping for Facebook page posts, NO RESIDENTIAL PROXIES required.

Posts sorted by time, from newest to oldest. Expected 5 posts per scroll, maximum amount of posts might randomly vary based on IP, but under any IP or proxy at least 200 posts should be available, confirmed stable output is 500 posts per page.

## Input

Provide list of pages and amount of scrolls to do on each page.

```json
{
  "pageNames": [ "nintendo" ],
  "scrollsAmount": 3
}
```

## Output

CSV friendly, optimized for facebook photos sharing:

```json
{
  "url": "https://www.facebook.com/Nintendo/posts/5408650062552736",
  "time": "Friday, 24 June 2022 at 07:59",
  "timestamp": "1656082757",
  "likes": 273,
  "comments": 15,
  "shares": 11,
  "text": "",
  "link": "https://www.facebook.com/Nintendo/photos/a.271203266297467/5408649879219421/?type=3",
  "thumb": "https://scontent-lcy1-1.xx.fbcdn.net/v/t39.30808-6/288222081_5408649869219422_7525573473741432066_n.png?stp=dst-png_s526x296&_nc_cat=106&ccb=1-7&_nc_sid=dd9801&_nc_ohc=Ex__XblJPNEAX_MttBn&_nc_ht=scontent-lcy1-1.xx&oh=00_AT_PnlaFfA4080EmLdtmg7J7Vl3auo_8FdGL3iqKX13rwA&oe=62BDEB8D",
  "alt": "May be an anime-style image of text that says \"1 SWITCH FIRE EMBLEM WARRIORS THREE HOPES Available Now W'Fce © Nintendo/ NTELLIGENT SYSTEMS KOEI TECMO GAMESCO, LTD Fire Emblem lintendo Switch rodemarks Nintendo. intendo. Violence Mild Suggestive Themes Alcohol Reference\""
}
```

External image and link cleaned up from facebook redirection:

```json
{
  "url": "https://www.facebook.com/apifytech/posts/444823317646334",
  "time": "Wednesday, 22 June 2022 at 07:51",
  "timestamp": "1655909464",
  "likes": 1,
  "comments": null,
  "shares": null,
  "text": "Tired of searching for the right web scraping #developer on #freelancer websites? 👀🔎 There must be a better way to find a specialist for a #datascraping project. We're here to share it:",
  "link": "https://apify.it/3xC6lHW",
  "thumb": "https://blog.apify.com/content/images/2022/06/FB-and-LI_Social-media-images-template-21-1.png"
}
```

Thumbnail without image means post is video and post URL will be redirected to video URL if you open it in browser, for example `https://www.facebook.com/Nintendo/posts/pfbid02TmVxhqWfdGqoNtjG5K9HhdfLfFAnSFWZDYLiCuKea7H6xBHRbQEWsnP3Eqoi3ZPxl` redirects to `https://www.facebook.com/Nintendo/videos/which-nintendo-game-universe-would-you-like-to-live-in/777293010347663/`

```json
{
  "url": "https://www.facebook.com/Nintendo/posts/pfbid02TmVxhqWfdGqoNtjG5K9HhdfLfFAnSFWZDYLiCuKea7H6xBHRbQEWsnP3Eqoi3ZPxl",
  "time": "Tuesday, 14 June 2022 at 11:34",
  "timestamp": "1655231680",
  "likes": 299,
  "comments": 265,
  "shares": 22,
  "text": "Which Nintendo game universe would you like to live in? Comment below with what you think the most popular response is and check back later for the results!",
  "thumb": "https://scontent-lcy1-1.xx.fbcdn.net/v/t15.5256-10/287486551_793789755359832_5952829725540553184_n.jpg?stp=dst-jpg_p280x280&_nc_cat=111&ccb=1-7&_nc_sid=08861d&_nc_ohc=y_NBKTwTzRIAX_klpot&_nc_ht=scontent-lcy1-1.xx&oh=00_AT8t3kLYlTwq76gGB8f1xffRuOmyAMytejC4x943oPh6cA&oe=62BD7906"
}
```

## Previous version 1
Old version marked as depricated but still internally available to run by name `alexey/facebook-page-posts-checker-v1`