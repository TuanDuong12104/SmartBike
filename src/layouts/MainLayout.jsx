import Header from '../components/Header'
import Footer from '../components/Footer'

const MainLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout

