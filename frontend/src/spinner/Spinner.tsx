import styles from "./Spinner.module.css";

function Spinner() {
  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center object-cover">
      <span className={styles.loader}></span>
    </div>
  );
}

export default Spinner;
