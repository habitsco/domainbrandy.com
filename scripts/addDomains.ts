import { domains } from "../src/app/config/domains";
import dotenv from "dotenv";

dotenv.config();

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.PROJECT_ID;
const VERCEL_API_BASE = "https://api.vercel.com";

const headers = {
  Authorization: `Bearer ${VERCEL_API_TOKEN}`,
  "Content-Type": "application/json",
};

interface DomainError {
  domain: string;
  reason: string;
}

if (!VERCEL_API_TOKEN || !PROJECT_ID) {
  console.error(
    "Missing VERCEL_API_TOKEN or PROJECT_ID. Set them as environment variables.",
  );
  process.exit(1);
}

async function getExistingDomains(): Promise<string[]> {
  const response = await fetch(
    `${VERCEL_API_BASE}/v9/projects/${PROJECT_ID}/domains`,
    {
      headers,
    },
  );

  const data = await response.json();
  if (!response.ok) {
    console.error("Failed to fetch existing domains:", data);
    return [];
  }

  return data.domains?.map((d: { name: string }) => d.name) || [];
}

async function getExistingRedirects(): Promise<any[]> {
  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v10/projects/${PROJECT_ID}/redirects`,
      {
        headers,
      },
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("[FAILED] Could not fetch existing redirects:", data);
      return [];
    }

    return data.redirects || [];
  } catch (error) {
    console.error("[ERROR] Exception when fetching redirects:", error);
    return [];
  }
}

async function deleteRedirect(redirectId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v10/projects/${PROJECT_ID}/redirects/${redirectId}`,
      {
        method: "DELETE",
        headers,
      },
    );

    if (response.ok) {
      return true;
    } else {
      const data = await response.json();
      console.error("[FAILED] Could not delete redirect:", data);
      return false;
    }
  } catch (error) {
    console.error("[ERROR] Exception when deleting redirect:", error);
    return false;
  }
}

async function deleteExistingRedirectsForDomain(
  domain: string,
): Promise<boolean> {
  try {
    const redirects = await getExistingRedirects();
    const wwwDomain = `www.${domain}`;

    // Find redirects related to this domain (both www and non-www)
    const domainRedirects = redirects.filter((redirect) => {
      // Check if this redirect has a host condition for this domain
      return redirect.has?.some(
        (condition: any) =>
          condition.type === "host" &&
          (condition.value === domain || condition.value === wwwDomain),
      );
    });

    if (domainRedirects.length === 0) {
      console.log(`[INFO] No existing redirects found for domain: ${domain}`);
      return true;
    }

    console.log(
      `[INFO] Found ${domainRedirects.length} existing redirects for domain: ${domain}`,
    );

    // Delete each redirect
    let allSuccessful = true;
    for (const redirect of domainRedirects) {
      const success = await deleteRedirect(redirect.id);
      if (success) {
        console.log(`[SUCCESS] Deleted redirect for domain: ${domain}`);
      } else {
        console.error(
          `[FAILED] Could not delete redirect for domain: ${domain}`,
        );
        allSuccessful = false;
      }
    }

    return allSuccessful;
  } catch (error) {
    console.error(
      `[ERROR] Exception when deleting redirects for domain ${domain}:`,
      error,
    );
    return false;
  }
}

async function ensureDomainExists(domain: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v9/projects/${PROJECT_ID}/domains`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ name: domain }),
      },
    );

    const data = await response.json();

    // If domain already exists, this is not an error
    if (response.ok || data.error?.code === "domain_already_exists") {
      console.log(`[SUCCESS] Domain exists or was added: ${domain}`);
      return true;
    } else {
      console.error(`[FAILED] Could not add domain: ${domain}`, data);
      return false;
    }
  } catch (error) {
    console.error(`[ERROR] Exception when adding domain ${domain}:`, error);
    return false;
  }
}

async function setupRedirectForDomain(domain: string): Promise<boolean> {
  try {
    // Ensure both www and non-www domains exist
    const wwwDomain = `www.${domain}`;

    const nonWwwSuccess = await ensureDomainExists(domain);
    if (!nonWwwSuccess) {
      console.error(
        `[FAILED] Could not ensure non-www domain exists: ${domain}`,
      );
      return false;
    }

    const wwwSuccess = await ensureDomainExists(wwwDomain);
    if (!wwwSuccess) {
      console.error(
        `[FAILED] Could not ensure www domain exists: ${wwwDomain}`,
      );
      return false;
    }

    // Delete any existing redirects for this domain
    await deleteExistingRedirectsForDomain(domain);

    // Create the new redirect (non-www to www)
    const redirectResponse = await fetch(
      `${VERCEL_API_BASE}/v10/projects/${PROJECT_ID}/redirects`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          source: `/(.*)`,
          destination: `https://www.${domain}/$1`,
          statusCode: 308,
          has: [
            {
              type: "host",
              value: domain,
            },
          ],
        }),
      },
    );

    const data = await redirectResponse.json();
    if (redirectResponse.ok) {
      console.log(`[SUCCESS] Added non-www to www redirect for: ${domain}`);
      return true;
    } else {
      console.error(`[FAILED] Could not add redirect for: ${domain}`, data);
      return false;
    }
  } catch (error) {
    console.error(
      `[ERROR] Exception when setting up redirect for ${domain}:`,
      error,
    );
    return false;
  }
}

async function processDomains() {
  try {
    console.log(`[INFO] Processing ${domains.length} domains...`);

    let successCount = 0;
    const failures: DomainError[] = [];

    for (const domain of domains) {
      try {
        console.log(`\n[INFO] Processing domain: ${domain}`);
        const success = await setupRedirectForDomain(domain);

        if (success) {
          console.log(`[SUCCESS] Completed setup for domain: ${domain}`);
          successCount++;
        } else {
          console.error(
            `[FAILED] Could not complete setup for domain: ${domain}`,
          );
          failures.push({
            domain,
            reason: "Failed to set up domain and redirect",
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          `[ERROR] Exception when processing domain ${domain}:`,
          errorMessage,
        );
        failures.push({ domain, reason: errorMessage });
      }

      // Small delay between domains to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(
      `\n[SUMMARY] Successfully processed ${successCount} domains, Failed ${failures.length} domains`,
    );

    if (failures.length > 0) {
      console.log("\n[FAILURE DETAILS]");
      failures.forEach((failure, index) => {
        console.log(`  ${index + 1}. Domain: ${failure.domain}`);
        console.log(`     Reason: ${failure.reason}`);
      });
    }
  } catch (error) {
    console.error(
      "[ERROR] Exception in domain processing:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

// Start processing domains
processDomains();
