import React from "react";
import Link from "next/link";

import domains from "@/app/config/domains";

function sortDomains(currentDomain: string, domains: string[]) {
  const letter = currentDomain.charAt(0).toLowerCase();
  const sortedDomains = domains.sort((a, b) => a.localeCompare(b));
  const combinedDomains = sortedDomains
    .filter((domain) => domain.charAt(0).toLowerCase() === letter)
    .concat(
      sortedDomains.filter(
        (domain) => domain.charAt(0).toLowerCase() !== letter,
      ),
    );
  const midpoint = Math.ceil(combinedDomains.length / 2);
  return [combinedDomains.slice(0, midpoint), combinedDomains.slice(midpoint)];
}

export const DomainList = ({ currentDomain }: { currentDomain: string }) => {
  const [domainListLeft, domainListRight] = sortDomains(
    currentDomain,
    domains.domains,
  );
  return (
    <div className="mt-6">
      <h2 className="mb-3 text-2xl font-semibold">Domains for Sale</h2>
      <div className="flex flex-col md:flex-row justify-between">
        <ul className="w-full md:w-1/2 mb-0">
          {domainListLeft.map((domain: string) => {
            return (
              <li key={domain} className="mb-2 text-sm">
                <Link
                  href={`http://${domain}`}
                  className="hover:underline"
                  target="_blank"
                >
                  {domain}
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className="w-full md:w-1/2 mb-4 mb-0">
          {domainListRight.map((domain: string) => {
            return (
              <li key={domain} className="mb-2 text-sm">
                <Link
                  href={`http://${domain}`}
                  className="hover:underline"
                  target="_blank"
                >
                  {domain}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DomainList;
1;
