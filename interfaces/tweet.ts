export interface TwitterUserEntities {
    description: {
        urls: string[];
    };
}

export interface TwitterUserProfile {
    created_at: string;
    default_profile: boolean;
    default_profile_image: boolean;
    description: string;
    entities: TwitterUserEntities;
    fast_followers_count: number;
    favourites_count: number;
    followers_count: number;
    friends_count: number;
    has_custom_timelines: boolean;
    is_translator: boolean;
    listed_count: number;
    location: string;
    media_count: number;
    name: string;
    normal_followers_count: number;
    pinned_tweet_ids_str: string[];
    possibly_sensitive: boolean;
    profile_banner_url: string;
    profile_image_url_https: string;
    profile_interstitial_type: string;
    screen_name: string;
    statuses_count: number;
    translator_type: string;
    verified: boolean;
    withheld_in_countries: string[];
}

export interface TweetEntities {
    hashtags: string[];
    symbols: string[];
    timestamps?: string[];
    urls?: string[];
    user_mentions?: string[];
    media?: string[]
}

export interface TwitterTweet {
    bookmark_count: number;
    bookmarked: boolean;
    created_at: string;
    conversation_id_str: string;
    display_text_range: number[];
    entities: TweetEntities;
    favorite_count: number;
    favorited: boolean;
    full_text: string;
    is_quote_status: boolean;
    lang: string;
    quote_count: number;
    reply_count: number;
    retweet_count: number;
    retweeted: boolean;
    user_id_str: string;
    id_str: string;
}

export type TwitterResponse = {
    user: TwitterUserProfile;
} & TwitterTweet