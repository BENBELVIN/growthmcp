import { redirect } from "next/navigation";

/** Legacy App route — product analytics live under Convert Layer. */
export default function AppRedirect() {
  redirect("/dashboard/convert");
}
