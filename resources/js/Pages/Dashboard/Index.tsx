import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ZeroState from './zerostate';

export default function Dashboard() {
  return (
    <AuthenticatedLayout
      header={
        <>
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Dashboard
          </h2>
        </>
      }

      // breadcrumbs={
      //   <BreadcrumbList>
      //     <BreadcrumbItem>
      //       <BreadcrumbLink asChild>
      //         <Link href="#">Dashboard</Link>
      //       </BreadcrumbLink>
      //     </BreadcrumbItem>
      //     <BreadcrumbSeparator />
      //     <BreadcrumbItem>
      //       <BreadcrumbLink asChild>
      //         <Link href="#">Orders</Link>
      //       </BreadcrumbLink>
      //     </BreadcrumbItem>
      //     <BreadcrumbSeparator />
      //     <BreadcrumbItem>
      //       <BreadcrumbPage>Recent Orders</BreadcrumbPage>
      //     </BreadcrumbItem>
      //   </BreadcrumbList>
      // }
    >
      <Head title="Dashboard" />

      <div className="mx-auto max-w-5xl">
        <ZeroState />
      </div>
    </AuthenticatedLayout>
  );
}
