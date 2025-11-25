// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        // 타입 정의 파일에는 없지만 실제로는 작동하는 설정입니다.
        // @ts-expect-error: allowedDevOrigins is a valid option but missing in types
        allowedDevOrigins: ["local.steadfastree.dev", "localhost:3000"],
    },
};

export default nextConfig;
