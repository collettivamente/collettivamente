import React, { useState, useEffect, Ref } from "react";
import Link from "next/link";
import classNames from "classnames";
import { NextRouter, useRouter } from "next/router";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import Image from 'next/image'
import { AppUser, useUser } from '../auth'
import Logo from "../public/images/socialmente.svg";
import styles from "./header.module.css";
import { Category } from "models"
import { getMenu } from "@/lib/api"
import { FaUser, FaUserCircle, FaUserSlash } from 'react-icons/fa'
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper'

const fnIsCurrentPath = (router: NextRouter) => (path: string) => router.asPath === path;

type LinkCategories = Pick<Category, 'nome' | 'slug'>;

const getLinks = (router: NextRouter, menu: LinkCategories[]) => {

  const isCurrentPath = fnIsCurrentPath(router);
  
  return (
    <>
      {menu.map(item => {
        const path = `/${item.slug}`

        return (
          <Link key={item.slug} href={path} passHref={true}>
            <a
              className={`px-3 py-2 rounded-md font-medium uppercase text-black text-opacity-75 ${
                isCurrentPath(path) ? styles["md-underline"] : ""
              }`}
              aria-current="page"
            >
              {item.nome}
            </a>
          </Link>
        )
      })}
    </>
  );
};

function UserPopover({ user }: { user: AppUser}) {
  let [referenceElement, setReferenceElement] = useState<any>();
  let [popperElement, setPopperElement] = useState<any>();
  let { styles, attributes } = usePopper(referenceElement, popperElement)

  return (
    <Popover className="relative">
      <Popover.Button ref={setReferenceElement}>
        <Image src={user.picture!} alt={user.displayName ?? ''} width={32} height={32} className="rounded-full" />
      </Popover.Button>
      <Popover.Panel className="absolute z-10 p-4 bg-white border-2 shadow-sm"
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="flex flex-col">
          <Link href="/auth/profile">
            <a className="flex items-center">
              <FaUser className="mr-2" />Profilo
            </a>
          </Link>
          <Link href="/api/auth/logout">
            <a className="flex items-center">
              <FaUserSlash className="mr-2"/>Logout
            </a>
          </Link>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useState<LinkCategories[]>([]);
  const router = useRouter();
  const { user, logout } = useUser()

  const onMenuOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    (async () => {
      const menu = await getMenu();
      menu.unshift({ nome: 'Editoriali', slug: 'editoriali' })
      setLinks(menu);
    })();
  }, [])

  return (
    <header className="header-area">
      <div className="relative h-32 bg-red-600 middle-header z-1">
        <div className="container h-full px-4 mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center h-full -mx-4">
            <div className="w-full h-full md:w-1/2">
              <div className="h-full logo-area">
                <Link href="/">
                  <a className="flex items-center h-full">
                    <Logo className="w-auto h-4/5" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-t border-gray-400 bottom-header h-14">
        <div className="container h-full px-4 mx-auto">
          <div className="flex flex-wrap items-center h-full -mx-4">
            <div className="flex items-center w-full">
              <div className="flex-grow main-menu">
                <nav>
                  <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset"
                          aria-controls="mobile-menu"
                          aria-expanded="false"
                          onClick={onMenuOpen}
                        >
                          <span className="sr-only">Open main menu</span>
                          {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
                        </button>
                      </div>
                      <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                        <div className="hidden sm:block sm:ml-6">
                          <div className="flex space-x-4">{getLinks(router, links)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={classNames("sm:hidden", { hidden: !isOpen, block: isOpen })} id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1">{getLinks(router, links)}</div>
                  </div>
                </nav>
              </div>
              <div className="pr-2 user">
                {user?.picture
                  ? <UserPopover user={user} />
                  : (<Link href="/api/auth/login" passHref>
                      <a>
                        <FaUserCircle className="w-8 h-8 text-gray-700"/>
                      </a>
                    </Link>)
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
