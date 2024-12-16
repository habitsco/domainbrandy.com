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
    <div className="flex flex-col min-h-screen">
      <header className=" w-full py-4 flex justify-center items-center xl:fixed xl:top-0 xl:left-0 xl:right-0 bg-primary-dark">
        <Image
          src={domainbrandy}
          alt="domainbrandy.com"
          className="h-12"
          width={120}
          height={120}
        />
      </header>
      <main className="flex flex-col items-center justify-start flex-grow">
        <section className="overflow-hidden w-full flex flex-col xl:flex-row">
          <article className="w-full xl:w-2/3 p-6 align-middle flex flex-col justify-center">
            <h1 className="text-6xl xl:text-8xl font-bold text-center mb-4">
              {domain}
              <br /> is for sale
            </h1>
            <p className="leading-normal text-center  mb-8 p-6 max-w-2xl mx-auto text-xl xl:text-2xl mb-2">
              Looking for prime digital real estate? <b>{domain}</b> is now
              available. Perfect for your next tech startup, or website.
            </p>
          </article>
          <aside className="w-full xl:w-1/3 p-6">
            <h2 className="text-2xl xl:text-3xl font-bold mb-4 text-center xl:mt-20">
              Interested in {domain}?
            </h2>
            <p className="text-center mb-8">
              Please fill out the form below to make an offer.
            </p>
            <ContactForm domain={domain} />
            <DomainList currentDomain={domain} />
          </aside>
        </section>
      </main>
      <footer className="w-full py-4 flex justify-center items-center xl:fixed xl:bottom-0 xl:left-0 xl:right-0 bg-primary-dark">
        <p>
          Made by{" "}
          <Link
            href={`http://habitsco.com`}
            className="hover:underline"
            target="_blank"
          >
            Habits & Co.
          </Link>{" "}
          &copy; {getCurrentYear()}
        </p>
      </footer>
    </div>
  );
}
