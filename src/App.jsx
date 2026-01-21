import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import ServicesSection from '../Components/ServicesSection'
import QuoteModal from '../Components/QuoteModal'
import OurWorkSection from '../Components/OurWorkSection'
import TestimonialsSection from '../Components/TestimonialsSection'
import Footer from '../Components/Footer'
import PricingSection from '../Components/PricingSection'
import ProcessSection from '../Components/ProcessSection'
import FAQSection from '../Components/FAQSection'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <ServicesSection/>
      <QuoteModal/>
      <OurWorkSection/>
      <TestimonialsSection/>
      <PricingSection/>
      <ProcessSection />
      <FAQSection/>
      <Footer/>
    </div>

  )
}

export default App
