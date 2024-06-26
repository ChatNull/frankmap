"use client";
import { addModeState, addStepState, isActBottomSheetState, latlngState, modalState } from "@/atoms/atoms";
import { Dispatch, SetStateAction } from "react";
import { MapMarker, useMap } from "react-kakao-maps-sdk";
import { useSetRecoilState } from "recoil";

const EventMarkerContainer = ({
  type,
  position,
  emotion,
  setIsShowCenter,
}: {
  type: string;
  position: Latlng;
  emotion?: number;
  setIsShowCenter: Dispatch<SetStateAction<boolean>>;
}) => {
  const map = useMap();
  const setAddMode = useSetRecoilState(addModeState);
  const setAddModeStep = useSetRecoilState(addStepState);
  const setLatlng = useSetRecoilState(latlngState);
  const setIsActBottomSheet = useSetRecoilState(isActBottomSheetState);

  const handleClick = (marker) => {
    map.panTo(marker.getPosition());
    setIsShowCenter(false);
    setIsActBottomSheet(false);
  };

  const handleAdd = (position: Latlng) => {
    setAddMode(true);
    setLatlng(position);
    setIsActBottomSheet(false);
    setAddModeStep("step1");
  };

  return (
    <>
      {type === "center" ? (
        // 지도 중심 좌표 마커
        <MapMarker
          zIndex={99999}
          position={position} // 마커를 표시할 위치
          onClick={() => handleAdd(position)}
          image={{
            src: `/icon-marker.svg`,
            size: {
              width: 28,
              height: 40,
            },
            options: {
              offset: {
                x: 14,
                y: 20,
              },
            },
          }}
        />
      ) : (
        // 기본, 검색 시 마커
        <MapMarker
          position={position} // 마커를 표시할 위치
          onClick={(marker) => handleClick(marker)}
          image={{
            src: type === "default" ? `/emotion${emotion}.svg` : `/icon-marker.svg`,
            size: {
              width: type === "default" ? 50 : 28,
              height: type === "default" ? 50 : 40,
            },
            options: {
              offset: {
                x: type === "default" ? 25 : 14,
                y: type === "default" ? 25 : 20,
              },
            },
          }}
        />
      )}
    </>
  );
};

export default EventMarkerContainer;
