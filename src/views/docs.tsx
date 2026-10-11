import ClientScript from "../components/ClientScript";
export default function Docs() {
  return (
    <>
      <title>Milind Mishra API Reference</title>
      <div id="api-reference" data-url="/openapi.json" />
      <ClientScript
        id="scalar"
        code={`const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@scalar/api-reference';script.onload=()=>Scalar.createApiReference('#api-reference',{url:'/openapi.json',pageTitle:'Milind Mishra API Reference',theme:'default'});document.body.append(script);`}
      />
    </>
  );
}
