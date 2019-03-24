import OAuth from 'oauth';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

class GitHubOAuth {
  constructor() {
    this.oauth2 = new OAuth.OAuth2(
      GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET,
      'https://github.com/login/oauth',
      '/authorize',
      '/access_token',
      null,
    );
    this.oauth2.useAuthorizationHeaderforGET(true);
  }

  get(...args) {
    return this.oauth2.get(...args);
  }

  getTokens(code, state) {
    return new Promise((resolve, reject) => {
      this.oauth2.getOAuthAccessToken(
        code,
        {
          state,
          grant_type: 'authorization_code',
          scope: 'user:email',
        },
        (e, access_token, refresh_token, results) => {
          // TODO: fix; refresh_token is undefined here
          if (e) reject(e);

          if (results.error) reject(results);

          resolve([access_token, refresh_token]);
        },
      );
    });
  }

  getUser(accessToken) {
    return new Promise(async (resolve, reject) => {
      this.oauth2.get('https://api.github.com/user', accessToken, async (err, body) => {
        if (err) {
          reject(err);
        }

        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          reject(e);
        }

        let emails;
        try {
          emails = await this.getEmails(accessToken);
        } catch (e) {
          reject(e);
        }

        resolve({
          id: String(json.id),
          emails,
          displayName: json.name,
          username: json.login,
          profileUrl: json.html_url,
        });
      });
    });
  }

  getEmails(accessToken) {
    return new Promise((resolve, reject) => {
      this.oauth2._request(
        'GET',
        'https://api.github.com/user/emails',
        { Accept: 'application/vnd.github.v3+json' },
        '',
        accessToken,
        (err, body) => {
          if (err) {
            reject(err);
          }

          let json;
          try {
            json = JSON.parse(body);
          } catch (e) {
            reject(e);
          }

          if (!json.length) {
            reject('Not array');
          }

          resolve(json);
        },
      );
    });
  }
}

export default new GitHubOAuth();
