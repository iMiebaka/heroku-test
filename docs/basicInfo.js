module.exports = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mockdata Test",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Mock Datatest",
                url: "imiebaka.github.io",
                email: "miebakaiwarri.dev@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3001/",
            },
        ],
    },
    apis: ["index.js"]
};