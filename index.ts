import {concurrently} from "concurrently";

concurrently([
    {
        name: "client",
        command: "bun run dev",
        prefixColor: "green",
        cwd: "./packages/client"
    },
    {
        name: "server",
        command: "bun run dev",
        prefixColor: "cyan",
        cwd: "./packages/server"
    }
])