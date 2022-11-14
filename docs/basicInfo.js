module.exports = {
    // defination: {
    //     openapi: "3.0.3", // present supported openapi version
    //     info: {
    //         title: "Simple Todos API", // short title.
    //         description: "A simple todos API", //  desc.
    //         version: "1.0.0", // version number
    //         contact: {
    //             name: "M3 Root", // your name
    //             email: "miebakaiwarri.dev@gmail.com", // your email
    //             url: "web.com", // your website
    //         },
    //     },
    // }






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