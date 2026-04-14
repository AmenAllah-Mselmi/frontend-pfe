import Footer from './components/footer/Footer';
import MondayNavbar from './components/navbar/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div>
        <MondayNavbar />
        <main>{children}</main>
        <Footer/>
      </div>
  );
}