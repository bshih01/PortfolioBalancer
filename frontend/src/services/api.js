const BASE = "http://localhost:8000";

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function jsonBody(method, body) {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export const getAccounts = () => request("/accounts");
export const getAllocation = (account = "all") => request(`/allocation?account=${account}`);
export const getTargets = () => request("/targets");
export const updateTargets = (targets) => request("/targets", jsonBody("PUT", targets));
export const getSuggestions = (budget, account = "all") => request(`/suggest?account=${account}`, jsonBody("POST", { budget }));
