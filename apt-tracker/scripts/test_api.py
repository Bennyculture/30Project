import urllib.request
import urllib.parse
import json
import os

API_KEY = os.environ.get("PUBLIC_DATA_API_KEY", "")

def fetch_apt_trades(lawd_cd: str, deal_ymd: str, rows: int = 10):
    """아파트 매매 실거래 데이터 조회"""
    base_url = "https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev"
    params = urllib.parse.urlencode({
        "serviceKey": API_KEY,
        "LAWD_CD": lawd_cd,
        "DEAL_YMD": deal_ymd,
        "numOfRows": rows,
        "pageNo": 1,
        "_type": "json"
    })
    url = f"{base_url}?{params}"
    try:
        with urllib.request.urlopen(url) as res:
            return json.loads(res.read().decode())
    except Exception as e:
        return {"error": str(e)}

def fetch_officetel_trades(lawd_cd: str, deal_ymd: str, rows: int = 10):
    """오피스텔 매매 실거래 데이터 조회"""
    base_url = "https://apis.data.go.kr/1613000/RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade"
    params = urllib.parse.urlencode({
        "serviceKey": API_KEY,
        "LAWD_CD": lawd_cd,
        "DEAL_YMD": deal_ymd,
        "numOfRows": rows,
        "pageNo": 1,
        "_type": "json"
    })
    url = f"{base_url}?{params}"
    try:
        with urllib.request.urlopen(url) as res:
            return json.loads(res.read().decode())
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # 강남구(11680) 2026년 3월 데이터
    print("=== 아파트 매매 ===")
    result = fetch_apt_trades("11680", "202603", rows=3)
    print(json.dumps(result, ensure_ascii=False, indent=2))

    print("\n=== 오피스텔 매매 ===")
    result = fetch_officetel_trades("11680", "202603", rows=3)
    print(json.dumps(result, ensure_ascii=False, indent=2))
