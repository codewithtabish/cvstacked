import Safepay from "@sfpy/node-core";

const secretKey = process.env.SAFEPAY_SECRET_KEY;
const apiBaseUrl = process.env.SAFEPAY_API_BASE_URL;

if (!secretKey) {
  throw new Error("Missing SAFEPAY_SECRET_KEY");
}

if (!apiBaseUrl) {
  throw new Error("Missing SAFEPAY_API_BASE_URL");
}

/**
 * Server-side Safepay client.
 *
 * IMPORTANT:
 * Never import this file from a client component.
 */
export const safepay = new Safepay(secretKey, {
  authType: "secret",
  host: apiBaseUrl,
});
