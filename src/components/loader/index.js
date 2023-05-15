import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loader}>
      <Loader color="pink" variant="bars" />;
    </div>
  );
};

export default Loader;
