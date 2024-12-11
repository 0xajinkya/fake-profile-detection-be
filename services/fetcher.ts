import { APIFY_API_KEY } from "@config/env";
import { ApifyClient } from "apify-client";
import fs from 'node:fs';

const client = new ApifyClient({
    token: APIFY_API_KEY,
});

const Fetch = async (username: string, withTweets?: boolean) => {
    const input = {
        "startUrls": [
            `https://x.com/${username}`
        ],
        "maxTweetsPerUser": 10,
        "onlyUserInfo": withTweets ? false : true, //make this false to fetch profile as well.
        "addNotFoundUsersToOutput": false,
        "addSuspendedUsersToOutput": false,
        "addUserInfo": true,
        "customMapFunction": (object) => { return { ...object } },
        "proxy": {
            "useApifyProxy": true
        }
    };

    const run = await client.actor("wbpC5fjeAxy06bonV").call(input);

    // Fetch Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    // Write results to a JSON file
    fs.writeFile('output.json', JSON.stringify(items, null, 2), (err) => {
        if (err) {
            console.error('Error saving to file:', err);
        } else {
            console.log('Results have been saved to output.json');
        }
    });

    return items;

    //Sample response
    // [
        // {
        //   __typename: "User",
        //   id: "VXNlcjo0NDE5NjM5Nw==",
        //   rest_id: "44196397",
        //   affiliates_highlighted_label: {
        //     label: [Object ...],
        //   },
        //   is_blue_verified: true,
        //   profile_image_shape: "Circle",
        //   legacy: {
        //     created_at: "Tue Jun 02 20:12:29 +0000 2009",
        //     default_profile: false,
        //     default_profile_image: false,
        //     description: "The people voted for major government reform",
        //     entities: [Object ...],
        //     fast_followers_count: 0,
        //     favourites_count: 99508,
        //     followers_count: 207135672,
        //     friends_count: 871,
        //     has_custom_timelines: true,
        //     is_translator: false,
        //     listed_count: 155030,
        //     location: "",
        //     media_count: 2931,
        //     name: "Elon Musk",
        //     normal_followers_count: 207135672,
        //     pinned_tweet_ids_str: [ "1866776699817562609" ],
        //     possibly_sensitive: false,
        //     profile_banner_url: "https://pbs.twimg.com/profile_banners/44196397/1726163678",
        //     profile_image_url_https: "https://pbs.twimg.com/profile_images/1858316737780781056/kPL61o0F_normal.jpg",
        //     profile_interstitial_type: "",
        //     screen_name: "elonmusk",
        //     statuses_count: 62155,
        //     translator_type: "none",
        //     verified: false,
        //     withheld_in_countries: [],
        //   },
        //   professional: {
        //     rest_id: "1679729435447275522",
        //     professional_type: "Creator",
        //     category: [],
        //   },
        //   tipjar_settings: {
        //     is_enabled: false,
        //     bandcamp_handle: "",
        //     bitcoin_handle: "",
        //     cash_app_handle: "",
        //     ethereum_handle: "",
        //     gofundme_handle: "",
        //     patreon_handle: "",
        //     pay_pal_handle: "",
        //     venmo_handle: "",
        //   },
        //   legacy_extended_profile: {},
        //   is_profile_translatable: false,
        //   has_hidden_subscriptions_on_profile: false,
        //   verification_info: {
        //     is_identity_verified: false,
        //     reason: [Object ...],
        //   },
        //   highlights_info: {
        //     can_highlight_tweets: true,
        //     highlighted_tweets: "466",
        //   },
        //   user_seed_tweet_count: 0,
        //   business_account: {},
        //   creator_subscriptions_count: 179,
        //   accountUrl: "https://twitter.com/elonmusk",
        // }
    //   ]
}

export const FetcherService = {
    Fetch
}