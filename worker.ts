import { database, JobKind, queue } from "./libraries";
import dotenv from "dotenv";
import QueueJobs from './subscribers';


dotenv.config();

(async () => {
    await database.Loader();
    await queue.Loader();

    for (const kind of Object.keys(QueueJobs)) {
        await queue
            .subscribe(kind as JobKind, QueueJobs[kind as JobKind])
            .then((r) => console.log("Subscribed to the JOB", kind))
            .catch((e) => console.error(e));
    }

})().catch((e) => console.error(e));