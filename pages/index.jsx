import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <h1>Schools</h1>
      <div className="links">
        <Link className="btn" href="/addSchool">Add School</Link>
        <Link className="btn" href="/showSchools">Show Schools</Link>
      </div>
    </div>
  );
}