import React, { Suspense } from "react";
import CustomRecipesPage from "./CustomRecipesPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomRecipesPage />
    </Suspense>
  );
}
