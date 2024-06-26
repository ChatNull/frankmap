"use client";

import React from "react";
import EmotionAdd from "../emotion/emotion-add";
import EmotionList from "../emotion/emotion-list";
import { useRecoilValue } from "recoil";
import { addModeState } from "@/atoms/atoms";

const BottomSheetCont = () => {
  const addMode = useRecoilValue(addModeState);

  return addMode ? <EmotionAdd /> : <EmotionList />;
};

export default BottomSheetCont;
