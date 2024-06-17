import type {Product} from "./types";

import {useEffect, useState} from "react";

import api from "./api";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    api.search(query)
    .then(data => setProducts(data));
  }, [query]);

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input name="text" placeholder="tv" type="text" onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {
          products.length > 0
          ? (
            products.map((product) => (
              <li key={product.id}>
                <h4>{product.title}</h4>
                <p>{product.description}</p>
                <span className={`${product.price <= 100 ? 'sale': ''}`}>$ {product.price}</span>
              </li>
            ))
          )
          : (
            <span>cargando...</span>
          )
        }
      </ul>
    </main>
  );
}

export default App;
