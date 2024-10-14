import styles from "./sidebar.module.css";

export default function Sidebar({sidebarVisible, children}) {
  return (
    <div className={"col-xs-12 col-sm-3 " + styles.sidebar + (sidebarVisible ? " visible" : " invisible")}>
      {children}
    </div>
  );
}