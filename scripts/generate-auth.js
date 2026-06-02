/**
 * Authenticates against the app's Supabase project via the REST API
 * (no browser, no Cloudflare Turnstile) and writes auth/storageState.json
 * in the format Playwright's storageState expects.
 *
 * Required env vars (set in .env locally, as CI secrets in GitHub Actions):
 *   SUPABASE_URL       e.g. https://xyzxyzxyz.supabase.co
 *   SUPABASE_ANON_KEY  the public anon key from Supabase dashboard
 *   TEST_EMAIL
 *   TEST_PASSWORD
 */

require('dotenv').config();

const https = require('https');
const fs = require('fs');
const path = require('path');

const { SUPABASE_URL, SUPABASE_ANON_KEY, TEST_EMAIL, TEST_PASSWORD } = process.env;

const APP_ORIGIN = 'https://abb95dd7-0f35-4a7d-b005-a2633f7e6534.lovableproject.com';
const STATE_PATH = path.join(__dirname, '..', 'auth', 'storageState.json');

function post(url, headers, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers,
      },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

(async () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error(
      'Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set.\n' +
      'Find them in your Supabase project dashboard → Settings → API.\n' +
      'Add them to .env locally and as GitHub Actions secrets in CI.'
    );
    process.exit(1);
  }
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    console.error('Error: TEST_EMAIL and TEST_PASSWORD must be set.');
    process.exit(1);
  }

  // Derive localStorage key prefix from the Supabase project ref
  const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];
  const localStorageKey = `sb-${projectRef}-auth-token`;

  console.log(`Authenticating ${TEST_EMAIL} via Supabase REST API...`);

  const authEndpoint = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
  const { status, body } = await post(
    authEndpoint,
    { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    { email: TEST_EMAIL, password: TEST_PASSWORD }
  );

  if (status !== 200) {
    console.error(`Auth failed (HTTP ${status}):`, body);
    process.exit(1);
  }

  const session = JSON.parse(body);
  if (!session.access_token) {
    console.error('No access_token in response:', body);
    process.exit(1);
  }

  console.log(`Got access_token. Expires in ${session.expires_in}s.`);

  // Build Playwright storageState
  const storageState = {
    cookies: [],
    origins: [
      {
        origin: APP_ORIGIN,
        localStorage: [
          {
            name: localStorageKey,
            value: JSON.stringify({
              access_token: session.access_token,
              token_type: session.token_type,
              expires_in: session.expires_in,
              expires_at: session.expires_at,
              refresh_token: session.refresh_token,
              user: session.user,
            }),
          },
        ],
      },
    ],
  };

  const authDir = path.dirname(STATE_PATH);
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  fs.writeFileSync(STATE_PATH, JSON.stringify(storageState, null, 2));
  console.log(`storageState saved to ${STATE_PATH}`);
})();
