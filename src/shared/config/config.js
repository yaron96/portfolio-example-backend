const config = {
    port: 8081,
    dbURL: 'mongodb://localhost/landingpage',
    dbOptions: {},
    JWT_ACCESS_SECRET: 'access_random_key', // todo
    JWT_REFRESH_SECRET: 'refresh_random_key', // todo
}

export {config as default}