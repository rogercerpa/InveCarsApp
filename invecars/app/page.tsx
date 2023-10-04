import Image from 'next/image'
import { UserButton } from "@clerk/nextjs";
import getCurrentUser from "@/utils/db/get-current-user";
import Button from "@/components/Button";
import getPlan from "@/utils/get-plan";
import PlanTable from "@/components/PlanTable";
import CustomerPortal from "@/components/CustomerPortal";

export default async function Home() {

  const user = await getCurrentUser();

  if (!user) {
    return <p>Loading...</p>;
  }

  const { buttonClicks } = user;
  const plan = getPlan(user.plan);

  if (!plan) {
    return <p>No User Plan Found</p>;
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

    <div className="flex flex-col gap-6">
      <div className="flex flex-row py-4 border-b justify-between items-center">
        <UserButton afterSignOutUrl="/" />
        <p className="text-xl">
          Your Current Plan: <span className="font-bold">{user.plan}</span>
        </p>
      </div>
      <Button plan={plan} current={buttonClicks} />
      {plan.TIER === "FREE" ? <PlanTable /> : null}
      <CustomerPortal />
    </div>
    </main>
  )
}
