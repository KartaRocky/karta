import Image from "next/image";
import backgroundImage from "../public/gray_shadow_bg.jpeg";
import styles from "../styles/Home.module.css";
import Dependencies from "./components/Dependencies";

export default function Home() {
  return (
    <div className={styles.container}>
      <Image
        className={styles.backgroundImage}
        src={backgroundImage}
        alt="Page background"
        fill
      />
      <div className={styles.content}>
        <p className="text-3xl font-bold">Karta</p>
        <Dependencies />
      </div>
    </div>
  );
}
