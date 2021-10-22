import React, { useState, useEffect } from "react";
import Link from "next/link";
import classNames from "classnames";
import { NextRouter, useRouter } from "next/router";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import Logo from "../public/images/logo.svg";
import styles from "./header.module.css";
import { Category } from "pages/models"
import { getMenu } from "@/lib/api"

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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useState<LinkCategories[]>([]);
  const router = useRouter();

  const onMenuOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    (async () => {
      const menu = await getMenu();
      setLinks(menu);
    })();
  }, [])

  return (
    <header className="header-area">
      <div className="relative h-40 bg-red-600 middle-header z-1">
        <div className="container h-full px-4 mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center h-full -mx-4">
            <div className="w-full h-full md:w-1/2">
              <div className="h-full logo-area">
                <Link href="/">
                  <a className="flex items-center h-full">
                    <Logo className="w-auto h-2/3" />
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
            <div className="w-full">
              <div className="main-menu">
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
