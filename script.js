const viewToday = document.getElementById("mostViewToday");
const newEpisodeUpdate = document.getElementById("recentUpdate");
const monday = document.getElementById("monday");
const tuesday = document.getElementById("tuesday");
const wednesday = document.getElementById("wednesday");
const thursday = document.getElementById("thursday");
const friday = document.getElementById("friday");
const saturday = document.getElementById("saturday");
const sunday = document.getElementById("sunday");
const days = [
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
];
const hamburgerBtn = document.querySelector(".navigator button");
const navList = document.querySelector(".navigator ul");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResult = document.getElementById("search-result");
const animeDetail = document.getElementById("anime-detail");
const animeDetailOverlay = document.getElementById("anime-detail-overlay")
const closeDetail = document.getElementById("close-detail");
const weeklyBroadlist = document.getElementById("broadcastDays");

hamburgerBtn.addEventListener("click", function() {
        navList.classList.toggle("show");
});

searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
                searchButton.click();
        }
});

searchButton.addEventListener("click", async function () {
        const keyword = encodeURIComponent(searchInput.value.trim());

        if (keyword === "") {
                return;
        }

        searchResult.textContent = "Loading...";

        const url = `https://api.jikan.moe/v4/anime?q=${keyword}`;

        try {
                const response = await fetch(url);

                const result = await response.json();

                //console.log(result);
                searchResult.innerHTML = "";

                if (result.data.length === 0) {
                        searchResult.textContent = "No anime found";
                        return;
                }

                for (const anime of result.data.slice(0, 10)) {
                        const image = anime.images.jpg.image_url
                        const title = anime.title

                        animeCard(image, title, anime.mal_id, searchResult);
                }

                const more = document.createElement("a");
                more.textContent = "Show More";
                more.href = `https://myanimelist.net/search/all?q=${keyword}&cat=all`;
                more.target = "_blank";
                searchResult.appendChild(more);
        }
        catch (error) {
                searchResult.textContent = "Something went wrong";
        }
        /*
        按 Search / Enter
               ↓
        输入为空？
           ↓ Yes → 什么都不做
               ↓ No
              Fetch
               ↓
        API 有没有正常回应？
           ↓ No
        Something went wrong
               
           ↓ Yes
        result.data 有没有 Anime？
           ↓ No
        No anime found
               
           ↓ Yes
        显示最多 10 个 Anime
        */
});

async function mostViewToday() {

        const url = `https://api.jikan.moe/v4/top/anime`;
        try {
                const response = await fetch(url);      //HTTP请求有没有成功

                if (!response.ok) {     //API有回应, 但是HTTP状态不好 (例如404 500 429)
                        viewToday.textContent = "Failed to load anime.";
                        return;
                }

                const result = await response.json();   //API回传的数据是什么

                console.log(result);
                console.log(result.data);
                console.log(result.data[0]);
                console.log(result.data[0].images.jpg.image_url);

                /*从 result.data 这个数组里面，一个一个拿出 Anime，暂时叫它 anime*/
                for (const anime of result.data.slice(0, 10)) {              /*.slice(0, 10)代表我只要从0到10的资料而已*/
                        console.log(anime.title);
                        console.log(anime.images.jpg.image_url);

                        const image = anime.images.jpg.image_url;
                        const title = anime.title;/*要什么写什么, 不用全部写完*/

                        animeCard(image, title, anime.mal_id, viewToday);        /*括号里的东西, 是把这里的资料传给function animeCard()*/
                };
        } catch (error) {       //根本没正常拿到response时执行
                viewToday.textContent = "Failed to load anime.";
        }

};
/*
url
 ↓
告诉 fetch：我要请求哪个 API
 ↓
fetch(url)
 ↓
得到 response
 ↓
response.ok ?
 ├─ No → 显示 Failed... → return
 │
 └─ Yes
      ↓
   response.json()
      ↓
   得到 result
      ↓
   从 result.data 拿资料
      ↓
   for...of 一个个处理 Anime
      ↓
   把 image / title / id
   传给 animeCard()
      ↓
   显示出来
*/


