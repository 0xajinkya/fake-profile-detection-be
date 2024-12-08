import PgBoss, { WorkHandler } from "pg-boss";

export type JobKind = "PREDICT_POST" | "PREDICT_PROFILE";
export type IJobProcessor<T = RawDocument> = WorkHandler<T>;

//@ts-ignore
export type RawDocument = Record<string, any>;

const Loader = async () => {
    queue.instance = new PgBoss("postgresql://postgres:password@localhost:5432/sih_q");
    queue.instance.on("error", (err) => {
        console.error(err);
    });
    await queue.instance.start();
    console.log("🚀 Queue started");
};

const publish = async (
    kind: JobKind,
    data: object,
    options?: PgBoss.SendOptions
) => {
    if (!queue.instance) {
        throw new Error('✈️ queue not initialized');
    }
    const job_id = await queue.instance?.send(kind, data, options || {});

    console.log(`Publishing ${kind}`, job_id, 'with data', data);
    return job_id;
}

const subscribe = async <T = RawDocument>(
    kind: JobKind,
    callback: IJobProcessor<T>
) => {
    if (!queue.instance) {
        throw new Error('✈️ queue not initialized');
    }

    return queue.instance.work(kind, async (job) => {
        console.log(job);
        console.log(`Receiving ${kind}`, job.id, 'with data', job.data);
        return callback(job as any);
    });
};

const fail = async (id: string) => {
    if (!queue.instance) {
        throw new Error('✈️ queue not initialized');
    }
    await queue.instance.fail(id);
    console.log(`Failing job with id ${id}`);
};

const complete = async (id: string) => {
    if (!queue.instance) {
        throw new Error('✈️ queue not initialized');
    }
    await queue.instance.complete(id);
    console.log(`Completing job with id ${id}`);
};

const cancel = async (id: string) => {
    if (!queue.instance) {
        throw new Error('✈️ queue not initialized');
    }
    await queue.instance.cancel(id);
    console.log(`Cancelling job with id ${id}`);
};

export const queue = {
    instance: null as PgBoss | null,
    Loader,
    publish,
    subscribe,
    fail,
    complete,
    cancel
}