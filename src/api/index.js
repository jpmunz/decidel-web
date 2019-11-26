const Cookies = require("js-cookie");

export default class API {
  _fetch(url, options) {
    return fetch(
      process.env.REACT_APP_API_HOST + url,
      Object.assign(
        {
          headers: {
            "Content-Type": "application/json"
          }
        },
        options
      )
    )
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        return response.json();
      })
      .then(json => {
        return json;
      });
  }

  fetchDecidel(id) {
    return this._fetch("/v1/decidels/" + id);
  }

  createDecidel(body) {
    return this._fetch("/v1/decidels/", {
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  persistDecidel(body) {
    return this._fetch("/v1/decidels/" + body.id, {
      method: "PUT",
      body: JSON.stringify(body)
    });
  }

  fetchCurrentUser() {
    return Promise.resolve({ name: Cookies.get("currentUserName") });
  }

  setCurrentUserName(name) {
    Cookies.set("currentUserName", name);
    return Promise.resolve({ name: name });
  }
}
