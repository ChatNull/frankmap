"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "@/libs/supabase";
import { userState } from "@/atoms/userstate";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./login.scss";
import Button from "@/components/button/button";
import { Metadata } from "next";
import { useModal } from "@/hooks/useModal";
import Input from "@/components/input/input";

export function loginMetadata({ params }: { params: { id: number } }): Metadata {
  return {
    title: "로그인",
    description: "로그인 정보를 입력 해 주세요.",
    openGraph: {
      title: "솔직할지도",
      description: "로그인 정보를 입력 해 주세요.",
      images: "/opengraph_img.png",
      url: `https://frankmap.netlify.app/login`,
      type: "website",
      siteName: "솔직할지도",
    },
  };
}

interface LoginFormInputs {
  email: string;
  password: string;
  name: string;
}

export default function Login() {
  const setUser = useSetRecoilState(userState); // Recoil 상태 업데이트
  const getUser = useRecoilValue(userState); // 현재 유저 상태
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { openModal } = useModal();

  const handleModal = () => {
    const modalData = {
      content: !isLoggedIn
        ? `
      <img className="emotion" src="/emotion2.svg" alt="환영합니다" />
      <h1>로그인 성공!</h1>
      <p>오늘의 감정을 남겨주세요</p>
      `
        : `<img className="emotion" src="/emotion4.svg" alt="로그아웃" />
        <h1>로그아웃 완료</h1>
          <p>다음에 다시 만나요</p>
        `,
      button: "확인",
      callBack: () => router.push(`/`),
    };
    openModal(modalData);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        // 사용자 정보를 Recoil 상태로 설정
        // setUser({ id: data.user.id, email: data.user.email, name: 'ddd' });
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, [setUser]);

  const handleLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    const { email, password } = data;

    try {
      const { data: loginData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (loginData.user) {
        // 로그인 성공 시 Recoil 상태로 유저 정보 설정
        setUser({
          id: loginData.user.id,
          email: loginData.user.email,
          nickname: loginData.user.user_metadata.nickname,
        });
        setIsLoggedIn(true);
      }

      handleModal();
      // router.replace("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
      setUser(null); // 로그아웃 시 Recoil 상태 초기화
      setIsLoggedIn(false);
      localStorage.removeItem("supabase.auth.token"); // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem("userState"); // userState 삭제
      router.replace("/");
      handleModal();

      router.replace("/login"); // 로그아웃 후 로그인 페이지로 이동
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  if (isLoggedIn) {
    return (
      <div className="login-container">
        <p>이미 로그인된 상태입니다.</p>
        <div className="login-group">
          <Button handleClick={() => router.replace("/")}>메인 페이지로 이동</Button>
          <Button
            size="normal"
            color="secondary"
            handleClick={() => {
              handleLogout();
            }}
          >
            로그아웃
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1>
        로그인 <span className="hidden">하기</span>
      </h1>
      <form onSubmit={handleSubmit(handleLogin)} className="login-form">
        <div className="form-group">
          <Input
            {...register("email", {
              required: "이메일을 입력해주세요.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "유효한 이메일 주소를 입력해주세요.",
              },
            })}
            id="email"
            placeholder="이메일"
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <Input
            {...register("password", {
              required: "비밀번호를 입력해주세요.",
            })}
            id="password"
            type="password"
            placeholder="비밀번호"
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <div className="button-group">
          <Button type="submit" size="full" color="secondary">
            로그인
          </Button>
          <Button type="button" size="full" color="primary" handleClick={handleSignup}>
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
}
