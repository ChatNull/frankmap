import Emotion from "@/components/list/emotion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "감정 목록",
  description: "감정 기록을 확인해보세요.",
  openGraph: {
    title: "솔직할지도",
    description: "감정 기록을 확인해보세요.",
    images: "/opengraph_img.png",
    url: "https://frankmap.netlify.app/list",
    type: "website",
    siteName: "솔직할지도",
  },
};

const EmotionPage = () => {
  return (
    <div>
      <h1 className="hidden">감정 기록 확인하기</h1>
      <Emotion />
    </div>
  );
};

export default EmotionPage;
