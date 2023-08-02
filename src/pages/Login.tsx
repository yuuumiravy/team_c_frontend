import { useCallback } from 'react'
import { Layout } from '../components/Layout/Layout'
import { TextField, Button } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { signIn } from '../apis/user'

type FormData = {
  email: string
  password: string
}

const Login = () => {
  const { control, handleSubmit } = useForm<FormData>()
  const onSubmit: SubmitHandler<FormData> = useCallback((data) => {
    return signIn(data.email, data.password)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }, [])

  return (
    <Layout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-full max-w-xl rounded-md bg-[#ffffff] p-8">
          <div className="mt-3 flex w-full justify-center">
            <h1 className="text-3xl font-bold">ログイン</h1>
          </div>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form className="mx-auto mt-3 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-3 flex w-full flex-col gap-2">
              <label className="text-sm text-[#636366]">メールアドレス</label>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...field}
                    variant="outlined"
                    type="email"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </div>
            <div className="mt-4 flex w-full flex-col gap-2">
              <label className="text-sm text-[#636366]">パスワード</label>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...field}
                    variant="outlined"
                    type="password"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </div>
            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <Button variant="contained" type="submit">
                ログイン
              </Button>
              <div className="mt-2 flex items-center justify-center text-sm text-[#636366]">
                <p>アカウントをお持ちでないですか？</p>
                <Link to={'/signup'} className="font-bold">
                  サインアップ
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Login
