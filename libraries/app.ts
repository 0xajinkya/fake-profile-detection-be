import express, { Application } from "express";
import { database } from "./database";
import { queue } from "./queue";
import cookieparser from 'cookie-parser';
import { Context } from "@theinternetfolks/context";

export const AppLoader = async ({
    app
}: {
    app?: Application
}) => {
    Promise.all([database.Loader(), queue.Loader()]).catch((e) => console.error(e));
    if (app) {
        app.enable("trust proxy");

        app.all("*", (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Org");
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
            res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
            next();
        });
        app.use(cookieparser("secret"));
        app.use(
            express.json({
                limit: '100mb'
            }));
        Context.Loader();
    }
}