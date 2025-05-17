const path = require("path");
const { Pact } = require("@pact-foundation/pact");
const { Matchers } = require("@pact-foundation/pact");
const axios = require("axios");
const { like } = Matchers;

// Pact mock server setup
const provider = new Pact({
    consumer: "UserApp",         // Name of the consumer
    provider: "UserService",     // Name of the provider
    port: 1234,
    log: path.resolve(process.cwd(), "logs", "pact.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "INFO"
});

// Consumer function to test
const getUser = (id) =>
    axios.get(`http://localhost:1234/user/${id}`).then(res => res.data);

// Pact test
describe("Pact with UserService", () => {
    beforeAll(async () => {
        await provider.setup();
    });

    afterAll(async () => {
        await provider.verify();
        await provider.finalize();
    });

    describe("when a call to GET /user/1 is made", () => {
        beforeAll(() => {
            return provider.addInteraction({
                state: "user with ID 1 exists",
                uponReceiving: "a request for user 1",
                withRequest: {
                    method: "GET",
                    path: "/user/1",
                },
                willRespondWith: {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                    body: like({
                        id: 1,
                        name: "Alice",
                        email: "alice@example.com"
                    }),
                },
            });
        });

        it("returns the correct user", async () => {
            const user = await getUser(1);
            expect(user).toEqual({
                id: 1,
                name: "Alice",
                email: "alice@example.com"
            });
        });
    });
});

