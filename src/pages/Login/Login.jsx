import React, { useState } from 'react'
import styles from './Login.module.css';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { useForm } from 'react-hook-form';
import { loginModel } from '../../models/Login.model';
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query';
import { login } from '../../lib/http/authentication.http';
import useUserInfo from '../../hooks/useUserInfo';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { updateToken, updateUserInfo } = useUserInfo();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(loginModel),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      updateToken(data?.token);
      updateUserInfo(data?.user);
      navigate('/')
    }, 
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  })
  function onSubmit(values) {
    mutation.mutate(values)
  }
  return (
    <main className={styles.container}>
      <Card className={styles.formContainer}>
        <CardHeader>
          <CardTitle className={styles.header}>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Your password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className={styles.loginBtn} type="submit">Login</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}

export default Login
