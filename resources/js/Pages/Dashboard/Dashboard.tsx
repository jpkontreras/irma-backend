import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { NoRestaurants } from "../Restaurant/NoRestaurants";
import { usePage } from "@inertiajs/react";
export default function Dashboard() {
  //@ts-ignore
  const { props, ...rest } = usePage();

  if (props.empty) {
    return (
      <AuthenticatedLayout>
        <Head title="Dashboard | vacio" />
        <NoRestaurants />
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Link href="/restaurant">
        <Button> WIP - restaurants</Button>
      </Link>
    </AuthenticatedLayout>
  );
}
