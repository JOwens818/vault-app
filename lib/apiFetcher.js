const fetcher = async (service, url, method, headers = null, body = null) => {
  console.log(service + " executing request...");
  let options = {
    method,
    credentials: "same-origin"
  };

  if (headers) { options.headers = new Headers(headers) }
  if (body) { options.body = body };

  return await fetch(url, options)
    .then(resp => {
      console.log(service + " response: " + resp.status + " - " + resp.statusText);
      if (resp.status == 504) {
        throw new Error("Request timed out");
      }
      return resp.json();
    })
    .then(handleResponse)
    .catch(err => {
      console.error(err.message);
      return {
        status: "error",
        message: err.message
      };
    });
};


const handleResponse = (resp) => {
  if (resp === null || resp === undefined) {
    return {
      status: "error",
      message: "Response body is null or undefined"
    };
  }

  const validStatuses = ["success", "fail", "error"];
  if (!resp.status || !validStatuses.includes(resp.status)) {
    return {
      status: "error",
      message: resp.error
    };
  }

  return resp;
};

export { fetcher };