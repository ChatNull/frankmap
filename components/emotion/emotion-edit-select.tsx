import { editStepState, emotionState } from "@/atoms/atoms";
import Button from "@/components/button/button";
import "@/components/emotion/emotion-select.scss";
import { useModal } from "@/hooks/useModal";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";

const EmotionEditSelect = (): JSX.Element => {
  const setEmotion = useSetRecoilState(emotionState);
  const setEditStep = useSetRecoilState(editStepState);
  const [currentEmotion, setCurrentEmotion] = useState<number>();
  const { openModal, closeModal } = useModal();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    document.querySelectorAll(".emotion-button").forEach((item) => item.classList.remove("selected"));
    e.currentTarget.classList.add("selected");
    setCurrentEmotion(Number(e.currentTarget.value));
  };

  const handleSelect = (): void => {
    if (currentEmotion) {
      setEmotion(currentEmotion);
      setEditStep("step2");
    } else {
      openModal({
        title: "감정 선택",
        content: `변경할 감정을 선택하지 않았습니다. 감정을 유지할까요?`,
        button: "확인",
        callBack: () => {
          closeModal();
          setEditStep("step2");
        },
      });
    }
  };

  const handleClose = (): void => {
    setEditStep("step2");
  };

  return (
    <div className="emotion-select-container">
      <div className="emotion-edit-header">감정 수정</div>
      <h3 className="emotion-select-title">오늘은 어떤 기분이었나요?</h3>
      <div className="emotion-button-container">
        <button className="emotion-button" type="button" value={1} onClick={handleClick}>
          <i className="hidden">행복</i>
          <img src="/emotion1.svg" alt="행복" />
          <span>행복</span>
        </button>
        <button className="emotion-button" type="button" value={2} onClick={handleClick}>
          <i className="hidden">즐거움</i>
          <img src="/emotion2.svg" alt="즐거움" />
          <span>즐거움</span>
        </button>
        <button className="emotion-button" type="button" value={3} onClick={handleClick}>
          <i className="hidden">설렘</i>
          <img src="/emotion3.svg" alt="설렘" />
          <span>설렘</span>
        </button>
        <button className="emotion-button" type="button" value={4} onClick={handleClick}>
          <i className="hidden">슬픔</i>
          <img src="/emotion4.svg" alt="슬픔" />
          <span>슬픔</span>
        </button>
        <button className="emotion-button" type="button" value={5} onClick={handleClick}>
          <i className="hidden">분노</i>
          <img src="/emotion5.svg" alt="분노" />
          <span>분노</span>
        </button>
        <button className="emotion-button" type="button" value={6} onClick={handleClick}>
          <i className="hidden">불안</i>
          <img src="/emotion6.svg" alt="불안" />
          <span>불안</span>
        </button>
        <button className="emotion-button" type="button" value={7} onClick={handleClick}>
          <i className="hidden">놀라움</i>
          <img src="/emotion7.svg" alt="놀라움" />
          <span>놀라움</span>
        </button>
        <button className="emotion-button" type="button" value={8} onClick={handleClick}>
          <i className="hidden">창피함</i>
          <img src="/emotion8.svg" alt="창피함" />
          <span>창피함</span>
        </button>
        <button className="emotion-button" type="button" value={9} onClick={handleClick}>
          <i className="hidden">무력감</i>
          <img src="/emotion9.svg" alt="무력감" />
          <span>무력감</span>
        </button>
      </div>
      <div className="emotion-select-button">
        <Button handleClick={handleClose}>취소</Button>
        <Button color="secondary" handleClick={handleSelect}>
          감정 변경
        </Button>
      </div>
    </div>
  );
};

export default EmotionEditSelect;
