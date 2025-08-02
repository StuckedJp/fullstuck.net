function handler(event) {
  const request = event.request;
  const uri = request.uri;
  const paths = uri.split("/");
  const last = paths.pop();
  if (last === "") {
    request.uri += "index.html";
  } else if (!last.includes(".")) {
    request.uri += "/index.html";
  }

  return request;
}
