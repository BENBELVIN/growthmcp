import { redirect } from "next/navigation";
import { settingsPaths } from "@/lib/data/dashboard";

export default function Page() {
  redirect(settingsPaths.root);
}
