import DomainList from "@/app/components/DomainList/DomainList";
import ContactForm from "@/app/components/ContactForm/ContactForm";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import domainbrandy from "../../public/domainbrandy.svg";
import { getDomainName } from "@/app/utils";

export default function Page() {
  const headersList = headers();
  const domain = getDomainName(headersList.get("host") || "") as string;
  const getCurrentYear = () => new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#f5f2e9] to-[#eae6d9] dark:from-[#24201c] dark:to-[#2b2c2a] text-[#444444] dark:text-[#dcc397]">
      <header className="w-full py-6 flex justify-center items-center xl:fixed xl:top-0 xl:left-0 xl:right-0 bg-[#24201c] shadow-md z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/">DOMAIN BRANDY</Link>
        </div>
      </header>
      
      <main className="flex flex-col items-center justify-start flex-grow pt-16 xl:pt-32">
        <section id="hero" className="overflow-hidden w-full flex flex-col xl:flex-row max-w-7xl mx-auto">
          <article className="w-full xl:w-2/3 p-4 md:p-12 align-middle flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold text-center xl:text-left mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#b0944c] to-[#8a7439]">
              {domain}
              <br /> is for sale
            </h1>
            <div className="w-24 h-1 bg-[#b0944c] mx-auto xl:mx-0 mb-8"></div>
            <p className="leading-relaxed text-center xl:text-left mb-8 max-w-2xl mx-auto xl:mx-0 text-lg xl:text-xl">
              Looking for prime digital real estate? <b className="text-[#b0944c] dark:text-[#dcc397]">{domain}</b> is now
              available. Perfect for your next tech startup, e-commerce site, or personal brand.
            </p>
          </article>
          
          <aside id="contact" className="w-full xl:w-1/3 p-4 mb-8">
            <div className="bg-white dark:bg-[#2b2c2a] rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl border border-[#dcc397] dark:border-[#444444]">
              <h2 className="text-2xl xl:text-3xl font-bold mb-4 text-center xl:mt-4">
                Interested in <span className="text-[#b0944c] dark:text-[#dcc397]">{domain}</span>?
              </h2>
              <p className="text-center mb-8 text-[#444444] dark:text-[#dcc397]">
                Please fill out the form below to make an offer.
              </p>
              <ContactForm domain={domain} />
            </div>
          </aside>
        </section>
        
        <section id="domains" className="w-full py-16 bg-gradient-to-r from-[#f5f2e9] to-[#eae6d9] dark:from-[#24201c] dark:to-[#2b2c2a]">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#b0944c] to-[#8a7439]">Domains for sale</h2>
              <p className="text-lg text-[#666666] dark:text-[#bbb0a0] max-w-2xl mx-auto">
                Browse our collection of high-quality domains perfect for your next project.
              </p>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white dark:bg-[#2b2c2a] rounded-2xl shadow-xl overflow-hidden border border-[#dcc397] dark:border-[#444444]">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#b0944c] to-[#8a7439]"></div>
                <div className="p-6">
                  <DomainList currentDomain={domain} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full py-8 bg-[#24201c] shadow-inner">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0 text-[#dcc397]">
              Made by{" "}
              <Link
                href={`https://habitsco.com`}
                className="text-[#b0944c] hover:text-[#dcc397] hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Habits & Co.
              </Link>{" "}
              &copy; {getCurrentYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}



