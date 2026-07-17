import { redirect } from "next/navigation";

export default function NewWebsiteRedirect() {
  redirect("/dashboard");
}
