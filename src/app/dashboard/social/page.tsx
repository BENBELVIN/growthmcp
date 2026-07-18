import type { Metadata } from "next";
import { SocialPage } from "@/components/dashboard/social-page";

export const metadata: Metadata = {
  title: "Social",
};

export default function SocialRoute() {
  return <SocialPage />;
}
