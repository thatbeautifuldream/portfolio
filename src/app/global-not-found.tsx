import RootLayout from "./[[...path]]/layout";
import Missing from "./[[...path]]/not-found";
export default function GlobalNotFound() {
  return (
    <RootLayout params={Promise.resolve({ path: ["404"] })}>
      <Missing />
    </RootLayout>
  );
}
