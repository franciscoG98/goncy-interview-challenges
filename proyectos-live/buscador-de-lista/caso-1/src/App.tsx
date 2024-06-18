import type { Product } from "./types";

import { useEffect, useState, useMemo } from "react";

import api from "./api";

enum Sortype {
  NAME = 'NAME',
  PRICE = 'PRICE'
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>(localStorage.getItem('query') || '')
  const [sort, setSort] = useState<Sortype>((localStorage.getItem('sort')) as Sortype || Sortype.NAME)

  useEffect(() => {
    api.search(query).then(setProducts);
  }, [query]);

  useEffect(() => {
    localStorage.setItem('query', query)
  }, [query]);

  useEffect(() => {
    localStorage.setItem('sort', sort)
  }, [sort]);


  const sortedItems = useMemo(() => {

    let sortedProducts = [...products]

    if (sort === Sortype.PRICE) {
      return sortedProducts.sort((pa, pb) => {
        if (pa.price > pb.price) return 1
        if (pa.price < pb.price) return -1
        return 0;
      })
    }
    
    if (sort === Sortype.NAME) {
      return sortedProducts.sort((pa, pb) => pa.title.localeCompare(pb.title))
    }

    return sortedProducts;
  }, [sort, products])

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input name="text" placeholder="tv" type="text" value={query} onChange={(e) => setQuery(e.target.value)} />

      <select name="sortProducts" id="sortProducts" value={sort} onChange={(e) => setSort(e.target.value as Sortype)}>
        <option value={Sortype.NAME}>Nombre [a-z]</option>
        <option value={Sortype.PRICE}>Precio [menor a mayor]</option>
      </select>

      <ul>
        {sortedItems.map((product) => (
          <li key={product.id}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>{product.price.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
