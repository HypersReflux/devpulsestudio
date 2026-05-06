export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ContactClient from "./ContactClient";

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactClient />
    </Suspense>
  );
}