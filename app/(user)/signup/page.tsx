// SignUp.tsx

"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "@/libs/supabase";
import "./signup.scss";
import Button from "@/components/button/button";
import { useRouter } from "next/navigation";
import Input from "@/components/input/input";
import { userState } from "@/atoms/userstate";
import { useSetRecoilState } from "recoil";
import { Metadata } from "next";
import { useModal } from "@/hooks/useModal";

export function signupMetadata({ params }: { params: { id: number } }): Metadata {
  return {
    title: "회원가입",
    description: "회원 정보를 입력 해 주세요.",
    openGraph: {
      title: "솔직할지도",
      description: "회원 정보를 입력 해 주세요.",
      images: "/opengraph_img.png",
      url: `https://frankmap.netlify.app/signup`,
      type: "website",
      siteName: "솔직할지도",
    },
  };
}

interface SignUpFormInputs {
  email: string;
  password: string;
  nickname: string;
}

export default function SignUp() {
  const { openModal } = useModal();
  const router = useRouter();
  const setUser = useSetRecoilState(userState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>();

  const handleModal = () => {
    const modalData = {
      content: `
      <img className="emotion" src="/emotion2.svg" alt="환영합니다" />
      <h1>회원가입 성공</h1>
      <p>반가워요 :) <br>오늘 하루는 어땠나요?</p>
      `,
      button: "홈으로",
      callBack: () => router.push(`/`),
    };
    openModal(modalData);
  };

  const handleSignUp: SubmitHandler<SignUpFormInputs> = async (data) => {
    const { email, password, nickname } = data;

    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname, // user_metadata에 저장
          },
        },
      });

      if (error) throw error;
      setUser(signUpData);
      if (signUpData.user) {
        setUser({
          id: signUpData.user.id,
          email: signUpData.user.email,
          nickname: signUpData.user.user_metadata.nickname,
        });
      }

      handleModal();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit(handleSignUp)} className="signup-form">
        <div className="form-group">
          <Input
            {...register("nickname", {
              required: "닉네임을 입력해주세요.",
            })}
            id="name"
            placeholder="닉네임"
            type="text"
          />
          {errors.nickname && <p className="error-message">{errors.nickname.message}</p>}
        </div>

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
            // type="email"
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

        <Button type="submit" size="full" color="secondary">
          가입하기
        </Button>
      </form>
    </div>
  );
}
