// lib/strava-api.ts
import { StravaActivity } from "./types";

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;

// 1. Token Refresh Function
// Access Token은 수명이 짧으므로(6시간), 호출 시마다 새로 받거나 갱신 로직이 필요합니다.
// Single User 앱이므로 요청 시마다 갱신하는 것이 가장 안전하고 간단합니다.
async function getAccessToken() {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
        throw new Error("Strava API credentials are missing in .env.local");
    }

    const response = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
            grant_type: "refresh_token",
        }),
        cache: "no-store", // 항상 최신 토큰을 받아오도록 캐싱 방지
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Token Refresh Error:", error);
        throw new Error("Failed to refresh Strava token");
    }

    const data = await response.json();
    return data.access_token as string;
}

// 2. Fetch Activities Function
// per_page: 가져올 활동 수 (기본 30개, 필요 시 조정)
export async function getStravaActivities(
    perPage = 30
): Promise<StravaActivity[]> {
    const accessToken = await getAccessToken();

    const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            next: { revalidate: 3600 }, // 1시간(3600초)마다 데이터 갱신 (Rate Limit 보호)
        }
    );

    if (!response.ok) {
        console.error("Fetch Activities Error Status:", response.status);
        throw new Error("Failed to fetch activities");
    }

    const activities: StravaActivity[] = await response.json();

    // 필터링: 오직 'Run' 데이터만 반환
    return activities.filter((activity) => activity.type === "Run");
}
