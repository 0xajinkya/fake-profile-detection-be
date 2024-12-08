import { IJobProcessor, JobKind } from "libraries";
import { PredictProfile } from "./predict-profile";
import { PredictPost } from "./predict-post";

const Queue: Record<JobKind, IJobProcessor<any>> = {
    "PREDICT_POST": PredictPost,
    "PREDICT_PROFILE": PredictProfile,
};

export default Queue;