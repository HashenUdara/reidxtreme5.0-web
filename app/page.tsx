import RegistrationForm from "./components/RegistrationForm";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <RegistrationForm />
    </main>
  );
}
