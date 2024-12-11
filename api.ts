// import { ApifyClient } from 'apify-client';

// // Initialize the ApifyClient with API token
// const client = new ApifyClient({
//     token: 'apify_api_bcZ28YiJ9Goaw0hptGe5y4R97Ihhtk1DirFQ',
// });

// // Prepare Actor input
// const input = {
//     "startUrls": [],
//     "handles": [
//         "elonmusk"
//     ],
//     "userQueries": [],
//     "tweetsDesired": 100,
//     "profilesDesired": 10,
//     "withReplies": true,
//     "includeUserInfo": true,
//     "proxyConfig": {
//         "useApifyProxy": true,
//         "apifyProxyGroups": [
//             "RESIDENTIAL"
//         ]
//     }
// };

// (async () => {
//     // Run the Actor and wait for it to finish
//     const run = await client.actor("VsTreSuczsXhhRIqa").call(input);

//     // Fetch and print Actor results from the run's dataset (if any)
//     console.log('Results from dataset');
//     const { items } = await client.dataset(run.defaultDatasetId).listItems();
//     items.forEach((item) => {
//         console.dir(item);
//     });
// })();



import { APIFY_API_KEY } from '@config/env';
import { FetcherService } from '@services/fetcher';
import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';
import fs from 'node:fs';  // Import the fs module to write files

dotenv.config();

(async () => {
    console.log(APIFY_API_KEY);
    // Run the Actor and wait for it to finish
    console.log(await FetcherService.Fetch("elonmusk"));
})();
