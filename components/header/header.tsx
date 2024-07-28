"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/atoms/userstate"; // Recoil 상태 import
import { supabase } from "@/libs/supabase";
import "./header.scss";

const Header = () => {
  const pathname = usePathname();
  const [isPC, setIsPC] = useState<boolean>(false);
  const { openModal } = useModal();
  const user = useRecoilValue(userState); // 유저 상태 가져오기
  const router = useRouter();

  //로컬에 있는 유저 정보를
  //핸들 로그아웃 만들어서
  //로컬에 있는거 날아가게 하기

  console.log("xxxxx", user);

  useEffect(() => {
    const handleResize = () => {
      setIsPC(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 모달에 전달할 데이터

  const modalData = {
    title: "회원정보",
    content: user
      ? `<p>닉네임: ${user.nickname || "알 수 없음"}</p><p>이메일: ${user.email}</p>`
      : `<img className="emotion" src="/emotion4.svg" alt="로그아웃" />
      <p>회원정보를 찾을 수 없어요</p>
      `,
    button: user ? "로그아웃" : "로그인",
    callBack: () => {
      if (user) {
        console.log("모달 확인 버튼 클릭");
        window.localStorage.clear();
        supabase.auth.signOut();
        window.location.reload();
      } else {
        router.push("/login");
      }
    },
    emoticon: "😊",
  };
  console.log(user);

  return (
    <>
      <header className="header">
        <div className="header_PC">
          <div className="calendar_PC">
            <Link href={"/calendar"}>
              <img src={pathname === "/calendar" ? "/calendar_black.svg" : "/calendar_gray.svg"} alt="캘린더" />
              <h1>캘린더</h1>
            </Link>
          </div>
          <div className="home_PC">
            <Link href={"/"}>
              <img src={pathname === "/" ? "/home_black.svg" : "/home_gray.svg"} alt="홈" />
              <h1>홈</h1>
            </Link>
          </div>
          <div className="emotion_PC">
            <Link href={"/emotion"}>
              <img src={pathname === "/emotion" ? "/emotion_black.svg" : "/emotion_gray.svg"} alt="감정기록" />
              <h1>감정기록</h1>
            </Link>
          </div>
          <button className="profile_PC">
            <img src="icon-user.svg" onClick={() => openModal(modalData)} alt="프로필" />
          </button>
        </div>
        <div className="header_MO">
          <div className="home_MO">
            <Link href={"/"}>
              <img src="emotion1-folded.svg" alt="홈" />
            </Link>
          </div>

          <button className="profile_MO">
            <img src="icon-user.svg" onClick={() => openModal(modalData)} alt="프로필" />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
