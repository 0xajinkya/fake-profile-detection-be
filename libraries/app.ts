import express, { Application } from "express";
import { database } from "./database";
import { queue } from "./queue";
import cookieparser from 'cookie-parser';
import { Context } from "@theinternetfolks/context";
import { FetcherService } from "@services/fetcher";
import { blockchain } from "./blockchain";
import { COOKIE_SECRET } from "@config/env";

export const AppLoader = async ({
    app
}: {
    app?: Application
}) => {
    Promise.all([database.Loader(), queue.Loader(), FetcherService.Loader(), blockchain.Loader()]).catch((e) => console.error(e));
    if (app) {
        app.enable("trust proxy");

        app.all("*", (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
            res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
            next();
        });
        app.use(cookieparser(COOKIE_SECRET));
        app.use(
            express.json({
                limit: '100mb'
            }));
        Context.Loader();
    }
}