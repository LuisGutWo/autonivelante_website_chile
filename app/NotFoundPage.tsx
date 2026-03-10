import Layout from '../src/components/layout/Layout';
import Image from "next/image";
import Link from "next/link";
export default function Error404() {
  return (
    <>
      <Layout headerStyle={4} footerStyle={1}>
        <section className="error-section p_relative centred">
          <div className="auto-container">
            <div className="inner-box">
              <figure className="error-image">
                <Image src="./assets/images/icons/error-1.webp"
                alt=""
                width={300}
                height={300}  
                className="w-100"
                layout="responsive"
                objectFit="contain"
                
                />
              </figure>
              <h2>
                Oops! Esta pagina no esta disponible...
              </h2>
              <Link href="/" className="theme-btn-one">
                <i className="icon-5"></i>Regresar al Home.
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
