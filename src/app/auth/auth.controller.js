class AUTH {
    async login(req, res) {
        res.send("login")
    }
}

export const authModule = new AUTH();