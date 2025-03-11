import { domains } from "../src/app/config/domains";

async function checkRedirect(domain: string): Promise<boolean> {
  try {
    const response = await fetch(`http://${domain}`, {
      redirect: "manual",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const location = response.headers.get("location");

    console.log(
      `${domain} - Status: ${response.status} - ${location ? `Redirect to: ${location}` : "No redirect"}`,
    );

    if (
      response.status === 308 &&
      location &&
      location.toLowerCase().includes(domain)
    ) {
      console.log(`  ✅ Valid 308 redirect containing the domain found`);
      return true;
    } else {
      console.log(`  ❌ Not a valid 308 redirect containing the domain`);
      return false;
    }
  } catch (error: unknown) {
    console.error(
      `❌ Error checking ${domain}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return false;
  }
}

async function main() {
  console.log("Checking domain redirects...");
  const successDomains: string[] = [];

  for (const domain of domains) {
    const isRedirecting = await checkRedirect(domain);
    if (isRedirecting) {
      successDomains.push(domain);
    }
    // Random delay between 500ms and 2000ms
    const delay = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  console.log(
    "\nDomains successfully redirecting to www version with 308 status code:",
  );
  if (successDomains.length > 0) {
    successDomains.forEach((domain) => console.log(`- ${domain}`));
    console.log(
      `\nTotal: ${successDomains.length}/${domains.length} domains redirect correctly with 308 status code`,
    );
  } else {
    console.log(
      "None of the domains redirect to www version with 308 status code",
    );
  }
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
