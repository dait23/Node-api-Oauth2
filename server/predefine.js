module.exports.oauth2 = {
    
    type : {
        authorizationCode: {
            name: "authorization_code",
            token_refreshable: true,
            token_duration: 3600
        },
        implicit: {
            name: "token",
            token_refreshable: false,
            token_duration: 3600
        },
        password: {
            name: "password",
            token_refreshable: true,
            token_duration: 3600 * 24 * 365
        },
        clientCredentials: {
            name: "client_credentials",
            token_refreshable: false,
            token_duration: 0
        }
    }
};