function animeCard(image, title, id, container) {              /*这个是接收到上面for的的资料*/
        const card = document.createElement("div");
        card.classList.add("result-list");
        const img = document.createElement("img");
        img.src = image;
        const name = document.createElement("h4");
        name.textContent = title;

        card.appendChild(img);
        card.appendChild(name);
        container.appendChild(card);

        card.addEventListener("click", async function () {
                const url = `https://api.jikan.moe/v4/anime/${id}`

                const response = await fetch(url);

                if (!response.ok) {
                        animeDetail.textContent = "Failed to load anime details.";
                        animeDetailOverlay.style.display = "block";
                        animeDetail.append(closeDetail);
                        return;
                }
                
                const result = await response.json();

                animeDetail.innerHTML = "";

                console.log(result);
                console.log(result.data.title);
                console.log(result.data.images.jpg.large_image_url);
                console.log(result.data.score);
                console.log(result.data.episodes);
                console.log(result.data.status);
                console.log(result.data.synopsis);

                const title = document.createElement("h2");
                title.textContent = result.data.title;
                const image = document.createElement("img");
                image.src = result.data.images.jpg.large_image_url;
                const score = document.createElement("span");
                score.textContent = "Score: " + result.data.score;
                const episode = document.createElement("span");
                episode.textContent = "Episode: " + result.data.episodes;
                const status = document.createElement("span");
                status.textContent = "Aired: " + result.data.status;
                const synopsis = document.createElement("p");
                synopsis.textContent = "Synopsis: " + result.data.synopsis;

                const detailContent = document.createElement("div");
                detailContent.classList.add("detail-content");
                const detailInfo = document.createElement("div");
                detailInfo.classList.add("detail-info");

                animeDetail.appendChild(closeDetail);
                animeDetail.appendChild(title);
                animeDetail.appendChild(detailContent);

                detailContent.appendChild(image);
                detailContent.appendChild(detailInfo);

                detailInfo.appendChild(score);
                detailInfo.appendChild(episode);
                detailInfo.appendChild(status);
                detailInfo.appendChild(synopsis);

                animeDetailOverlay.style.display = "block";
        });

};

closeDetail.addEventListener("click", function () {
        animeDetailOverlay.style.display = "none";
});

animeDetailOverlay.addEventListener("click", function(event) {
        if (event.target === animeDetailOverlay) {      //当真正点击animeDetailOverlay的时候才会执行, 点到anime-detail的内容会显示false, 会触发但不会执行
        animeDetailOverlay.style.display = "none"; 
        }
});

async function recentUpdate() {
        const now = Math.floor(Date.now() / 1000);
        const yesterday = now - (24 * 60 * 60);                 /*一天有多少秒*/
        const url = "https://graphql.anilist.co";

        const query = `
        query ($start: Int, $end: Int) {
            Page(page: 1, perPage: 50) {
                airingSchedules(
                    sort: TIME_DESC
                    airingAt_greater: $start
                    airingAt_lesser: $end
                ) {
                    id
                    episode
                    airingAt

                    media {
                        idMal

                        title {
                            romaji
                        }

                        coverImage {
                            large
                        }
                    }
                }
            }
        }
    `;

        const options = {
                method: "POST",

                headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                },

                body: JSON.stringify({
                        query: query,

                        variables: {
                                start: yesterday,
                                end: now
                        }
                })
        };
        try {
                const response = await fetch(url, options);
                if (!response.ok) {
                        newEpisodeUpdate.textContent = "Failed to load anime."
                        return;
                }

                console.log(response.status);
                console.log(response.ok);

                const result = await response.json();

                if (result.data.Page.airingSchedules.length === 0) {
                        newEpisodeUpdate.textContent = "No anime found."
                        return;
                }

                console.log(result);
                console.log(result.data.Page.airingSchedules[0]);
                console.log(result.data.Page.airingSchedules[0].media.title.romaji);

                const animeList = [];

                console.log(result.data.Page.airingSchedules.length);

                for (const anime of result.data.Page.airingSchedules) {
                        const image = anime.media.coverImage.large;
                        const title = anime.media.title.romaji;
                        const id = anime.media.idMal;
                        console.log(id);

                        if (!animeList.includes(title)) {
                                animeList.push(title);

                                animeCard(image, title, id, newEpisodeUpdate);
                        }

                        if (animeList.length === 10) {
                                break;
                        }

                }
        } catch (error) {
                newEpisodeUpdate.textContent = "Failed to load anime."
        }

};

/*
逻辑
Sazae-san → 没有 → 加进去       1
Sazae-san → 已经有 → 跳过
Sazae-san → 已经有 → 跳过
Anime B   → 没有 → 加进去       2
Anime B   → 已经有 → 跳过
Anime C   → 没有 → 加进去       3
Anime D   → 没有 → 加进去       4
...
*/

