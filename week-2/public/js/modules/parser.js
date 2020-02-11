function parseTokenData(tokenData) {
    if (tokenData && tokenData.access_token && tokenData.expires_in) {
        return {
            accessToken: tokenData.access_token,
            expiresIn: tokenData.expires_in
        }
    }
    console.log("One or more response items related to the token are undefined");

    return
}

export { parseTokenData }