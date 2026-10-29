import { RentalDetail } from "@/components/rental-detail";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <RentalDetail id={(await params).id} />;
}
