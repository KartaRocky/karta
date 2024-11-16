// import Image from "next/image";
// import backgroundImage from "../public/gray_shadow_bg.jpeg";
// import styles from "../styles/Home.module.css";
// import AllDependencies from "./components/AllDependencies";
import Overview from "./components/Overview";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <button className="self-end text-white font-semibold bg-zinc-800 py-2 px-6 rounded-full hover:bg-zinc-500">
        <Link href={"/allDependencies"}>All dependencies</Link>
      </button>
      <Overview />
    </div>
  );
}
