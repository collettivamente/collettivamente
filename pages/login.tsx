import Container from "@/components/container"
import Header from "@/components/header"
import Layout from "@/components/layout"
import { useAuth } from "context/AuthContext"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormProvider, useForm } from "react-hook-form";

interface LoginType {
  email: string
  password: string
}

export default function LoginPage() {
  const { logIn } = useAuth()
  const router = useRouter()

  const methods = useForm<LoginType>({ mode: 'onBlur' })
  const { register, handleSubmit, formState: { errors } } = methods

  const onSubmit = async (data: LoginType) => {
    try {
      await logIn?.(data.email, data.password)
      router.push('/')
    } catch (error: any) {
      console.log(error.message)
    }
  }

  return (
    <Layout preview={false}>
      <Head>
        <title>SocialMente</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Header />
      <Container>
        <div className="container w-auto mx-auto mt-12 border-2 border-gray-400 login-form sm:w-96">
          <h2 className="px-12 mt-8 text-2xl font-semibold text-center text-blue-900">Accedi</h2>
          <FormProvider {...methods}>
            <form action="" className="w-auto px-4 pb-12 mx-auto sm:w-80" onSubmit={handleSubmit(onSubmit)}>
              <div className='mt-8'>
                <div className='flex items-center justify-between'>
                  <label htmlFor='' className='block mb-3 font-sans text-blue-900'>Email</label>
                </div>
                <input type='email' {...register('email', { required: 'La mail è obbligatoria' })}
                  className='flex items-center w-full h-12 px-6 py-3 text-lg font-normal text-gray-500 border border-gray-400 border-solid rounded-lg ring-0 focus:ring-0 focus:outline-none'
                  autoComplete="email"
                />
                {errors.email && <p className='text-red-400'>{errors.email.message}</p>}
              </div>
              <div className='mt-8'>
                <div className='flex items-center justify-between'>
                  <label htmlFor='' className='block mb-3 font-sans text-blue-900'>Password</label>
                </div>
                <input type='password'
                  {...register('password', { required: 'La password è obbligatoria' })}
                  className='flex items-center w-full h-12 px-6 py-3 text-lg font-normal text-gray-500 border border-gray-400 border-solid rounded-lg ring-0 focus:ring-0 focus:outline-none'
                  autoComplete="current-password"
                />
                {errors.password && <p className='text-red-400'>{errors.password.message}</p>}
              </div>
              <div className="flex justify-center pt-8">
                <button type="submit" className="w-2/3 h-12 text-lg text-center transition bg-blue-900 border-2 rounded-md hover:shadow-lg hover:bg-blue-800">
                  <p className="font-normal text-white capitalize">Invia</p>
                </button>
              </div>
            </form>
          </FormProvider>
          <div className="text-center">
            <p>
              Non hai un account?&nbsp;
              <Link className="text-blue-500 underline cursor-pointer underline-offset-2" href='/signup'>Registrati</Link>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}