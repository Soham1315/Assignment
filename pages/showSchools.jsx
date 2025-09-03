import { useEffect, useState } from "react";
import Link from "next/link";

export default function ShowSchools() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/schools");
        const json = await res.json();
        if (json.ok) setItems(json.data || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);
  return (
    <div className="container">
      <h1>Schools</h1>
      <div className="links under">
        <Link className="link" href="/addSchool">Add School</Link>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="cards">
          {items.map((x) => (
            <div className="card" key={x.id}>
              <div className="thumb">
                <img src={x.image} alt={x.name} />
              </div>
              <div className="body">
                <div className="title">{x.name}</div>
                <div className="sub">{x.address}</div>
                <div className="sub">{x.city}</div>
              </div>
            </div>
          ))}
          {!items.length && <div>No schools found</div>}
        </div>
      )}
    </div>
  );
}