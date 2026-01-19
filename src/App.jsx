import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import ServicesSection from '../Components/ServicesSection'
import QuoteModal from '../Components/QuoteModal'
import OurWorkSection from '../Components/OurWorkSection'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <ServicesSection/>
      <QuoteModal/>
      <OurWorkSection/>
    </div>

  )
}

export default App
