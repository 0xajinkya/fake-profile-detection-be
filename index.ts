// import { queue } from "libraries";

import { BlockchainService } from "@services/blockchain";
import { blockchain } from "libraries";
import { Server } from "server";

// (async () => {
//     await queue.Loader();
//     await queue.publish("PREDICT_POST", {
//     username: "minl",
//     host: "TWITTER",
//     prediction: "REAL",
// })})()
// (async() => {
//     await blockchain.Loader();
//     BlockchainService.setPredictionStatus("sdfgh", "Fake");
// })()

(async() => {
    Server().then(({app}) => app.listen(3000, () => {
        console.log(`🚀 Server started at 3000`);
    }));
})()