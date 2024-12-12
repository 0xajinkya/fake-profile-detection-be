import { APIFY_API_KEY } from "@config/env";
import { TwitterResponse } from "@interfaces/tweet";
import { ApifyClient } from "apify-client";
import axios from "axios";

const client = new ApifyClient({
    token: "apify_api_bcZ28YiJ9Goaw0hptGe5y4R97Ihhtk1DirFQ",
});

const Loader = async () => {
    const webhooksClient = await client.webhooks();
    await webhooksClient.create({
        description: 'Twitter profile actor succeeded',
        condition: { actorId: 'wbpC5fjeAxy06bonV' },
        requestUrl: 'https://85ec-2409-40c2-6056-20cc-db62-abb4-5de5-3fbe.ngrok-free.app/webhooks',
        // requestUrl: "https://webhook.site/bcae8819-3a4c-4fe2-827f-9d1390764807",
        eventTypes: ['ACTOR.RUN.SUCCEEDED'],
    });
    console.log("🚀 Webhooks listening!!")
}

const Fetch = async <T>(username: string, withTweets?: boolean) => {

    const input = {
        "startUrls": [
            `https://twitter.com/${username}`
        ],
        "maxTweetsPerUser": 10,
        "onlyUserInfo": !withTweets, //make this false to only fetch profile.
        "addNotFoundUsersToOutput": false,
        "addSuspendedUsersToOutput": false,
        "addUserInfo": true,
        "customMapFunction": (object) => { return { ...object } },
        "proxy": {
            "useApifyProxy": true
        }
    };

    const run = await axios.post("https://api.apify.com/v2/acts/epctex~twitter-profile-scraper/runs?token=apify_api_bcZ28YiJ9Goaw0hptGe5y4R97Ihhtk1DirFQ", input);

    return run;
};

const ExtractStats = (tweets: TwitterResponse[]) => {
    const user = tweets[0].user;
    
    const objForPrediction = {
        //Number of posts
        pos: user.statuses_count,
        //Number of followers
        flw: user.followers_count,
        //Number of followings
        flg: user.friends_count,
        //Biography Length
        bl: user.description.length ?? 0,
        //Profile Picture Present
        pic: Boolean(user.profile_image_url_https) ? 1 : 0,
        //Links Present
        lin: user.entities.description.urls.length > 0 ? 1 : 0,
        // Average caption length
        cl: (tweets.map(tweet => tweet.full_text.length).reduce((a, b) => a + b, 0)) / 10,
        //Percentage of tweets with captions less than 3 characters
        cz: tweets.filter(tweet => tweet.full_text.length <= 3).length / 10,
        //Percentage of tweets without media
        ni: tweets.filter(tweet => !tweet.entities.media || tweet.entities.media.length === 0).length / 10,
        //Engagement Rate
        erl: ((tweets.reduce((a, b) => a + b.favorite_count, 0) / 10) / user.followers_count),
        //Engagement Rate For Comments
        erc: ((tweets.reduce((a, b) => a + b.reply_count, 0) / 10) / user.followers_count),
        //Hashtags Average Count
        hc: tweets.reduce((a, b) => a + b.entities.hashtags.length, 0) / 10,
    }

    console.log(objForPrediction);
    
    return objForPrediction;
};

const SaveToDB = () => {

}

export const FetcherService = {
    client,
    Loader,
    Fetch,
    ExtractStats
}