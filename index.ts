import { Server } from "server";

(async() => {
    Server().then(({app}) => app.listen(3000, () => {
        console.log(`🚀 Server started at 3000`);
    }));
})()