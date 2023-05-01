import Container from '@/components/container'
import Header from '@/components/header'
import Layout from '@/components/layout'
import Head from 'next/head'
import { FieldError, FormProvider, useForm } from 'react-hook-form'
import { useAuth } from 'context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { UserProfile } from '@/models/user'
import { FaUser, FaUserCheck } from 'react-icons/fa'
import { useState } from 'react'
import cn from 'classnames'
import InputMask from 'react-input-mask'
import { format, parse } from 'date-fns'
import { Alert, Toast } from 'flowbite-react'
import { HiExclamation } from 'react-icons/hi'

interface SignupType extends Omit<UserProfile, 'uid' | 'meta' | 'photoURL'> {
  password: string;
  password_confirm: string;
  newsletter: boolean;
  publisher: boolean
}

export default function SingupPage() {
  const { signUp, user, getError } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [message, setMessage] = useState<string>()

  const methods = useForm<SignupType>({ mode: 'onBlur' })
  const { register, handleSubmit, getValues, formState: { errors, isValid } } = methods

  const labelClasses = (errors?: FieldError) => cn('block', 'mb-3',  'font-sans', { 'text-blue-900': !errors }, { 'text-red-400': errors })
  const inputClasses = (errors?: FieldError) => cn('flex', 'items-center', 'w-full', 'h-12', 'px-6', 'py-3', 'text-base', 'font-normal', 'text-gray-500', 'border', { 'border-gray-400': !errors }, { 'border-red-400': errors }, 'border-solid', 'rounded-lg', 'ring-0', 'focus:ring-0', 'focus:outline-none')

  const goToNext = () => { setCurrentStep(currentStep + 1) }
  const goToPrev = () => { setCurrentStep(currentStep - 1) }

  const onSubmit = async (data: SignupType) => {debugger
    try {
      const { password, password_confirm, newsletter, publisher, birthdate: _b, ...userData } = data
      if (!userData.email || !signUp) { return }
      const birthdate = format(parse(_b!, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
      const user: UserProfile = { uid: null, ...userData, birthdate, meta: { newsletter, publisher, role: 'user' } }
      await signUp(userData.email, data.password, user)
      router.push('/')
    } catch (error: any) {
      console.error(error.message)
      const msg = getError?.(error)
      if (msg) {
        setMessage(msg)
      } else {
        setMessage('Opps! Qualcosa è andato storto. Riprovare più tardi')
      }
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
        <div className='container w-auto mx-auto mt-12 mb-4'>
          <Alert color={'info'}>
            <p>Registrarsi al blog SocialMente ti consente di poterti iscrivere alla newsletter e proporti 
              come collaboratore per partecipare alla stesura degli articoli e poter intervenire nel dibattito</p>
          </Alert>
        </div>
        <div className='container w-auto mx-auto mt-12 mb-4 border-2 border-gray-200 sign-up-form sm:w-96'>
          <h2 className='px-12 mt-8 text-2xl font-semibold text-center text-blue-900'>Registrati</h2>
          {message && <div className="flex items-center justify-center">
            <Toast className="bg-red-200">
              <div className="inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-100 rounded-lg shrink-0">
                <HiExclamation className="w-5 h-5" />
              </div>
              <div className="ml-3 text-sm font-normal text-red-500">
                {message}
              </div>
              <Toast.Toggle className="text-red-500" onClick={() => setMessage(undefined)} />
            </Toast>
          </div>}
          <div className='w-full py-6'>
            <div className='flex'>
              {Array.of(0, 1).map(it => (
                <div className='w-1/2' key={it}>
                  <div className='relative mb-2'>
                    {it > 0 && (
                      <div className='absolute flex items-center content-center align-middle' style=
                        {{width: 'calc(100% - 2.5rem - 1rem)', top: '50%', transform: 'translate(-50%, -50%)'}}>
                        <div className={'w-full rounded items-center align-middle flex-1 ' + (currentStep >= it ? 'bg-blue-500 text-blue-500' : 'bg-gray-200 text-gray-200')}>
                          <div className='w-0 py-1 bg-current rounded' style={{width: '100%'}}></div>
                        </div>
                      </div>
                    )}
                    <div className={'w-10 h-10 mx-auto rounded-full text-sm text-white flex items-center ' + (currentStep >= it ? 'bg-blue-500' : 'bg-gray-200')}>
                      <span className='w-full text-center text-white'>
                        {it === 0 ? <FaUser className='w-full fill-current' /> : <FaUserCheck className='w-full fill-current' />}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <FormProvider {...methods}>
            <form action='' className='w-auto px-4 pb-12 mx-auto sm:w-80' onSubmit={handleSubmit(onSubmit)}>
              { currentStep === 0 && (
                <>
                  <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                      <label htmlFor='email' className={labelClasses(errors.email)}>Email</label>
                    </div>
                    <input type='email' id='email' {...register('email', { required: 'La mail è obbligatoria', 
                      pattern: { value: /^[^\s]+@[^\s]+\.[^\s]+$/, message: 'La mail non è valida' } }) } 
                      className={inputClasses(errors.email)}
                      aria-invalid={!!errors.email}
                      autoComplete='email'
                    />
                    {errors.email && <p role='alert' className='text-red-400'>{errors.email.message}</p>}
                  </div>
                  <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                      <label htmlFor='password' className={labelClasses(errors.password)}>Password</label>
                    </div>
                    <input type='password' id='password'
                      {...register('password', { required: 'La password è obbligatoria', 
                      minLength: { value: 6, message: 'La password è troppo corta' } })}
                      className={inputClasses(errors.password)} aria-invalid={!!errors.password}
                      autoComplete='new-password'
                    />
                    {errors.password && <p role='alert' className='text-red-400'>{errors.password.message}</p>}
                  </div>
                  <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                      <label htmlFor='password_confirm' className={labelClasses(errors.password_confirm)}>Conferma password</label>
                    </div>
                    <input type='password' id='password_confirm'
                      {...register('password_confirm', { required: 'Controlla la password', validate: (val) => {
                        const pwd = getValues('password')
                        if (pwd !== val) {
                          return 'Le password non  coincidono'
                        }
                        return undefined
                      } })} aria-invalid={!!errors.password_confirm}
                      className={inputClasses(errors.password_confirm)}
                      autoComplete='new-password'
                    />
                    {errors.password_confirm && <p role='alert' className='text-red-400'>{errors.password_confirm.message}</p>}
                  </div>
                  <div className='flex justify-center pt-8'>
                    <button type='button' className='w-2/3 h-12 text-lg text-center transition bg-blue-900 border-2 rounded-md hover:shadow-lg hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed'
                      onClick={goToNext} disabled={!isValid}>
                      <p className='font-normal text-white capitalize'>Successivo</p>
                    </button>
                  </div>
                </>
              ) }
              { currentStep === 1 && (
                <>
                  <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                      <label htmlFor='name' className={labelClasses(errors.name)}>Nome</label>
                    </div>
                    <input type='text' id='name' {...register('name', { required: 'Il nome è obbligatorio' })}
                      className={inputClasses(errors.name)} aria-invalid={!!errors.name}
                    />
                    {errors.name && <p role='alert' className='text-red-400'>{errors.name.message}</p>}
                  </div>
                  <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                      <label htmlFor='surname' className={labelClasses(errors.surname)}>Cognome</label>
                    </div>
                    <input type='text' id='surname' {...register('surname', { required: 'Il cognome è obbligatorio' })}
                      className={inputClasses(errors.surname)} aria-invalid={!!errors.surname}
                    />
                    {errors.surname && <p role='alert' className='text-red-400'>{errors.surname.message}</p>}
                  </div>
                  <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                      <label htmlFor='gender' className={labelClasses(errors.gender)}>Sesso</label>
                    </div>
                    <select id='gender' className={inputClasses(errors.gender)} aria-invalid={!!errors.gender}
                      {...register('gender', { required: 'Il sesso è obbligatorio', 
                      pattern: { value: /^[M|F|A]$/, message: 'Il sesso scelto non è valido' } })}>
                      <option value={''}></option>
                      <option value={'M'}>Maschio</option>
                      <option value={'F'}>Femmina</option>
                      <option value={'A'}>Altro</option>
                    </select>
                    {errors.gender && <p role='alert' className='text-red-400'>{errors.gender.message}</p>}
                  </div>
                  <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                      <label htmlFor='birthdate' className={labelClasses(errors.birthdate)}>Data di nascita</label>
                    </div>
                    <InputMask id='birthdate' mask="99/99/9999" {...register('birthdate', { required: 'La data di nascita non è valida' })}
                      className={inputClasses(errors.birthdate)} aria-invalid={!!errors.birthdate}></InputMask>
                    {/* <input type='text' {...register('birthdate', { required: 'La data di nascita è obbligatoria' })}
                      className={inputClasses(errors.birthdate)} aria-invalid={!!errors.birthdate}
                    /> */}
                    {errors.birthdate && <p role='alert' className='text-red-400'>{errors.birthdate.message}</p>}
                  </div>
                  <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                      <label htmlFor='phone' className='block mb-3 font-sans text-blue-900'>Telefono</label>
                    </div>
                    <input type='text' id='phone' {...register('phone')}
                      className='flex items-center w-full h-12 px-6 py-3 text-lg font-normal text-gray-500 border border-gray-400 border-solid rounded-lg ring-0 focus:ring-0 focus:outline-none'
                    />
                  </div>
                  <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                      <label htmlFor='newsletter' className='block mb-3 font-sans text-blue-900'>Vuoi iscriverti alla newsletter?</label>
                    </div>
                    <input type='checkbox' id='newsletter' {...register('newsletter')}
                      className='flex items-center text-lg font-normal text-gray-500 border border-gray-400 border-solid rounded ring-0 focus:ring-0 focus:outline-none'
                    />
                  </div>
                  <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                      <label htmlFor='publisher' className='block mb-3 font-sans text-blue-900'>Vuoi diventare un nostro collaboratore?</label>
                    </div>
                    <input type='checkbox' id='publisher' {...register('publisher')}
                      className='flex items-center text-lg font-normal text-gray-500 border border-gray-400 border-solid rounded ring-0 focus:ring-0 focus:outline-none'
                    />
                  </div>
                  <div className='flex justify-center pt-8'>
                    <button type='button' className='w-2/3 h-12 text-lg text-center transition bg-blue-900 border-2 rounded-md hover:shadow-lg hover:bg-blue-800'
                      onClick={goToPrev}>
                      <p className='font-normal text-white capitalize'>Precedente</p>
                    </button>
                    <button type='submit' className='w-2/3 h-12 text-lg text-center transition bg-blue-900 border-2 rounded-md hover:shadow-lg hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed'
                      disabled={!isValid}>
                      <p className='font-normal text-white capitalize'>Invia</p>
                    </button>
                  </div>
                </>
              ) }
            </form>
          </FormProvider>
          <div className="mb-2 text-center">
            <p>
              Hai già un account?&nbsp;
              <Link className="text-blue-500 underline cursor-pointer underline-offset-2" href='/login'>Accedi</Link>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}