import Clients from './components/clients/Clients'
import MeasurableResults from './components/metrics/KPIResults'
import Temoignage from './components/clients/Temoignage'
import LocationSection from './components/findUs/FindUs'
import EmailDemoSection from './components/email_demo_section/EmailDemoSection'
import ProductsFeatures from './components/features/AboutUs'

const page = () => {
  return (
    <div>
      <Clients />
      <EmailDemoSection />
      <Temoignage/>
      <ProductsFeatures />
      <MeasurableResults />
      <LocationSection />
    </div>
  )
}

export default page
