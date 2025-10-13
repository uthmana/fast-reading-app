type FetchDataParams = {
  apiPath: string;
  method?: string;
  payload?: any;
  headers?: Record<string, string>;
};

export const fetchData = async ({
  apiPath,
  method = "GET",
  payload,
  headers = { "Content-Type": "application/json" },
}: FetchDataParams) => {
  const options: RequestInit = {
    method,
    headers,
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const res = await fetch(apiPath, options);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Request failed: ${res.status} - ${errorText}`);
  }

  // Try to parse JSON safely
  try {
    return await res.json();
  } catch {
    return null;
  }
};
