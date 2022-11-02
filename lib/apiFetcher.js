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
      console.error("Error in api response: " + err.message);
      return {
        status: "error",
        message: "Error processing request"
      };
    });
};


const handleResponse = (resp) => {
  if (resp === null || resp === undefined) {
    throw new Error("Body is null or undefined");
  }

  const validStatuses = ["success", "fail", "error"];
  if (!resp.status || !validStatuses.includes(resp.status)) {
    throw new Error(resp.error);
  }

  return resp;
};

export { fetcher };