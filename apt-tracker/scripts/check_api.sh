#!/bin/bash
# API 키 활성화 확인 스크립트
# 사용법: bash check_api.sh

API_KEY="99ecf717d21af35f03b9dd7ad2eb01eea9973a09f8e5cf6754cf27157f58c21c"

echo "API 키 상태 확인 중..."

RESULT=$(curl -s "https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey=${API_KEY}&LAWD_CD=11680&DEAL_YMD=202603&numOfRows=1&pageNo=1")

if echo "$RESULT" | grep -q "Unauthorized"; then
  echo "❌ 아직 활성화 안됨 - 조금 더 기다려주세요"
elif echo "$RESULT" | grep -q "SERVICE_KEY_IS_NOT_REGISTERED_ERROR"; then
  echo "❌ 키 등록 오류 - data.go.kr에서 신청 확인 필요"
elif echo "$RESULT" | grep -q "items"; then
  echo "✅ 활성화 완료! 데이터 받아왔어요"
  echo "$RESULT"
else
  echo "⚠️  알 수 없는 응답:"
  echo "$RESULT"
fi
