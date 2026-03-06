import Layout from '../../src/components/layout/Layout';
import Contact from '../../src/components/layout/Contact';
import ContactGoogleMap from '../../src/components/layout/ContactGoogleMap';

export default function ContactPage() {
  return (
    <Layout headerStyle={2} footerStyle={1}>
      <div>
        <Contact />
        <ContactGoogleMap />
      </div>
    </Layout>
  );
}
