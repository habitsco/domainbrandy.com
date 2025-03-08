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
  
  const columnSize = Math.ceil(combinedDomains.length / 3);
  return [
    combinedDomains.slice(0, columnSize),
    combinedDomains.slice(columnSize, columnSize * 2),
    combinedDomains.slice(columnSize * 2)
  ];
}

export const DomainList = ({ currentDomain }: { currentDomain: string }) => {
  const [domainListLeft, domainListMiddle, domainListRight] = sortDomains(
    currentDomain,
    domains.domains,
  );
  
  return (
    <div className="mt-2">
      <div className="flex flex-col md:flex-row justify-between">
        <ul className="w-full md:w-1/3 mb-2 md:mb-0">
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
        <ul className="w-full md:w-1/3 mb-4 md:mb-0">
          {domainListMiddle.map((domain: string) => {
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
        <ul className="w-full md:w-1/3 mb-2 md:mb-0">
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
