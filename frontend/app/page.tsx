// This is the entry point of the frontend application. It redirects to the login page.
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
