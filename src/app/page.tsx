import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <h1>Radio Browser</h1>
        </div>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}