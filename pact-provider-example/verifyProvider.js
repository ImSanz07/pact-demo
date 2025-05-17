const path = require("path");
const { Verifier } = require("@pact-foundation/pact");
const server = require("./provider");

const runProviderVerification = async () => {
    try {
        const opts = {
            provider: "UserService",
            providerBaseUrl: "http://localhost:8081",
            pactUrls: [path.resolve(__dirname, "../pact-consumer-example/pacts/userapp-userservice.json")],
            publishVerificationResult: false, 
            providerVersion: "1.0.0"
        };

        await new Verifier(opts).verifyProvider();
        console.log("Pact Verification Complete ✅");
    } catch (err) {
        console.error("Pact Verification Failed ❌", err);
    } finally {
        server.close();
    }
};

runProviderVerification();
