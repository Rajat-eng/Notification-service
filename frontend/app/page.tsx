"use client";
import React, { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const SUBSCRIBE_URL = "http://localhost:8000/subscribe";
  const [status, setStatus] = useState<string | null>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = JSON.stringify({
      mail: email,
    });

    try {
      const response = await fetch(SUBSCRIBE_URL, {
        method: "POST",
        body: payload,
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      if (json.success) {
        setStatus("Thnak you for subscribing");
      }
      console.log(json);
    } catch (err) {
      console.error(err);
      setStatus("Some Error Occured");
    }
  };
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>Subcribe to our newsletter</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            aria-label="Your email address"
            name="email_address"
            placeholder="Your email address"
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <button>SUBSCRIBE</button>
        </form>
      </div>
      {status && <p>{status}</p>}
    </main>
  );
}
