import { redirect } from "next/navigation";

export default function WebsitesIndexRedirect() {
  redirect("/dashboard");
}
