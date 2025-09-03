import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [status, setStatus] = useState("");
  const onSubmit = async (values) => {
    setStatus("Saving...");
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("address", values.address);
    fd.append("city", values.city);
    fd.append("state", values.state);
    fd.append("contact", values.contact);
    fd.append("email_id", values.email_id);
    if (values.image && values.image[0]) fd.append("image", values.image[0]);
    const res = await fetch("/api/schools", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.ok) {
      setStatus("Saved");
      reset();
    } else {
      setStatus(json.error || "Failed");
    }
  };
  return (
    <div className="container">
      <h1>Add School</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="grid">
          <div className="field">
            <label>Name</label>
            <input {...register("name", { required: true, minLength: 2 })} type="text" />
            {errors.name && <span className="err">Required</span>}
          </div>
          <div className="field">
            <label>Address</label>
            <input {...register("address", { required: true })} type="text" />
            {errors.address && <span className="err">Required</span>}
          </div>
          <div className="field">
            <label>City</label>
            <input {...register("city", { required: true })} type="text" />
            {errors.city && <span className="err">Required</span>}
          </div>
          <div className="field">
            <label>State</label>
            <input {...register("state", { required: true })} type="text" />
            {errors.state && <span className="err">Required</span>}
          </div>
          <div className="field">
            <label>Contact</label>
            <input {...register("contact", { required: true, pattern: /^[0-9\-\+\s]{7,15}$/ })} type="text" />
            {errors.contact && <span className="err">Invalid</span>}
          </div>
          <div className="field">
            <label>Email</label>
            <input {...register("email_id", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} type="email" />
            {errors.email_id && <span className="err">Invalid</span>}
          </div>
          <div className="field">
            <label>Image</label>
            <input {...register("image", { required: true })} type="file" accept="image/*" />
            {errors.image && <span className="err">Required</span>}
          </div>
        </div>
        <button className="btn" type="submit">Submit</button>
        <div className="status">{status}</div>
        <div className="links under">
          <Link className="link" href="/showSchools">Show Schools</Link>
        </div>
      </form>
    </div>
  );
}