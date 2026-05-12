import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const API_KEY = Deno.env.get("PUBLIC_DATA_API_KEY") ?? "";
const BASE_URL = "https://apis.data.go.kr/1613000";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchData(endpoint: string, params: Record<string, string>) {
  const query = new URLSearchParams({
    serviceKey: API_KEY,
    _type: "json",
    numOfRows: "100",
    pageNo: "1",
    ...params,
  });
  const res = await fetch(`${BASE_URL}/${endpoint}?${query}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  return res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "apt";    // apt | offi | villa
  const lawdCd = url.searchParams.get("lawd_cd") ?? "";  // 지역코드 ex) 11680
  const dealYmd = url.searchParams.get("deal_ymd") ?? ""; // 계약년월 ex) 202603

  if (!lawdCd || !dealYmd) {
    return new Response(
      JSON.stringify({ error: "lawd_cd와 deal_ymd 파라미터가 필요합니다" }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  const ENDPOINTS: Record<string, string> = {
    apt:   "RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev",
    offi:  "RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade",
    villa: "RTMSDataSvcRHTrade/getRTMSDataSvcRHTrade",
  };

  const endpoint = ENDPOINTS[type] ?? ENDPOINTS.apt;

  try {
    const data = await fetchData(endpoint, { LAWD_CD: lawdCd, DEAL_YMD: dealYmd });
    return new Response(JSON.stringify(data), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
