'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from './breadcrumb';
import { Home } from 'lucide-react';
import { Button } from './button';
import Link from 'next/link';
import { titleCase } from '@/lib/utils';

export function AddressBar() {
  const pathname = usePathname();
  let pathnameArray = pathname.split('/');

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Button variant="link" className='p-1'>
        <Link href='/' >
          <Home />
        </Link>
      </Button>
      <Breadcrumb>
        <BreadcrumbList>
          {pathnameArray.map((value, index) => {
            if (value === "") {
              return;
            }
            let label = titleCase(value.replace("-", " "));
            let path = pathnameArray.slice(0, index + 1).join("/");
            return (
              <BreadcrumbItem key={value}>
                <BreadcrumbSeparator />
                <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}