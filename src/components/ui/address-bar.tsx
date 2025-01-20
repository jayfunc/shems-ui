'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator } from './breadcrumb';
import { Home } from 'lucide-react';
import { Button } from './button';
import Link from 'next/link';
import { titleCase } from '@/lib/utils';

export function AddressBar() {
  const pathname = usePathname();
  let pathnameArray = pathname.split('/');

  return (
    <div className="sticky top-0 backdrop-blur realtive h-16 border-b items-center flex gap-2 px-4" style={{ zIndex: 1000 }}>
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
                / <Link href={path}>{label}</Link>
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
