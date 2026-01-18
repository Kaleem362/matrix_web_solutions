import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import ServicesSection from '../Components/ServicesSection'
import QuoteModal from '../Components/QuoteModal'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <ServicesSection/>
      <QuoteModal/>
    </div>

  )
}

export default App
