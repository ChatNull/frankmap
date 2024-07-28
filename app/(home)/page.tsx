"use client";
import KakaoMap from "@/components/kakao/kakao-map";
import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import BottomSheetCont from "@/components/bottom-sheet/bottom-sheet-cont";
import "@/app/(home)/home.scss";
import { useState } from "react";

const Home = () => {
  const [search, setSearch] = useState<string>("");
  return (
    <div className="map">
      <h1 className="hidden">지도에 나의 감정 등록하기 또는 확인하기</h1>
      <KakaoMap search={search} setSearch={setSearch} />
      <BottomSheet>
        <BottomSheetCont setSearch={setSearch} />
      </BottomSheet>
    </div>
  );
};

export default Home;
