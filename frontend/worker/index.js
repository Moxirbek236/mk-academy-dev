self._ref = function (payload) {
  const response = payload && payload.response;

  if (response && response.type === "opaqueredirect") {
    return new Response(response.body, {
      status: 200,
      statusText: "OK",
      headers: response.headers,
    });
  }

  return response;
};
