import styles from "./menu.module.css";

export default function CloseSidebarButton({setSidebarVisible}){
  return (
    <div className={"nav " + styles.navSidebar + " " + styles.menuNavSidebar}>
      <div onClick={() => setSidebarVisible(false)} className={styles.menuButton}>
        <i className={"bi bi-list " + styles.menuIcon}></i>
      </div>
    </div>
  );
}