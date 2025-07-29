import { ProductListingPage } from "./ProductListingPage";
import { db } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

const MenPage = () => {
  const menProductsQuery = query(
    collection(db, "products"),
    where("category", "==", "men")
  );

  return (
    <ProductListingPage
      title="Men's Collection"
      firestoreQuery={menProductsQuery}
      selectedCategory="men"
    />
  );
};

export default MenPage;
