import EmotionEditCont from "@/components/emotion/emotion-edit-cont";
import { Metadata } from "next";

export function generateMetadata({ params }: { params: { id: number } }): Metadata {
  return {
    title: "감정 수정",
    description: "감정을 수정해보세요.",
    openGraph: {
      title: "솔직할지도",
      description: "감정을 수정해보세요.",
      images: "/opengraph_img.png",
      url: `https://frankmap.netlify.app/emotion/${params.id}/edit`,
      type: "website",
      siteName: "솔직할지도",
    },
  };
}

const EmotionEdit = ({ params: { id } }: { params: { id: number } }): JSX.Element => {
  return (
    <>
      <h1 className="hidden">감정 기록 수정하기</h1>
      <EmotionEditCont id={id} />
    </>
  );
};

export default EmotionEdit;
