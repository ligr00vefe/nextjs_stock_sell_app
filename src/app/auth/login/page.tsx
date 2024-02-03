'use client'

import Input from '@/components/Input';
import Button from '@/components/Button';
import React, { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';
// import getCurrentUser from '@/app/actions/getCurrentUser';
import { useRouter } from 'next/navigation';

const LoginPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: {
    errors
  } } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const loginCheck = async () => {
    const currentUser = await getSession();

    // 로그인이 되었다면 메인 페이지로 이동
    if (currentUser && currentUser !== null) {
      router.push('/'); // 로그인 페이지 경로
    }

    // console.log('loginPage_currentUser', currentUser);
  }

  useEffect(() => { 
    loginCheck();
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    setIsLoading(true);
    
    try {
      const data = signIn('credentials', body);
      // console.log('@data', data);
    } catch (error) {
      // console.log('@error', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className='grid h-[calc(100vh_-_56px)] place-items-center'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col justify-center gap-4 min-w-[350px]'
      >
        <h1 className='text-2xl'>로그인</h1>
        
        <Input
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <Input
          id="password"
          label="Password"
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <Button 
          label="Login"
        />
        <div className='text-center'>
          <p className='text-gray-400'>
            회원이 아니신가요?{" "}
            <Link href="/auth/register" className='text-black hover:underline'>회원가입</Link>  
          </p>
        </div>
      </form>      
    </section>
  )
}

export default LoginPage 