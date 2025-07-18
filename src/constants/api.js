export const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL;
export const PUBLIC_API_KEY =
  process.env.REACT_APP_PUBLIC_API_KEY +
  "$" +
  process.env.REACT_APP_PUBLIC_API_KEY_SECOND_PART;

export const apiPaths = {
  getArticle: "/articles/article",
  getProfile: "/profile/get-profile",
};

export const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOiIyMDIzLTEyLTEzVDEwOjA3OjM0Ljk5MloiLCJ1c2VybmFtZSI6IkRyLiBTbWlsZSIsInNlc3Npb25JZCI6ImNkZDVjODBiLTRmNmItNDRhYy05MGQ1LWE5ZTEzYmUwYjlhNiIsInVzZXJJZCI6NywiYWRtaW5JZCI6bnVsbCwid2FsbGV0QWRkcmVzcyI6IjB4Q0JBMkNhN2UzNjcyMkZFMjhjOTdiY2MzMDVEMjY2RjVlNWE1Nzc4ZSIsImlhdCI6MTc1MjgzMTg5NSwiZXhwIjoxNzUyODM1NDk1fQ.9F5qLQIcO7UdTofyHpLlso6aXJeTvm_tH1QSchzzUUA";
