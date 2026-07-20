import { redirect } from "next/navigation";

/** Legacy Social route — publishing under Supply; listening under Demand. */
export default function SocialRedirect() {
  redirect("/dashboard/supply");
}
