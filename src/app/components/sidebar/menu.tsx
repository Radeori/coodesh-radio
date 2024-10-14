import styles from "./menu.module.css";
import { SetBooleanState } from "@/types";

interface Arguments{
  setSidebarVisible: SetBooleanState
}

export default function CloseSidebarButton({setSidebarVisible}:Arguments){
  return (
    <div className={"nav " + styles.navSidebar + " " + styles.menuNavSidebar}>
      <div onClick={() => setSidebarVisible(false)} className={styles.menuButton}>
        <i className={"bi bi-list " + styles.menuIcon}></i>
      </div>
    </div>
  );
}