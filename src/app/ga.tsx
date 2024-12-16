"use client"
import { useEffect } from 'react';
import Head from 'next/head';

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;

const GoogleAnalytics = () => {
  useEffect(() => {
    const dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer = dataLayer;
    function gtag(...args: any[]) {
      dataLayer.push(args);
    }
    function gtagConfig() {
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname + window.location.search,
        page_location: window.location.href,
        page_title: document.title,
        page_domain: window.location.hostname,
      });
    }
  
    if (!document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.onload = () => {
        gtag('js', new Date());
        gtagConfig();
      };
      document.head.appendChild(script);
    } else {
      gtagConfig();
    }
   
  }, []);
  

  return (
    <Head>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      ></script>
    </Head>
  )
}

export default GoogleAnalytics
