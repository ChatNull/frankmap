"use client";

import { editStepState } from "@/atoms/atoms";
import { useRecoilValue } from "recoil";
import EmotionEditRecord from "./emotion-edit-record";
import EmotionEditSelect from "./emotion-edit-select";

const EmotionEditCont = ({ id }: { id: number }): JSX.Element => {
  const editState = useRecoilValue(editStepState);

  return <>{editState === "step1" ? <EmotionEditSelect /> : <EmotionEditRecord id={id} />}</>;
};

export default EmotionEditCont;
