import React from 'react'
import Container from './container'
import {FaFacebookF, FaTwitter} from 'react-icons/fa'

const Footer: React.FC = () => (
  <footer className="bg-gray-800 border-t border-gray-900">
    <Container>
      <div className="flex flex-col items-center py-2 text-white lg:flex-row">
        <h3 className="mb-10 text-4xl font-bold leading-tight tracking-tighter text-center lg:text-5xl lg:text-left lg:mb-0 lg:pr-4 lg:w-1/2">
          CollettivaMente
        </h3>
        <div className="flex flex-col items-center justify-center lg:flex-row lg:pl-4 lg:w-1/2">
          <a
            href="https://www.facebook.com/Collettivamente-101060368918324" target="_blank" rel="noreferrer"
            className="px-12 py-3 mx-3 mb-6 font-bold transition-colors duration-200 hover:bg-white hover:text-black lg:px-8 lg:mb-0"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com/_collettivamente" target="_blank" rel="noreferrer"
            className="px-12 py-3 mx-3 mb-6 font-bold transition-colors duration-200 hover:bg-white hover:text-black lg:px-8 lg:mb-0"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </Container>
  </footer>
)

export default Footer