async function weeklyBroadcast() {
        const today = new Date();

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());

        console.log(today);
        console.log(weekStart);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        console.log(weekEnd);

        const start = Math.floor(weekStart.getTime() / 1000);
        const end = Math.floor(weekEnd.getTime() / 1000);

        console.log(start);
        console.log(end);


        const url = "https://graphql.anilist.co";
        /*有加airingAt_greater: $start 和 airingAt_lesser: $end*/
        const query = `
        query ($start: Int, $end: Int) {
            Page(page: 1, perPage: 50) {
                airingSchedules(
                    airingAt_greater: $start            
                    airingAt_lesser: $end
                    sort: TIME_DESC
                ) {
                    id
                    episode
                    airingAt

                    media {
                        title {
                            romaji
                        }

                        coverImage {
                            large
                        }
                    }
                }
            }
        }
    `;

        const options = {
                method: "POST",

                headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                },

                body: JSON.stringify({
                        query: query,

                        variables: {                    /**/
                                start: start,
                                end: end
                        }
                })
        };
        try {
                const response = await fetch(url, options);
                if (!response.ok) {
                        weeklyBroadlist.textContent = "Failed to load anime."
                        return;
                }
                console.log(response.status);
                console.log(response.ok);

                const result = await response.json();

                if (result.data.Page.airingSchedules.length === 0) {
                        weeklyBroadlist.textContent = "No anime found."
                        return;
                }

                console.log(result);
                console.log(result.data.Page.airingSchedules[0]);
                console.log(result.data.Page.airingSchedules[0].media.title.romaji);

                for (const anime of result.data.Page.airingSchedules) {
                        console.log(anime.media.title.romaji);
                        console.log(anime.airingAt);
                        console.log(anime.episode);

                        const title = anime.media.title.romaji;
                        const episode = anime.episode;
                        const airing = anime.airingAt;

                        const date = new Date(airing * 1000);
                        const day = date.getDay();

                        const animeName = document.createElement("div");
                        animeName.classList.add("weekly-list");

                        const titleText = document.createElement("span");
                        titleText.textContent = title;

                        const animeEpisode = document.createElement("span");
                        animeEpisode.textContent = "EP " + episode;

                        animeName.appendChild(titleText);
                        animeName.appendChild(animeEpisode);

                        days[day].appendChild(animeName);              /*day是星期几的号码：0 = Sunday，1 = Monday，...，6 = Saturday*/
                };
        } catch (error) { 
                weeklyBroadlist.textContent = "Failed to load anime."
        }
};

const dayButtons = document.querySelectorAll("#broadcastDays a");

dayButtons[0].addEventListener("click", function () {
        for (const day of days) {
                day.style.display = "none";
        };

        monday.style.display = "block";
});

dayButtons[1].addEventListener("click", function () {
        for (const day of days) {
                day.style.display = "none";
        };

        tuesday.style.display = "block";
});

dayButtons[2].addEventListener("click", function () {
        for (const day of days) {
                day.style.display = "none";
        };

        wednesday.style.display = "block";
});

dayButtons[3].addEventListener("click", function () {
        for (const day of days) {
                day.style.display = "none";
        };

        thursday.style.display = "block";
});

dayButtons[4].addEventListener("click", function () {
        for (const day of days) {
                day.style.display = "none";
        };

        friday.style.display = "block";
});

dayButtons[5].addEventListener("click", function () {
        for (const day of days) {
                day.style.display = "none";
        };

        saturday.style.display = "block";
});

dayButtons[6].addEventListener("click", function () {
        for (const day of days) {
                day.style.display = "none";
        };

        sunday.style.display = "block";
});

const todayIndex = new Date().getDay(); //告诉今天是星期几
/*条件 ？如果正确 ： 如果错误*/
dayButtons[todayIndex === 0 ? 6 : todayIndex - 1].click(); //需要- 1是因为我上面dayButtons拜一是0, 但是JS的拜一是1
/*
拆开来看就是
const buttonIndex =     
    todayIndex === 0    //如果今天是0 (也就是JS的礼拜天)
        ? 6             //true的话把0变成6,也就是dayButtons[6]
        : todayIndex - 1;       //false的话, todayIndex的号码- 1, 比如todayIndex = 2 (也就是拜二),这样就需要- 1,才能对应dayButtons[1]

dayButtons[buttonIndex].click();        //模拟用户点击这个按钮
*/

mostViewToday();
recentUpdate();
weeklyBroadcast();